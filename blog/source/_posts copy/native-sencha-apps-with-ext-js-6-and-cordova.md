---
title: Native Sencha apps with Ext JS 6 and Cordova / PhoneGap
description: Learn how to make native mobile apps with Ext JS 6 and Cordova PhoneGap
tags:
  - Cordova
  - Hybrid
  - Native
  - Phonegap
  - Mobile App
  - iOS
categories:
  - Cordova
alias: /developer/native-sencha-apps-with-ext-js-6-and-cordova/
date: 2016-06-18 18:10:22
---

Last time I played with Cordova, I developed Sencha Touch apps. Been there, done that. Sencha’s new mobile framework, is Ext JS 6. With Ext JS 6 you can create desktop applications or mobile (tablets or phone) apps. And.. you can create universal apps. A universal app, means one Ext JS 6 code base, for any type of device. Whether it’s a phone, a tablet or a desktop app, we let Sencha detect the type of device, browser or OS, and download and serve the right kind of experience for you. That works great for web applications, the so called PWAs, progressive web apps. But what if you want to create a native app with Ext JS?

<!--more-->

For example, because you want to sell your app in an app store, or because you want to make use of native device API features. The solution would be Adobe PhoneGap or Apache Cordova. Just in case you are completely new to this technology; PhoneGap and Cordova are making use of the same technology, but PhoneGap is from Adobe and is a commercial solution, Cordova is Apache and open source. The commercial version has a cloud build tool, which can build your applications to native online, (and therefore you don’t need to install dev tools (like for example XCode) on your own machine. Just like how Cordova works, with PhoneGap it’s also possible to build yourself, from your own machine. This requires you to have the SDKs for Android Dev Tools, Windows Tools or XCode installed on your pc or Mac. The way how Cordova/PhoneGap works, is they will take your web build (the Sencha concatenated / minified JavaScript build, index.html and CSS theme), and copy this in a native project file. (like an XCode project). These SDK project files contain a webview (a native shell. It’s like a browser, it can display webpages/apps, you just can’t enter URLs, it defaults to your web build). Alright, so in the past I’ve wrote tutorials about Cordova and PhoneGap before, you can find those [here](https://www.leeboonstra.com/developer/getting-started-with-sencha-touch-2-build-a-weather-utility-app-part-3) and [here](https://www.leeboonstra.com/developer/make-a-native-build-with-ext-js-5-sencha-cmd-5-and-phonegap-cordova-with-plugins). 

However, that has been a while ago, and I’m curious to see if it all works the same way, since technologies change, and so do Android and iOS versions. In particular I’m curious how it will work with Ext JS 6 universal apps. I do want to have one code base for maintainability, however I do *not* want to have my desktop application deployed with my mobile app, since it’s only for mobiles. Further more, I don’t want to have my Android interface in an iOS build etc. So let’s dive into this! We will make use of Cordova, since it’s open source there will be many plugins available. In case you haven’t already. You will need to install Cordova with the NPM package manager, from your command-line. It requires Node. I’m currently running Node JS version: 5.8.0 `` `$ npm install -g cordova` `` (Mac OSX users might need to prefix the CLI commands with sudo, for the permissions.) Afterwards, review if Cordova has been correctly installed: `` `$ cordova -v` `` Generate a new Ext JS universal app. (Or use an existing one.) (`sencha generate app MyApp ../mypath`), you run this command from the downloaded Sencha SDK folder. Next open from your Ext JS app, the app.json file. We will add some code here. Scroll to the ***builds*** block. Add the following build profile: 

``` JSON
"cordovaios": { 
  "packager": "cordova", 
  "cordova": { 
    "config": { 
        "platforms": "ios", 
        "remote": false, 
        "id": "com.ladysign.Spotifinder", 
        "name": "MyApp" 
      }
  },
  "toolkit": "modern", "theme": "theme-ios" },
```

The *packager* field, will trigger Sencha Cmd, to make use of your Cordova installation. Note, you can also enter **phonegap** here, in case you have PhoneGap installed on your machine. Once you have the packager defined, you can use the **cordova** object. 

In the *platforms* field, you define the platforms you want to build for (again, it requires the SDK tools for every platform). Unless you are creating an application with one universal look and feel (a theme derived from Neptune or Triton), I would put only one platform here. You can always create multiple build profiles in the app.json. 

I only wrote *ios* here, because my app is making use of the new Ext JS 6.2 *theme-ios* theme. (Remember, that I don’t want to put more than one theme in my build?). 

The field *remote* is set to false, unless you want to make use of the PhoneGap cloud builder, than it would be *true*. The *id* is the id (reverse domain notation), you will use in your app store, and *name* that’s the name of your app, as you use in `Ext.Application`. 

The *toolkit* property is important for an Ext JS 6 app. (Remember, that I don’t want to include the desktop version of my app in this build?). All phone applications should make use of the toolkit, since that’s a faster performing toolkit, with more components that were designed for mobile touch user experience. Next. verify, that you didn’t make typos in the **app.json** file, by running from your project folder the following command: `$ sencha app refresh` Now, we need to modify the index.html file, to make sure the application can load within Cordova. The microloader will need to detect if it’s an Cordova app, to load the correct JavaScript code and theme: 

``` JavaScript
  var Ext = Ext || {}; // Ext namespace won't be defined yet...
    // This function is called by the Microloader after it has performed basic
    // device detection. The results are provided in the "tags" object. You can
    // use these tags here or even add custom tags. These can be used by platform
    // filters in your manifest or by platformConfig expressions in your app.
    //
    Ext.beforeLoad = function (tags) {
        var s = location.search,  // the query string (ex "?foo=1&amp;bar")
            profile;
        if (
            location.href.match(/\bcordova\b/) ||
            Ext.platformTags.cordova ||
            Ext.platformTags.webview
        ) {
            profile = 'cordovaios';
        }
        else if (s.match(/\bmodern\b/) || tags.ios) {
            profile = 'modern';
        }
        else if (s.match(/\bandroid\b/) || Ext.platformTags.android &gt; 0) {
            profile = 'android';
        }
        else {
            profile = 'classic';
        }
        Ext.manifest = profile;
    };
```
 
 This tells the Sencha microloader, to load the *cordovaios* build, if: *cordova* is in the url (to test on your development machine) or if the app runs in a cordova or webview shell. Sure, instead of all this if else checking, you could force `Ext.manifest = ‘cordovaios’` but the magic here, is that we will reuse this index.html for every type of app, whether it’s an desktop app, iOS PWA or Android PWA. So this microloader is actually great. Ready? Let’s go and build: `$ sencha app build cordovaios` We tell Sencha Cmd to build the *cordovaios* profile, like we wrote in **app.json**. Woopie. It seems like it worked. 
 
 Let’s take a close look and see where the build is located. According to my build log, it looks like there’s a **cordova** folder created in my Ext JS application folder: **MyApp/cordova**:

 ``` txt
 MyApp 
 - cordova 
 - - config.xml 
 - - hooks 
 - - platforms 
 - - plugins 
 - - www 
 - - - index.html 
 - - - cordovaios 
 - - - - app.js 
 - - - - resources 
 - - - - - MyApp.css 
 ```

 The **www** folder, will be the place, where a copy of your Sencha Ext JS 6 app will be located. Let’s look into this folder, and verify what’s inside of it. So what’s in the **cordovaios** folder, is the JavaScript code, for the modern toolkit only. Nice! So. you won’t bundle the desktop version inside of it. And also, it only includes one theme, the right one. This is all because of the *toolkit* and *theme* settings we made in the **app.json** file. How awesome. 
 
 Let’s cover some Cordova / XCode stuff, since you are here anyway. If you have done this before, this is probably not so interesting for you… Oh cool. So you are still here. Open **config.xml** and modify the name and description fields to describe your app. After your first build, you can copy the generated **cordova.js** and **cordova-plugins.js** files, and put it in your cordova **www** folder. Copy it from **MyApp/cordova/platforms/ios/www**. That way the other **cordova/www** folder won’t have 404 errors. You could make another build: `$ sencha app build cordovaios` Open your application from the cordova www folder in your browser, and verify that everything works without issues. For example: http://localhost/MyApp/cordova/www/ We don’t need the auto generated **css** and **js** folders. So remove those. No worries, the next time you make a cordovaios build, those folders won’t come back. Ok, so basically, we could now open XCode, open the **MyApp/cordova/platforms/ios/MyApp.xcodeproj**, and build with XCode tools, the applications. 
 
 In XCode, press the *play* button. It creates a build, and it should run it in an simulator. I run into a common issue: *The status bar is mixed into my layout.* We can fix this with the cordova-plugin-statusbar plugin. So install it. Run on the CLI from he cordova folder: `$ cordova plugin add cordova-plugin-statusbar`
 
 In XCode rightclick your project to view the *resources/MyApp.pList* configuration. And add the following settings: 
 
 * `Status bar is initially hidden = YES` 
 * `View controller-based status bar appearance = NO`
 * `UIRequiresFullScreen = YES` 
 
This should be fixed. Next replace all the Cordova logos and splash screens. You can find and replace those assets from here: **MyApp/Cordova/platforms/ios/MyApp/Images.xcassets** And that’s it. Project > Clean your build, Rebuild, *Project > Build*. And test and run your application in the simulator. For iOS developers, the next steps would be to setup an paid Apple Developer account. It cost about a 100 bucks a year, and you can sell unlimited applications from the Apple App Store. With the developer account, you can get access to iOS beta releases, and you can test your applications on real devices. [https://developer.apple.com/](http://developer.apple.com)

Success! Feel free to share your deployed Sencha hybrid apps for Android or iOS with me in the comments!