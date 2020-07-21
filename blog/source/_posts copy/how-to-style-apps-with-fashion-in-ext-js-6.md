---
title: How to Style Apps with Fashion in Ext JS 6
description: In this article, I will focus on Sencha Fashion – what it is and what you can do with it.
tags:
  - Fashion
  - Sass
  - Theming
categories:
  - Theming
date: 2015-07-30 07:16:18
alias: /developer/how-to-style-apps-with-fashion-in-ext-js-6/
---

In Ext JS 6, one of the big new features is the merged framework. With a single codebase, you can create the best performing applications, with the ideal experience on each device. It also includes a new way to style your apps.

In this article, I will focus on Sencha Fashion – what it is and what you can do with it. Keep an eye out for my upcoming tutorials that will show you how to create a great looking dark theme.

<!--more-->

### Compiling themes

Themes in Ext JS apps use Sass. It’s a more dynamic way of writing CSS code. For example, you can use variables and calculations in your stylesheets. A browser can’t understand Sass, only CSS. Therefore, these Sass themes need to be compiled to production-ready CSS code, which is what a browser can understand. The compilation process of themes in Ext JS apps run via Sencha Cmd:

`sencha app build [development]`

or

`sencha app watch [toolkit]`

The difference here is that **watch** is polling for changes, and compiles it on the fly, while **sencha app build** compiles it manually just once.

In older versions of Ext JS and Sencha Touch, the Sass stylesheets were compiled on top of Ruby. On Windows, you had to install Ruby with administrator rights. Once everything was set up, you could start compiling the themes. But that compilation took a lot of time especially when you had a large codebase and an advanced theme.

To compile an advanced theme, it sometimes could take a minute. Then, you had to refresh your browser window and test it to make sure you set the right Sass variables. And then you had to start over again. You can understand that this process was time consuming. That’s why I am so happy about Fashion.

With Sencha Fashion, you can compile your themes on top of JavaScript, and that is super fast. It’s so fast that when I change a line of code on my left monitor, it’s already changed on the right monitor when I look. I don’t have to wait for the compilation (when starting the server), and I don’t have to refresh my browser window.

Because Fashion is JavaScript, there are more advantages. For example you can extend on top of Fashion and create your own styling functions (like Sass functions), and you are also able to debug your stylesheet code.

However, the big advantage here is on your development machine while you’re designing your theme. To get this up and running, you will need to run sencha app watch from your command line and run the following arguments in your URL and then you’re good to go:

`?platformTags=fashion:true`

### Let’s Compile

You can try to compile a theme with Fashion. First of all, [download Ext JS 6](http://www.sencha.com/products/extjs/evaluate/). This includes the SDK. You will also need to [download Sencha Cmd 6](https://www.sencha.com/products/extjs/cmd-download/).

After installing the command line tools, extract the Ext JS 6 framework zip somewhere on your machine. Open your command prompt and navigate to the framework folder via the command line. From the Ext6 folder, type the following command to generate your first sencha universal app:

`ext> sencha generate app MyApp ../path-to-your-project`

Open your new universal app project in your IDE or editor. You will notice two new folders: **classic** and **modern**. These are the separate toolkit folders. Shared code will be located in the **app** folder. The classic toolkit folder contains the legacy (desktop) views. The modern toolkit folder contains the modern touch views. The DOM for both toolkits is different, so the styling will also be a little different. That’s why each toolkit folder has a **src** subfolder for JavaScript code, and a **sass** folder for all the specific styling.

Open **app.json** and scroll to `“builds”` configuration:

``` JavaScript
    "builds": {
        "classic": {
            "toolkit": "classic",
            "theme": "theme-triton"
        },
 
        "modern": {
            "toolkit": "modern",
            "theme": "theme-neptune"
        }
    },
```

You will notice here, that each build profile, has its own toolkit and theme. You will use the new **Triton** theme for the classic profile, and the **Neptune** theme (formerly known as the Sencha Touch default theme) for the modern toolkit.

We don’t need to change this for now. Let’s create the following new files:

*   classic/sass/var/Application.scss
*   modern/sass/var/Application.scss

Now, let’s start our Sencha local webserver, and let Sencha poll for changes in the stylesheet.  
From the folder where your universal application is located, run the following command:

path-to-your-project> sencha app watch classic

When Cmd is installed correctly, this command should run fine. The built-in sencha server will wait for changes. Your application by default is available on [http://localhost:1841](http://localhost:1841)  
Assuming you are running on port 1841, let’s open our application in the browser:

http://localhost:1841/?platformTags=fashion:true

Wait until your application is done loading. The first time your theme gets compiled, it will take a little longer. Once you see your application, open with your editor:

*classic/sass/var/Application.scss*

If you have two monitors, drag your browser window to the other monitor, so you have your editor on one and the browser on the other.

We will change the overall stylesheet to the color black. Write down the following global variable:

`$base-color: #000;`

As soon as you hit save, you will notice that the style is changed in the browser — not only the header is changed to black, but also all the other styles that extend from the global base color will be black too. For example, double-click on the grid, and you will notice the alert box was changed too.

Feel free to play around with this, change the $base-color to something else. For example a 20% lighter color of the color red:

`$base-color: lighten(red, 20%);`

![Changing the base color](/images/20150707-theming-fashion-extjs6.png)

Of course, you can also theme your modern toolkit this way. Run on the command line:

`sencha app watch modern`

Open the following url in your browser to trigger the modern toolkit:

http://localhost:1841/?toolkit=modern&platformTags=fashion:true

Change the following file: *modern/sass/var/Application.scss*:

It’s fast isn’t it! That’s Fashion. The compilation runs on top of JavaScript. The magic all happens under the hood. Sencha Cmd is running PhantomJS in the background. PhantomJS basically is a headless browser, which you can run from the command line. It will run your application, compile the theme, and put it all into one big JavaScript function. Every change you make, you just let JavaScript change the styling in the DOM.

Stay tuned for my theming tutorials.