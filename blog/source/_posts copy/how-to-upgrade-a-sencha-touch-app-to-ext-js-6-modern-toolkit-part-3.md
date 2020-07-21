---
title: How to Upgrade a Sencha Touch App to Ext JS 6 Modern Toolkit – Part 3
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
date: 2016-02-09 16:13:10
alias: /developer/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-3/
---

### Advanced Universal Upgrade

This upgrade will take the most time, but your opportunities are endless. You will have the latest framework with all the new features and classes, and you can improve your application performance and code base with the new MVVM architecture. Plus, you can create universal cross-platform apps (or plan to do that in the future). Not only can you build applications for mobile phones or tablets, you can also support desktop or hybrid computers, with a component set specifically made for desktop usage.

<!--more-->

To take this approach, my advice is to regenerate a folder structure with Sencha Cmd, with the same namespace, but this time as a universal app.

1.  Navigate to the **ext** framework folder and generate a project with:  
    **sencha generate app**  
    For example:  
    `ext> sencha generate app Dinmu ../dinmu3`
    
    This will create a folder structure with the shared app folder, the classic folder for the **classic** toolkit, and a modern folder for the **modern** toolkit.
    

![Files](/images/touch-extjsmodern-tutorial-files-part3-img1.png)

3.  Once you have this folder structure, you will need to think about which code you want to share, and which code you want to be unique for each experience.

Obviously, this means that you need to create new views, specific for desktop. (In the case of the weather application, I can assume that you already have an existing touch application, with modern toolkit views, so you will make new desktop views). Desktop components might require unique event listeners, so you probably will end up with additional view controllers. You can share view controllers from the app folder, by extending it, for example.

However, you could also choose to create unique data / models for desktop views. The screens are bigger, so you have more space to display additional data. Or maybe a mobile phone has different features (camera, geolocation, etc.) than a desktop application, so you might want to create different behaviour for certain devices. The good thing is that this is all possible. The trick here is that you move classes over from the app folder to either the classic or modern folders. You can learn more about [creating universal apps](/Sencha-Touch/how-to-build-a-great-looking-universal-app-with-ext-js-part-1/) in my previous blog post series.

## What About File Sizes?

Are you interested in the file size of the build app.js and app.css of the Weather app? Have a look:

<table class="table">
  <thead>
    <tr>
      <th scope="col">Files</th>
      <th scope="col">Sencha Touch original</th>
      <th scope="col">Ext JS 6 Modern (Basic)</th>
      <th scope="col">Ext JS 6 Modern (MVVM)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">app.js – minified</th>
      <td>558kb</td>
      <td>836kb</td>
      <td>@887kb</td>
    </tr>
    <tr>
      <th scope="row">app.css – compiled</th>
      <td>241kb</td>
      <td>91kb</td>
      <td>@91kb</td>
    </tr>
  </tbody>
</table>

Ext JS 6 requires more advanced classes, so that’s why the total build will be a bit bigger. You can make your own code base smaller by switching to View Controllers, using data binding, and cleaning your model fields, which might get you an even smaller final build.

Also note, because of the new microloader, we can cache your applications way smarter, and applications can be made for offline use.

![Triton Theme](/images/touch-extjsmodern-tutorial-triton1-part3-img2.png)

![Triton Theme](/images/touch-extjsmodern-tutorial-triton2-part3-img3.png)

### Conclusion

In this tutorial, I’ve explained how to migrate your Sencha Touch application to Ext JS 6 Modern toolkit. For me, the basic upgrade took a few hours, and the upgrade to MVVM took a morning. However, this is a pretty basic application with not many views.

Upgrading is easier than when you had to upgrade from Sencha Touch 1 to Sencha Touch 2, but it can take some time. It depends on whether you want to upgrade the pattern too, and if you have lots of custom components in your existing Sencha Touch app.

We have lots of professional services engineers, who migrate complex applications all the time, and they can help you with your application. [Contact us](https://www.sencha.com/contact/) for details.

![Windows Theme](/images/touch-extjsmodern-tutorial-windowsphone-part3-img4.png)

I do think it’s worth spending the time on upgrading your app with the MVVM pattern because:

*   You will be on the latest framework, and support the latest browsers and operating systems.
*   You can clean up your code base a lot.
*   The MVVM pattern can improve performance.
*   You can create desktop & mobile applications with one code base.
*   You will get all new classes, components, and themes.
*   You can use the new theme package structure, and compile themes much faster.

Because of the new Ext JS core, all newer Ext JS apps (version 5 and up) will be backwards compatible. That means it will be simpler to upgrade (just like Ext JS 5 to Ext JS 6 applications, which only require an upgrade through Cmd).

*   [Part I](/Sencha-Touch/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-1/)
*   [Part II](/Sencha-Touch/how-to-upgrade-a-sencha-touch-app-to-ext-js-6-modern-toolkit-part-2/)