---
title: Generate a theme with Sencha Cmd
tags:
  - Compass
  - Sass
  - Sencha Cmd
  - Sencha themes
  - Theming
  - SCSS
categories:
  - Sencha CMD
alias: /developer/generate-a-theme-with-sencha-cmd/
date: 2012-12-18 10:36:45
---

This guide will teach you how to generate a Sencha Theme with Sencha CMD, to start theming with Sass.

<!--more-->

## Prerequisites

1.  Make sure you have Sencha CMD installed. If you don't have Sencha Cmd installed: [See this blog post.](http://www.leeboonstra.com/developer/environment/sencha-cmd-for-scaffolding-sencha-touch-mvc-project/ "Sencha Cmd for scaffolding Sencha Touch / EXT MVC project")
2.  Make sure you have SASS/Compass/Ruby installed. No? [Check this blog post.](http://www.leeboonstra.com.com/developer/sass/installing-sass-compass-for-windows-os-x/ "Installing SASS + Compass for Windows & OS X")

All applications start with a "default" theme. To create new themes, you can easily generate themes with Sencha CMD.

## Generate your theme

1.  Navigate to your project with your console/terminal and type the following command:
    
`sencha generate theme MyThemeName`
    
This will generate for you the following folders:

*   `[project]/resources/sass/MyThemeName`
*   `[project]/resources/theme/MyThemeName`
*   `[project]/resources/css/MyThemeName` (after compiling the Sass file)
    
        
2.  After generating the theme, [project]*/resources/sass/MyThemeName/config.rb* is generated with the correct paths to all theme folders.
3.  From here you can start editing your SASS file.
4.  The next step is to build the image slices needed for IE browsers.
    
This is done with the following command:
    
`sencha theme build MyThemeName`

This will slice all the images in the CSS folder. This approach reduces the size of the CSS file since all image paths are relative to the CSS file location.
    
5.  You can preview your theme in your browser: [project]/resources/theme/MyThemeName/theme.html

Do you want to know more about theming Sencha with Sass? [Check this blog post.](http://www.leeboonstra.com/developer/sass/create-an-amazing-sencha-touch-theme-with-sass/ "Create an amazing Sencha Touch theme with Sass")

Read more info about Theming with Sencha Cmd? [Check: http://docs.sencha.com/ext-js/4-1/#!/guide/command_theme](http://docs.sencha.com/ext-js/4-1/#!/guide/command_theme)