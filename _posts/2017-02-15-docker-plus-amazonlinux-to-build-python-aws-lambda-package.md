---
layout: post
title: 'Docker Plus Amazonlinux to Build Python Aws Lambda Package'
date: 2019-02-15 00:00:00 +0000
categories: programming
---

AWS has [good documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python-how-to-create-deployment-package.html) for creating a Python Deployment Package for Lambda, but things get a little more complicated if you are using a library that requires C Extensions.

A recent project I was building required lxml and lxml must be built with C extensions for libxml2 and libxslt that will play nice in a Lambda EC2 like environment.

`bcrypt`, `MySQL-Python`, `PyCrypto`, `regex` and [others](https://github.com/Miserlou/lambda-packages) will run into the same issue.

I came across a couple of other solutions. The [lambda-packages](https://github.com/Miserlou/lambda-packages) is a repo of pre-built packages. You can build your zip file according to the AWS documentation and then slide these packages in to replace the packages built on your machine.

A post from [Azavea](https://www.azavea.com/blog/2016/06/27/using-python-lxml-amazon-lambda/) takes an approach more similar to mine where they actually run an EC2 instance and build the package inside the EC2 instance.

I had just attended a Docker Lunch & Learn and noticed mention of an official amazonlinux image during the presentation. I wanted to see if I could use Docker to assist in building the Python package.

## Dockerfile

Here is a look at my Dockerfile

```
FROM amazonlinux:latest

RUN echo 'alias ll="ls -ltha"' >> ~/.bashrc

RUN yum -y update && \
    yum -y install \
      vim \
      zip

# Create app directory and add app
ENV APP_HOME /app
ENV APP_SRC $APP_HOME/src
RUN mkdir $APP_HOME
ADD . $APP_HOME
```

`FROM amazonlinux` sets the [Amazon Linux Container Image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/amazon_linux_container_image.html) as our base.

> The Amazon Linux container image is built from the same software components that are included in the Amazon Linux AMI, and it is available for use in any environment as a base image for Docker workloads. If you are already using the Amazon Linux AMI for applications in Amazon EC2, then you can easily containerize your applications with the Amazon Linux container image.

`RUN echo 'alias ll="ls -ltha"' >> ~/.bashrc` is a preference of mine. Something I have gotten used to with Ubuntu.

Installing `zip` is necessary for bundling the python package below.

Installing `vim` is just another preference. I want it there if I need it.

```
ENV APP_HOME /app
ENV APP_SRC $APP_HOME/src
RUN mkdir $APP_HOME
ADD . $APP_HOME
```

The Dockerfile should be in the root of your project directory. `$APP_HOME/src` assumes that your function is in the `src` folder.

The next command downloads and installs `pip`.

```
RUN pip install --no-deps -t $APP_SRC/site-package -r $APP_SRC/requirements.txt
```

`--no-deps` tells pip not to install package dependencies.

`-t $APP_SRC/site-package` tells pip to install packages into app/src/site-package — more on this below.

`-r $APP_SRC/requirements.txt` tells pip to use the requirements.txt file found at `app/src/requirements.txt`

The `-t` command assumes you have a site-packages folder inside src on your host machine.

The `-r` command assumes you have a requirements.txt file inside your src folder on your host machine.

## Build and Run

```
docker build -t python-lambda .
```

This command tells docker to build an image from the Dockerfile in the current directory . and tag that image as python-lambda

```
docker run -it --rm --name py-lamb -v /Users/user_name/python_project/src/site-package:/zipped-package python-lambda /bin/bash
```

`-i` tells docker to keep STDIN open even if not attached -t tells docker to allocate a pseudo-TTY

`--rm` tells docker to automatically remove the container when it exits. Just remove this flag if you want to be able to stop, start and re-attach to the same image.

`--name py-lamb` assigns the name py-lamb to the container for easier reference later.

`-v /Users/user_name/python_project/src/site-package:/zipped-package`

This command is pretty specific to what we are trying to do here. This tells docker to mount my host site-package directory inside a root zipped-package directory inside the docker container.

Later when we zip the python package inside the container we will copy it into this zipped-package directory. That will make it available on our host inside site-package.

This would obviously have to be modified to fit your environment. You could also accomplish the same thing with the docker cp command.

`python-lambda` is the name of the image to run

`/bin/bash` opens you up at the bash prompt

## Get the package back to your host

I have a bash script alongside my Dockerfile, but this is all that is in it.

```
cd /app/src
zip /zipped-package/package.zip lambda.py
cd /app/src/site-package/
zip -ur /zipped-package/package.zip *
```

`lambda.py` holds my lambda function. I zip that file and store the new `package.zip` in the `/zipped-package` directory. I then add the contents of `/site-package` to `package.zip`.

Because of the `-v` option used when we ran this container the `package.zip` file will be in my `site-package` folder on my host machine.

## Gotchas

Because we told pip to install the python packages to a target directory python doesn’t know about the packages inside the container.

We would need to execute a second pip install if we wanted to be able to execute this script inside the container.

But there would be some benefit to doing so. It would allow us to avoid installing any of these dependencies on our host machine and allow us to avoid using virtualenv. We could execute our tests, etc inside the container.
