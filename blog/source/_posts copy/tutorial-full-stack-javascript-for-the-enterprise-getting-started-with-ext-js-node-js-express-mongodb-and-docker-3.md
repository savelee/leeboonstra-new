---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise. Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (3)
description: Part 3 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - Database
categories:
  - Containers
date: 2016-08-18 16:30:30
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3/
---

_This is part III of the tutorial, and covers how to setup a MongoDB NoSQL database._ 

<!--more-->

# MongoDB & Mongoose

**MongoDB** is a cross-platform document-oriented database, also known as a NoSQL database, This is different compared to a traditional table-based relational database like MySQL. Instead, the structure are JSON-like documents with dynamic schemas (MongoDB calls the format BSON), making the integration of data in certain types of applications easier and faster. MongoDB is developed by MongoDB Inc. and is published as free and open-source software under a combination of the GNU Affero General Public License and the Apache License. **Mongoose** is a MongoDB object modeling tool designed to work in an asynchronous environment. It provides a model layer for interacting with your MongoDB collections from Node. This model layer provides a common location for implementing document validation, persistence indirection, and other logic that should be abstracted from the business layer. Let’s integrate this with our Node back-end. Make sure you have MongoDB installed on your machine. Create in the root of your server folder, the following file: 
{% gist 822bf5e1e3f78ec17a51bd6b0b9a5f80 %}

After that, run from the server folder the following command on the command-line: `$ npm install` This will install MongoDb, Mongoose and Nodemon, and if you don’t have Express yet, also express. You will have to manually start MongoDB. Open a new terminal, and use the following command on the command-line: `$ mongod` 

We will change our **server/config/express.js**, to make sure bodyParser and csrf security works for posting forms.
{% gist 1145fc1ada6acf3265584fbf83a3fef5 %}

Let’s create a couple more routes, to create a CRUD application. We need a route for creating new users (POST), a route to read one user (GET), a route to update one user (PUT) and a route to remove (DELETE) a particular user. We will also need a register and authenticate route, which you will need to check if the username and password are correct. If so, it will return a JWT key, which you can store on your (mobile) client app. Open **server/routes.js** and change to:
{% gist 0c2fb124e51b00007c215efcf4c73520 %}

I’ve created another JS file (**server/config/local_settings.js**), which contains all sensitive information, such as passwords, secrets and keys. Now that this is a separate file, I don’t need to check in this file into my versioning system. It contains this:

```javascript 
module.exports = { 
  "secret": "mysecret", 
  "database": "mongodb://localhost:27017/dockerextnode" 
}
```

Next, we will replace the **server/libs/user/index.js** with the below piece of code. Take a look into the comments, to figure out what I am doing. 
{% gist de67d85234e3cbc2bf98b33ab57660d7 %}


Now run the server: `$ nodemon app.js `. We don’t have data in our Mongo database yet, so we will use *CURL* on the command-line, to get this fixed: 

``` bash
$ curl -H "Content-Type: application/json" -X POST -d '{ "username": "lee", "password": "mypassword" }' 
http://127.0.0.1:9000/register 
```

Instead of Curl, you can also use *Postman*. There’s a Postman extension available for Google Chrome: [https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) Choose the method: **POST** With the url: **http://127.0.0.1:9000/register** Select the body tab, and create 2 x-www-form-urlencoded fields: **username** & **password**, also specify the values that belong to these fields. See screenshot: 

![postman](/images/postman-1024x302.png) 


Incase you want to test if all the values were correctly added to the database, you can run MongoDB from the command-line:

``` bash 
$ mongo dockerextnode > db.users.find({}, function(err, users) { console.log(users) }) 
```

Want to checkout all my code? I hosted it on Github: [https://github.com/savelee/docker-node-server](https://github.com/savelee/docker-node-server ) By the end of this part of the tutorial, you will have a working JavaScript server, created with Node.js and Express. The next part of this tutorial will cover the setup of a MongoDB NoSQL database. 

## Read the next part

[Part 4](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)