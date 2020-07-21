---
title: How to localize your Sencha Touch applications
description: Learn how to localize your Sencha Touch applications
tags:
  - l8n
  - languages
  - localization
  - overwrites
  - Sencha Touch
  - translation
categories:
  - Sencha Touch
date: 2014-11-25 10:25:11
alias: /developer/how-to-localize-your-sencha-touch-applications/
---

I live in Europe; in Europe they speak about 23 languages. In some countries it is even common to speak more than 2 or 3 languages. Especially for these countries localisation of applications and websites is very important.

So you need to come up with a strategy on how to localize all your views.  
In Sencha Touch localization works a little different than in Ext JS, since there are no packages; but overall the basic idea is the same:
<!--more-->

“All your views shouldn’t contain text literals, but variables.” and “all your views are built dynamically.  
You will create a view class override, to “`override`” the variables with language translation.

``` JavaScript
Ext.define('MyApp.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    TAB_ONE_TITLE_SHORT: 'Hello',
    TAB_ONE_TITLE: 'Hello Sencha Touch 2',
    TAB_ONE_HTML: 'This app was written in English.',
    config: {
        tabBarPosition: 'bottom',
    },
    initialize: function() {

        var items = [{
                title: this.TAB_ONE_TITLE_SHORT,
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: this.TAB_ONE_TITLE
                },

                html: this.TAB_ONE_HTML
            }
        ];

        this.add(items);
        this.callParent();
    }
});
```

I uploaded my code to Github:  
[  
https://github.com/savelee/hands-on-sencha-touch-2/tree/master/99-Other/Localization  
](https://github.com/savelee/hands-on-sencha-touch-2/tree/master/99-Other/Localization)

When you download and preview this code, it doesn’t look much different than an auto generated app by Sencha Cmd, right? Well the difference here, is that this view is build dynamically [try this out](http://biturlz.com/GVCzYKU).

Note the `initialize: function()`. Instead of coding the items in the config object, we’re creating a variable items, which is an array that contains all the items and are added later to the view. The text literals are not directly written; instead we are pointing to the new class variables: `this.TAB_ONE_TITLE`, `this.TAB_ONE_TITLE_SHORT` and `this.TAB_ONE_HTML`.

Nice! So these are the variables which needs an override, to replace these with different language translations. But how do we do that?

Well let’s create a new folder in the app directory first: “**utils**”.  
In this folder, you can create another folder, with the name of your language translation and within that folder, you can create the same folder structure as your view directory, (or keep it one single file).

For this example, I’m using Dutch translation; so my path will look like: **app/utils/nl/Main.js**  
Here’s the override class:

``` JavaScript
Ext.define('MyApp.utils.nl.Main', {
	override: 'MyApp.view.Main',

    TAB_ONE_TITLE_SHORT: 'Hallo',
    TAB_ONE_TITLE: 'Hallo Sencha Touch 2',
    TAB_ONE_HTML: 'Deze app is geschreven in het Nederlands.',
});
```

As soon as it loads this file, it will override the previews defined Main view.  
Ok, so now we have a dynamic view and a view override with language translations. How do you load this in your app? Just add it to the requires!

Open **app.js**, and add the language class there:  
`requires: [‘MyApp.utils.view.nl.Main’]`

That did the trick, the app is now successfully localized to Dutch!

Great, but what if I want to create a dropdown with all different languages, and let the user select a language?

You could do this, with for example an Ext.Ajax request, or with Ext.require(), but you will need a hard refresh. When this hard refresh happens it needs to know which language it needs to load.  
We can’t save this in the memory because that will be gone during a hard refresh; but we could save it for example in a cookie or browser (local) storage.  
You do need to delay the creation of your application, because the call for the language file will be returned in a callback…

The code for loading should be something like this:

**app.js:**

``` JavaScript
    launch: function() {
        onCallback = function(){
            Ext.Viewport.add(Ext.create('MyApp.view.Main'));
        }

        Ext.require(localStorage.getItem('language'), onCallback);
    }
```

For my demo I created a Toggle pirate language button; this button sets the localstorage and refreshes the page:

``` JavaScript
{
docked: 'top',
xtype: 'toolbar',
items: [{
    xtype: 'button',
    text: 'Toggle pirate language',
    handler: function(){
        if(localStorage.getItem("language")) {
            localStorage.removeItem("language");
        } else {
            localStorage.setItem("language", "MyApp.utils.pirate.Main");
        }
        window.location.reload();
    }
}
```

With this pirate language file:

**app/utils/pirate/Main.js**

``` JavaScript
Ext.define('MyApp.utils.pirate.Main', {
	override: 'MyApp.view.Main',

    TAB_ONE_TITLE_SHORT: 'Ahoy!',
    TAB_ONE_TITLE: 'Ahoy! Sencha Touch 2',
    TAB_ONE_HTML: 'Tis app be written in scurvy pirate language, matey!',
});
```

And that’s the trick!

### Update 2016:

Sencha partners: Jnesis, wrote a very nice blog post on how to deal with localization for Ext JS 6, where you don’t have to deal with page refreshes. Please have a look: [Blog Post](https://www.sencha.com/blog/internationalization-localization-with-sencha-ext-js/)