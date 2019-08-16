---
layout: post
title: 'Starting a New Rails Project With Git Rbenv and Heroku'
date: 2015-01-24 00:00:00 +0000
categories: programming
---

## Update

It has been several years since I first wrote this post. While there are still a few helpful tips below my approach to local development with Rails has changed completely.

If I ever get around to documenting my new process I will be sure to link to that here.

---

## Update Gems

`gem update`

## Install Rails (if not already installed)

Specify the version with -v followed by the release

`gem install rails -v 4.2.0`

## Install a specific Ruby version (if not already installed)

First update and install rbenv if necessary

```
brew update
brew upgrade rbenv ruby-build
```

Install the Ruby version

`rbenv install 2.2.0`

You can use rbenv install -l to list all available versions

`rbenv install -l`

Set the Ruby version either for the current directory or for your entire system

```
rbenv local 2.2.0  # Current directory
rbenv global 2.2.0  # System-wide
```

Then rehash to install all shims (what are shims?) known to rbenv

`rbenv rehash`

## Create the Rails App

Now create a new Rails app by specifying the desired Rails version

`rails _4.2.0_ new my_app`

Make your Gemfile edits and then update your bundle

Add just below source in the Gemfile

`ruby '2.2.0'`

Move sqlite3 to development group

For all environments

```ruby
gem 'bcrypt'  # for strong-passwords
gem 'bootstrap-sass'  # to style with Bootstrap
gem 'puma'  # recommended web server by Heroku
```

For development

```ruby
gem 'pry'  # for binding-pry
gem 'dotenv-rails'  # for sensitive data management
```

Create a production group

```ruby
group :production do
  gem 'pg' #postgres database
  gem 'rails_12factor'
end
```

Add puma.rb to /config with the following

```ruby
workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['MAX_THREADS'] || 5)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 3000
environment ENV['RACK_ENV'] || 'development'

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
```

Install –without production

`bundle install --without production`

## Setup Git

```bash
git init  # Initializes the local repository
git add -A  # Adds all of the files in the directory to the repository
git commit -m 'Initialize repository'  # The initial commit
```

Head out to Github or Bitbucket and create a corresponding repository and then add it to the local Git repository.

```bash
git remote add origin git@github.com:rickpeyton/my_app.git
git push -u origin --all
```

## Deploy to Heroku

Add a simple hello message to your routes.rb file just to verify things are working

`root 'application#hello'`

And add a method inside the applications controller

```ruby
def hello
  render text: 'hello world'
end
```

And commit

`git commit -am 'Add hello'`

Create your heroku slice

`heroku create`
A trick I picked up from the Rails Tutorial is to jump into irb and come up with a random string for your heroku app name

`('a'..'z').to_a.shuffle[0..7].join`

Then rename your heroku slice

`heroku rename tbxejdfg`

And push your app to heroku

`git push heroku master`
