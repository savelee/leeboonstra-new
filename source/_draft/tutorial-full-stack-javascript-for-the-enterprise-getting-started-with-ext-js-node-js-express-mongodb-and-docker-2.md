---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise. Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker.  (2)
description: Part 2 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - Express JS
categories:
  - Containers
date: 2016-08-17 16:30:31
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2/
---

*This is part II of the tutorial, and covers: JavaScript on the server.* 

<!--more-->

# Node.js: Setup the back-end with Express 4 

Now that the client Sencha app is ready to be served, we need to create our server to display the Sencha app in the browser. What you see in the **client** folder, those are the development files (classes), which you use on your workstation. We are going to use *Express.js* plus a couple of other modules to make our server app, serve pages, so let’s install all those. (First navigate out the **client** folder, then..) `client $ cd ../server/ $ npm install --save express` 

Now let’s create the following folder structure: 

``` bash 
$ mkdir -p config 
$ mkdir -p components/errors 
$ mkdir views 
```

And the following files: 

``` bash 
$ touch app.js 
$ touch routes.js 
$ touch config/index.js 
$ touch config/express.js 
$ touch components/errors/index.js 
$ touch views/404.html 
```

Let’s look into all the files: 
{% gist a8f7b74cafeed5e84c92102d29978161 %}

In **server/routes.js** we define some configuration for the routes, like 404 and other routes. The file looks like this: 
{% gist 85df49e74ee8824f07de5e67a1be2cc6 %}

In **server/config/index.js** we define some common configuration for the server: 
{% gist 64abbeb88d6bc9667b85dc7695a0e3db %}

And in **server/config/express.js** we setup Express to serve our files. Note that we point here to the production build of the Sencha app. 
{% gist 77f173638941383f1d9ed4873e226c8c %}

In **server/components/errors/index.js** we define app errors like how 404 should behave and what to respond with. 
{% gist 5725786617a7348cf0505255c95a9f7a %}

The **server/views/index.html** view: 
`html Webservice` 

Finally the **server/views/404.html** view: `
`404 Not Found`

Now we are ready to start the server: 
``` bash 
$ node app.js 
Express server listening on 8080, in development mode. 
```

You can now open your browser, the Node server, should serve the production version of your Sencha app. [http://localhost:8080](http://localhost:8080). Before we move on, let’s create a very simple API route, which outputs json data. We will tweak the Sencha client app, so it retrieves the data from Node. 

``` bash 
$ mkdir libs 
$ cd libs 
$ mkdir users 
$ cd users 
$ touch index.js 
```

Here’s the contents for the **users/index.js** file. Like I mentioned before, it doesn’t do anything special then outputting data. But this could be a great point to start for you. 
{% gist 890fa9ea7dc15c3cde87a20706436d66 %}

 Once you saved this file. We need to create a new route: [http://localhost:8080/users/](http://localhost:8080/users/). We will be able to test this route, when entered in the browser. Node.js needs to be (`node app.js`). You can create this file, by opening **server/routes.js** and add the following route:

``` JavaScript
  app.route('/users')
    .get(function (req, res) {
        var us = new UsersService();
        us.getData(req, res);
    });
```

Want to checkout all my code? I hosted it on Github: [https://github.com/savelee/docker-node-server](https://github.com/savelee/docker-node-server) By the end of this part of the tutorial, you will have a working JavaScript server, created with Node.js and Express. The next part of this tutorial will cover the setup of a MongoDB NoSQL database. 

## Read the next part 

[Part 3](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)