---
title: Conditional Templating in Dialogflow for Google Assistant
tags:
  - Actions on Google
  - Conditionals
  - Dialogflow
  - Google Assistant
  - Pug
  - Templating
  - Chatbots
  - Dialogflow Enterprise
categories:
  - Bots
alias: /developer/conditional-templating-in-dialogflow-for-google-assistant/
header: /images/articles/conditionaltemplating.jpg
date: 2018-05-20 17:02:22
---

What I like most about Dialogflow, (the tool to create Chatbots and Smart Assistants / Google Assistant apps), is that you can maintain your conversations within the Dialogflow UI. Many users write their complete FAQ content in intents and responses. You no longer need a developer to tweak your conversations or deploy your agent which makes it very scalable for large organizations. It's also possible to load data from external systems. In that case, you are hosting parts of the conversation elsewhere. You could store these parts in language files or databases. Some organizations prefer to write the full conversation in the Dialogflow UI. That way your copywriters can maintain the full conversation. 

It's good to know that it is possible to use templates and conditionals within the Dialogflow UI. The trick here, is to make use of the **custom payload** response setting, which you can find in the Intent > Responses section.
<!--more-->

Just like how you would include Rich Cards, you can choose custom payload, and provide your own JSON. Since JSON is just JavaScript, my first try was to use `if else` conditions directly in the code: 

``` JSON 
{ "web": { 
    "type": "text", 
    "fn": "var today = new Date(); var curHr = today.getHours(); var greet = ""; if (curHr < 12) { greet = 'Good morning!'; } else if (curHr < 18) { greet = 'Good afternoon!'; } else { greet = 'Good evening!'; } return greet;" }
} 
```

In my SDK back-end code or fulfillment app, I could convert the string to executable JavaScript code. Although this works. It kinda feels dirty, since I need to use evil `eval()` or equivalent code in my back-end. On top of that I expect the person who maintains the conversation, to have JavaScript skills. The next solution, came from a customer of mine. Instead, let make use of a templating library, so you can provide readable templates, and variables that an be injected. 

Think Jinja (for Python or Java developers), Smarty (PHP) or Jade/Pug, Handlebars and Mustache (for JavaScript developers). I tried this with [PugJS](http://www.pugjs.org) (formerly known as Jade). It works really nice.

Let's take this intent: 

**Intent Name**: [templating] example

**Training Phrases**: 
  * Greet me 
  * Greet Lee 

**Parameters**: 
  * username - @sys.given-name - $username 
  
**Fulfillment**: Enable webhook call 

**Response**: Here's an example 

**custom payload**: 

``` JSON 
{ "custom": 
  { "locals": { 
      "username": "$username" 
    }, 
    "pug": [ "if usernamen", " | Hello $usernamen", "elsen", " | Hello stranger" ] 
  } 
}
```

The values of the `locals` object, are the parameter values. In the `pug` object, I wrote a multi-line string template, with an if else branche. When using PugJS, the line indenting is importing. Pay attention to the newline `n` code, and the `|` for using plain text. In my fulfillment Cloud Function, I will take this template, and compile it, together with the local template variables. Your code will look like this:

{% gist 52b9c84c035b2e1ef4f8a84051a2803b %}
