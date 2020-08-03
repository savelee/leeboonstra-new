---
title: Custom UI Components with Sencha
description: Learn how to build custom UI components in Ext JS.
tags:
  - Custom UI Components
  - HTML
  - packages
  - XTemplate
  - Angular
  - React
categories:
  - Ext JS
date: 2016-11-01 13:20:00
alias: /developer/custom-ui-components-with-sencha/
---

Sencha recently announced the Angular 2 and React bridges. 

* [https://www.sencha.com/blog/first-look-ext-js-bridge-to-angular-2/](https://www.sencha.com/blog/first-look-ext-js-bridge-to-angular-2/) 
* [https://www.sencha.com/blog/react-and-ext-js-secret-besties/](https://www.sencha.com/blog/react-and-ext-js-secret-besties/) 

These are great solutions for Angular 2 or React developers, which make use of the robust Sencha components. (For what’s worth; the Angular and React frameworks don’t contain components. These are just single page app frameworks which sets up the architecture pattern. 
<!--more-->

In comparison with Ext JS; 

- Sencha has an architecture pattern, 
- a DOM manipulation framework, 
- a data package and 
- visual UI components (with themes)). 

With such a bridge, you can integrate Ext JS components like grids and trees within your Angular 2 or React application. Lately, I have been asked a lot: 

*“What about the other way around?”* 

Integrating an Angular or React component within a Sencha Ext JS app? This question contains a lot of confusion. First of all, it’s not possible (it's an anti pattern) to integrate Angular 2 / React within an Ext JS app. Why would you do so? Again, both frameworks don’t contain any UI components and themes. It’s just the architectural pattern, which Ext JS has as well. Angular 2 / React components basically exist of HTML / DOM snippets with CSS stylesheet code. Maybe you found this great slideshow component online. A custom HTML component with an essential StyleSheet. You need this component in your Sencha app. So, let’s change the question: 

*“Can I integrate custom HTML in my Sencha App?”* or *“Can I create custom Sencha components?”*. 

That answer is: **YES**, You certainly can do. This is actually what our Sencha developers do, to create UI components... 

## About Custom Reusable UI Components 

Ext JS ships with many, many components. There are times, however, when the components are just a little bit different than what you were looking for. Since Ext JS is just JavaScript with HTML and CSS, it is possible to create your own Ext components instead. We call these *custom components*. You may need custom components, to create custom experiences. Custom Components in Ext JS are **packages**. 

Packages are like themes, you can share code within your own projects. For example, you could create your own library with Sencha custom components, and reuse it in all your projects! A custom UI component often exist of more files than just one single JavaScript file. Maybe it mixes multiple JavaScript classes inside, and maybe it also contains images, fonts or specific styling. Where do I store those files? Do I mix it within my app-specific Sass stylesheet and resources folder? Hmmm... That makes this custom UI component less compact and hard to reuse. The better way is to share code through *packages*. This enables you to share packages: 

### Locally

One use of packages is simply to hold code or themes that are available for multiple applications in a workspace. These packages don’t need to be distributed (beyond source control) to provide value to your development.

### Remotely

You can download packages remotely from the command-line. The set of available packages are listed in the *catalog* on the command-line. You can display the contents of the global catalog using this command: `sencha package list` You can download these packages with the following command; `sencha package install` It will be downloaded to your Cmd **extensions** folder: For example: */Users/leeboonstra/bin/Sencha/Cmd/6.x/extensions/* 

### Sencha Market

It is also possible to share your custom components via the Sencha Market. This does not require packages. You can also share ux folders. [http://market.sencha.com](http://market.sencha.com) For more information about packages, please check this guide: [http://docs.sencha.com/cmd/6.x/cmd_packages/cmd_packages.html](http://docs.sencha.com/cmd/6.x/cmd_packages/cmd_packages.html) 

# Tutorial: Create a custom UI Component 

To exactly explain how custom UI components are build, let’s create an example. This tutorial will show you how you can create a custom, ..wait for it.. “Hyperlink Component”. 

Maybe not the most exciting custom component. (I will leave that up to you.) But it’s simple enough, to quickly go through a couple steps, so you will understand what you will need to do. I’ve created in the past many custom components like these. Think about fancy toggle buttons. Nested Lists and slideshows. For all these examples, I often just googled online, to find a tutorial or custom HTML component, which I could wrap in a Sencha component. The beauty of these components is the CSS stylesheet code, that belongs to a particular HTML snippet. Within Ext JS, we deal with a Sencha layout system. We write JavaScript code, via the Ext JS API the Sencha way. The browser reads these JavaScript instructions, and generates the DOM tree (like HTML representation within the browser memory), because of the Sencha themes (StyleSheets), your components look like nice UI components. 

So what we need to do here, is to “wrap”, your HTML snippets within a Sencha components, so it can make use of the Sencha API and the Sencha layout system! The good thing is. When you are a Sencha developer, you will probably know:

* How the Sencha Class System works
* How `Ext.XTemplate` works 
* How event listeners work 
* How to theme/style with Sass/CSS Custom UI components, inherit from existing Sencha components. 

If you know the Ext JS essentials, you can create custom UI components too! Let’s give it a try! 

## Generate a Package 

We will start with generating a package from the command-line, which will generate the *package* folder structure. You can execute the following command from your project folder: `sencha generate package -type code ExtAddonHref` This will create the following folder structure: 

``` 
packages/ 
  foo/ # Top-level folder for the package 
  .sencha/ 
  package/ 
    sencha.cfg # Sencha Cmd configuration for this package 
    build-impl.xml # Generated build script for package 
    plugin.xml # Sencha Cmd plugin for this package 
    codegen.json # Data to support 3-way merge in code generator 
    docs/ # Documentation for the package screenshots/ # Screenshots for Sencha Market licenses/ # License agreement 
    overrides/ # Folder for automatically activated overrides 
    resources/ # Static resources (typically has images folder) 
    sass/ # Container for Sass code 
      etc/ # General, non-component oriented Sass 
      src/ # Sass rules and mixins named by component 
      var/ # Sass variables named by component 
      src/ # Folder for normal JavaScript code 
    build.xml # Build script (called by `sencha package build`) 
    package.json # Package descriptor 
    Readme.md # High-level information about this package 
```

Your *package.json* file, contains the package configuration. It will look similar to this:

{% gist 9c418ff4e7cecb96541ce464810e3288 %}

Packages published by Sencha will use names with the following prefixes: 
* sencha-* 
* ext-* 
* touch-* 
* cmd-* 

All package names beginning with the above prefixes are reserved by Sencha with respect to the Sencha Package Repository. It is recommended that you avoid conflicting with these names even if you disconnect from the Sencha Package Repository. *Versions* These versions are used when resolving package requirements. Each release of a package should have an updated version number. 

The meaning assigned to version numbers by Sencha may help you:  `x.y.z.b` 
x : Major release number (large, impacting changes and features) 
y : Minor release number (new functionality but few if any breaking changes) 
z : Patch release number (bug fix / maintenance release - goal of 100% compatible) 
b : Build number (assigned by build system)

## Extend from a Sencha Component 

Create in *packages/ExtAddonHref/src*, the following file and folder: **component/Href.js** 

``` JavaScript 
Ext.define('ExtAddonHref.component.Href', { 
  //todo custom logics 
}); 
```

The ExtHrefComponent will be pretty basic. We give it the alias name: “extaddonhref”, and we will only inherit from Ext.Component: 

``` JavaScript
Ext.define('ExtAddonHref.component.Href', { 
  xtype: 'extaddonhref',
  extend: 'Ext.Component',
});
```

As a rule of thumb: You should extend from Sencha components that are the most similar to your new component. Features not being used will cost you in additional file size. So, for example, if I want to create a custom slideshow component, I have to deal with a store that contains images, and every slide should have it’s own HTML. In that case I would extend from `Ext.view.View`. When I create a custom togglefield, it pretty similar to a checkbox, so I would extend from `Ext.form.field.Checkbox`, and so on.

## What Will Be Configurable? 

The next step, is that you will need to decide what will be configurable. For an hyperlink component, you will need at least an *url* and a *title*. Maybe also a link *target*, an *anchorName*, *preventDefault* behaviour and an *external icon* to show if the hyperlink is external.

{% gist cbc6ae98531ee92192ec1f723fc697c8 %}


## Implementing a tpl 

Now that we know what needs to be configurable for the end user, let’s create the HTML snippet. Every Ext JS component, makes use of an XTemplate: [http://docs.sencha.com/extjs/6.0.0/classic/Ext.Template.html](http://docs.sencha.com/extjs/6.0.0/classic/Ext.Template.html). Inject the data based on the calling routine: https://gist.github.com/savelee/9c41aac37b34468f68a8bbd243807e44 Instead of the *tpl* you could also use the *renderTpl* instead. It separates the render part from init. You will need a *bufferRender* function to apply the *renderData* to the template. https://gist.github.com/savelee/6d65fb7b2c22dbd46de38f812750c024 

## Implementing Event Handling 

The hyperlink component will listen to both *click* and *dblClick* events. 

{% gist afd0021be8497045bafcf0fcdac4e734 %}

You will add the two event listeners, that fire the events from a DOM element. We will also implement some logic to switch off the default browser behavior. So the browser won’t visit the url. (e.g., When you wish to run a custom JavaScript behavior instead.) Use event delegation for handling bubbling events. It can keep the code simpler, (especially when adding or removing elements), and saves some memory.

## Implementing Styles 

You can add custom styles in the *packages/ExtAddonHref/sass/* folder. Create the following folders/files: *src/component/Href.scss*

#### The Sass Namespace 

The Sass namespacing settings are correctly configured by default, and it points to the Ext JS framework structure. However it is possible to edit these mappings in the package.json file: 

``` JSON
"sass": { 
  "namespace": "Ext", //MyApp or ExtAddonHref 
  "etc": "${package.dir}/sass/etc/all.scss", 
  "var": "${package.dir}/sass/var", 
  "src": "${package.dir}/sass/src" 
},
```

The namespace Ext, tells Sencha, that the Sass files for the package are mapping the folder structure of the framework. (For example Ext.button.Button → src/button/Button.scss). You could change the namespace, to the namespace of your app or your package. The other settings, are to configure where the var and source folders are located in the package. Before Ext JS 5, you had to make this setting in the hidden *packages/ExtHrefComponent/.sencha/package/sencha.cfg* file. It had the setting: 

```
package.sass.namespace=Ext //which could be set to: package.sass.namespace=ExtAddonHref
```

**Implementing Styles** 
Write the style code. This code will implement a little "external link" icon after external hyperlinks: 

{% gist 410bdfcf1b98608aa3d17c5ad700b49f %}

Do not mix app specific styling, like colors, fonts etc. in your package. You want to reuse your package and those styles belongs to the application stylesheet. 

## Implementing Assets 

You can add custom images, fonts and icons in the *packages/ExtAddonHref/resources/* folder. For the ExtAddonHref component, I’ve used an icon font, that I copied to the *packages/ExtAddonHref/resources/icons* folder.

## Consume The Package 

Open your application *app.json* and add the new package to your requires array: 

{% gist 51ce3be80ab174ae3e24df4731050ce7 %}

Refresh your application to force your application to detect the new package. `sencha app refresh` Build your app to compile the Sass styles and to copy over the resources to the production folder: `sencha app build` 

## Implement The Package 

In Your App The last step is to nest the custom component in your application: For example:

{% gist ba45471a77d08b5b9c5f72d7041c69bf %}

It is also possible to build the package only, and publish it to a local repository. To build the package: `sencha package build` This produces a *build* folder inside the package. This is needed by applications when they are running in “dev mode” (without being compiled). It also produces *mypackage.pkg* file in your workspace’s build folder. The mypackage.pkg file is used to add the package to your local repository. This pkg file is not placed in the package’s build folder because: 
* It is a ZIP file of your package folder. 
* It is not needed by users of the package. In case you want to setup a local repository, see this guide: [http://docs.sencha.com/cmd/6.x/cmd_packages/cmd_creating_packages.html](http://docs.sencha.com/cmd/6.x/cmd_packages/cmd_creating_packages.html)