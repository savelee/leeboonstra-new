---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise. Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (4)
description: Part 4 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
  - CORS
categories:
  - Containers
date: 2016-08-19 16:30:58
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4/
---

*This is part IV of the tutorial, and covers: Setting up CORS on Node.js* 

<!--more-->

Once we are done with all the tutorials, you will have a working back-end with Node.js / Express 4 and a working front-end, with Ext JS. Only there will be one problem. The client, can’t reach the JSON backend, because both are running on different ports / or different domains. **Cross-Origin Resource Sharing** is a mechanism for allowing clients to interact with APIs that are hosted on a different domain. CORS works by requiring the server to include a specific set of headers that allow a browser to determine if and when cross-domain requests should be allowed. (For more information about CORS, take a look here: [http://www.html5rocks.com/en/tutorials/cors/](http://www.html5rocks.com/en/tutorials/cors/) Let’s open **server/package.json**, and add the following dependency: 

`"cors": "^2.7.1",`. Open **server/config/express.js**, and add the following variable to the top of the file: `cors = require('cors'),`. In the `module.exports` function, add the following line: `app.use(cors());`. Now save both files, stop Nodemon, and run on the command-line: 
`$ npm install $ nodemon app.js`. 

This should fix your cross origin problem. By the end of this part of the tutorial, your client can reach your server, without cross origin blockages. You learned about CORS. 

## Read the next part 

[Part 5](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)