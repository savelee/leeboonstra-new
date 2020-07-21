---
title: 'Asynchronous JavaScript: Promises'
description: JavaScript is single threaded, causing code to execute from top to bottom. Instead of blocking the thread, there are ways you can streamline this code execution by using asynchronous JavaScript.
tags:
  - async
  - ecmascript6
  - es6
  - JavaScript
  - promises
  - ExtJS6
  - Sencha
  - Ext JS 6
categories:
  - Ext JS
alias: /developer/asynchronous-javascript-promises/
date: 2016-04-01 10:14:56
---

JavaScript is single threaded, causing code to execute from top to bottom, so two bits of code cannot run at the same time. For example, you might download a JSON file from an (external) server and you’d have to wait until you retrieve that file. Instead of blocking the thread, there are ways you can streamline this code execution by using asynchronous JavaScript.
<!--more-->
You’re probably already familiar with asynchronous JavaScript. Events (observer pattern) and Callbacks are examples of asynchronous code. For example, whenever you make an Ext.Ajax request or a user presses a button, the action is pushed into a queue, which is called the event loop. The JavaScript engine doesn’t start processing the event loop until the code has been executed after an async function (from top to bottom). This means that JavaScript code is not multi-threaded even though it appears to be so.

![Event Loop](https://wp-test.sencha.com/wp-content/uploads/2016/02/asynch-javascript-promises-img2-300x210.png)

Callbacks are often used when you have an async operation (for example, loading data from a database) that should notify the caller about its completion. When calling such a function, you can pass it another function as an argument, which confirms that something has happened. Putting callbacks into callbacks is a great solution, and I think that’s one of the powerful features of JavaScript. However, it can be messy when your code requires other asynchronous pieces of code first.

For example, you read your user settings from local storage (that’s a callback!). Based on those settings, you make a request from some external server with a database connection, (that’s callback #2). Before you render that information on the screen, you retrieve something else from the database (that’s callback #3).

These steps are very common when you build a large enterprise app. In your code, there will be a callback function, written in a callback function, that’s in another callback function. You can imagine if these functions are spread over separate files that you’d have a hard time reading this code back a month later.

This is where JavaScript Promises comes into play. It’s a new way of writing your code in a more readable and understandable way. A Promise represents the result of a task, which may or may not have been completed. Like a contract for a value that we might not know when the promise is created. It’s an object or function with a **then** method. Because of the “then” method, the action can be chained endlessly, and that’s awesome!

A Promise typically has one of these 4 states.

*   **fulfilled** – when the promise succeeds
*   **rejected** – when the promise failed
*   **pending** – ongoing, hasn’t been fulfilled or rejected yet
*   **settled** – it has been fulfilled or rejected already

![JavaScript Promises](https://wp-test.sencha.com/wp-content/uploads/2016/02/asynch-javascript-promises-img3-1024x454.png)

Promises is part of ECMAScript 6, which is available in the client of some modern browsers, and also within the latest version of Node.js. The following browsers do not support JavaScript Promises: Explorer 11 and below, Android 4.4 and below, and iOS Safari 7.1 and below.

Ext JS 6 supports Promises and conforms to the Promises A+ spec; both Classic and Modern toolkits are included. You can call the Sencha Promises class, which is a wrapper for the native JavaScript functionality. Legacy browsers will use the fallback provided by Sencha, and modern browsers will use the native functionality.

Here’s an example of a function that returns a Sencha Promise object:

``` JavaScript
requestUserSettings: function(){
    	return new Ext.Promise(function (resolve, reject) {
		    //something asynchronous, like loading a store
	    	Ext.getStore(‘Settings’).load({
    			callback: function(records, operation, success) {
    			        if(success){
    			        	if(records.length > 0){
    						//when it’s ok
    			        		resolve(records);
    			        	} else {
    						//still ok, but no results
    			        		resolve(false);
    			        	}
    			        } else{
    					//something bad happened
    			        	reject(operation);
    			        }
    			  }
		    });
    	});
}
```

The `Ext.Promise` constructor takes one argument, a callback with two parameters, resolve and reject. When it does something asynchronous within the callback, like retrieving user settings from a local storage store, then it calls “**resolve**”; if everything worked it passes in the result, otherwise it calls “**reject**” and passes in what went wrong.

Here’s how you use that Promise:

``` JavaScript
this.requestUserSettings().then(function(records) {
  //It’s ok. do something with the records
}, function(err) {
  //oh no, something went wrong, display a nice error
});
```

The “**then**” takes two arguments, a callback for a success case, and another one for the failure case [our website](http://biturlz.com/L5m74B2). Both are optional, so you can add a callback for the success or failure case only. You can chain as many **then** methods as you want to run additional async actions one after another.

Besides the `“then()”` instance method, there are also ways to terminate a Promise chain (`“done()”`), cancel pending chains (`“cancel()”`). Also, there’s a way to attach an **onCompleted** callback to the chain (`“always()”`), for example with cleanup logic regardless the outcome. And, you can attach an **onRejected** callback, if one action within the chain is rejected (`“otherwise()”`), for example to handle failures.

In addition to `Ext.Promise`, Sencha will also ship `Ext.Deferred`, which is a mechanism used to create new Promises within Ext JS 6. The difference between these two constructors is that with a deferred constructor the creator has direct access to “behind the scenes” extras, such as progress updates.

Last but not least, Sencha integrated Promises support into `Ext.Ajax`.

`Ext.Ajax.request()` is now an instance of a class derived from Ext.data.request.Base which can be used with a **then** method. It allows you to write code like this:

``` JavaScript
Ext.Ajax.request({
    url: 'feed.json',
}).then(function(response) {
    // use response
}).always(function() {
   // clean-up logic, regardless the outcome
}).otherwise(function(reason){
   // handle failure
});
```

#### More Resources

There’s a lot more information to explain how you can use JavaScript & Ext JS Promises. Take a look at these resources to learn more!

*   [Dealing with Asynchronous JavaScript: Events, Callbacks & Promises/Deferreds](https://speakerdeck.com/savelee/deferreds) (presentation)
*   Ext JS API docs
    *   [Ext.Promise](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Promise)
    *   [Ext.promise.Promise-method-then](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.promise.Promise-method-then)
    *   [Ext.Deferred](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Deferred)
*   [Promises spec](https://github.com/promises-aplus/promises-spec)
*   [Mozilla Promise spec](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)