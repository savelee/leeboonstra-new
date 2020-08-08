---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise. Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker.  (1)
description: Part 1 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - JavaScript
  - Client Container
categories:
  - Containers
date: 2016-08-16 16:30:18
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1/
---

*This is part I of the tutorial, and covers: JavaScript on the client.* 

Yeah you are correct, when you have a web project, optimized for production, you can use FTP and simple upload the folder on your server. That’s easy, and when you only have a simple HTML5/JS/CSS app, or an application with a PHP back-end on Apache this probably works fine for you. But what, if you have a very complex application, or you are working on an application with a large team? You probably want to automate as much as possible, and make every live build easy. This tutorial will show you, how you can create an app where we will use JavaScript on the client (an Ext JS 6 app), and JavaScript on the server (Node.js with Express).

<!--more-->

Maybe you have played around with Node.js before. When you configured a Node.js app with Express etc, you will probably need to install packages via the the NPM packages manager. These are all dependencies. Now imagine you’ve created on your local workstation a fully working back-end, with Node.js and a MongoDB database. You had to install a lot of packages, and make some configurations on your system. This can be a configuration where you save environment passwords, or maybe even hardware configurations. What you don’t want, is to manually replicate all the settings and configurations you made locally, again on the server. Ideally, you will take whatever you have on your local machine, and take that over. Maybe you even want to run the same operating system and hardware on production. This is where Docker comes into play. With Docker you can create an isolated container with all the files such as dependencies and binaries for your app to run, making it easier to ship and deploy. It simplifies the packaging, distribution, installation and execution of (complex) applications. So, what is an isolated container? These containers are self-contained, preconfigured packages that a user can fetch and run with just a single command via the Docker hub (like Github, but for Docker). By keeping different software components separated in containers they can also be easily updated or removed without influencing each other.

## About Docker 

With Docker you can create an isolated container with all the files such as dependencies and binaries for your app to run, making it easier to ship and deploy. It simplifies the packaging, distribution, installation and execution of (complex) applications. So, what is an isolated container? These containers are self-contained, preconfigured packages that a user can fetch and run with just a single command via the Docker hub (like Github, but for Docker). By keeping different software components separated in containers they can also be easily updated or removed without influencing each other. # What you will need: For this tutorial I used: Ext JS 6 and Cmd 6.0.2, Node.js 5.8 with NPM installed and Docker 1.10. Please install the following: * A working Sencha environment, with Sencha Cmd and the Ext JS SDK You can check if Sencha Cmd is correctly installed by running: `sencha which` from the CLI. To setup Sencha on your local machine, use this guide: [http://se.sencha.com/setup-guide/](http://se.sencha.com/setup-guide/) 

* Node.js installed, with NPM See the install guide here: [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/) [https://docs.npmjs.com/getting-started/installing-node](https://docs.npmjs.com/getting-started/installing-node) 
* MongoDb installed You can find a guide here: [https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) 
* Docker installed: Tale a look here: [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/) 

## Ext JS 6: Create the client app 

Create the following folder somewhere on your hard drive: **dockerextnode**. Put a temporary copy of the Sencha SDK inside **dockerextnode**, (for example **ext-6.0.2**). If you don’t have Ext JS yet, feel free to download the trial: [https://www.sencha.com/products/evaluate/](https://www.sencha.com/products/evaluate/) 

Open Windows Command / Terminal, and navigate on the command-line to the **dockerextnode** folder. From there enter the following commands:

`$ mkdir server $ cd ext-6.0.2 $ sencha generate app Client ../client` 

You’ve now created 2 folders. The **server** folder, which will contain the Node code later and the **client** folder, which contains the copy of the Sencha SDK together with a demo app. Let’s remove the temp folder: `$ cd .. $ rm -Rf ext-6.0.2` You’ve now removed the temp. Sencha SDK folder. We can now, start testing our Sencha demo app: `$ cd client $ sencha app build production $ sencha app watch` This command will spin off, a Jetty server on [http://127.0.0.1:1841](http://127.0.0.1:1841). 

Visit this page in the browser, and confirm you see the Sencha demo app. Once, you’ve seen the demo app, we can stop the server, by stopping the `sencha app watch` (with CTRL + C for example). We will keep the demo app like it is, but this could be a nice starting point for you, when you want to create your own app. **NOTE:** By default, the `sencha app watch` command starts the development server on the internal IP at port 1841. If you want to change the server’s port, for example to port 8082, you will have to start the server via the web command. This command will only bootu p an internal server, and won’t “watch” your app for changes. `$ sencha web -port 8082 start` Want to checkout all my code? I hosted it on Github: [https://github.com/savelee/docker-ext-client](https://github.com/savelee/docker-ext-client) By the end of this part of the tutorial, you will have a working JavaScript client app, created with Sencha Cmd and Ext JS 6. The next part of this tutorial will cover the setup for creating a Node.js with Express app.*

![ExtJS6-demo-app](/images/ExtJS6-demo-app-500x206.png) 

## Read the next part 

[Part 2](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2/)
*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)