---
title: Chrome 43 breaks Ext.menu.Menu submenus in Ext JS 4 and how to fix it.
description: Chrome 43 which breaks a couple of things in Sencha Touch 2.4, here are the fixes.
tags:
  - chrome 43
  - Ext JS browser bug
categories:
  - Ext JS
date: 2015-05-28 21:20:50
alias: /developer/chrome-43-breaks-ext-menu-menu-submenus-ext-js-4/
---

A few days ago, I mentioned Chrome 43 which breaks a couple of things in Sencha Touch 2.4. Unfortunately also Ext JS 4 developers, experienced some problems. Google Chrome version 43 breaks the `Ext.menu.Menu` submenus, when hovering over the items. Currently our engineers are working on a solution. As soon as it's fixed, you will be able to download a nightly build, which you can download from our support portal.

<!--more-->

For now, please use this override as a fix:

``` JavaScript
Ext.define('MyApp.utils.MenuOverride', {
    override: 'Ext.menu.Menu',
    onMouseLeave: function(e) {
        var me = this;
        // BEGIN FIX
        var visibleSubmenu = false;
        me.items.each(function(item) {
            if (item.menu && item.menu.isVisible()) {
                visibleSubmenu = true;
            }
        })
        if (visibleSubmenu) {
            return;
        }
        // END FIX
        me.deactivateActiveItem();
        if (me.disabled) {
            return;
        }
        me.fireEvent('mouseleave', me, e);
    }
})
```

Put this file in the **app/utils/** folder. (and give it the name: "**MenuOverride.js**"). It should fix the problem..