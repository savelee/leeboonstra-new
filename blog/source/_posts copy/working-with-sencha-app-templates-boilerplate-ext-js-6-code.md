---
title: 'Working With Sencha App Templates: Boilerplate Ext JS 6 code.'
description: Boilerplate Ext JS applications.
tags:
  - app templates
  - boilerplate
  - bootstrap
  - Sencha
  - templates
categories:
  - Ext JS
date: 2015-07-10 14:43:57
alias: /developer/working-with-sencha-app-templates-boilerplate-ext-js-6-code/
---

### Software in a day 

Maybe you have experienced this before. You meet with a client (or worse your boss ;) ), he explains what kind of application he wants, and then he asked you the big question: *How long will it take?*. Being realistic (and add a little more time on top of that), you say: *"a month!"*. "A month? It's just an application with 3 screens. I was thinking tomorrow." You know, software in a day.
<!--more-->

It should have been done yesterday. Now making software for yesterday that's impossible. But software within a day, is possible. Maybe you already had a preview at SenchaCon or one of the SenchaCon Roadshows, something else what's new in Ext JS 6 are app templates. This is boilerplate code, you can use, to quick start with developing full (enterprise) applications. And wow! It does look pretty. These app templates are full code examples, far beyond the current kitchensink examples. It's code written with best practice code (because originally it was written with Sencha Architect) and it is responsive. These templates make use of the new Triton Ext JS 6 theme, and therefore they are highly customisable, have a flat design, and is making use of icon fonts for all icons. (so no additional image requests). Currently this app template is only available for the classic toolkit, (so ideally you would use it for desktop/tablet apps) but eventually we will also have templates for the modern toolkit. You can find the app *template*, in the template folder of your Ext JS 6 sdk. 

Preview the Dashboard - App Template: http://examples.sencha.com/extjs/6.0.0/examples/admin-dashboard/#dashboard 

![apptemplate](/images/apptemplate-500x270.png) 

Now to show you, how easily I created a custom application with the app template, here's a little tutorial. I used these steps to create the FitDashboard app. (A jawbone up / fitness mashup application). 

### Take over the template 

1. Generate app with the same namespace as the app template: `sencha generate app Admin ../my-path` 
2. Navigate to the *ext-6/template/admin-dashboard* folder, and copy over all the contents to your *my-path* folder 
3. Run: `sencha app refresh` to refresh the bootstrap.json. 
4. Make a sencha build: `sencha app build` 
5. You can now run your application in the browser. 

### How To Modify The Template 

1. The app template is not available yet for the modern toolkit. Therefore let's disable the modern toolkit, in *index.html*. (You can remove the folders in the modern toolkit if you want.) Comment out:

```
  //else if (s.match(/\\bmodern\\b/)) {
  //    profile = 'modern';
  //}
```

2. Open the *app/store/NavigationTree.js* file, and remove the pages from the menu, which you don't need. When you want, you can remove those view directies from the *view* folder, and the *data*, *model*, *store* and *sass/var* & *sass/src* folders. The way how I did it; I created a *_temp* folder, where I moved all the classes too, that I won't need. Then I created more subfolders for my own data. And run a `sencha app refresh`. 

3. To remove the logo from the header, open *Viewport.js* You can modify the logo from the component with the `itemId: headerBar` 

4. The styling for this logo bar, can be found in *classic/sass/src/view/main/Viewport.scss*. - You can modify the sencha-logo class. Afterwards build the theme. 

5. The overall base color, can be set in *classic/sass/var/view/Viewport.scss* `&base-color`. Make sure you build (or watch) the theme. 

6. Once your happy, it's time to modify the data. 

You can find the data in the *app/data* folder. I would start with creating my own subfolders, and remove everything else to a *_temp* folder, since that way it will be easier later on, the remove all the data you are not using. 
* app/store/NavigationTree.js - Contains the store with the menu items. You can add new ones here. Note the `viewType` which uses the widget alias (view xtype). 
* app/view/, classic/view/, modern/view - Here you can add new views, viewcontrollers and viewmodels. 
* Do a `sencha app refresh` before testing See the screenshot how my application finally looks. I created this, together with the data (which probably took the most time), within a day. I think that's really fast! And you can do this too!

**Edit: - It's now, also possible to generate an application based on an app template. https://gist.github.com/savelee/6578ffb24240eaaa35fb**