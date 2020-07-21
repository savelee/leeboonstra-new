---
title: Connect & play around with BB-8 by Sphero with JavaScript on a Mac
description: Play around with the BB-8 Sphero JavaScript SDK.
tags:
  - BB-8
  - JavaScript
  - Sphero
  - Star Wars
  - Robotics
  - Node.js
categories:
  - Robotics
alias: /developer/connect-play-around-with-bb-8-by-sphero-with-javascript-on-a-mac/
date: 2016-01-02 12:07:16
---

I'm a huge Star Wars fan, and like most of you, i've seen The Force Awakens as well. I immediately felt in love with BB-8. The little white orange droid. So you can imagine, how happy I was, when I opened my christmas presents, and found the little BB-8 by Sphero droid in a box. BB-8 by Sphero, is a little toy robot that you can control with apps for Android and iOS, via bluetooth. Actually the sphere is the true robot, BB-8's head is attached to the big sphere, via a magnet, and it has little wheels so it always stays on top, and gives it the Looney Toones Road runner look, while rolling. Cute. 

This little droid has the following functionalities; it can roll around (quiet fast,), 
it can listen to your voice (via the app), it can show colors, it has IMU, 3 axis accelerometer, 3 axis rotation gyro and locator sensors.
The BB-8 uses a Bluetooth Low Energy (LE) interface, also known as "Bluetooth Smart" or "Bluetooth 4.0/4.1". 

What's really awesome is that Sphero opens up their APIs, so developers like me, can play around with this. And that's great. There are SDKs for Android, iOS, Windows development, and there's a JavaScript SDK! Since I'm a JavaScript lover, I thought, let's give it a go, and try this out myself.

<!--more-->

Here's are the steps that I took, to get it all up and running. I tried it on a Mac OSX with XCode installed. You will need an editor and Node JS on your machine. With these base requirements, you will need to install the Sphero SDK, and also Noble, a hardware adapter that supports the Bluetooth 4.x+ standard to connect your computer to your BB-8. https://github.com/sandeepmistry/noble
With Noble, you can read out the bluetooth information, which you will later need while writing your code. To get Noble up and running I had to fix my system paths. I've added the following to my bashprofile, to make sure Noble and XPC-Connection which is what the package uses under the hood, don't run into build errors: `export MYBIN=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin export PATH=${MYBIN}:${PATH}` 

Then afterwards, run the following commands to make a connection from your computer:

{% gist 3098563c5566fdf8e320 %}

The UUID is what you'll need. I wrote this simple script, which I run in Node to make a simple connection with my little friend, and read out his information:

{% gist b76682c6491a1b7b05a8 %}

It doesn't do anything special yet, other than switching some colors, but this is a great start. My next goal will be to create my own Sencha universal app, to control BB-8 via a web interface. I'll need a Node JS Express back-end for that: Once, I'm done with that I can share this, in another blog post, but here's a start: https://github.com/savelee/bb8-starwars

For now, take a look into these resources:

* http://http://developer.gosphero.com/
* https://github.com/orbotix
* https://github.com/orbotix/DeveloperResources/tree/master/docs
* https://github.com/alchemycs/spheron
* http://sdk.sphero.com/community-apis/javascript-sdk/

![BB8 by Sphero](/images/sphero.jpg)
