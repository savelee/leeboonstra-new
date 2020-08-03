---
title: Create a TV app with Sencha Touch and Sencha Architect
description: Design a TV application with Sencha Touch and Sencha Architect.
categories:
  - Sencha Architect
alias: /developer/create-a-tv-app-with-sencha-touch-and-sencha-architect/
date: 2014-06-16 12:00:02
tags:
  - Sencha Architect
  - Sencha Touch
  - TV Application
---

Often people think, Sencha Touch is a great framework to create **mobile phone apps with.** While that is certainly true, it's also a great framework to create mobile apps with, as in **any** **touch enabled device**.

Think about car navigation systems, game consoles, smart watches or tv/media centers. These devices all probably run HTML5; and are great to build Sencha Touch apps for. To show you something cool this week; I will provide you all the steps, how you can create a simple media app with Sencha Touch and our visual design tool: Sencha Architect.

<!--more-->

This is the app we will build: **TouchTunes**, a videoclip app, which you can run on your tv and control it with your fingers or with a TV remote!

The Setup
---------

1. Open **Sencha Architect** 
2. Choose **Sencha Touch 2.3** 
3. Save Project: - TouchTunes - touchtunes 
4. Configuration - http://localhost:1841/touchtunes 
5. Create a new resolution: (Let's take this: http://www.samsungdforum.com
   /Devtools/Spec) **Samsung TV App 960x540** 
6. **Switch the orientation**

The Model
---------

1. Click in the project inspector on the **+ button** 
2. Select **Model** 
3. Select the new Model 
4. In the Config panel make the following settings: _- userClassName: Video - fields: artist,id,image,preview,title_
5. Select the _artist_ field 
6. In the Config panel make the following settings: _- mappings: ["im:artist"].label_ 
7. Do the same for the following fields: _- id - id.attributes["im:id"] - image - ["im:image"][2].label - preview - link[1].attributes.href - title - ["im:name"].label_

The Store
---------

1. Click in the project inspector on the **+ button** 
2. Select **Store > JsonP Store** 
3. Select the new Store 
4. In the Config panel make the following settings: _- userClassName: Videos - model: Video - autoLoad: check - MyJsonPProxy: select - url: https://itunes.apple.com/us/rss
   /topmusicvideos/limit=25/json - MyJsonReader: select - rootProperty: feed.entry_

Test Feed
---------

1. **Save** Architect 
2. Press **Preview** 
3. In your browser: Right Click: Inspect Element 
4. Go to the Network tab 
5. Review: https://itunes.apple.com/us/rss
   /topmusicvideos/limit=25/json?_dc=1392819371345&
   page=1&start=0&limit=25
   &callback=Ext.data.JsonP.callback1 It should return a JSON feed. 6. Run the following command in your browser console: _Ext.getStore('Videos').getCount();_ It should return 25.

Views
-----

1. In your toolbox, filter for **Container** 
2. Drag a Container into the design canvas 
3. Click the **gear icon** in the top right of the container component 
4. Select a layout: **hbox** 
5. In the Config Panel, make the following setting: _- requires: Ext.Video_ 
6. In your toolbox, filter for **Toolbar** 
7. Drag a Toolbar component into the Container 
8. Double click on the Toolbar and set the following text: _“TouchTunes”_ 
9. In your toolbox, filter for List 
10. Drag a List into the Container 
11. Select the List 
12. In the Config panel, make the following settings: _- flex: 2 - store: Videos - itemTpl: select - <div>{artist:ellipsis(20, false)} - {title:ellipsis(20, false)}</div>_ 
13. In your toolbox, filter for Container 
14. Drag another Container into the Project Inspector > Views > Container, right above the List 
15. Select the new Container 
16. In the Config panel, make the following settings: _- flex: 3 - cls: holder - displayName: Holder - layout: vbox - align: center - pack: center_ 
17. In your toolbox, filter for **Image** 
18. Drag an Image component into the Project Inspector > Views > Holder, 
19. Select the new Image 20. In the Config panel, make the following settings: _- width: 400 - height: 300_

Navigation View
---------------

1. In your toolbox, filter for **Navigation View** 
2. Drag the Navigation View into the Project Inspector > Views
3. Drag the MyContainer into the Navigation View 
4. Press the **Link** button when prompted. 
5. In the Config Panel make the following settings: _- useralias: navview - initialView: check - navigationbar: uncheck_

Listeners
---------

1. In the Project Inspector, select the **List** 
2. In the Config panel, select **Event Bindings** 
3. **Add Basic Event Binding** 
4. Choose the **select** event 
5. In the Project Inspector, double click on the **onMylistSelect** function 
6. Enter the following code:

``` JavaScript
var image = Ext.ComponentQuery.query('container[cls=holder] .image')[0];
image.setSrc(record.get('image'));
```

The Controller
--------------

We will map some keyboard keys, check out: http://wiki.xbmc.org/index.php
?title=Keyboard_controls We will map the arrow keys, the spacebar and the enter key. 
1. Click in the project inspector on the **+ button** 
2. Select **Controller** 
3. In the Config Panel, set the following settings: _- userClassName: Navigation - Actions: Add - Choose a target type: Ext.dataview.List - Choose an event by name: initialize - Enter the following code:_

``` JavaScript
var me = this;
document.addEventListener('keydown',function(e){
 if(e.keyCode == 40) {
   Ext.Viewport.down('list').fireEvent('downkey', e);
 }
 if(e.keyCode == 38) {
   Ext.Viewport.down('list').fireEvent('upkey', e);
 }
 if(e.keyCode == 37) {
   Ext.Viewport.down('list').fireEvent('leftkey', e);
 }
 if(e.keyCode == 39) {
   Ext.Viewport.down('list').fireEvent('rightkey', e);
 }
 if(e.keyCode == 13) {
   Ext.Viewport.down('list').fireEvent('enterkey', e);
 }
 if(e.keyCode == 32) {
   Ext.Viewport.down('list').fireEvent('spaceKey', e);
 }
});
```

4. Select the Navigation Controller and Add the following functions: _- navDown - navUp - navEnter - videoPause - navList_ 
5. Double click the navDown() function and enter the following code: _this.navList(1);_ 
6. Double click the navUp() function and enter the following code: _this.navList(-1);_ 
7. Double click the navList() function and enter the following code:

``` JavaScript
var list = Ext.Viewport.down('list'),
records = list.getSelection(),
store = Ext.getStore('Videos'),
count = store.getCount();

if(records.length > 0) {
  var i = store.find('id', records[0].get('id')),
  next = store.getAt(i+direction);

  if(i+direction < 0){
    //console.log('reached the top');
    list.select(0);
  } else if(i+direction >= store.getCount()) {
    //console.log('reached the end');
    list.select(count-1);
  } else {
    //console.log(i + direction, records[0]);
    list.select(i + direction);
    list.scrollToRecord(next);
  }

} else {
  list.select(0);
}
```

8. Double click the navEnter() function and enter the following code:

``` JavaScript
var list = Ext.Viewport.down('list'),
record = list.getSelection()[0],
video = Ext.Viewport.down('video');
if(video){
  video.stop();
} else if(record){
  var data = record.getData();
  Ext.Viewport.down('navview').push({
    xtype: 'video',
    url: data.preview,
    id: 'myvideos',
    title: data.title,
    listeners: {
      painted: function (component) {
        Ext.getCmp('myvideos').setEnableControls(true);
        Ext.getCmp('myvideos').play();
        Ext.getCmp('myvideos').ghost.hide();
        Ext.getCmp('myvideos').media.show();
      },
      pause: function(){
        Ext.getCmp('myvideos').ghost.hide();
        Ext.getCmp('myvideos').media.show();
      },
      stop: function(component){ 
        Ext.Viewport.down('navview').pop();
      }
   }
});
}
```

9. Double click the videoPause() function and use the following code:

``` JavaScript
var video = Ext.Viewport.down('video');
if(video){
  if(video.isPlaying()){
    video.pause();
  } else {
    video.play();
  }
}
```

10. Double click the videoPrev() function and use the following code: 
11. Double click the videoNext() function and use the following code: 
12. In the Config Panel, add 6 Actions: (Option, Target type, Event name, Function Body) - Controller Action - Ext.dataview.List - downkey this.navDown(); - Controller Action - Ext.dataview.List - upkey this.navUp(); - Controller Action - Ext.dataview.List - enterkey this.navEnter(); - Controller Action - Ext.dataview.List - spacekey this.videoPause()

The Theme
---------

1. In the Project Inspector, select **Resources > MyDefaultTheme** 
2. In the Config Panel, set the Filename to: _MediaCenter_ 
3. Click in the Config Panel, the **Theme tab** Now our app is finished, we can control it with a tv remote. The only thing is... It doesn't look like a MediaCenter app yet... Let's style it!

Theme Variables
---------------

1. Filter for the following variables: _- base color: #000 - page bg color: #000 - list bg color: #000 - list color: #fff - list active color: #1b51fb; - include default icons: false - include pictos font: false_

Add custom styling
------------------

1. In the Project Inspector, select Resources > MyDefaultTheme
2. In the Config Panel, add a SCSS snippet - Set the compile order to: **afterFramework** - Set the DisplayName to: **List**
3. Use the following styles, to style the List:

``` CSS
.x-list {
  margin: 0 50px;
}

.x-list .x-list-item.x-item-selected .x-dock-horizontal,
.x-list .x-list-item.x-item-selected.x-list-item-tpl {

-webkit-box-shadow: inset 1px 0px 5px 2px #347EC9;
-moz-box-shadow: inset 1px 0px 5px 2px #347EC9;
box-shadow: inset 1px 0px 5px 2px #347EC9;
background-color: #000;
background-image: -moz-linear-gradient(top, #000, #56626E 55%, lighten(#000, 15%) 55%, #000);
background-image: -webkit-linear-gradient(top, #000, #56626E 55%, lighten(#000, 15%) 55%, #000);

* { color: #fff; }
}
```

4. Create another SCSS snippet - Set the compile order to: **afterFramework** - Set the DisplayName to: **Image** 
5. Use the following styles:

``` CSS
.x-img {
-webkit-transform: perspective(600px) rotateY(10deg);
-webkit-box-reflect: below -1px
-webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.7, transparent), to(rgba(0,0,0,0.5)));

transform: perspective(600px) rotateY(10deg);
box-reflect: below -1px
gradient(linear, left top, left bottom, from(transparent), color-stop(0.7, transparent), to(rgba(0,0,0,0.5)));

}
```

6. Create another SCSS snippet - Set the compile order to: **beforeVariables** - Set the DisplayName to: **Fonts** 
7. Pick a Google Font: - Choose a font - Add to Collection - Click the Use tab - Copy the @Import code. For example:


``` SCSS
@import url(http://fonts.googleapis.com/css?family=Coda+Caption:800);

- Paste it into the Architect SCSS snippet. 8. Open the List SCSS snippet, add the following styles:

.x-toolbar .x-innerhtml {
  font-family: 'Coda Caption';
}
```

Note the name of your chosen font.

Build the app
-------------

1. In the toolbar hit the **Build web app button**. 
2. In the popup select the environment: **Production** 
3. Click **Save** 
4. Click **Run** 
5. Test your application: http://localhost:1841/Architect
   /TunesTouch/build/production/TunesTouch/ 

And well done! How to run this app on your TV? First, upload the production package to some server online. In case you have a smart tv, you could open the browser app, and browse to the TunesTouch app. I tested it on my Raspbmc and on the Ouya XBMC browser app, and it runs great!