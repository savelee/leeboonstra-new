---
title: How to Upgrade a Sencha Touch App to Ext JS 6 Modern Toolkit – Part 1
description: In this tutorial, I will show you how you can upgrade your app, and why you should consider taking this step.
tags:
  - Ext JS 6
  - Migration
  - Mobile app
  - Sencha Touch
  - Upgrade
  - MVVM
categories:
  - Sencha Touch
date: 2016-02-07 18:08:55
alias: /developer/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-1/
---

Previously, I wrote a [blog post](/Ext-JS/universal-app-ext6-p1/) on how to create great looking universal apps with Ext JS. However, we also have lots of customers who currently have a mobile (phone or tablet) application and want to upgrade it to Ext JS 6.

In this tutorial, I will show you how you can upgrade your app, and why you should consider taking this step.

<!--more-->

![Cupertino Theme](/images/touch-extjsmodern-tutorial-iphone1-part1-img1.png)

I used my existing tutorial files, “Do I need my umbrella” weather application, which I wrote a couple of years ago with Sencha Touch 2. You can find the [original tutorial here](/Sencha-Touch/getting-started-with-sencha-touch-2-build-a-weather-utility-app-part-1/). You can download the [tutorial files here](https://github.com/savelee/ext-weatherapp/).

You don’t have to use these tutorial files, you can also just read through this guide and try it out with your own existing Sencha Touch 2 app.

### Ext JS 6 Modern Toolkit and Sencha Touch

Ext JS has more (advanced) classes and features than Sencha Touch. You can create advanced enterprise desktop applications, and now you can also create advanced mobile applications or even advanced cross-platform apps.

We incorporated concepts from Sencha Touch 2, and merged them as “the modern toolkit” in Ext JS 5, with the modern core (class system, mvvm pattern, etc.), and there are also many updated classes. From a theming perspective, Ext JS 6 modern toolkit has been updated and looks different than Sencha Touch.

When you’re looking for an enterprise solution to create mobile apps, whether it’s a universal app or just mobile, there are many reasons why you’d choose Ext JS 6 Modern toolkit. I will explain these benefits to you in this article.

Then, I will take an example Sencha Touch 2 application, and migrate it to Ext JS 6 with the Ext JS 6 Modern toolkit.

### What’s Different in Ext JS 6 Modern Toolkit

Here’s an overview of new features in Ext JS 6 compared to Sencha Touch.

#### Basic Upgrade

**(No change to the MVVM pattern)**

This upgrade allows you to use:

*   the latest mobile framework version, and support for the latest OS & browser versions
*   running your mobile application on your desktop computer too
*   controlling lists with your mouse scroll and keyboards (besides touch support)
*   new packages / theme packages structure
*   new Neptune and Triton (universal) themes
*   fast theme compilation with Fashion
*   cleaning up your models, by writing less code
*   JavaScript promises, for asynchronous code
*   out-of-the-box font-awesome integration
*   one of the new components/classes:
    *   data grid
    *   data tree
    *   navigation tree list
    *   soap, amf0, amf3 proxies
    *   new charts
    *   form placeholders

#### Advanced Upgrade

**(Change to MVVM architecture pattern)**

This upgrade allows you to use:

*   ViewControllers and ViewModels

*   The Stores and Controllers in MVC are global. VCs and VMs live together with a particular view, which means that they will be created with a view, and can be destroyed. ViewModels and ViewControllers therefore can improve your application performance. They also allow you to write less code and make it easier to maintain.

*   Databinding

*   Bind to data or component states. It allows you to do advanced things by writing less code.

#### Universal Upgrade

This upgrade allows you to:

*   Create cross-platform apps, for mobile phones and tablets, but also desktop computers. By supporting the modern (lightweight component set) and the classic rich desktop component set.
*   Support legacy browsers, like Internet Explorer 8, as well as the latest modern (mobile) browsers.

### Things That Changed in the API

You can read a complete list of [Ext JS 6 API changes here](http://docs.sencha.com/extjs/6.0/api_diffs/600_modern_diff.html). The ones that I faced when upgrading the weather utility app are:

*   ViewControllers and ViewModels

*   The Stores and Controllers in MVC are global. VCs and VMs live together with a particular view, which means that they will be created with a view, and can be destroyed. ViewModels and ViewControllers therefore can improve your application performance. They also allow you to write less code and make it easier to maintain.

*   Sencha Touch has Ext.app.Controller.launch() methods; in Ext 6 Modern toolkit, it’s Ext.app.Controller.onLaunch()
*   In Sencha Touch, you had to define everything in a config block; in Ext 6 Modern toolkit, you just put properties in config blocks that need the magic methods (get, set, apply, and update). Although you don’t have to, you can clean up the config blocks.
*   There are changes in the way you wire up stores that you can read about in these docs:

*   [Ext JS 6 Ext.app.Controller-cfg-stores](http://docs.sencha.com/extjs/6.0/6.0.0-modern/#!/api/Ext.app.Controller-cfg-stores)
*   [Sencha Touch 2.4.2 Ext.app.Controller-cfg-stores](http://docs.sencha.com/touch/2.4/2.4.2-apidocs/#!/api/Ext.app.Controller-cfg-stores)
*   Also in Ext JS 6, Stores don’t automatically set the storeId to the name of the class.

*   Sencha Touch validations are now called **validators**

*   [Ext JS 6 Ext.data.Model-cfg-validators](http://docs.sencha.com/extjs/6.0/6.0.0-modern/#!/api/Ext.data.Model-cfg-validators)
*   [Sencha Touch 2.4.2 Ext.data.Validations](http://docs.sencha.com/touch/2.4/2.4.2-apidocs/#!/api/Ext.data.Validations)

*   The Sencha Touch default theme was replaced by Ext JS 6 Modern toolkit themes – Neptune and Triton.
*   The default icon set that is being used is Font Awesome, instead of Pictos.

### Basic Mobile Upgrade

For the basic, easy upgrade, we will stick with the existing MVC pattern. You will see that it won’t take many steps. However, you won’t be taking advantage of Ext JS 6. You will have the latest framework, with all its features and classes, but you won’t be using the new MVVM pattern.

1.  [Download](https://www.sencha.com/products/extjs/evaluate/) the Ext JS 6 (trial version).  
  
2.  Look in your Sencha Touch project (app.js for example), and note the namespace that was used. For example, for the Weather Application, the namespace is “**Dinmu**”.  
  
3.  Generate an Ext JS 6 modern app:

Navigate to the **ext** framework folder, and generate a project with:  
`sencha generate app -modern`  
For example:  
ext> `sencha generate app -modern Dinmu ../dinmu1`  
  
See [https://github.com/savelee/ext-weatherapp/tree/master/dinmu1](https://github.com/savelee/ext-weatherapp/tree/master/dinmu1)

4.  Go to the project in your browser, you should see the new Ext JS 6 demo app.  
  
5.  In your file system, rename the **<myproject>/app** folder to something else (like **app-backup**)  
  
6.  Do the same for the **app.js** file; rename it to **app-backup.js**  
  
7.  Then, copy the **app** folder and the **app.js** from your Sencha Touch project, and paste it in your new Ext JS 6 project.  
  
In case you are loading external JS or CSS files via **app.json**, you can manually merge those lines into the new app.json. My advice is to do these kind of steps at the end, after you have your app running.  
  
8.  Run the following command from the command-line:

1.  `sencha app refresh`
2.  You might run into build errors here, because of API changes. For the Dinmu app, there was an error because `Ext.device.Geolocation` has been deprecated.
3.  When you have lots of custom components, you may run into problems here. The best way to solve them is to read the messages from the CLI, and open the [Modern toolkit API docs](http://docs.sencha.com/extjs/6.0/6.0.0-modern/) to search for the classes that fail. In my case, it was the geolocation class that failed. In the docs, I noticed that there are no device APIs anymore. In Sencha Touch, these classes where wrappers for PhoneGap/Cordova support, that would fall back to the HTML5 API feature, if available in the browser. There is **Ext.util.Geolocation**, so I changed the code to use it. After I changed the line, I ran another **sencha app refresh** again, to check for more errors. See the [results here](https://github.com/savelee/ext-weatherapp/blob/master/dinmu1/app/utils/Functions.js).

9.  When you don’t have any more errors anymore, you can try to run the application in the browser. When I ran my app, I got a console error in my app.js launch method.  
`Ext.fly(‘appLoadingIndicator’).destroy();`  
  
Basically, this is an error that tells you that you can’t destroy the “appLoadingIndicator” element, just because it’s not there. The **index.html** is just different. Now you don’t want to replace the index.html file, with the Sencha Touch one, because the calls to the microloader are different. It’s up to you, if you want to remove this destroy line in the app.js launch method, or if you take over the <style> and <body> tags from the Sencha Touch app. I liked the Sencha Touch simple CSS preloader, that you will see before loading any JS or CSS, so that’s why I took over those tags. After fixing this problem, I was able to open my Ext JS 6 app in the browser.  
  
10.  The application is running a bit odd. By inspecting my application, I noticed that in my Sencha Touch application I have controllers with `launch` methods. And launch methods on controllers don’t exist in Ext JS 6, instead they’re called: `onLaunch`. So I renamed it, and ran the application again.  
  
11.  This time I had a problem with the store. The store manager couldn’t find `Ext.getStore('Settings')`, because it was wired up to the controller like this: `Dinmu.store.Settings`. Instead, the store manager has to access it via the full class name. I fixed it in the controller, instead of wiring up the full path, and I just passed in the Store name.  
  
12.  The settings button was not visible; this was due the changes in the icon sets. I used the default font-awesome settings icon, and changed the iconCIs in the Settings button in Main.js to: **x-fa fa-cog**

13.  Last step was to run a build to make sure that I was able to build my application. I expected it to work, because the **sencha app refresh** command did not fail.

And that’s it. After this last step, I was able to run the Weather Application as a full working Ext JS 6 mobile app.

### Coming Up Next

In the next article in this series, I’ll show you how to do the advanced upgrade, where we will switch to the new MVVM pattern, and we can also clean up some code.

*   [Part II](/Sencha-Touch/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-2/)
*   [Part III](/Sencha-Touch/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-3/)