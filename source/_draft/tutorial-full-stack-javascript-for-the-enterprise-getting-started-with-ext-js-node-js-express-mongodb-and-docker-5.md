---
title: >-
  Tutorial: Full-stack JavaScript for the Enterprise. Getting started with: Ext
  JS, Node.js, Express, MongoDB and Docker. (5)
description: Part 5 of the tutorial full stack JS development with Ext JS, Node.js, MongoDB and Docker
tags:
  - Docker
  - Node.js
  - MongoDB
  - Ext JS
categories:
  - Containers
date: 2016-08-20 16:30:04
alias: /developer/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5/
---

*This is part V of the tutorial, and covers how the Ext JS client app can consume the server Node.js API* 

<!--more-->

# Let the Ext JS app consume your API 

By now we have a working back-end with Node, and a working front-end with Sencha. Now we are ready to modify our Sencha app, so we can consume our back-end data and see it all in action! It’s a simple client application with CRUD functionality for the Users model. With other words, we can create (`POST`) new users, read users and user details (`GET`), update existing users (`PUT`), and remove a user (`DELETE`). I’ve added the codebase to Github, so let’s go through it, file by file. We will focus on the Classic Desktop view first, later we will create a mobile phone view. # Classic [https://github.com/savelee/docker-ext-client/blob/master/classic/src/Application.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/Application.js) The application doesn’t auto create a viewport. Instead I’ve created a custom launch function, which either creates a login view (with the viewport plugin enabled), or the main interface with the viewport plugin enabled. It depends on the authorization token, if you have one on the device, it will auto login. Take a look into the following files: 
* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/login/Login.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/login/Login.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/login/LoginController.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/login/LoginController.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/app/view/login/LoginControllerShared.js](https://github.com/savelee/docker-ext-client/blob/master/app/view/login/LoginControllerShared.js) 

Here you can see the login panel. It’s actually a non-closable, non-draggable window, locked in the middle of the screen. The user can enter the username and password, which will be posted to the Node Express server. In case the username and password match with what’s in the database, it will return a token. In the *success callback*, we will save the token to the browser *local storage*. Notice that we created *two ViewControllers*. One which will be shared by the classic and modern view. (This one contains the functionality to communicate with the back-end, since that’s view irrelevant.) The other ViewController, extends from the shared VC. This is the VC that contains an `alias`, and is bound to the classic view. Note that although we Bcrypt the passwords in the database. It’s not secure to send passwords over HTTP. An attacker could very easily sniff the username and password that will be in the `POST`. Therefore enter: [https://letsencrypt.org/](https://letsencrypt.org). You could very easily create a free SSL certificate. You can find a guide here: [https://letsencrypt.org/getting-started/](https://letsencrypt.org/getting-started/) so you could set this up in no time. It’s actually very easy, as long as you have console access to your webserver. Let's dive further into our Ext JS code: 

* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/main/Main.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/main/Main.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/main/MainController.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/main/MainController.js) 

That’s the main viewport. It’s pretty much the same as the generated one from Sencha Cmd. We’ve just added a logout button. (which will destroy the main viewport, and remove the token from the localstorage.) 

* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/Users.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/Users.js) 

This is just a view with a grid. It shows a grid column for the `first_name`, `last_name`, `email` and an `action` column to remove the user from the grid. The functionality for this can be found in: 
* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/UsersController.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/UsersController.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/app/view/users/UsersControllerShared.js](https://github.com/savelee/docker-ext-client/blob/master/app/view/users/UsersControllerShared.js) `onRemove` makes an AJAX call with the `DELETE` method, it makes a call to a URL that contains a *user id*. 
* [https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/UserForm.js](https://github.com/savelee/docker-ext-client/blob/master/classic/src/view/users/UserForm.js) 

When you click on a row in the grid, it will open a popup window, which contains the form. I’ve implemented a `renderConfig`, which will hold the *selected record*. That way, as soon as the window will be created, and you run `setRecord()` on the form, it will run `updateRecord()` and load the record in the form, since the model fields map the form fields. When you submit the form, you will get into the `beforeSubmit()` method. Here we just determine if the form contains a hidden form field, which contains the user URL. If it does, it means, the form contains data, so every change made will be a `PUT` request. If the form is empty, we will *add a new user*, and therefore we `POST` to the */users* overview URL. The AJAX request itself, can be found in the shared user VC. And that’s it for the desktop view. 

![desktop](/images/desktop-1024x490.png)

# Modern 

The mobile view re-uses most of the functionality that’s already there. What is new, are the mobile (phone) views: 

* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/Application.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/Application.js) If there’s a token available, it will add the main view to the viewport, else it adds a login view. 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/login/Login.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/login/Login.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/login/LoginController.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/login/LoginController.js) 

The login view is a container, which centers a login form in the middle of the screen. It calls the login view controller, for the `onLogin()` method. This method uses the `doLogin()` method from the *shared* login view controller, which contains the AJAX `POST` call, to request a token. Once logged in, it will add the token to the *local storage*, and it will remove the login view from the viewport, and instead add the main view to the viewport. 

* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/main/Main.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/main/Main.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/main/MainController.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/main/MainController.js) The main view is just a *tabpanel*, with for now, just one tab. It contains a hidden back button, which will be enabled once you are in a form. And it contains a logout button, which calls the `onLogout()` method, which removes the token, and resets the views. It contains a user tab, which has a `card` layout. It can switch between a grid view which list all the users, or a form, to edit one user. 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/Users.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/Users.js) This is the list view. It contains an `itemTpl` with the `first_name`, `last_name`, `email`, `username` and `password`. Once you tap an item, it slides in the userform. 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/UserForm.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/UserForm.js) 
* [https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/UsersController.js](https://github.com/savelee/docker-ext-client/blob/master/modern/src/view/users/UsersController.js) 

This form contains also a toolbar with a *Delete* button. This toolbar will be hidden, when you open the form via the *Add* button. But when you tap an item, it’s visible, and the form will be prefilled with data. It contains similar functionality as in the classic toolkit. It holds a `config` with the record. `updateRecord()` will be called, every time when you run `setRecord()`. Feel free to download the code base and play around with it. 

![mobile](/images/mobile.png) 
By the end of this part of the tutorial, you will understand how the Sencha Ext JS client can consume the Node.js server API. In the next blog posts we will focus on getting familiar with Docker. 

## Read the next part

[Part 6](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6/)

*   [Quick link to Part 1.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-1)
*   [Quick link to Part 2.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-2)
*   [Quick link to Part 3.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-3)
*   [Quick link to Part 4.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-4)
*   [Quick link to Part 5.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-5)
*   [Quick link to Part 6.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-6)
*   [Quick link to Part 7.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-7)
*   [Quick link to Part 8.](/Containers/tutorial-full-stack-javascript-for-the-enterprise-getting-started-with-ext-js-node-js-express-mongodb-and-docker-8)