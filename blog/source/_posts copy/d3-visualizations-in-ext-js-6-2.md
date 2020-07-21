---
title: D3 Visualizations in Ext JS 6.2
tags:
  - d3.js
  - SVG
categories:
  - Ext JS
alias: /d3-visualizations-in-ext-js-6-2/
date: 2016-06-28 11:03:31
---

What’s new in Ext JS 6.2 is the **Material Design theme** for the modern toolkit, **row body plugin** for grids (for example to create grids within grids), **pinch to zoom** and premium components such as the **Calendar Component** and **Pivot Grid** (both for classic and modern toolkit), **Exporter plugin** (export Grids and PivotGrid data to CSV, XML, HTML, or Excel format) and the new **D3 wrapper component**. Today, I like to talk more about this component.

<!--more-->

The D3 add-on, is part of the premium tier and will be a Sencha package (for classic and modern toolkit) which you can drop within your workspace, and whitelist via your **app.json**. Like this:

``` JavaScript
"requires": [
    "d3"
],
```

This package contains a D3 wrapper component as a base class, which will make sure the D3 SVGs will be part of the Sencha layout rendering. On top of that it will also provide support for Sencha (hierarchical tree)stores and SVG interactions. It bundles D3.js version 3.5.14. (I'm not sure if this will change before we will release the plugin though.) The D3 library itself is open source, and there are lots of SVG examples available online. [https://d3js.org/](https://d3js.org/) Sencha will also ship a bunch of D3 implementations, such as: various trees, treemap, sunburst, partition, pack and hierarchy SVG charts.

Here's an example of such an implementation. This example, shows an horizontal D3 tree component, with a hierarchical TreeStore bound to it. Note also the panzoom interaction: 

{% gist b71caa37e37bbf5f4e7b51afaabfe209 %}

Now that’s easy. It comes all the way, out of the box. But what if you want to create something totally custom? Maybe you have seen a nice D3 example online, or you want to create your own chart or visualization. You will need to understand the D3 syntax and API. This can be a bit challenging at first, though a simple example can be easily made. First start with using the D3 base component. `Ext.d3.svg.Svg` will be the base class you can use: 

{% gist e41e06bb52e52669eb696d868593489a %}

What I have done here, is: I created a child item for my panel, and I gave it a `fit` `layout`. (Since D3 visualizations are SVGs under the hood, they need to have a `height` and a `width`, and this way it gets that from the parent panel.) I also set: `scrollable` to `true`, because, in case my D3 visualization becomes too large, I can always scroll within the component. I use the base class `Ext.d3.svg.Svg`, with the `xtype`: `d3`. Once I have the wrapper, I can use the `scenesetup` listener. The `scenesetup` has the following parameters: “`component`” (which is the Sencha wrapper component (a div element under the hood), you can get the layout from this component for example), and the “`scene`” which is the SVG scene. (A g element which will contain the visual graphics, like the rectangles and text layers in my case). Now we can start coding D3 magic. I don’t need to query wrapper html elements. I can start right away, and use the `scene` variable. Take a look into this code snippet, I’m creating here a simple bar chart. Here’s how the below component looks within my Spotifinder app: 

![d3-spotifinder](/images/d3-spotifinder-500x217.png)

I left comments per line, so you have an idea how the D3 API works: 

{% gist 1569b77d26c59bb7b377e14aeb325d8c %}

Do you want to play around with this yourself? You can download the EA release here ([https://www.sencha.com/blog/announcing-ext-js-6-2-early-access/](https://www.sencha.com/blog/announcing-ext-js-6-2-early-access/). Or take a look into the [API Docs](http://docs.sencha.com/extjs/6.2.0-classic/Ext.d3.svg.Svg.html) or [examples](http://examples.sencha.com/extjs/6.2.0-ea/examples/kitchensink/?charts=true#d3). Questions or problems? Feel free to leave some comments.