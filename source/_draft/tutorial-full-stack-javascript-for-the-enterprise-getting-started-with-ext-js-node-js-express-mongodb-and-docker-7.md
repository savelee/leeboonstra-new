---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (7)
description: Part 7 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - Docker Compose
  - Containers
categories:
  - Containers
date: 2016-08-22 16:30:10
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7/
---

_This is part VII of the tutorial, and covers: Docker Compose_ 

<!--more-->

# Docker Compose: 

Linking containers Docker Compose is a tool for defining and running multi-container Docker applications. **Docker** is a great tool, but to really take full advantage of its potential it's best if each component of your application runs in its own container. For complex applications with a lot of components, orchestrating all the containers to start up and shut down together (not to mention talk to each other) can quickly become confusing. The Docker community came up with a popular solution called **Fig**, which allowed you to use a single **YAML** file to orchestrate all your Docker containers and configurations. This became so popular that the Docker team eventually decided to make their own version based on the Fig source. They called it: **Docker Compose**. In short, it makes dealing with the orchestration processes of Docker containers (such as starting up, shutting down, and setting up intra-container linking and volumes) really easy. So, with Docker Compose you can spin off various Docker images, and link it to each other. That’s great, because in case you ever decide to get rid of the Node.js back-end, and instead like to make use of something else; let’s say Python with Django; you would just link to another images. (For example: here's the same API back-end service, but build in Python with Django/Django Rest Framework: [https://github.com/savelee/docker-django-server](https://github.com/savelee/docker-django-server)) You will use a Compose file (**docker-compose.yml**) to configure your application’s services. Then, using a single command, you create and start all the services from your configuration. For more information, see: [https://docs.docker.com/compose/overview/](https://docs.docker.com/compose/overview/) _Remember, how we wrote in our client Sencha app, URLs to the Node.js back-end? We hardcoded it to the localhost URL. Now this won’t work. When the container is running, it won’t know localhost, only it’s own ip address._ Let’s figure out what the docker machine ip address is. While you are still in the Docker terminal, enter the following command: `$ docker-machine ip`. 

We will now need to change the Sencha URLs. You could hardcode this to the Docker machine ip, or you could let JavaScript detect the hostname, you are currently using. (Remember, our Node server is on the same host as our Sencha app, it just has a different port.) The live URL in the **client/util/Constants.js** needs to be changed to:

``` JavaScript
'LIVE_URL': window.location.protocol + "//" + window.location.host + ':9000',
```

You will need to build the Sencha app, before moving on with Docker. We will copy the Sencha build directory over to our container, and this one needs to be finalized, concatenated and minimized, to leverage performance while serving the page. (Manually copying builds over to folders can be automated too, btw. Take a look in one of my previous posts: [https://www.leeboonstra.com/developer/how-to-modify-sencha-builds/](https://www.leeboonstra.com/developer/how-to-modify-sencha-builds/)) Navigate to the **dockerextnode/client** folder: `$ sencha app build classic $ sencha app build modern`. 

We’re going to run our MongoDB database and our Node.js back-end on separate containers as well. We can use official images for this. Node.js has an official Docker image: [https://hub.docker.com/_/node/](https://hub.docker.com/_/node/) And also MongoDB has its own Docker image: [https://hub.docker.com/_/mongo/](https://hub.docker.com/_/mongo/) The Node.js image, we will need to configure, because we need to copy over our own back-end JavaScript code. Therefore create one extra **Dockerfile** which we create in the **server** folder. The contents will look like this: **server/Dockerfile:** [https://github.com/savelee/docker-node-server/blob/master/Dockerfile](https://github.com/savelee/docker-node-server/blob/master/Dockerfile) https://gist.github.com/savelee/6b0d44e03f30c5790c24b3ecf3a9ead6 Once we are done with that, we can create our Docker composition, in the root of our **dockerextnode** folder: https://gist.github.com/savelee/295b81b78d57de6e4fae13380ccf54b7

Build with: `$ docker-compose up --build`. 
After building the composition, you can quickly boot up all the containers in once with: `$ docker-compose up`. 

**Note:** By the way, to build and run this image on its own, using these commands: `$ docker build -t nodeserver . $ docker run -d --name dockerextnodeserver -p 9000:9000 nodeserver`. 

You can test it in your browser by entering the ip address plus /users: [http://192.168.99.100:9000/users](http://192.168.99.100:9000/users) Now you can visit the application in your browser. You will need to figure out what the ip address is. Remember: `$ docker machine ip`. 

For me it gives back this ip address: [http://192.168.99.100/](http://192.168.99.100/) You will need to create the first login credentials. Open **Postman** or use CURL: 

``` bash
$ curl -H "Content-Type: application/json" -X POST -d '{ "username": "myusername", "password": "mypassword" }' http://192.168.99.100:9000/register
``` 

**For Postman:** - Choose the method: `POST` - With the URL: `http://192.168.99.100:9000/register` - Select the body tab - create 2 `x-www-form-urlencoded fields`: `username` & `password`, also specify the values that belong to these fields. Now you can test your application! Woops. There’s a problem with this code. The Node.js server can’t connect to my MongoDB! This is because it’s trying to connect to Mongo database on localhost, but our Mongo database isn’t on local machine. You could hardcode the container IP ofcourse, in your Node.js script, or you can use environment variables, which are automatiaclly added by Docker, when it links the container: In **server/libs/users/index.js**, change the `mongoose.connect` line to: `mongoose.connect('mongodb://'+settings.mongoAddress+':'+settings.mongoPort+'/'+settings.dbName);` 

Open **server/config/local_settings.js** and change it to the below code, so it contains the environment variables: 

``` JavaScript 
module.exports = { "secret": "mysecret", "mongoAddress": process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost', "mongoPort": process.env.MONGO_PORT_27017_TCP_PORT || 27017, "dbName": 'dockerextnode' } 
``` 

![compose](/images/compose-500x494.png)

That's awesome, you've now learned how to setup multiple Docker containers and link them together. In our next tutorial, we will look into the distribution of containers. 

## Read the next part 

[Part 8](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)