---
title: 'Advanced Cmd: How to modify Sencha builds'
description: This guide, will discuss Ext JS builds, and how you can modify it, with Apache Ant.
tags:
  - Apache Ant
  - build script
  - Sencha
categories:
  - Ext JS
date: 2016-02-22 18:13:46
alias: /developer/how-to-modify-sencha-builds/
---

This guide, will discuss builds, and how you can modify it, with Apache Ant.

<!--more-->

## About Apache Ant integration in Sencha Cmd. 

Sencha Cmd is build with Apache Ant. You don’t need to have Ant installed on your machine, Sencha Cmd has that dependency for you, while installing Cmd. (Sencha Cmd is delivered as a JAR file and it exposes its core functionality as an Ant Library (or antlib). The command line level of Sencha Cmd, as well as SDK-specific processing are implemented on top of this layer. So anything you can do in one, you can do in the other.) [Ant](http://ant.apache.org/) has long been a pillar of the Java development community, but at its core, Ant is an XML-based, cross-platform scripting platform. We call it a "platform" rather than a "language" because Ant can easily incorporate libraries of code in JAR form, or you can use one of the many supported scripting languages as part of your Ant script. Ant can, of course, call other programs (like Sencha Cmd), passing arguments and processing exit codes, but what Ant is particularly good at is manipulating files. This is because Ant was designed for use with build scripts. 

## Copying / Removing folders with Ant 

Internally, Sencha maintains many Apache Ant scripts, within the hidden **.sencha** folder. Ideally, you shouldn’t edit the internal Sencha build scripts, because they will be overwritten when you update Sencha Cmd. Additionally, I don’t recommend, checking **.sencha** and framework folders in source control systems such like Git. You don’t want to get merge errors, when other team members have newer versions of software, running on their machines. Therefore, every application or package contains its own **build.xml** file. This is the place, where you can write your own Ant tasks. To copy folders over, I use the copy tag: See: 

{% gist 5e7d073b75b7dc3187a2 %}

To remove folders, I use the *delete* tag.

Take a look into this example, that I share on Github. I created my own build script, which copies my final build, to another destination folder, and archives it, by creating a foldername that includes a timestamp: [https://github.com/savelee/ant-build-sencha/blob/master/build.xml](https://github.com/savelee/ant-build-sencha/blob/master/build.xml) If the only thing that you want to do, is moving the build folder to a different place on your filesystem, you might not even need a build script. 

Also the **app.json** file, has settings to control the output:

``` JavaScript
    "output": {
        "base": "${workspace.build.dir}/${build.environment}/${app.name}",
        "page": "index.html",
        "manifest": "${build.id}.json",
        "js": "${build.id}/app.js",
        "appCache": {
            "enable": false
        },
        "resources": {
            "path": "${build.id}/resources",
            "shared": "resources"
        }
    }
```

And here are some handy links: 
* [http://docs.sencha.com/cmd/6.x/advanced_cmd/cmd_ant.html](http://docs.sencha.com/cmd/6.x/advanced_cmd/cmd_ant.html) 
* [http://ant.apache.org/](http://ant.apache.org/) 
* [http://www.cs.ucsb.edu/~cappello/50/resources/rc104-010d-apacheant_0.pdf](http://www.cs.ucsb.edu/~cappello/50/resources/rc104-010d-apacheant_0.pdf)