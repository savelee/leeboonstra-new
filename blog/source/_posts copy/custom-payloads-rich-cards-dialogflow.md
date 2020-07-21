---
title:   How to build chatbots for Hangouts with Dialogflow by using custom payloads
  and cards.
description:   The Dialogflow Hangouts integration lets you create bots you can include in
  one-on-one chats as well as chat rooms. From the Integrations…
categories:
  - Bots
tags:
  - Cloud Functions
  - Dialogflow
  - Node JS
  - Firebase
  - Hangouts Chat
  - Chatbots
alias: /developer/build-chatbots-for-hangouts-with-dialogflow/
date: 2020-02-21 14:41:36
---

The Dialogflow Hangouts integration lets you create bots you can include in one-on-one chats as well as chat rooms. From the Integrations menu on the left, you can enable this feature and select your agent environment.

You can follow this guide for more information: [https://cloud.google.com/dialogflow/docs/integrations/hangouts](https://cloud.google.com/dialogflow/docs/integrations/hangouts)

But you are probably here, to figure out how you can integrate this with rich messages such as cards, formatted texts, images or custom payloads. Maybe you are even trying to enable this via your fulfillment code. Well I got you covered!

<!--more-->

### Rich Messages

When Hangouts Chat sends an event to a bot, it includes certain data in the event payload; the exact payload depends on the event type. This event and payload are contained in the HTTP call sent to the bot’s registered URL.

For some events, the bot may send a message to the chat in response to the event. This message is a JSON object, whose contents depend on what kind of message it is:

### Google Hangouts integration in Dialogflow UI Console

Out of the box, in the Dialogflow UI console, you could choose custom Hangout responses by clicking on the + button in the **Responses** block:

![Dialogflow](/images/0_YaAyVGrY9A3jYPaW.png)

This allows you to create 4 different types of responses:

*   Formatted Text Responses
*   Images
*   Cards
*   Custom Payloads

![Dialogflow Responses](/images/0_2U3Q_AjG5VK8K22S.png)

The Hangouts **Text Response**, visually looks the same as the **Default Text Response** in the Dialogflow UI console. However the raw api response will look a bit different as it also sets the platform config to “GOOGLE\_HANGOUTS”, which could be interesting when building multi channel agents.

``` JSON
"fulfillmentMessages": \[

{
    "text": {
        "text": \[
            "This is a test."
        \]
    },
   "platform": "GOOGLE\_HANGOUTS"
},
```

...

On top of that, you can change the text formatting. See [SimpleText](https://developers.google.com/hangouts/chat/reference/message-formats/basic) for example you can make text **bold** or _italics_ by wrapping the text in certain (markdown light) symbols.

The Hangouts **Image**, will as the name implies insert an image in Hangouts. You can specify an image url.

The Hangouts **Card** allows you to create a basic Simple Card. You can set a **title**, a **subtitle**, an **image** **url** and **multiple** **buttons** (a label and an url):

![Dialogflow Cards](/images/0_lP4zxoRxsU6enke9.png)

Which will look in Google Hangouts like this:

![Hangouts Chat](/images/0_T_aRue9LmbXn5AYX.png)

Lastly, there is the option to specify a Hangouts **Custom Payload**, _now this is where the magic happens in order to create advanced cards_. One card can have one or many sections. Each section could have a header.

You can have a look into the hangouts message formats cards reference guide, to see some of the combinations you can create with this: [https://developers.google.com/hangouts/chat/reference/message-formats/cards](https://developers.google.com/hangouts/chat/reference/message-formats/cards)

However, using custom payloads means that you will have to provide the JSON format.

Now if you copy and paste the examples of the reference guide to the custom payload box in Dialogflow, you will need to be aware of the following:

*   The first key can’t be called **cards**, but it has to be named: **hangouts**
*   The **hangouts** key points to an object, not an array (of cards)
*   Make sure the editor doesn’t contain any linting errors
*   You can’t test the results in the Dialogflow _Try it now Console_, you will have to test it directly in Hangouts Chat

Here’s a working example:

{% gist 612450be03f64a69cc2d4b2b4a5b9d32 %}

Dialogflow custom payload for Hangouts advanced rich cards

### Google Hangouts integration in Dialogflow fulfillment code

Unless you create static FAQ chat agents for Hangouts chat, you will likely fetch results from a server and display it in a component. For this you will need back-end fulfillment code (either in a cloud function (for example provided by the inline editor), or by specifying a webhook url.

Either Way, incase you use JavaScript/Node, the simplest way to integrate Hangouts cards in your chats is by using the **dialogflow-fulfillment** npm library: [https://www.npmjs.com/package/dialogflow-fulfillment](https://www.npmjs.com/package/dialogflow-fulfillment)

_(Note: You can’t use the actions-on-google npm package, since that library is meant for Google Assistant agents.)_

Make sure you use version 0.6.1 (or higher). Although version 0.6.1 doesn’t have specific Google Hangouts platform recognition, the default Dialogflow Card, Image and Payload responses will work out of the box:

``` JavaScript
var card = new Card({
    title: 'hello',
    text: 'test',
    imageUrl: 'https://goo.gl/aeDtrS',
    buttonText: 'Details',
    buttonUrl: 'https://assistant.google.com/'

});

var image = new Image({
    imageUrl: 'https://goo.gl/aeDtrS',

});
```

_(The Suggestion chips won’t work in Hangouts, as they don’t exist in Hangouts Chat. … but you probably could use buttons for this.)_

But assuming that you want a little more complicated cards than these, you will have to work with custom payloads. Let’s assume we have the following cloud function written in the Dialogflow fulfillment editor:

``` JavaScript
const { WebhookClient, Payload } = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

   let agent = new WebhookClient({ request, response });
   let intentMap = new Map();
   intentMap.set('test', test);

   agent.handleRequest(intentMap);
});
```

In Dialogflow we have created an intent called ‘**test**’, which has the fulfillment webhook enabled.

You can use the [rich card example](https://gist.github.com/savelee/612450be03f64a69cc2d4b2b4a5b9d32), I have used earlier in this article. Instead a function **getCard**, returns this custom payload object.

The test method would look something like this:

``` JavaScript
function test(agent){
    let json = getCard();
    let payload = new Payload(
        'hangouts',
        json,
        { rawPayload: true, sendAsMessage: true}
    );

    agent.add(payload);

}
```

We are creating a **Payload** object. It’s important to specify the platform as a string: **hangouts** to make sure it will showup in Google Hangouts.

The second argument is the custom payload as mentioned before.

And we will need to specify a 3rd object, which sets the **rawPayload** to **true**, and make sure it will be **sent as a message**.

Go ahead, test it. It should work!



 