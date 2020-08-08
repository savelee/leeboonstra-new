---
title: Actions on Google with Google Cloud Functions
description: Learn how to invoke the Google Assistant with Cloud Functions
categories:
  - Bots
tags:
  - Actions on Google
  - Cloud Functions
  - Dialogflow
  - Node JS
  - Google Assistant
  - Dialogflow Enterprise
  - Chatbots
alias: /developer/actions-on-google-for-google-cloud-functions/
date: 2018-05-19 14:41:36
header: /images/articles/aogcf.jpg
---

When building Google Assistant apps (actions) with Dialogflow, you likely will have to write some logics. The most common way in developing this logics layer is by using a webhook and a Cloud Function. The webhook requires a URL. So technically you can use any web server and program language you like, Cloud Functions are just easy.
<!-- more -->
It's serverless, which means you don't need to worry on setting up and maintaining an environment, and it scales out of the box. Dialogflow integrates with Firebase Cloud Functions. There's an easy inline editor you can use, which creates the Cloud Function within Firebase. (Which under the hood uses the infrastructure of Google Cloud.) For Dialogflow Enterprise customers (the Dialogflow version which is compliant and better for large organizations), Firebase Functions don't make much sense. (And in fact, are not been created within your current GCP project). You rather use the Google Cloud Functions. Both use functions can make use of HTTP triggers. The way of invoking is different: 

*GCP*:

``` JavaScript 
exports.helloWorld = function helloWorld (request, response) { 
  res.send(`Hello from GCP!`); 
};
```


*Firebase:* 

``` JavaScript
exports.helloWorld = functions.https.onRequest((request, response) => { 
  response.send("Hello from Firebase!"); 
}); 
```

The [Actions on Google Node JS library](https://www.npmjs.com/package/actions-on-google) (for creating Dialogflow agents with Google Assistant), explains how you can integrate the library within a Firebase Cloud function. Unfortunately, it doesn't explain to you how to integrate it with a GCP Cloud Function. So here's how you would do this: 

{% gist 7485763b67e6ee3a5d00aa07c8678f94 %}

As you can see, you can get the request and response headers from the `conv` object, in the conversation handler function. NOTE: This example was written for the 2.1.1 version of the Actions on Google NPM package: *package.json* 

``` JSON 
{ 
  "name": "Demo", 
  "description": "Google Assistant with Dialogflow Enterprise", 
  "version": "1.0.0", 
  "license": "Apache-2.0", 
  "author": "Lee Boonstra", 
  "engines": { 
    "node": "^6.11.5" 
  }, 
  "dependencies": { 
    "actions-on-google": "2.1.1" 
  } 
}
```