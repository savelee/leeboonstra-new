---
title: 'Getting Started with Sencha Touch 2: Build a Weather Utility App (Part 3)'
description: Learn how to create a utility app with Sencha Touch and Sencha Cmd
tags:
  - Build native app
  - Cordova
  - hybrid app
  - Phonegap
  - Sencha Ant
  - Sencha Build
  - Sencha CMD
  - Sencha Touch
categories:
  - Sencha Touch
alias: /developer/getting-started-with-sencha-touch-2-build-a-weather-utility-app-part-3/
date: 2014-04-21 10:52:47
---

In this three-part Sencha Touch tutorial, you will build the _Do I need my Umbrella?_ app, a simple utility app that loads weather information from a web service — worldweatheronline.com. Based on weather codes, this app can predict if you need your umbrella or not.
<!--more-->

In this last part of the tutorial, we’ll talk about builds. You’ll use Sencha Cmd as well as PhoneGap/Cordova.

For the native app, you’ll use a native API for retrieving the location of the device, and you’ll port your app to a native mobile app with PhoneGap/Cordova for iOS, Android, BlackBerry10 or Windows Phone.

Note: If you want to test your app on an iOS, BlackBerry or Windows Phone device, you will need authorization keys and developer accounts. Also, if you use Cordova, you can’t build an iOS app in the Windows operating system, nor can you build a Windows app from within Mac OS X.

For reference, you can view [Part 2](http://www.leeboonstra.com/developer/getting-started-with-sencha-touch-2-build-a-weather-utility-app-part-2) of this tutorial.

You can download the solution code from Part 2 of the tutorial — [full solution](https://training.sencha.com/sencha-blog/tutorial-dec-2013-lee/goodies-tutorial/fullsolution-download.zip).

**This tutorial requires:**

*   Sencha Touch 2.3 or higher
*   Sencha Cmd 4.x
*   Compass and Sass on top of Ruby
*   A modern browser
*   An editor
*   [PhoneGap 3.3](http://phonegap.com/install/) / [Cordova 3.3](http://cordova.apache.org/)
*   [Node.js v.0.10.23](http://www.nodejs.org)

Optionally, you can install the following software to build apps locally:

*   XCode 5 (for building iOS app locally, for Mac OS X users only)
*   Android Developer Tools (Revisions 13+, for building Android apps locally)
*   Windows 8 Pro with Visual Studio 2012 Pro/Ultimate (for building Windows Phone apps locally, for windows users only)
*   Blackberry 10 Native SDK (for building BlackBerry 10 apps locally)

### Creating a production build

With Sencha Cmd, you can create production and test build packages. The production build package compiles the Sass style sheet to production-ready (minified) CSS. It will also copy over your static images and build your JavaScript (Sencha Touch framework classes plus your own custom classes) into a single minified, concatenated file that’s small enough to easily download or cache the file. The production build will also include a cache manifest file to enable local caching.

The test package won’t contain this file. In the test build, the JavaScript and CSS files in the test package won’t be minified and therefore will be readable.

![Weather App Tutorial](/images/weather-app-1-build.png)

Let’s first create a production build of the Weather application. We’re not going to create a native build yet. In case you want to host the Weather App on your own server, you need to copy the production build folder over to your web server.

On the command-line enter the following command to generate a production build:

`sencha app build production`

or

`sencha app build testing`

Review the folder structure. This is the folder structure you can use on your web server, in case you decide to run the mobile application from an online URL.

![Weather App Tutorial](/images/weather-app-2-files.png)

Perhaps you noticed that the fonts are not copied into the build folder. We could copy this folder manually, or we could modify the build process. Let’s look into these options.

Sencha Cmd uses Apache Ant for the build processes. You can find all the internally used tasks in the hidden **.sencha** folder.

If you want to modify the build process yourself, you can open the **build.xml** file in the root of your application folder and add the following Ant task to the end of the file:

```XML
<target name="-after-build">
    <target name="build"
            depends="init,-before-build,-build,-after-build"
            description="Copy over the font/dinmu folder and remove temp files"></target>
 
    <copy todir="${basedir}/resources/css/stylesheets/fonts/dinmu" overwrite="true">
      <fileset dir="${basedir}/resources/sass/stylesheets/fonts/dinmu">
        <include name="**/*">
      </fileset>
    </copy>
    <copy todir="${build.dir}/resources/css/stylesheets/fonts/dinmu" overwrite="true">
      <fileset dir="${basedir}/resources/sass/stylesheets/fonts/dinmu">
        <include name="**/*">
      </fileset>
    </copy>
    <delete dir="${basedir}/${build.dir}">
```

Now build your application again:

sencha app build

You can test the production build with the following url: [http://localhost/dinmu/production/Dinmu/](http://localhost/dinmu/production/Dinmu/)

### Native Device APIs

Do you want to run your application as a native app on your device? With tools such as Adobe PhoneGap and Apache Cordova, you can port your app to a hybrid app.

Once you have a hybrid app, you can use device APIs, such as geolocation. The [geolocation](http://docs.phonegap.com/en/edge/cordova_geolocation_geolocation.md.html#Geolocation) object provides access to location data based on the device's GPS sensor or inferred from network signals.

Open the following file with your editor: **app/utils/Functions.js** and inspect line 101:

``` JavaScript
Ext.device.Geolocation.getCurrentPosition({
   timeout: 5000,
   maximumAge: 10000,
   success: function(position) {
      var place = position.coords.latitude + "," + position.coords.longitude;
      Dinmu.utils.Functions.getWeather(place);
      Ext.Viewport.unmask();
   },
   failure: function() {
      Ext.Viewport.unmask();
      Ext.Msg.alert('Timeout', 'Can not retrieve position, please retry.');
   }
});
```

The Sencha Touch class: `Ext.device.Geolocation()` provides access to the native Geolocation API when running on a device. There are three implementations of this API:

*   [Sencha Mobile Packager](http://docs.sencha.com/touch/2.3.1/#!/guide/native_packaging-section-step-2%3A-create-a-packaging-configuration-file)
*   [PhoneGap/Cordova](http://docs.phonegap.com/en/1.4.1/phonegap_device_device.md.html)
*   Browser

This class will automatically select the correct implementation for the device your application is running on.

Before we will build the Do I need my umbrella (Dinmu) application, there are two more checks.

*   Prefix the request to api.worldweatheronline.com with the http protocol. You can find this request in **app/utils/Functions.js** on line 125.
*   Make sure you entered a valid API Key for the worldweatheronline.com web service. You can retrieve an API Key by registering at [http://www.worldweatheronline.com](http://www.worldweatheronline.com)

All set? That’s great. The only thing that’s left is building a native app with PhoneGap/Cordova.

![Weather App Tutorial](/images/weather-app-3-styling2.png)

### Building a hybrid app

There are three products you can use to create a native app from a Sencha Touch code base: Sencha Mobile Packager, Adobe PhoneGap, and Apache Cordova. All products are supported by the Sencha Device API which allows you to access hardware resources on devices.

Let me explain the differences between these three solutions:

#### Sencha Mobile Packager

Uses the **packager.json** to build iOS or Android build packages locally that can be distributed through the Android Marketplace or Apple App Store.

#### Adobe PhoneGap

Lets you use the PhoneGap Build cloud service to (remotely) package your apps and distribute them through the Android Marketplace, BlackBerry App World, Windows Phone Store or Apple App Store. It’s an easy solution, and you can test applications on your device by scanning a QR code. You can also build applications locally. It’s a commercial product, and the free version is limited to one private app.

#### Apache Cordova

Apache Cordova is a top-level project within the Apache Software Foundation. Cordova is the free, open-source, community-driven version of Adobe PhoneGap. Cordova lets you package apps locally and distribute them through the Android Marketplace, Blackberry App World, Windows Phone Store or Apple App Store.

Building packages locally via the command-line requires an installation of XCode, Android Developer Tools, BlackBerry 10 SDK or Windows 8 Pro with Visual Studio.

Building packages via PhoneGap build requires a (free) Adobe (PhoneGap Build) account: [https://build.phonegap.com/apps](https://build.phonegap.com/apps)

Note: We will use PhoneGap Build in this tutorial. If you would rather use Cordova, you can use the same commands as you see in the tutorial, but replace the word **`phonegap`** with **`cordova`** on the command-line. ![Weather App Tutorial](/images/weather-app-4.png)

#### Initialize a PhoneGap project

The first step in building a hybrid app is to issue the following command from your project’s directory to enable it:

sencha phonegap init <APP-ID> <APP-NAME>

*   The **App ID** follows this pattern: `<REVERSED-DOMAIN>.<APP-NAME>`.
*   Your **application name** should be the same value as the name property that you specified in your app.json file.

Note: If you want to port to an iOS app, you will need to make sure that the App Id is the same one that you registered in your Apple provisioning portal.

Here’s the command I used to enable PhoneGap support:

sencha phonegap init com.sencha.dinmu Dinmu

Note: Mac OS X users might need to prefix with sudo to get administrative rights.

This generated the following structure/files:

*   PhoneGap folder structure
*   phonegap.local.properties
*   config.xml

#### MyApp/phonegap

**MyApp/phonegap** contains the full PhoneGap file structure. If you used Cordova to initialize a project, the folder will be named **cordova**.

![Weather App Tutorial](/images/weather-app-5.png)

#### phonegap.local.properties

The **phonegap.local.properties** file contains the names of the platforms that you want when building locally. By default, it takes the local installed SDKs, for example:

phonegap.platforms=ios android blackberry10 wp8

When you run the phonegap `init` command, the property file also gives you settings for the Adobe PhoneGap remote packager. When you have a PhoneGap Build account, you can set up these additional settings:

```
phonegap.build.remote=true
\# Username for PhoneGap Build
phonegap.build.remote.username={username}
\# Password for PhoneGap Build
phonegap.build.remote.password={password}
```

When you leave the phonegap.build.remote property as false, you have to have one of the SDKs (XCode, Android Developer Tools, BlackBerry 10 SDK or Windows 8 Pro with Visual Studio) installed on your machine.

#### config.xml

The default Cordova/PhoneGap **config.xml** file contains metadata about your app. Let’s modify this file:

We will change the app name, app description and author information:

``` XML
<name>Dinmu</name>
<description>
    Do I need my Umbrella today?
</description>
<author email="myemail@addres.com" href="http://www.mydomain.com">
    Your name
</author>
```

The next step is to enable the Geolocation plugin at startup, to retrieve the location via the device:

``` XML
<preference name="EnableLocation" value="true"></preference>
```

Disable fullscreen mode, to show the status bar (battery indicator and time):

``` XML
<preference name="fullscreen" value="false"></preference>
```

Let’s make sure the application supports connections to external urls. The weather application will connect to [http://www.worldweatheronline.com](http://www.worldweatheronline.com). Therefore, we need to give access to either this URL or all external URLs. We can use the wildcard to allow all external connections:

``` XML
<access origin="*"></access>
```

The last thing we’ll modify are the paths to the icons and loading images. By default Sencha Touch generated iOS icons and splash images. They can be found in the **MyApp/resources** folder.

When building apps for iPhones with retina displays (iPhone 5+), it’s important that you provide the correct splash screens with the required screen sizes. If not, your viewport may be resized incorrectly. For this example, we’ll stick to the PhoneGap splash screens. Feel free to replace them with your own splash screens.

``` XML
<icon src="icon.png"></icon>
<icon src="resources/icons/Icon.png"></icon>
<icon gap:platform="ios" height="57" src="resources/icons/Icon.png" width="57"></icon> 
<icon gap:platform="ios" height="72" src="resources/icons/Icon~ipad.png" width="72"></icon> 
<icon gap:platform="ios" height="114" src="resources/icons/Icon@2x.png" width="114"></icon> 
<icon gap:platform="ios" height="144" src="resources/icons/Icon~ipad@2x.png" width="144"></icon> 
 
<gap:splash gap:platform="ios" height="480" src="res/screen/ios/screen-iphone-portrait.png" width="320"></gap:splash>
<gap:splash gap:platform="ios" height="960" src="res/screen/ios/screen-iphone-portrait-2x.png" width="640"></gap:splash>
<gap:splash gap:platform="ios" height="1024" src="res/screen/ios/screen-ipad-portrait.png" width="768"></gap:splash>
<gap:splash gap:platform="ios" height="768" src="res/screen/ios/screen-ipad-landscape.png" width="1024"></gap:splash>
```

For more information about possible settings in config.xml, check the [PhoneGap documentation.](http://docs.phonegap.com/en/3.3.0/)

#### Creating the native build package

After initializing your application with PhoneGap or Cordova, it’s time to create a native build. Run the following command from the command-line:

`sencha app build -run native`

Note: The -run argument makes sure your app will be loaded in an emulator that’s installed on your machine. Again, Mac OS X users might need to prefix with sudo to get administrative rights.

It will build the applications in the MyApp/cordova or MyApp/phonegap folder:

*   platforms/android/bin - Android .apk file
*   platforms/ios/build/ - iOS .app file
*   platforms/blackberry10/build/simulator - BlackBerry 10 .bar file
*   platforms/wp8/Bin/Debug - Windows Phone .xap file

#### Testing a native build

If you’re using PhoneGap Build, testing the application on Android devices will be very easy. Simply scan the QR code or download, drag and drop the **.apk** file on the memory card of your phone.

For iOS, you will need provisioning and code signing, which assures users that the app is from a known source and the app hasn’t been modified since it was last signed. Windows Phone developers and iOS developers will need a (paid) developer account.

Once you have an iOS developer account, you’ll need to set up a certificate, an identifier and a provisioning profile. For more information, see the [Apple Developer Tools](https://developer.apple.com/) and Sencha Touch docs on [Packaging Native iOS Applications](http://docs.sencha.com/touch/2.3.1/#!/guide/native_provisioning).

When all is set, you can build the application with PhoneGap from the command-line interface:

sencha app build native

When you build for iOS, you might run into a build error because you need to code sign the iOS app. With PhoneGap Build, you’ll need to upload the ***.p12 certificate** and the ***.mobileprovisioning mobile provisioning profile**. After you’ve uploaded these two keys, you can unlock the keys and rebuild.

If you’re building the app locally, (PhoneGap remote=false or with Cordova), you can open: **platforms/ios/Dinmu.xcodeproj** from the **phonegap** or **cordova** folder, and maintain the build settings to code sign the application. Your developer identity should be in the _Code signing identity_ list. If not, you probably need to go through the whole native provisioning process again.

![Weather App Tutorial](/images/weather-app-6.png)

Make sure your phone is hooked up to your Mac OS X, and build and run in XCode.

Congratulations, you’ve finished building a Sencha Touch utility app from scratch. If you’ve followed all three tutorials in this series, you’ve generated an application with Sencha Cmd and created all the views, models, stores and controllers for the Do I need my Umbrella? app. You’ve created a custom theme with Sass, and you’ve created a production build to host on a web server or built a hybrid app wtih Adobe PhoneGap/Cordova. With this workflow, you’re ready to build any app you like.

Did you like this series of tutorials? Join one of the (advanced) Ext JS and Sencha Touch Training courses. Take a look at the [open courses](http://www.sencha.com/training/) located around the world or join an online class or check out my book that I wrote for O'Reilly: [Hands-on Sencha Touch 2 by Lee Boonstra](http://shop.oreilly.com/product/0636920030058.do)