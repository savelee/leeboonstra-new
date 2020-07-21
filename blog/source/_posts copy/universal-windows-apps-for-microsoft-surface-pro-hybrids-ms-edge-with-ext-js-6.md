---
title: >-
  Universal Windows Apps for Microsoft Surface Pro Hybrids / MS Edge with Ext JS 6
description: Learn how to create universal apps for Microsoft Surface Pro Hybrids with Ext JS 6
tags:
  - Surface Pro
  - Universal App
  - Microsoft Hybrid Apps
categories:
  - Ext JS
date: 2016-11-02 13:59:17
alias: /developer/universal-windows-apps-for-microsoft-surface-pro-hybrids-ms-edge-with-ext-js-6/
---

Now that hybrid touch pc’s / tablets, like the Windows Surface Pro, got popular, I often hear people asking me, if it’s possible to create Ext JS apps for Windows tablets? Ext JS 6 has support for Windows 10. The classic toolkit supports IE8 and up, and the modern toolkit supports the Edge browser. It even contains a Windows mobile theme!

<!--more-->

![sp4](/images/sp4-500x326.png)

Ext JS 6 is also the framework, with supports you by creating universal apps. With one code base you can create Windows desktop apps for mouse and keyboard usage, and tablet interface for touch usage. Just generate your project like: `sencha generate app MyWindowsApp ../mywindowsapp` 

This will create a folder structure for you, with a classic and modern toolkit folder, to branche out the separate views. For more information about universal apps, please see my previous blog post: [https://www.leeboonstra.com/developer/webinar-secrets-to-building-a-great-looking-universal-app/](https://www.leeboonstra.com/developer/webinar-secrets-to-building-a-great-looking-universal-app/)

The fun stuff comes into the **app.json** file. I’ve created these build profiles:

``` JavaScript
"builds": { 
  "desktop": { 
    "toolkit": "classic", 
    "theme": "theme-crisp" 
  }, 
  "tablet": { 
    "toolkit": "modern", 
    //classic "theme": "theme-windows" 
    //theme-crisp-touch 
  } 
}
```

You can set the tablet theme to windows mobile, or in case you prefer to make use of the classic toolkit, then switch the theme to "theme-crisp-touch" for more whitespace around buttons and links, and bigger icons and buttons. So you won’t miss tap. My **index.html** file, has an `Ext.beforeLoad` method, that looks like this: 

``` JavaScript
Ext.beforeLoad = function (tags) { 
  var s = location.search, profile; 
  if (s.match(/desktop/)) { 
    profile = 'desktop'; 
  } else if (s.match(/tablet/)) { 
    profile = 'tablet'; 
  } else { profile = tags.desktop ? 'desktop' : 'tablet'; 
  } Ext.manifest = profile; 
};
```

`Ext.platformTags` is a singleton [http://docs.sencha.com/extjs/6.0.0/classic/Ext.html#property-platformTags](http://docs.sencha.com/extjs/6.0.0/classic/Ext.html#property-platformTags) within Ext JS which can contain information about what type of device I am running on. When I execute this command on my Windows Surfarce Pro tablet, I get the following information: 

``` JavaScript
Ext.platformTags.tablet > false Ext.platformTags.touch > 10 Ext.platformTags.edge > 15 
```

  
If I switch to touch / tablet mode, for example by removing my tablet from the dock: 

``` JavaScript
Ext.platformTags.tablet > false Ext.platformTags.touch > 10 Ext.platformTags.edge > 15 
```

Hmm. Not what I expected. Unfortunately, there is no out of the box way, on how you can detect the tablet mode, from your browser, or from the `Ext.platformTags` singleton. Now obviously you can create a button in the top of your app, which contains an onclick handler that does something like this: 

``` JavaScript
onTablet: function(){ 
  var url = window.location.href; 
  url = url.split('?')[0]; window.location.href = url + '?tablet'; 
}, 
onDesktop: function(){ 
  var url = window.location.href; url = url.split('?')[0]; window.location.href = url + '?desktop';
}
```

It would be nicer, if my device can detect this mode switch programmatically. Unfortunately, by the time of writing there is no HTML5 / JavaScript API solution, which can detect mode changes. I tried to look into projects like Apache Cordova, to figure out if there are native API solutions, but I couldn’t find it either. I can’t check on touch input either, because on a hybrid machine, like the surface pro, touch input works regardless switching the mode, since the screen is just a touch screen. So `navigator.pointerEnabled` will always return true. So for now, we are left with a trick. It’s a smart trick though. And it won’t work in IE11 or below. Which is ok, since for our demo, we will make use of the modern toolkit for tablet mode, and modern toolkit is for modern browsers, like Microsoft Edge. **However, it won’t work in any other browser either. So not, in Google Chrome or Firefox. For those browsers, you will have to stick with the button switch approach. This might be an ok solution for you, since we are talking here about developing universal windows apps.** 

In tablet mode; there is no browser scrollbar. The browser scrollbar will be 0, while on desktop mode, it will be a value in pixels. (like 12px). Now, user: robocat created a working JavaScript example in a JSBin, where you can see a working demo: https://output.jsbin.com/puseco. The trick here, is to add an hidden div to your page body with overflow scroll, to start calculating the scrollWidth. Now I was super amazed and surprised, but apparently Ext JS already has a built-in function like this! Yay. So you only need to call: `Ext.getScrollbarSize(true)` where you are forcing it to re-check it: http://docs.sencha.com/extjs/6.0.0/classic/Ext.html#method-getScrollbarSize So on my Windows Surface Pro, in desktop mode, it will return: 

``` JavaScript
Ext.getScrollbarSize(true).height > 12 Ext.getScrollbarSize(true).width > 12 
```

And in tablet mode: 

``` JavaScript
Ext.getScrollbarSize(true).height >0 Ext.getScrollbarSize(true).width >0 
```

Great! We are getting close. Now let’s check and see if we can detect it automatically! Most of the times, when switching modes, it will also fire a window resize [http://docs.sencha.com/extjs/6.0.0/classic/Ext.container.Viewport.html#event-resize](http://docs.sencha.com/extjs/6.0.0/classic/Ext.container.Viewport.html#event-resize) or a childmove [http://docs.sencha.com/extjs/6.0.0/classic/Ext.container.Viewport.html#event-childmove](http://docs.sencha.com/extjs/6.0.0/classic/Ext.container.Viewport.html#event-childmove) event. We can attach a resize listener on an `Ext.Viewport`, like our **main.js** file, and run the mode switch. Note the extra check that I created to make sure you are switching profiles. (Otherwise your app would keep on refreshing.) **Main.js** 

``` JavaScript
listeners: { 
  resize: 'onMainResize', 
  childmove: 'onMainResize' 
}, 
```

**MainController.js** 

``` JavaScript
onMainResize: function(){ 
  var url = window.location.href; 
  url = url.split('?')[0]; 
  //console.log(Ext.getScrollbarSize(true).height == 0); //console.log(Ext.manifest.profile); 
  if ( Ext.platformTags.edge > 0 && Ext.manifest.profile == 'desktop' && Ext.getScrollbarSize(true).width == 0 && Ext.getScrollbarSize(true).height == 0 ) {    window.location.href = url + '?tablet'; } 
  else if ( Ext.platformTags.edge > 0 && Ext.manifest.profile == 'tablet' && Ext.getScrollbarSize(true).width != 0 && Ext.getScrollbarSize(true).height != 0 ) {      window.location.href = url + '?desktop'; } },
  ```

  Let’s finish this article with a bonus topic. Sencha has responsiveConfig to change configuration on runtime, based on criteria. [http://docs.sencha.com/extjs/6.0.0/classic/Ext.plugin.Responsive.htm](http://docs.sencha.com/extjs/6.0.0/classic/Ext.plugin.Responsive.html). 
  
  Responsive Design in Ext JS, means it’s JavaScript configuration, which means that you can write any type of criteria. It also means, that you can change anything you like on runtime. This doesn’t necessary means that you have to change the look and feel. You can change anything, so for example also load different models, redraw or refresh a page. (..because you can override a setter/update method). Here’s a simple example. Any property can be configured as long as it has an setter under the hood. (if not, you can create your own setters of course.) 
  
``` JavaScript
  plugins: ['responsive'],
  responsiveConfig: { 
    tall: { tabPosition: 'left' }, 
    wide: { tabPosition: 'bottom' } 
  },
```

Now look into this customized example, where I override the updateMethod 
  
``` JavaScript 
config: { customTabPanel: false }, 
plugins: ['responsive'], 
responsiveConfig: { tall: { 
  customTabPanel: true }, 
  wide: { customTabPanel: false } 
}, updateCustomTabPanel: function(isCustomTabPanel){ 
    if(isCustomTabPanel){ 
      //manually build my tabpanel, and do a whole bunch of //other stuff, like creating models or something 
      //or destroying a screen and rebuild it 
    } else { 
      //code for when customTabPanel is false } } 
```

The criteria to choose from are: `tall` — Viewport width < height regardless of device type `wide` — Viewport width > height regardless of device type. `landscape` — Like wide, but always true on desktop devices `portrait` — Like tall, but always false on desktop devices `width` — An expression that tests for the specific width of the viewport `height `— An expression that tests for the specific height of the viewport `platform` — An object containing various booleans describing the platform So how can you create a custom criteria? With responsiveFormulas! [http://docs.sencha.com/extjs/6.0.0/classic/Ext.mixin.Responsive.html#cfg-responsiveFormulas](http://docs.sencha.com/extjs/6.0.0/classic/Ext.mixin.Responsive.html#cfg-responsiveFormulas) 

``` JavaScript
responsiveFormulas: { 
  touch: function(context) { 
    return Ext.feature.has.Touch; 
  }, 
  notTouch: function(context) { 
    return !Ext.feature.has.Touch; } 
  }, 
```

I have used this example, for example in a chart. On a touch device I use pinch to zoom, and on a mouse and keyboard device, I use the crosshair interaction. Although this is a great example, it would make less sense for a windows universal app, since hybrid tablet PCs have both interfaces: touch and mouse/keyboard support. Maybe you are creating an interface that needs to support mouse/keyboard or touch support. Do you have a tablet/pc hybrid and want to play around with this? Here’s my project on Github to fork: [https://github.com/savelee/sencha-windows-universal-apps](https://github.com/savelee/sencha-windows-universal-apps) 

![studio](/images/studio-500x281.jpg) 

*(PS: I own a Microsoft Surface Pro 4, and the best thing of it, is it’s keyboard. ;) - As a small hybrid touch windows PC it’s great. As a tablet, it really sucks. No matter to what mode you switch it, it feels and breaths like a PC with touch support. Certain things in Windows are designed for mouse and keyboard usage. And also, the way how it boots, load times etc, it just shows you, it’s a PC. ..but a really good one.)*
