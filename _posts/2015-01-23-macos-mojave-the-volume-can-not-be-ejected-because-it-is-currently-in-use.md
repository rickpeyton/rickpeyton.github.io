---
layout: post
title: 'macOS Mojave The volume cannot be ejected because it is currently in use.'
date: 2015-01-23 00:00:00 +0000
categories: other
---

![The volume cannot be ejected because it is currently in use](/assets/the_volume_cant_be_ejected_because_it_is_currently_in_use.png 'The volume cannot be ejected because it is currently in use')

My only computer is a Macbook Air with a 128gb SSD so if I am home and docked I always have an external hard drive attached.

I make heavy use of [symlinks](https://gigaom.com/2011/04/27/how-to-create-and-use-symlinks-on-a-mac/) to keep my SSD tidy, but I occasionally run into trouble when trying to eject my external.

> The volume can’t be ejected because it’s currently in use.

That’s not very helpful is it?

Pop open Terminal and issue the following command (where myDrive is the Volume name you are trying to eject)

`lsof | grep /Volumes/myDrive`

Mine recently looked something like this

![List of open files](/assets/lsof_command.jpg 'List of open files')

In my case the offender was Mail’s Indexing process.

After com.apple, notice that 272? That is the process ID (PID for short).

In your terminal window take your PID and issue the kill command (where 272 is your PID)

`kill -9 272`

Go ahead and eject that volume.

Lets go back to the command

`lsof | grep /Volumes/myDrive`

[lsof](https://en.wikipedia.org/wiki/Lsof) is simply "list of open files"

Go ahead and run that command by itself to see the madness.

[grep](https://en.wikipedia.org/wiki/Grep) is a text search utility so what you are saying here is basically give me a list of open files, but search that list for only lines that contain '/Volumes/myDrive' and show me those.
