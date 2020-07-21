---
title: 'Advanced Sencha Cmd: Dealing with a multi Ext JS app infrastructure'
description: This guide will describe how to deal with an infrastructure, that contains multiple Ext JS apps.
tags:
  - Apache Ant
  - build properties
  - build scripts
  - Ext JS
  - Sencha
  - Sencha CMD
categories:
  - Sencha CMD
alias: /developer/advanced-sencha-cmd-dealing-with-a-multi-ext-js-app-infrastructure/ 
date: 2016-02-21 18:06:24
---

This guide will describe how to deal with an infrastructure, that contains multiple Ext JS apps.
I will discuss: 
* Local workspaces 
* How to split builds 
* How to modify file paths and output settings

<!--more-->

## About Workspaces 

To support these, Sencha Cmd defines the concept of a “Workspace”. A Workspace is simply a folder that ultimately contains one or more apps (pages), frameworks, packages and other shared code or files. The location of the Workspace root folder should be chosen to facilitate these needs as well as your source control requirements. Any generated applications/pages created in sub-folders of the Workspace folder regardless of their depth are considered to be members of the Workspace. Though not a requirement, it is typically the case that the Workspace folder is the root folder in a source control repository. To create a workspace, you will need to have a downloaded copy of the Ext JS framework on your hard disk, also you will need to have Sencha Cmd installed. On the command-line navigate to the downloaded Ext JS sdk folder. From here, enter the following command: `sencha generate workspace [path to workspace[` This will generate the following folder structure:

```
workspace.json   # The JSON descriptor for the workspace.
ext		     # A copy of the Ext JS sdk, examples/docs are stripped out
packages	     # Empty folder, which will contain shared code / themes
.sencha/                # Sencha-specific files (e.g. configuration)
    workspace/          # Workspace-specific content (see below)
        sencha.cfg       # Configuration file for Sencha Cmd
        plugin.xml        # Plugin for Sencha Cmd
```

Within this workspace you can generate Ext JS apps, from the *ext* folder: `cd ext` `sencha generate app MyApp [folder-name[` All applications within the workspace, can share the same Sencha ext folder, code packages (such as custom components, themes or locals) can be shared across both apps and also applications can find each other in the workspace. (for example, in case you want to extend from apps.) For more information about workspaces see: 
* http://docs.sencha.com/cmd/6.x/workspaces.html
* http://docs.sencha.com/cmd/6.x/extjs/cmd_app.html 

## Splitting builds 

By default, a workspace only matters on your development machine. Once you make a build: `sencha app build` Sencha will copy all the used framework classes and all your self written Sencha classes to a build folder. For production, all scripts will be minified. Also the Sass themes will be compiled to production ready css, and copied together with the resources. This means, by default, all shared frameworks and code packages, will be duplicated in the production build, as they can run as stand-alones. For most users, this behavior is exactly what they want. However, there are reasons, why people want to “split” their builds, and host code packages or frameworks separated from their app code. Examples of such reasons are: 

* You are creating your own application framework. You are dynamically generating views, or maybe you are hosting the framework within a portal, expecting your code base will grow over time. 
* You are building a large application, with separated areas, such as an application, and an admin panel. Each of these areas, could be treated as an app itself. Which contains many views, controllers and models etc. It might be that you have different user groups visiting these apps. Why deliver them code, which they don’t need? 
* Your application became huge, and you want to split your scripts in smaller chunks. For the last reason, there’s a good tutorial online: 
https://www.sencha.com/blog/blazingly-fast-load-times-for-apps-built-with-ext-js-and-sencha-touch/ 

Let’s dive into this topic, about splitting builds. Assuming you want to exclude the Sencha framework classes from your own app code. In every sencha application folder, there’s a hidden **.sencha** folder. This hidden folder contains lots of build scripts, settings and metadata used by Sencha Cmd. One of those files is: **js-impl.xml**, an Apache Ant build script, which contains an **compile-js** block, which takes care of filtering out all the used framework classes, and all your own JavaScript classes, to create a (minified) build: https://gist.github.com/savelee/b854dba3217ed5fb0252 It checks if, setting: **enable.split.mode** is set to true, and if so, it will split your framework with a minified, concatenated framework file & a minified, concatenated **app.js** file, which contains your own classes. Note, by default this setting is false. Unfortunately, the code in the first block, doesn’t really work in Ext JS 6. But you can change it to something like below, to make it working again. I've been playing around with this: https://gist.github.com/savelee/4c2fdd2bda303bc03704 *NOTE: I will need to test this further, but this code will need some more iterations though, I have the idea, you can union more, by tagging the \`Ext\` namespace. Also, saving this script in **js-impl.xml**, is not a best practice. When you reinstall Sencha Cmd, and upgrade your app, you will loose everything that's inside the hidden **.sencha** folder. Instead you want to move this script out and leave it a build xml file within your project.

* You can find a working example in my Github repository: https://github.com/savelee/ext-workspace-demo/blob/master/app1/.sencha/app/js-impl.xml

In this example, I have 2 generated Sencha apps. **MyApp1** and **MyApp2**. Both contain a custom build file, to make sure the framework will be filtered out of the final build. ##Build properties So where is this *enable.split.mode* setting coming from? It’s a property file, and the hidden **.sencha** folder, has many properties files. You can find them all in: **default.properties**. To fine-tune your build, you could open **production.properties**, and add the props you like, for example:

```
enable.split.mode=true
build.out.framework.path=${build.out.base.path}/${app.output.framework.path}
app.output.framework=framework.js
app.output.framework.path=${app.output.framework}
app.output.framework.enable=false
```

Ideally you shouldn’t edit the **.properties** files, these are located in the hidden sencha folder, so this means they will be overwritten when you update Sencha Cmd. Additionally, I don’t recommend, checking **.sencha** and framework folders in source control systems such like Git. You don’t want to get merge errors, when other team members have newer versions of software, running on their machines. So to make these changes, to make sure that the sencha build process, splits the build, you can make changes in the **app.json** file of your app:

``` JSON
"output": {
..
        "framework": {
          "path": "${workspace.build.dir}/${build.environment}/framework.js",
          "enable": true
        },
..
```

Move the framework.js outside the app build folder Now that we know how to split builds, or you might want to move assets / scripts around. By default it will include **framework.js** and **app.js** in the same application folder but this will be a file, which needs to be located on a central place. Luckily with Ext JS, you are able to move around files very easily. Many things are configurable. In the **app.json** file, there will be an output block. In this block, you can rename the files, change the extension from the index page. (for example, in case you want to change it to a jsp or php file…), and you are also able to change the base path. Once the base path is changed, you probably will need to change all the other paths as well. Have a look into the **app.json** file that I wrote, or the snippets below: https://github.com/savelee/ext-workspace-demo/blob/master/app1/app.json The output block:

``` JSON
"output": {
        "base": "${workspace.build.dir}/${build.environment}/",
        "page": "${app.name}/index.html", //you can change this to index.jsp
        "manifest": "${app.name}/${build.id}.json",
        "js": "${app.name}/${build.id}/app.js",
        "framework": {
          "path": "framework.js", //this will be the shared sencha framework stuff
          "enable": true
        },
        "resources": {
            "path": "${app.name}/${build.id}/resources",
            "shared": "resources"
        }
        ...
```

The archivePath, to move the archives folder: `"archivePath": "${app.name}/archive/${build.id}",` The appCache block, to move the **app.cache** file. Note, it’s also located in the production block.

``` JSON
"appCache": {
            "path": "${app.name}/app.cache",
            "enable": false
},
```

The cache block, to move the delta folders:

``` JSON
"cache": {
        "enable": false,
        "deltas": "${app.name}/${build.id}/deltas"
},
```

Versioning Systems I mentioned it before, there are a couple of scripts, you ideally don’t want to check into your source control. For Git, you can write a gitignore file, which blocks checking in the below files. I’m sure, other versioning systems, can do the same. https://gist.github.com/savelee/d76bfd972531ab96f6a0 There are some handy links, I like to share with you: 

* http://docs.sencha.com/cmd/6.x/advanced_cmd/cmd_compiler_reference.html
* http://docs.sencha.com/cmd/6.x/advanced_cmd/cmd_advanced.html