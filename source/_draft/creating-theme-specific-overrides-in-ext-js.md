---
title: Creating Theme-Specific Overrides in Ext JS
description: Learn how to override components in themes.
tags:
  - Overrides
  - Theming
  - Ext JS
  - Plugins
categories:
  - Ext JS
alias: /developer/creating-theme-specific-overrides-in-ext-js/
date: 2014-05-05 11:17:51
---

Ext JS provides a number of functions that make it simple to create and work with classes. It also provides a series of functions to extend or override existing JavaScript classes. This means you can add behaviors and create your own classes, or override the behavior of some functions. In this article, we will show you how to use theme-specific class overrides.

<!--more-->

You probably already know how to create an Ext JS class override. For example, you might want to change default behavior or patch the framework. In that case, you would create the class override using this code:

``` JavaScript
Ext.define('SomeClassName', {
    override : 'Ext.panel.Panel'
 
    //the override: by default, all panels will have a 200px width
    width : 200 
});
```

The first questions that come up are: what do you name this override class and where do you put it. You may be creating a class override that is specific to a theme. Wouldn’t it be nice, to have this JavaScript override bundled together with your custom theme? For example, in your custom theme, all panels should have a box-shadow. Or perhaps, you created an awesome CSS3 animation that will be visible any time you open a popup window. Unfortunately, the old versions of Internet Explorer can’t handle CSS3, so you might want to write a JavaScript fallback. In both cases, the default functionality change is visual. So, where in your file structure can you create these overrides, so they don’t break any other themes?

The trick is the **overrides** folder. With Sencha Cmd 3.1, it’s possible for **applications** and **packages** to save class overrides in the **overrides** folder. By default, when you generate a (theme) package, it already contains such a folder, and it has been set up to support overrides.

Let’s create a JavaScript fallback. For a simple animation, we will animate the opacity when opening a popup window.

Create the following file structure in your theme package, (let’s assume the name of this package is called: **MyTheme** ):

```
packages
> MyTheme
> > overrides
> > > window
> > > > Window.js
```

This file structure maps to the file structure of the framework for `Ext.window.Window`.

Let’s define the class:

``` JavaScript
Ext.define('MyTheme.window.Window', {
 
});
```

This class will **override** from `Ext.window.Window`:

``` JavaScript
Ext.define('MyTheme.window.Window', {
    override : 'Ext.window.Window'
 
});
```

Let’s test if this override works. First, run this from the command-line:

`sencha app refresh`

At this point, the previous code won’t change any functionality yet. Let’s output a console log as soon as the class is created, and test it in a browser:

``` JavaScript
Ext.define('MyTheme.window.Window', {
    override : 'Ext.window.Window'
 
}, function(){
    console.log("Oh yes, my override works!");
});
```

Let’s create the custom behavior. This override will add an animation on the **beforeshow** listener of a window:

``` JavaScript
listeners: {
    beforeshow: function(mywindow){
 
    }
}
```

The beforeshow listener will create a new animation (`Ext.fx.Anim`), so first you have to require the animation in your class:

``` JavaScript
requires: ['Ext.fx.Anim'],
```

Next, you include the code for creating the animation in the beforeshow event. For now, we will create a very simple animation, which changes the **opacity** to smoothly display the window (`mywindow`) from hidden to 100% visibility:

``` JavaScript
Ext.create('Ext.fx.Anim', {
    target: mywindow, //argument of the beforeshow event
    duration: 1000, //ms
    from: {
        opacity: 0
    },
    to: {
        opacity: 1
    }
});
```

Now, you can test if the animation works.

To top it off, let’s create a nice CSS3 animation for the modern browsers as well. We will wrap the Ext JS animation into a check that will only execute when the browser is an old version of Internet Explorer (IE9 or lower):

``` JavaScript
if(Ext.isIE9m) {
 
}
```

Confirm your code looks like this:

``` JavaScript
Ext.define('MyTheme.window.Window', {
    override : 'Ext.window.Window',
 
    requires: ['Ext.fx.Anim'],
    closeAction: 'hide',
    listeners: {
        beforeshow: function(mywindow){
 
            if(Ext.isIE9m) {
                Ext.create('Ext.fx.Anim', {
                    target: mywindow,
                    duration: 1000,
                    from: {
                        opacity: 0
                    },
                    to: {
                        opacity: 1
                    }
                }); 
            }
        }
    }
});
```

The only thing that is missing is the Sass code for the CSS3 animation. We will use Compass for that.

In the theme package, we can add the following Sass code to **packages/MyTheme/sass/src/window/Window.scss**. The code below shows the same animation that we coded in the JavaScript file:

``` Scss
@import "compass/css3/transition";
 
.x-window.x-hide-offsets {
    @include opacity(0);
}
 
.x-window {
    @include single-transition(opacity, 1000ms);
    @include opacity(1);
}
```

You will need to compile the Sass stylesheet to production-ready CSS code. Since this is included in Sencha Cmd and the Sencha build process, the Sass stylesheet will be automatically compiled when building the application with Sencha Cmd.

For now, we don’t need to build the whole application, we just want to quickly test the animation and only compile the stylesheet. You can achieve this by running one of the following commands from the command-line:

`sencha ant sass`

or

`sencha app watch`

The first command runs the Apache Ant task to compile the Sass once. The second command is more powerful, but it requires you to [download](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) and install Java Development Kit 7. You can compare sencha app watch with the Compass command: compass watch. Sencha Cmd watches the app and every time you hit save, Sencha Cmd builds your app and compiles your Sass Stylesheets. When changes are detected, only the minimum amount of work necessary is performed to bring your app and its CSS up to date, saving you from rebuilding your Sass.

Voila — the animation works in old **and** new browsers.
