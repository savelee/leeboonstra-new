---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (8)
description: Part 8 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - Docker Hub
  - Container Registry
categories:
  - Containers
date: 2016-08-23 14:00:30
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8/
---

_This is the last part of this tutorial series, it will cover Github and the Docker Hub._ 

<!--more-->

# Github Navigate to github, to add a new repository: [https://github.com/new](https://github.com/new) Create two git repositories:

*   docker-ext-client
*   docker-node-server
Add a .gitignore file to the following folders:*   dockerextnode/client/
*   dockerextnode/server/dockerextdjango/

It should contain the following ignore rules: [https://gist.github.com/savelee/970c0d72195ed5b9ca7c5ca533d0a4de](https://gist.github.com/savelee/970c0d72195ed5b9ca7c5ca533d0a4de) Type for both folders, the following commands on the command-line: ``` $ git init $ git status $ git add . $ git commit -m “First commit” $ git remote add origin https://github.com/myrepo/myrepo.git like: git remote add origin https://github.com/savelee/docker-ext-client.git $ git push -u origin master --force ``` ![github](http://146.148.113.87/wp-content/uploads/2016/08/github-500x400.png) 

# Docker Hub: Distribution of containers 

Now that you’re reading this guide, you might be interested, or maybe you just want to see these examples working live. Well with Docker, you can very run these container images. In case you have the Docker Toolbox installed, this should be very easy. You just need to have access to my containers. Enter Docker Hub! **Docker Hub** is like Github but for Docker images. The Docker Hub is a public registry maintained by Docker, Inc. It contains images you can download and use to build containers. It also provides authentication, work group structure, workflow tools like webhooks and build triggers, and privacy tools like private repositories for storing images you don’t want to share publicly. Let me first show you how you can add your images to the Docker Hub, afterwards I will show you how to checkout these images. First, we are going to add an **Automated build repository** in Docker Hub. For that, we first need to push the code to Github. If you followed this guide, you should have done this by now. 

![DockerHub](/images/DockerHub-500x347.png) 

# Adding images to Docker Hub 

We will need to have a working images, which you will have when you have done the previous chapters. Next, we will link our Github account with Docker Hub to add an automated build repo. You will need a Docker Hub account: [https://hub.docker.com/login/](https://hub.docker.com/login/) We will automate the Docker builds, by linking Github to Docker Hub, so everything I push to Git, it will automatically push to Docker as well. We can achieve this with **webhooks**. Go to: [https://hub.docker.com/account/authorized-services/](https://hub.docker.com/account/authorized-services/) You can choose to link to Github or Bitbucket. See: [https://docs.docker.com/docker-hub/github/](https://docs.docker.com/docker-hub/github/) I’m using Github for this tutorial. Choose between; **public & private** or **limited access**. The “Public and Private” option is the easiest to use, as it grants the Docker Hub full access to all of your repositories. GitHub also allows you to grant access to repositories belonging to your GitHub organizations. If you choose “Limited Access”, Docker Hub only gets permission to access your public data and public repositories. I choose *public & private*, and once I am done with that, it forwards me to a Github page. (I’m logged in on Github), which asks me to grant permission, so Docker Hub can access the Github repositories: 

![authorize](/images/authorize-500x345.png) 

Once you click **Authorize application**, you will see the DockerHub application in the Github overview: [https://github.com/settings/applications](https://github.com/settings/applications) Now go back to your DockerHub dashboard, and click on the **Create > Create Automated Build** from the dropdown, which you will see next to your account name, in the top right: 

![automatedbuilds1](/images/automatedbuilds1-500x280.png)

Select **Create Auto-Build Github**, select your Github account, and then select the repository: **docker-ext-client**, enter a description of max 100 characters and **save**. Redo these steps as well for **docker-node-server**. 

![automatedbuilds2](/images/automatedbuilds2-500x203.png) Once the Automated Build is configured it will automatically trigger a build and, in a few minutes, you should see your new Automated Build on the [https://hub.docker.com/](Docker Hub) Registry. It will stay in sync with your GitHub and Bitbucket repository until you deactivate the Automated Build. Now go to **Build Settings**. You should see this screen: 

![automatedbuilds3](/images/automatedbuilds3-500x143.png)

You could click the **Trigger** button, to trigger a new build. Automated Builds can also be triggered via a URL on Docker Hub. This allows you to rebuild an Automated build image on demand. Click the **Active Triggers** button. Creating an automated build repo means that every time you make a push to your Github repo, a build will be triggered in Docker Hub to build your new image. Make sure, when committing the **docker-ext-client** app to Git, that you will check in the production **build/production/Client** folder, as this folder will be used by the Docker images, not the folder with your local Sencha (class) files. # Running images from Docker Hub Now that we know, how we can add Docker images to the Docker Hub, let's checkout some images. First download the image from the Docker Hub: `$ docker pull savelee/docker-ext-client` Then run the new Docker image `--name` = give your container a name `--p` = bind a port to the port which is in the Dockerfile `-d` = the image name you like to run For example: `$ docker run --name extjsapp -p 80:80 -d savelee/docker-ext-client` 

Here’s the code for running the Docker container: 

``` bash 
$ docker pull savelee/docker-node-server 
$ docker run --name nodeapp -p 9000:9000 -d savelee/docker-node-server 
``` 

# Conclusion 

The last part of the tutorial focussed on publishing Docker images to the Docker Hub. If you followed all the tutorials of this 8 series, you've learned the following:

*   Full stack JavaScript for the enterprise with JavaScript on the front-end (with Ext JS 6).
*   Node.js on the back-end
*   A NoSQL database with MongoDB and Mongoose
*   About Docker, and how to create containers
*   How to link Docker containers with Docker Compose
*   How to publish Docker images with Github and Docker Hub

The best part of this all, is that you can easily swap one technology for another. For example, I could link new Docker images, with Ext JS 6 on a Python/Django with MySQL environment, or an Angular 2 app on Node.js with CouchDB... I hope you like it, and that this might come in handy. Cheers!

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)