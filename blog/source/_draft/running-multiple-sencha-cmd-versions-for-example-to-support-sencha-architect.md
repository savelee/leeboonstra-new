---
title: Running multiple Sencha Cmd versions
description: Learn how to run multiple Sencha Cmd versions next to each other
tags:
  - Sench Cmd
categories:
  - Sencha CMD
date: 2015-07-10 09:19:52
alias: /developer/running-multiple-sencha-cmd-versions-for-example-to-support-sencha-architect/
---

Do you want to run multiple versions of Sencha Cmd, because you are developing Sencha Touch, Ext JS 4, 5 and 6 apps all together? This guide will give you answers.

<!--more-->

 ###Multiple Cmd versions 
 
 Now the only thing here, you will need to take care of, is that you are running multiple Sencha Cmd versions, next to each other. From the Sencha website, you can install the older versions, just in case, you are running a fresh install: [http://www.sencha.com/products/extjs/cmd-download/ ](http://www.sencha.com/products/extjs/cmd-download/)
 
 It will install Sencha Cmd on your machine. On a Mac, the path is: **~/bin/Sencha/Cmd/** on Windows it is probably **C:\senchacmd**. You can maintain the Cmd versions on a Mac in the ~/.bash_profile file. On Windows it's under your environment variables. (see this guide, I wrote earlier [http://docs.sencha.com/architect/3/getting_started/installation_setup.html](http://docs.sencha.com/architect/3/getting_started/installation_setup.html)) 
 
 ###Running multiple Cmd versions side by side 
 
 Something else I did. What you might consider to setup as well, especially in case you are developing Sencha Touch, Ext JS 6, and / or Ext JS 4 & 5 apps all together... Is making earlier Sencha Cmd versions available on the command -line. When I type `sencha5`, I run Sencha Cmd 5 commands. When I type `sencha`, I run the latest Cmd 6 commands. That's because I bound these to the correct paths. You can do this too. It's very easy. First of all make sure the paths to the earlier versions are in the .bash_profile / environment vars. (which you probably already did, since I wrote it above). Second, and the most important step, is renaming the **sencha** executable (located in the Cmd installation folder) to **sencha5**, **sencha4** etc. And that's it! Enjoy