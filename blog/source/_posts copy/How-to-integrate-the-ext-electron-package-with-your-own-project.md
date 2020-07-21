---
title: How to integrate the ext-electron package with your own project.
description: Learn how to create a desktop executable with Electron in Ext JS
tags:
  - Desktop
  - Electron
  - electron-packager
  - ext-electron
  - Executable
  - Native
categories:
  - Ext JS
date: 2015-06-05 10:00:28
alias: /developer/How-to-integrate-the-ext-electron-package-with-your-own-project/
---

At SenchaCon 2016, Sencha introduced their open sourced ext-electron package. [https://github.com/sencha/electron-demo](https://github.com/sencha/electron-demo). Electron is a framework (created by Github) for creating native applications with web technologies like JavaScript, HTML, and CSS.

It’s what’s Cordova/PhoneGap is for mobile. A native wrapper, a native shell/project with a browser inside that runs your app. Thus, if you can create web apps, you can create native desktop apps. You can create native apps for Linux, Windows 32 & 64bit and Mac OSX.
<!--more-->

This technology has been used by Atom Editor, Slack, Visual Studio Code, and also by Sencha.

For example, for the tools Sencha Test, Sencha Inspector, Sencha Themer and Sencha Architect, we all use Ext JS and Electron. Therefore Sencha has a lot of experience with wrapping Ext JS apps to native desktop applications. 

Part of these magic, Sencha likes to share. Not only does this Sencha example Electron app, makes it easy for you to wrap your application with NodeJS? It will also give you: 

* IPC (inter process communication) to push heavy workloads to the main process 
* Support for native menu’s 
* Support for native GUI’s such as: 
  * File Pickers 
  * Folder Pickers 
  * Tray Icons 
  * Notifications / “Balloons” 

The opensource demo, let’s you run an example Sencha app in a native Electron / Node JS runtime. Although that works fine, you might be interested, in wrapping your own Ext JS web application with Electron. Here are the steps that I took: 

## Prerequisites

You will need Ext JS 6.2 You will also need NodeJS installed and NPM. 

### NOTE: 

I’m using Node v6.9.1 (includes npm 3.10.8). I figured out I got problems with Node 7.0+ and NPM4+. ## Use Electron for development Before you will package your desktop application as an .exe or app executable, you might want to do a testrun. Since Electron is a NodeJS runtime; ECMAScript 2015 code is fully supported without the use of a transpiler. I used the following steps from the Sencha electron demo (), which I forked: [https://github.com/sencha/electron-demo](https://github.com/sencha/electron-demo) 

1. Go to [https://github.com/savelee/electron-demo](https://github.com/savelee/electron-demo) 
2. Download the zip and copy the following files: 
  * *packages/local/ext-electron* to: *myappworkspace/packages/local* 
  * *package.json* to: *myappworkspace* 
  * *app/package.json* to *myappworkspace/myapp* 
3. Open *myappworkspace/package.json* Change `electron app` to `electron myapp` (where myapp is your app folder name) 
4. Run from the *myappworkspace* folder: 
  * `npm install` 
  * `sencha app build -dev` 
  * `npm run app` (to build the development version) 

When you have an universal app, you might want to run `sencha app build classic` instead, since you don’t want to bundle your mobile version of the code. 

## Use Electron for production 

The next steps explain, how to make an executable bundle. (such as an .exe for Windows or an .app for Mac OSX). The *package.json* needs to be updated, according your path names:

``` JavaScript
"scripts": { 
  "app": "electron myapp", 
  "build-dev": "sencha --cwd myapp app build --dev", 
  "build-prod": "sencha --cwd myapp app build --clean --production", 
  "bundle-all": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --all --out build/electron",
  "bundle-win32": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --platform=windows --arch=32 --version=1.4.7 --out build/electron", 
  "bundle-win64": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --platform=windows --arch=64 --version=1.4.7 --out build/electron", 
  "bundle-osx": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --platform=darwin --arch=x64 --version=1.4.7 --out build/electron", 
  "bundle-linux32": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --platform=linux --arch=x86 --version=1.4.7 --out build/electron", 
  "bundle-linux64": "sencha --cwd myapp app build --clean --production classic && electron-packager build/production/MyApp MyAppName --platform=linux --arch=x86_64 --version=1.4.7 --out build/electron", 
  "clean": "rm -rf ext; rm -rf .sencha; rm -rf MyApp/.sencha; rm -rf node_modules; rm -rf MyApp/node_modules; rm -rf build" 
},
```

Edit your *build.xml* file, to copy over package.json and main.js: --- --- Then run: `npm run bundle-all` (or for Mac OSX specific: `npm run bundle-osx`) ###TIP: In case you run in issues here, (for example, because of missing or outdated NPM dependencies, which you could run into, when running from different versions, try to the sencha app build and electron-packager commands separately. The error stack trace might be better. 

`electron-packager build/production/MyApp MyAppName --platform=darwin --arch=x64 --version=1.4.7 --out build/electron`