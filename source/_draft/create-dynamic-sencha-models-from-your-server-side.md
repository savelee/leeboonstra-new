---
title: Create dynamic Sencha models from your server-side
description: Learn how to generate sencha models with server-side coding.
tags:
  - Ext JS
  - MVC
  - Models
  - Generate Models
categories:
  - Ext JS
alias: /developer/create-dynamic-sencha-models-from-your-server-side/
date: 2014-04-26 15:00:05
---

Every now and then I get this question in my Sencha training classes: "How can I dynamically create Sencha Models from my server-side?".

<!--more-->

Or "How can I dynamically inject fields?" Normally you would define a Sencha Model like this:

``` JavaScript
Ext.define('App.model.MyModel', {
  extend: 'Ext.data.Model',
  
  fields: [{
     name: 'id',
     type: 'int'
  }, {
    name: 'firstname',
    type: 'string'
  }, {
    name: 'lastname',
    type: 'string'
  }]

});
```

The previous code is a Model class definition written in Ext JS. In Sencha Touch, it's almost the same, you would wrap the `fields` array in a `config` object. Defining Models this way, is perfect, but sometimes you would like to generate your Models from the server-side. For example, because you are using lots of fields, field names often change and you don't want to maintain the fields on two places (server-side vs. client-side). Mind you, also the data-type or field validations, needs to be in sync on both places, to not experience funny behavior.

So? Is it possible to create dynamic models? How does that work?

Let's say we have a PHP & MySQL server-side. I'm not gonna show you my PHP skills, since it has been a while. (..but if you are really curious, please leave a comment, then I can see if I can share some codes). But you will need to request the database schema. With MySQL I could write the following SQL statement: `SHOW COLUMNS FROM mytable`, where **mytable** is my database table name. This will return an Array with all my database fields.

The next step is to output JSON. I only care about the field **names**, and the field **types**. But... the MySQL data-types are different then the data-types in Ext JS / Sencha Touch, so I somehow need to map a `varchar` to a `string` etc. After that's done, my JSON output should look something like this:

``` JavaScript
{
  success: true,
  fields: [{
    name: "id",
    type: "int"
  },{
    name: "fname",
    type: "string"
  },{
    name: "lname",
    type: "string"
  }]
}
```

Now we are getting somewhere. These are the fields I dynamically want to inject in my Sencha Model. I can do this with an `Ext.Ajax.request`. Take a look:

``` JavaScript
Ext.define('App.store.MyStore', {
  extend: 'Ext.data.Store',
  
  constructor: function(){
      var me = this;
      me.callParent();

      Ext.Ajax.request({
        url: '../data/phpscript/?action=schema',
        success: function(response) {
          try{
            var resp = response.responseText;
            if(resp) {
              var data = Ext.JSON.decode(resp);

              var model = Ext.define("App.model.MyModel", {
                  extend: "Ext.data.Model",
                  fields: data.fields
              });

              me.model = model.$className;
            }
          }catch(e){
            console.error(e);
          }
        },
        failure: function(e){
          console.error(e);
        }
    });
  }
});
```

Here is what I did. I defined a Store, in the `constructor` I run an Ajax request, which fetches the `fields` array from my backend script, (in my case:) **../data/phpscript/?action=schema**, which returns the JSON. In the `success` method, I create a model, and that's where I inject the fields.

Alright. Now hook up the Store to your app and test. You can run in your browser console the following line:

`Ext.create('App.model.MyModel', { lname: "Boonstra" });`

That should work, it will return the record, and you will see all the (empty) fields that this record contains.

Now that you get the idea, you will be pleased to know, that you can use similar tricks for injecting validations from the server-side or dynamically injecting grid columns... Woot woot.