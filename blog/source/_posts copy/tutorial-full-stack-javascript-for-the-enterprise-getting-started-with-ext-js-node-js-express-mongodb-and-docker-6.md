---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (6)
description: Part 6 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - Containers
  - Containerized Sencha apps
categories:
  - Containers
date: 2016-08-21 16:30:53
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6/
---

*This is part VI of the tutorial, and covers Docker.*

<!--more-->

# Docker: Containerize your apps

A Docker container is similar to a virtual machine. It basically allows you to run a pre-packaged "Linux box" inside a container. The main difference between a Docker container and a typical virtual machine is that Docker is not quite as isolated from the surrounding environment as a normal virtual machine would be. A Docker container shares the Linux kernel with the host operating system, which means it doesn't need to "boot" the way a virtual machine would. You can think of a Docker image as a complete Linux installation. These images use the kernel of the host system, but since they are running inside a Docker container and only see their own file system, it's perfectly possible to run a distribution like CentOS on an Ubuntu host (or vice-versa). Docker containers are isolated from the host machine by default, meaning that by default the host machine has no access to the file system inside the Docker container, nor any means of communicating with it via the network. 

![docker](/images/docker-500x171.png) 

Docker containers run ephemerally by default, which means that every time the container is shut down or restarted it doesn't save its data — it essentially reverts to the state it was in when the container started. First make sure you have the Docker properly installed on your machine. Mac OSX users can follow this guide: [https://docs.docker.com/engine/installation/mac/](https://docs.docker.com/engine/installation/mac/ ) Windows users this one: [https://docs.docker.com/engine/installation/windows/](https://docs.docker.com/engine/installation/windows/ ) There are also various guides available to install Docker on Linux or cloud environments btw. You will need to install the Docker toolbox. It includes the Docker terminal, the Docker Machine, Docker compose etc. You can test if Docker is installed by running the following command: 

``` bash
$ docker -v 
$ docker-machine version
```

After installing, start the **Docker Quickstart Terminal** application. It will take a while, but afterwards it opens another terminal window, with a message like this: 

``` bash
## . ## ## ## == ## ## ## ## ## === /"""""""""""""""""___/ ===
~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ / ===- ~~~ ______ o __/   __/
___________/
docker is configured to use the default machine with IP 192.168.99.100 
For help getting started, check out the docs at https://docs.docker.com 
MacBook-Pro-3: ~ leeboonstra $ 
```

In this case, it will configure Docker on my workstation on this local IP address: *192.168.99.100*. Now, let’s create a Docker file: **Dockerfile** (note, it does not have an extension) and you will save it into the **dockerextnode/client** folder. We will create a new Docker image, and base it on other Docker image, The official Nginx image. [https://hub.docker.com/_/nginx/](https://hub.docker.com/_/nginx/) Nginx (pronounced "engine-x") is an open source reverse proxy server for HTTP, HTTPS, SMTP, POP3, and IMAP protocols, as well as a load balancer, HTTP cache, and a web server (origin server). The Nginx image will serve all our static content. Here are the contents of the **client/Dockerfile**. See the comments for explanation: [https://github.com/savelee/docker-ext-client/blob/master/Dockerfile](https://github.com/savelee/docker-ext-client/blob/master/Dockerfile) https://gist.github.com/savelee/3b37ef3659918d42e4791bd658a502ce To finally create the image, we need to run the following command from the **dockerextnode/client** folder, in the Docker terminal window: `$ docker build -t extclient .` 

**Note:** Because I migrated from the Boot2Docker command to the Docker Machine, I wasn’t able to build here. Instead I received the following error: *“Cannot connect to the Docker daemon.”* I had to run this line on my CLI first, before building. Which regenerate the TSL certificates for me. `$ docker-machine regenerate-certs default` To test if it worked run: `$ docker-machine env default ` 

To see your newly created image, run the following Docker command: `$ docker images` You will see the images that are currently installed on your workstation. It could look like this: `REPOSITORY TAG IMAGE ID CREATED VIRTUAL SIZE extclient latest 4ad898544bec 4 minutes ago `. The name `extclient`, is our Ext JS Docker image, since we specified this name in the build command. To remove all images use: `$ docker rmi $(docker images -q)` To remove all containers including the running ones use: 
``` bash
$ docker rm --force
$ docker ps -qa 
```

To run a container using the image we just created run: `$ docker run -d --name dockerextnodeclient -p 80:80 extclient` You can test it in your browser by entering the ip address in the browser: [http://192.168.99.100](http://192.168.99.100) In case a Docker container automatically exits, because of an error, you might want to look into the logs: `$ docker logs` For example: `$ docker logs 2f9236343def` We are running in the background a new container called: *“dockerextnode”*, which maps port *80* to the port that the Dockerfile exposes from the image named *“extclient”*. Now the container is running. To see our app inside the container we need to know the ip of the Docker Machine: `$ docker-machine ip` To see running containers use: `$ docker ps -a` This works, but only for the front-end, not for our Node.js back-end and Mongo database. Of course, you could edit the Dockerfile, and create Docker RUN commands, to install Node.js and Mongo on this image. However, that would be a bit silly, and it would take the magic powers of Docker away. A much better approach, would be to create separate images for Sencha, Node.js and for MongoDB. That's why Docker Compose comes into play... We will look into that, in the next part of the tutorial. 

## Read the next part 

[Part 7](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)