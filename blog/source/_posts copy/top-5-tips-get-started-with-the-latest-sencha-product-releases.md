---
title: Top 5 Tips — Get Started with the Latest Sencha Product Releases
description: To celebrate the new product releases, we’re sharing some of the best tricks to get your app development started quickly.
tags:
  - Ext JS
  - Sencha Cmd
  - Sencha Touch
categories:
  - Ext JS
date: 2013-10-23 12:08:47
alias: /developer/top-5-tips-get-started-with-the-latest-sencha-product-releases/
---

While the whole world is discussing the new iOS 7 release, or locking themselves in front of the game console to play GTA 5, Sencha has just delivered several updates to its frameworks and tools. Not just one product release but four product releases: Sencha Touch 2.3, Ext JS 4.2.2, Sencha Cmd 4 and Sencha Architect 2.2.3.

To celebrate the new product releases, we’re sharing some of the best tricks to get your app development started quickly. You can also attend Sencha training, where you’ll not only master these four products, you’ll get lots more tips and tricks as well as best practices from our expert instructors.

We’ll start off with a very basic, but oh so handy trick, and progress to one we think you will really appreciate.
<!--more-->

### 5) How to upgrade Sencha Cmd from the command line interface (CLI)

To upgrade Sencha Cmd to the latest stable release, enter the following command on the CLI:

``` bash
sencha upgrade

marsair:SenchaTraining mars$ sencha upgrade
Sencha Cmd v4.0.0.203
[INF] Determining the latest version of Sencha Cmd
[INF] The latest version of Sencha Cmd is 4.0.0.203
[INF] Sencha Cmd 4.0.0.203 is this version.
```

To see if there’s a newer beta version online, append the previous command with the parameter:  
`--check;`

`sencha upgrade --check`

If you want to upgrade to the latest beta release, enter the following command on the CLI (warning: this may downgrade your version of Sencha Cmd):

`sencha upgrade --beta`

Sencha Cmd 4 and Sencha Architect 2.2.3 are optimized for the latest Sencha Touch and Ext JS releases.

Next, let’s upgrade our existing apps!

### 4) It is easy to upgrade your existing app to the new Sencha Touch and Ext JS releases

Download the latest frameworks from: [http://www.sencha.com/products/extjs/download/](http://www.sencha.com/products/extjs/download/)

or [http://www.sencha.com/products/touch/download/](http://www.sencha.com/products/touch/download/). Unpack the folders, open your CLI and navigate to your current Ext JS / Sencha Touch app. Enter the following command to upgrade:

`sencha app upgrade [path-to-framework]`

Within Sencha Architect 2.2.3, you can upgrade between minor versions. Right-click on the **Resource Library** in the project inspector and choose **Upgrade to Ext 4.2.x** or **Upgrade to Sencha Touch 2.3.x.** The upgrade performs necessary transformations to your configs and settings to bring it up to par for the new framework. Typically, this is minimal.

Sencha Touch 2.3 provides themes for iOS 7 (**Cupertino**), previous iOS themes (**Cupertino Classic**), and a theme for Android (**Mountain View**). Additional improvements were made to the existing **BlackBerry** theme. These themes augment the existing Sencha Touch default and Windows Phone themes.

Now, let’s create an app with Sencha Architect and use the Cupertino theme.

### 3) How to create iOS 7 apps with Sencha Architect

By default, Sencha Architect uses the Sencha Touch default theme. To choose any other theme, click on Resource Library in the project inspector and click on the theme property. Here, you can choose the following themes: BlackBerry, Cupertino, Cupertino Classic, Default, Mountain View and Windows.

Speaking about themes. Wouldn’t it be great if your (mobile) browser could detect which theme to apply based on the device platform? Check out this next trick.

### 2) How to detect a device’s platform and serve the appropriate Sencha Touch themes

Open app.json. In the css array, add the platforms that should serve a different theme, together with the theme name and path.

See the example snippet below.

``` JavaScript
css: [
    {
        path: resources/css/sencha-touch.css,
        platform: [desktop],
        update: delta
    },
    {
        path: resources/css/wp.css,
        platform: [ie10],
        theme: Windows,
        update: delta
    }
]
```

The following themes are available out of the box, but you could also serve your own custom themes per platform:

*   `sencha-touch.css` (default theme)
*   `wp.css` (Windows theme)
*   `cupertino.css` (iOS 7 theme)
*   `cupertino-classic.css` (classic iOS theme)
*   `mountainview.css` (Android theme)
*   `bb10.css` (BlackBerry theme)

These are the available platforms: `android, base, blackberry, chrome, desktop, firefox, ie10, ios, ios-classic, phone, safari, tablet` and `tizen`.

To preview your app in the browser and test it per platform theme, just append

`?platform=<platformname>`

to the end of your app URL.

The last trick will make a lot of people happy. People that are familiar with the `compass watch` command will love this one. Sencha Cmd can “watch” the application in the background. Every time you save your project, Sencha Cmd will build your application and Stylesheet in the background. It’s almost as fast as switching between browser windows. So, here’s the number one trick.

### 1) How to let Sencha Cmd build your app and themes in the background

Enter the following command on the CLI:

`sencha app watch`

This command will run in the background and automatically handle changes to the common files. It continually updates any changes to your project as soon as you save/ When changes are detected, only the minimum amount of work necessary is performed to bring your app and its CSS up to date, saving you from having to manually run app refresh or rebuild your Sass. This feature is available for both Sencha Touch 2.3 and Ext JS 4.2.2 in combination with Sencha Cmd 4.

_Please note: In order for this to work, you will need to have Java SDK 7 installed on your machine._
