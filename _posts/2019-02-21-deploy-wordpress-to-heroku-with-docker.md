---
layout: post
title: 'Deploy Wordpress to Heroku with Docker'
date: 2019-02-21 00:00:00 +0000
categories: programming
redirect_from:
  - /programming/deploy-wordpress-to-heroku-with-docker/ 
---

## Update

I am no longer using Wordpress to host my site. I went back to Github Pages. Mostly just because it is free. But I am keeping this up as an archive.

## The Original Post

I had been using a static site generator to host this website from an S3 bucket, but I recently decided to go back to WordPress and its nice hosted editor. I am hoping that might get me to post more often.
Most all of my projects are hosted on Heroku and I love the platform in general. Dev-ops is fun. But I really just want my site to work.

There were a few gotchas along the way. I hope to document those here.

The Dockerfile is pretty simple

```
FROM wordpress:5.0.3-php7.3-apacheCOPY ./config/ports.conf /etc/apache2/ports.conf
COPY . /var/www/html
```

As is the .heroku.yml

```
build:
  docker:
    web: Dockerfile
```

Here is a copy of the ports.conf

```
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

# Listen 80
Listen ${PORT}

<IfModule ssl_module>
	Listen 443
</IfModule>

<IfModule mod_gnutls.c>
	Listen 443
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```

The ports.conf was one of the gotchas. The Listen \${PORT} was necessary because Heroku assigns the port via an environment variable. Line two in the Dockerfile copies that file to the appropriate location for Apache inside the container.

Another gotcha was that during my first deploy I received the following error

```
apache2: Configuration error: More than one MPM loaded.
```

I found the [following post](https://github.com/docker-library/wordpress/issues/293) which pointed me to this command

```
heroku labs:enable --app=YOUR-APP runtime-new-layer-extract
```

I also modified the wp-config.php to grab the settings from the environment instead of checking them into Github. You can find [a copy of that gist here](https://gist.github.com/rickpeyton/7b266600d80ef3ce65f679270ea17e64).

The [WP Offload Media plugin](https://wordpress.org/plugins/amazon-s3-and-cloudfront/) was another must have. You can see some of the settings for that in my wp-config above. This plugin copies your uploads off to an S3 bucket and rewrites your file paths for you. You’ll be in for a bad time if your Heroku dyno restarts and you haven’t been doing this.

Another problem was MySQL on Heroku. Initially, I went with the ClearDB add-on. The first hiccup there was my discovery that it was running MySQL 5.5. I had been doing my local development with MySQL 5.7 so when I went to import my mysqldump I starting hitting some strange encoding errors.

After resolving that, by doing my local dev and dumps with a MySQL 5.5 Docker image, I thought everything was going to be fine, but then I ran into a max_questions error. All I was doing was copying over some old data from my static site and ran into what is basically a too many queries error. This took my site completely offline for an hour.

I could have upgraded from the free MySQL plan to the $9.99 a month plan, but I already had a node running on Linode for $5 a month hosting my Redis Cache for [www.packerwire.net](https://www.packerwire.net/). So I decided to just spin up another MySQL Docker instance over there. That is where my DB is now.

That pretty well covers my pain points. If you enjoyed this post, but get stuck anywhere please don’t hesitate to reach out.
