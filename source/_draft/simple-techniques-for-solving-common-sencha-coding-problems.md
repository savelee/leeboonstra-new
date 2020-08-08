---
title: Simple Techniques for Solving Common Sencha Coding Problems
description: Learn some tricks and techniques from a Sencha trainer to debug and solve coding problems.
tags:
  - Ext JS
  - problem solving
  - Sencha
  - Sencha Touch
  - Troubleshooting
  - TDD
categories:
  - Ext JS
date: 2014-05-22 11:01:55
alias: /developer/simple-techniques-for-solving-common-sencha-coding-problems/
---

Often when I’m teaching a Sencha Training class, students ask me to look at their apps because there’s a problem they don’t know how to fix. Since I didn’t write the code, it’s hard sometimes for me to give them a quick answer. However, I do have a set of simple techniques that filter out the most obvious problems.

<!--more-->

In this tip, I’ll categorize a couple of most common problems and tackle them with some simple but effective strategies.

### Problem: “I don’t see my data”

You are browsing through your app, but the data is not visible. Often, this problem is easy to fix.

#### “Here, try this:”

First, try to inspect the Store. You can do this from the browser console by running:

`Ext.getStore(‘MyStore’).load();`

This returns the Store object. You can drill through the data config and see if the array length is greater than zero.

If there is data available, something probably went wrong with rendering. Consider these possible issues:

Do the data fields map the fields in the Model?

Is the data array empty? In your browser developer toolbar, hit the Network tab. Do you get a status code 200? No? Then something went wrong with your request. Check your Model/Store proxy.

The request works correctly, but it still doesn’t display the data? Verify whether the data you get back is valid. For example, when you are using JSON data, you can copy the data response from the browser network tab into [http://jsonlint.com](http://jsonlint.com) or [http://jsonplint.com/](http://jsonplint.com). You can also use your own written test data too.

### Problem: “I can’t build my app”

Sencha Cmd won’t build your app. Most of the time, Sencha Cmd gives a clear explanation of what’s going on, or what needs to be changed. However, every now and then, I see problems where Sencha Cmd won’t build. and the error description is not clear. It might be that there is nothing wrong with your code. For example, your code runs perfectly on your local environment. It just won’t build.

#### “Here, try this:”

This trick is pretty radical, but most of the time it works. Generate a new application with the same namespace from the command line:

`sencha generate app App ../myapp`

Next, copy over the app folder, and make sure you take the changes over from app.js. Now try it again!

### Problem: “Strange component-x behavior”

These types of problems are always the hardest ones. For example, suddenly multiple scrollbars show up in your grid. Or, you see a tab panel with the wrong styling. Testing these kind of problems within your app can be time consuming. Not only do you have to navigate through your app to get to this problem, there can also be many reasons why it’s broken.

#### “Here, try this:”

A common problem-solving technique for developers is to isolate the problem into smaller, more manageable chunks.

#### Isolate the problem

Let’s generate a new application with Sencha Cmd, again with the same namespace. Now, copy over the Class that contains the problems and test it. Do you see the same bugs? You can try to solve it in this test app. You can isolate it even further by trying to re-build your class from the ground up. Start with only the necessary code.

Did it work? There is nothing wrong with the framework, and there is nothing wrong with this Class. Something else must be wrong.

#### Switch to the default theme

Go back to your own app and try to switch to one of the Sencha default stylesheets. (Sencha Default StyleSheet in Sencha Touch, Neptune Theme in Ext JS) Does it finally work? Then there is something wrong in your custom StyleSheet. Is it still not working? At least now you know that your custom StyleSheet is correct. There might be something wrong with your nesting. Or maybe you used the wrong layout?

##### Query for Components

Do you have problems with querying for Components? You can easily query components from your browsers dev console:

`Ext.ComponentQuery.query('button[action="test"]');`

Does it return an empty array? Then there you go! Or maybe it does return the components, but you made a timing mistake. That can often be the case when you’re working with callbacks. When your code is executed, the component may not be rendered on the screen.

#### Common Debugging Techniques

As a developer, you will often run into bugs and problems that you have to solve. But hey, that’s what makes our jobs challenging, right?

Aside from the above mentioned techniques, there are also a couple of standard tricks. First of all, know the framework and know your tools. Read the API Docs (or even better, browse through the framework code).

Switch to one of the debugging frameworks. The advantage is that it often shows extra log messages, and you can directly read through the framework code. For Sencha Touch projects, open app.json and change the framework temporarily:

``` JavaScript
"js": [
{
"path": "../touch/sencha-touch-all-debug.js",
"x-bootstrap": true
},
```

For Ext JS projects, open **index.html** and change the framework temporarily:

Your browser dev tools can help (Google Chrome or Firebug). Also, there are some handy plugins for developing Sencha code: [Illuminations](http://www.illuminations-for-developers.com/) and [App Inspector for Sencha](https://chrome.google.com/webstore/detail/app-inspector-for-sencha/pbeapidedgdpniokbedbfbaacglkceae?hl=en).

Do you quickly want to prototype something? Try [Sencha Fiddle](http://fiddle.sencha.com). There are great tools for testing available, such as [Siesta](http://www.bryntum.com/products/siesta/).

And last but not least, if none of these techniques help you and you are staring at your code for hours (or even days)... take a break! Often, when you take a break and free your mind, you can solve it right away. Especially if you’ve made spelling mistakes or (case sensitive) typos that can cause hours of frustration because you just don’t see them.
