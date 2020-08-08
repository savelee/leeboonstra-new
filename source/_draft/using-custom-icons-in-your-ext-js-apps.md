---
title: Using Custom Icons in Your Ext JS Apps
description: Learn how to use custom icons in your Ext JS apps
tags:
  - glyphs
  - icon fonts
  - icons
  - Sass
  - Theming
categories:
  - Theming
date: 2014-03-28 11:19:30
alias: /developer/using-custom-icons-in-your-ext-js-apps/
---

Do you like the glyph attribute in Ext JS 4.2 as much as I do? With glyphs, you can implement an icon that is created from a font. 

<!--more-->

There are advantages to using icon fonts — they are vectors and therefore never lose quality; it’s easy to style icons without the use of Photoshop; and you make one page request to download all of the icons. The glyph attribute is available on Ext JS buttons and panels. You can download a custom icon font from a site like: [IcoMoon](http://icomoon.io/) and implement the font in your style sheet. The value of the glyph attribute is the decimal code that maps to the unicode character which represents your icon. You add this attribute to the name of your custom font, and you’re good to go:

`glyph: '115@MyIconFont',`

A lot of Ext JS components extend from panel, but what if you want to implement icon fonts in other components that do not extend from `Ext.panel.Panel`or `Ext.button.Button`? To answer this question, we can use the concepts that are actually happening under the hood: _A character is inserted before (or after) a certain DOM element. You can see an icon because this character is styled with a custom font (@font-face technique) that contains all of the icons._ Let’s try this ourselves:

1.  With your browser’s dev tools, select the DOM element in which you want to implement an icon. Ideally put a CSS class on top of it (for example: `.arrow`), so you can easily refer to it from your Sass.
2.  Download an icon font and map it to some character. (Let's use the following character: `>`)
3.  Implement the icon font in your Sass:

```CSS
@font-face { 
  font-family: 'MyIconFont'; 
  src: url('../resources/fonts/Nouveau.eot'); 
  src: url('../resources/fonts/Nouveau.eot?#iefix') format('embedded-opentype'), url('../resources/fonts/Nouveau.woff') format('woff'), url('../resources/fonts/Nouveau.ttf') format('truetype'), url('../resources/fonts/Nouveau.svg#Nouveau') format('svg'); 
  font-weight: normal; font-style: normal; }
```
    
4.  Alright, now comes the magic. In your Sass style sheet, write the following CSS rules:
  
```CSS
.arrow:before { 
      content: ">"; //the character mapped to an icon font-family: 'MyIconFont'; //the name of the icon font color: red; //set additional colors or dimensions... margin-right: 10px;
}
```  

The pseudo CSS selector `:before`will create the icon on the left side of the DOM element. The pseudo CSS selector `:after`will create the icon on the right side of the DOM element. Now that you know how to use this technique, you can try it in any components, such as templates, dataviews, form fields, etc.