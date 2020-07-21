---
title: A simple solution for fetching data from a headless CMS in a Dialogflow Chatbot
description: How to integrate Dialogflow with a headless CMS such as Sanity? So non-techy people can modify webhook fulfillment answers, without having to train models or use the Dialogflow console. 
categories:
  - Bots
tags:
  - Cloud Functions
  - Dialogflow
  - Node JS
  - Sanity CMS
  - Chatbots
alias: /developer/integrating-dialogflow-with-sanity-headless-cms/
date: 2020-03-03 14:41:36
---

I often get the question, why does Dialogflow not have a CMS? So non-techy people can modify webhook fulfillment answers, without having to train models or use the Dialogflow console. The thing is, Dialogflow can be integrated with anything you like.

In [my Dialogflow, Django, Angular example](https://github.com/savelee/kube-django-ng/) I am using Django as a CMS to import user accounts. In fact, I am using the Django Rest module, to communicate with Django via a Rest API.

In this tutorial I will make use of a headless CMS; [Sanity](https://www.sanity.io/).

<!--more-->

You can use any CMS, even Wordpress, but it makes things easier when there are (out of the box) REST APIs to use. This is what a headless CMS can do really well. It detaches the content from a webpage in order to reuse it in various contexts such as Mobile Apps or Chatbots.

### **Dialogflow**

To prepare Dialogflow with dynamic content, let’s create some entities and intents.

This example, creates a multilingual help desk chatbot. In the Dialogflow settings panel I have enabled the following two languages: **English** and **French**.

In the entities screen I have created 2 entities: **systems** and **useractions**.

**Systems** holds a bunch of computer system names, that all map to a key. For example **InsidePayments** belongs to key **ibb** in entity **systems**.

![Dialogflow Entities](/images/0_oiY4oK9y_2upL2lR.png)
Dialogflow Entities

The entity **useractions** contains user actions such as **delete, add, edit**.

For every content item in my CMS, I will need to create an intent with training phrases. Here’s an example of intent name: **333**. It has a bunch of training phrases, such as:

**“How do I edit a new account in TopMortgage”.**

This intent holds 2 required parameters, which needs to be filled, in order to filter the CMS content items. **paramUserActions** & **paramSystems**.

![A Dialogflow Intent with required parameters](/images/0_4lt6bqiz6j81uF1X.png)
A Dialogflow Intent with required parameters

You will need to make sure that all your intents that need to fetch information from a CMS, have the **webhook fulfillment** enabled:

![enable webhooks](/images/0_-Oo3aWlQp7JKiXHj.png)

And that’s it for the Dialogflow part. Now let’s move on to Sanity.

### Sanity

_I’m installing Sanity on my localhost, since I will only use the Sanity Studio to write content items. In case you want to deliver this environment to your (non techy) customers, you could install Sanity on a Compute Engine Node.js VM._

1.  Install Sanity

`sudo npm install -g @sanity/cli`

`sanity init`

Login with a Google account, Github or your own email account. Click on the link which is shown on the command line, and accept the terms & conditions:

![Sanity Terms & Conditions](/images/0_acDbZhajXGBi7aPa.png)

2\. Back on the command line:

**Provide a Project name**: Chatbot CMS

**Default Dataset configuration**: Y

**Output Path**: /home/admin/chatbotcms

**Schema**: None

**Add Samples**: No

3\. Let’s modify the Sanity schema:

```
cd /home/admin/chatbotcms/schemas
nano schema.js
```

Paste & Save the contents of:

Schema.js

{% gist 688ac7837f58dfe3561d4e56d835d5f7 %}


```
nano simpleresponse.js
```

Paste & Save the contents of:

simpleresponse.js

{% gist 9ef13f33f8eb7b2d2ff41ef363a4f4be %}

4\. Start Sanity

```
cd chatbotcms
sanity start
```

5\. Navigate to [http://localhost:3333](http://localhost:3333)

Click on **Intent > +**

Add the content pages:

Here it’s important that you stick to the Dialogflow mappings.

*   Note the Intent name (id) which is the same as the intent name **333** in Dialogflow!
*   System name (paramSystem) maps to the Dialogflow entity key **ibb** in **systems**
*   User Action (paramUserAction) maps to the Dialogflow entity key **add** in **useractions**

For the rest this item needs to have a readable title which will be visible in Sanity. And 2 chatbot responses. One in English and one in French:

![Sanity CMS](/images/0_SEKa233K93G83k92.png)

You can create multiple content items. For each user action and system combination its own item.

Now let’s query our data:

6\. Click on **Vision** in the Sanity menu

Use the following [GROQ](https://www.sanity.io/docs/groq) query to get all simple response items:

`\*\[\_type == ‘simpleresponse’\]`

![GROQ results](/images/0_dLBO3mSyPJ-kMebL.png)

Use the following query to filter the items on the specific intent name (id) and parameters **paramSystem** & **paramUserAction**. As an output let’s just show the response in English language:

```
\*\[\_type == ‘simpleresponse’ &&
id == $id
&& paramUserAction == $paramUserAction
&& paramSystem == $paramSystem\]{
responseEn
}
```

Params:

```
{
“id”: “333”,
“paramUserAction”: “add”,
“paramSystem”: “ibb”
}
```

And notice the result:

![GROQ results](/images/0_nvvnUYJOEKCqwxHA.png)

Alright so the content is present. We can filter for the contents through **GROQ** queries. The only thing that’s left to do is to implement webhook fulfillment code in Dialogflow, which can run this query, but uses the parameters provided by Dialogflow through slot filling.

### **Dialogflow**

In the Dialogflow inline editor, we can use the following code:

Use the following **package.json**:

package.json

{% gist 39583d17e88be59d3918560d656c0ed4 %}

And the following **index.js**:

index.js

{% gist 0453fa5b009de4b18eaa9ab16bf2a112 %}

This code implements the Sanity NPM client. You will need to specify the Sanity project ID and dataset name. (In case you lost these, you can find it in the Sanity installation folder, **sanity.json**). This way it knows to query the content items that belong to your project.

The Sanity client method: **client.fetch()** takes the GROQ query with the parameters provided by the Dialogflow agent.

Within the Firebase Cloud function, it implements the Dialogflow agent, and retrieves the parameters and agent locale from the Dialogflow agent. The correct intent will be matched by these lines of code:

``` JavaScript
let intentMap = new Map();
intentMap.set(‘333’, responses);
agent.handleRequest(intentMap);
```

The only important thing to remember, is that these lines will need to be inside the resolved promise of **client.fetch** otherwise you will likely get a timing issue and thus Dialogflow returns with a matched intent, without the CMS results.

Now you can test your expression in the Dialogflow console:

![Dialogflow Simulator](/images/0_bPoId4OOj4MjcSEX.png)

Based on the Agent locale, it will return the language item of choice, from the data which is inside of the headless Sanity CMS.

And there you go, here’s a simple solution for fetching data from a headless CMS (Sanity) in a Dialogflow Chatbot!

