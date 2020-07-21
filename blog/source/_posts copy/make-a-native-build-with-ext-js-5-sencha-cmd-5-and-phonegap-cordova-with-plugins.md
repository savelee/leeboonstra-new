---
title: >-
  Make a native build with Ext JS 5, Sencha Cmd 5 and Phonegap / Cordova with
  plugins.
description: Learn how to make a native iOS build with Ext JS 5 and PhoneGap Cordova.
tags:
  - Cordova
  - Hybrid App
  - InAppBrowser
  - iOS
  - Native
  - Phonegap
  - Mobile App
categories:
  - Cordova
alias: /developer/make-a-native-build-with-ext-js-5-sencha-cmd-5-and-phonegap-cordova-with-plugins
date: 2014-09-03 20:16:28
---

With the release of Ext JS 5; we finally have Touch experience in the framework. So yes, you can start creating tablet applications. Maybe you are now wondering, can I also package Ext JS 5 apps with Apache Cordova or Adobe Phonegap, so I can sell my app in the App Stores? Well yes, you can! Here are the steps I took; for porting my app with Cordova/Phonegap. 

<!--more-->

_**note, instead of using the keyword `phonegap`, Cordova users may use the keyword `cordova` instead. **note2: you will need to have the following dependencies installed: (Sencha Cmd, Node JS and Phonegap or Cordova)_ There we go:

1.  **Let's generate a new Ext JS 5 app**  
    Browse with your terminal to your Ext JS 5 SDK folder. Run the following command: `sencha generate app MyApp ../phonegapdemo` Here we generate an Ext JS 5 demo app, in the phonegapdemo folder, which stands next to the downloaded extjs5 sdk folder.
2.  **Open app.json**  
    Add the following code block:

``` JSON
"builds": {
    "ios": { //build name
        "packager": "phonegap",
        "phonegap": {
            "config": {
                // Uncomment the line below and add the platform you wish to build for
                "platform": "ios",

                "remote": false,
                "id": "com.domain.MyApp",
                "name": "MyApp"
            }
        }
    }
},
```

    
Here I'm adding a custom phonegap build for iOS. I used as a build name the keyword `ios`, a name i choose to recognize iOS builds, but incase you want to make for example Android builds, I could change it for `android`. In case of an Android I would also need to change the `platform` keyword. Note also the `id` property, which expects an id in reversed domain style; and `name` which should be the name of the Sencha App namespace. In case I want to build via the Phonegap cloud web service; I should set the property `remote` to true. Then, you will also need to create a `local.properties` file in the _phonegapdemo_ folder; with the login details for build.phonegap.com:

```
    phonegap.remote.username=my@email.com
    phonegap.remote.password=mypassword
```

3.  **Create a native build**  
    Back to your terminal, navigate to the _phonegapdemo_ folder, and run the following command:
    
    `sencha app build ios`
    
    Note the keyword `ios`, that's the build name which was set in _app.json_! Mac OSX users, might need to prefix with the word `sudo`. In case you are using Phonegap cloud webservice, it will now upload your app. In case of Phonegap local or Cordova, this command will now generate the following folderstructure like below. Instead of the command `sencha app build`, I could also use the command `sencha app prepare`; it would prepare the folderstructure as well.


``` text
phonegapdemo  
- phonegap  
- - config.xml  
- - hooks  
- - platforms  
- - plugins  
- - www  
```
  
The _www_ folder, will be the place, where a copy of your Sencha Ext JS 5 app will be located. The _plugin_ folder will contain Device API plugins after installing those. (see the steps below, woot!)

4.  **Enable the JS Phonegap/Cordova API**  
    Although you could build and run your application on a device by now; it might be handy when you enable the Phonegap/Cordova device API. For example, in case you need to install plugins, such as the **inappbrowser** plugin. Open in an editor _phonegapdemo/index.html_ and add the following line, **before** the micoloader _bootstrap.js_ script:
    
    ``` HTML
     <script type="text/javascript" src="cordova.js"></script>
    ```

    You might wonder, why I won't add this _cordova.js_ file to the `js` array in _app.json_. Not sure if I did it wrong, but I was running into sencha build errors because of that. Mind you, the cordova JavaScript file will be created while building the app; so it's not available in the project root.
5.  **Let's build it (again)!**  
    
    `sencha app build ios`
    
    In case you are building with the PhoneGap cloud webservice, you can start scanning the QR code. Cordova or PhoneGap local users, can start opening the project file from the _phonegapdemo/phonegap/platforms/<platform>_ folder, and build it via the developer toolkit.

    Wait, let's add another step, as a BONUS! What about installing the inAppBrowser plugin, to make sure PhoneGap/Cordova will open your external hyperlinks in browser window within your app! (That's it's what you want iOS user! Cause iOS ignores opening new browser windows. **grrrumbll!!!!**) These steps are for PhoneGap Local / Cordova users:

6.  **Edit config.xml**  
    You can find it here: _phonegapdemo/phonegap/config.xml_ Now add the following line, (if not already available):
    
    ``` HTML
    <gap:plugin name="org.apache.cordova.inappbrowser"></gap:plugin>
    ```

2.  **Install the plugin:**  
    Run from the command-line the following command, from the _phonegapdemo/phonegap_ folder:
    
    `phonegap plugin add org.apache.cordova.inappbrowser`
    
    Again, Mac OSX users, you will need to have admin rights, so prefix with `sudo`. This command will add the plugin into the _phonegapdemo/phonegap/plugins/_ folder.

3.  **How to open URLs**  
    Edit the demo app, and create a button, which will open an external URL in a separate browser. For example: _phonegapdemo/app/view/main/Main.js_
    
    ``` JavaScript
    Ext.define('MyApp.view.main.Main', {
        extend: 'Ext.panel.Panel',
        requires: [
            'MyApp.view.main.MainController',
            'MyApp.view.main.MainModel'
        ],
    
        xtype: 'app-main',
        
        controller: 'main',
        viewModel: {
            type: 'main'
        },
    
        padding: 20,
    
        layout: 'vbox',
        items: [{
            xtype: 'button',
            scale: 'large',
            text: 'Open Web Page',
            margin: 20,
            handler: 'openWebPage'
        }]
    });
    ```
    
And note here, the magic: `window.open()`. See below, the implementation in my viewcontroller: _phonegapdemo/app/view/main/MainController.js_

``` JavaScript
Ext.define('MyApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox'
    ],

    alias: 'controller.main',

    openWebPage : function(){
        var url = 'http://www.google.com';
        window.open(url, '_blank', 'location=no,EnableViewPortScale=yes'); 
    }
});
```
    
BAMMM!!! Build and Test your inAppBrowser, it should work!