---
title: Reverse Engineer the Sencha FontAwesome package to get an overview of icons.
description: What I learned from reverse engineering the Sencha fontawesome package.
tags:
  - font awesome
  - fonts
  - icon font
  - out of the box icons
  - Sencha
  - Theming
categories:
  - Theming
date: 2016-07-06 16:00:14
alias: /developer/reverse-engineer-the-sencha-fontawesome-package-to-get-an-overview-of-icons/
---

Ext JS 6, ships with a copy of the font-awesome icon font. Remember the Wingdings* Font from back in the days? Icon Fonts are somehow similar like that. An icon font is a (fontface) font, and every (unicode) character maps to an icon. Icon fonts are great, because they are all vectors. Therefore you can easily change the color or size, and they will always have best quality. Perfect on retina displays. You no longer need to open Photoshop to modify the icons. Because it’s text, you can add shades, change colors, backgrounds and sizes all with CSS code. *(You just can’t make 3D icons / multi color icons, because it’s text.)*. Also, icon fonts won’t spam your screenreaders. 

In Ext JS 6, font-awesome icon font is a code package, which is included in the SDK, and free to use. It’s version 4.4. which includes 585 vector icons! You can use font packages, by enabling font awesome in your **app.json** file: (when you generated the application with Sencha Cmd, this should be already there.) `"requires": [ "font-awesome" ],` 

Now you can start using the font, by adding the `iconCls` property to your component. For example: 

``` JavaScript 
  { xtype: ‘button’, iconCls: ‘x-fa fa-globe’ } 
```

The `iconCls` is supported on: buttons, panel titles, menu’s, tree node items, grid actions, separators and ux status bars. (That probably covers most of the places you want an icon for, but if you want icons in for example templates, you can use the below trick as well, and set icons manually.) The big question is, how do I know, which icons are included out of the box? The easy answer is, you can use the font awesome cheatsheet: [http://fontawesome.io/cheatsheet/](http://fontawesome.io/cheatsheet/) Everything 4.4 and below will be available. But the best answer is, you can reverse engineer this from the package yourself! Browse to: **myapp/ext/packages/font-awesome/sass/etc/** 

Let’s first dive into: **_variables.scss**. This Sass file, shows the font version number, and the CSS prefix. For Ext JS 6.2 this is: 

``` SCSS
$fa-version: "4.4.0" !default; 
$fa-css-prefix: fa !default; 
```


The **_variables.scss** file sets all the used variable names for every icon. However, we still don’t know how the icon will look like. Therefore, open your browser and use the Icomoon font app: [https://icomoon.io/app/#/select](https://icomoon.io/app/#/select) Click the *Import Font* button. Now browse to **myapp/ext/packages/font-awesome/resources/fonts/** and select: **fontawesome-webfont.svg** 

This will import all the font-awesome icons, which are in Ext JS. Within the Icomoon app, select all the font-awesome icons. (Select the first, hold shift and select the last.) Then press the *Generate Font* button in the bottom of the app. You will now see an overview of all the icons with its used unicode. (If you want, you can download the font here, so it also saves an HTML file, with this overview.) Ok, so now we know how the fonts look like, and what it’s unicode is. I could now, look into this list, pick the icon that I want. Copy the unicode, and lookup the variable name in **_variables.scss**. For example, the icon with the double music notes, has the title: uniF001, so unicode: *f001*, which matches Sass variable name: `$fa-var-music`. Once you know the variable name, copy it and open **_icons.scss**. Search in this file for the variable name, and it will reveal to you. For the `$fa-var-music` variable, it contains this Sass line: 

``` SCSS
.#{$fa-css-prefix}-music:before { 
  content: $fa-var-music !important; 
} 
```

Which will be compiled as the following CSS: 

``` CSS
.fa-music:before { 
  content: $fa-var-music !important; 
}
```

As you can see the CSS class fa-music, will create another node in your HTML DOM, before the element that has this CSS class, with the *content* that contains the unicode of the music note icon. `iconCls`, just adds this node in the DOM tree. How does it know how to style the icon (for example, the color and its font-size?) That’s what the class `.x-fa` is for. Note: The *x-fa* class should be used in Ext JS applications instead of *fa* which is the class you get if you download the font package from font-awesome.com itself. The *fa* class sets some properties that may collide with the Sencha theme properties, whereas *x-fa* sets only the font-family: 

``` CSS
.#{$prefix}fa:before { 
  font-family: FontAwesome !important; 
}
```

The default font-size and colors are set in **_variables.scss**: 

``` SCSS
$fa-font-path: "../fonts" !default;
$fa-font-size-base: 14px !default; 
$fa-line-height-base: 1 !default; 
$fa-version: "4.4.0" !default; 
$fa-border-color: #eee !default; 
$fa-inverse: #fff !default; 
$fa-li-width: (30em / 14) !default; 
```

For the rest it’s up to you to style the icons as you like. You can do this in your theme package or app stylesheet. *The Wingdings font was developed by Microsoft in 1990, it is actually a dingbat (a printer character used for typesetting) font. None of the characters were mapped to unicode back then, and is only available on (legacy) Microsoft platforms, therefore you should not use Wingdings for the web.