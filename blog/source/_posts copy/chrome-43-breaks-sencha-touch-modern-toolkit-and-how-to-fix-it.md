---
title: Chrome 43 breaks Sencha Touch / modern toolkit and how to fix it.
description: Chrome 43 breaks Sencha Touch, here are the fixes.
tags:
  - chrome 43
  - load spinner
  - overflowchangeevent
  - scroll problem
categories:
  - Sencha Touch
date: 2015-05-26 09:31:14
alias: /developer/chrome-43-breaks-sencha-touch-modern-toolkit-and-how-to-fix-it/
---

Lately, I received a couple of questions about the latest Chrome 43.x version, which breaks Sencha Touch 2.4 apps (or Ext JS 6 modern toolkit apps) due the deprecation of the `overflowchanged` event. It actually breaks the following classes: `Ext.util.PaintMonitor` and `Ext.util.SizeMonitor`. You will notice this bug when trying to scroll in a list component. You will see a small square in the top right corner, instead of the familiar scroll bar, and it's impossible to scroll.

<!--more-->

As the day of writing this blogpost, Sencha is currently fixing this bug in Sencha Touch and in Ext JS 6 modern toolkit. When you are a Sencha support subscriber, you will have access to our support portal, and probably by the time of reading this, you will be able to download the latest nightly build, which includes this fix. If you can't wait, and temporary want to fix this issue, (for example because it's blocking you from development) you can use an override. You can use the following override classes. ([PaintMonitor](https://github.com/savelee/senchatouch-chrome43/blob/master/app/util/PaintMonitor.js) and [SizeMonitor](https://github.com/savelee/senchatouch-chrome43/blob/master/app/util/SizeMonitor.js)). Just require these in your _app.js_. I am hosting an example app on Github, feel free to clone it: [https://github.com/savelee/senchatouch-chrome43](https://github.com/savelee/senchatouch-chrome43). 

Thanks [Trevor Brindle](http://trevorbrindle.com/chrome-43-broke-sencha/), for sharing parts of your solution. There is another small problem with the load spinner in Sencha Touch applications; `Ext.LoadMask` is no longer animated. This is a simple fix in the Sass (_touch/resources/themes/stylesheets/sencha-touch/base/src/_Class.scss_) the prefixes for keyframe and transform aren't used anymore. In case you want to quickfix this in your app, you can add the following styles to your application stylesheet (and make a build): [app.scss](https://github.com/savelee/senchatouch-chrome43/blob/master/resources/sass/app.scss)

Again, this probably will be fixed in the latest nightly build. So if possible, switch to that, instead of manually patching stuff. For further information about these Chrome changes, take a look into the links below. - [http://blog.chromium.org/2015/04/chrome-43-beta-web-midi-and-upgrading.html](http://blog.chromium.org/2015/04/chrome-43-beta-web-midi-and-upgrading.html)  
- [http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype](http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype)