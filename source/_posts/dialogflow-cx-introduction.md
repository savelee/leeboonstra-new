---
title: An introduction to bot builder platform Dialogflow CX
description: Dialogflow CX is a separate product that will coexist with Dialogflow Essentials. Developers and businesses can choose which bot building suite is the right tool for them. Dialogflow CX addresses the need for businesses to build more complex chat & contact center voice bots. Dialogflow Essentials is often choosen for it's simplicity.
tags:
  - Dialogflow CX
  - Dialogflow CX for beginners
  - Dialogflow CX vs. Dialogflow Essentials
  - Dialogflow CX vs. Dialogflow ES
  - Dialogflow Customer Experience
  - Dialogflow CX pricing
  - Bot builder
  - Chatbot development suite
categories:
  - Chatbots
featured: dialogflow-cx-flows
date: 2021-02-26 10:00:00

---

According to Gartner, this is the year that 50% of the enterprises will spend more money on bot development than traditional mobile app development! At Google, we have made a similar observation. Through Google Cloud, we work a lot with enterprise customers, we get lots of questions about our conversational AI tools for building chatbots and voice bots, and we help companies build these. This includes bots for the apparent channels such as websites, iOS, Android mobile apps, and social media like Facebook Messenger, Twitter, Slack, Whatsapp, Line etc. but also: building virtual agents in contact centers!

Dialogflow recently had a name change; it's now called **Dialogflow Essentials** (**Dialogflow ES**) to make room for a new Google Cloud Conversational AI tool: **Dialogflow Customer Experience** (**Dialogflow CX**). Dialogflow CX will be an alternative development suite for building conversational UIs and will exist next Dialogflow ES. Google will continue to support Dialogflow ES, as we have a huge user base. To understand why Google created another bot builder, let's first understand how Dialogflow ES works.

<!--more-->

<figure class="homecard">
<blockquote cite="https://www.gartner.com/smarterwithgartner/gartner-top-strategic-predictions-for-2018-and-beyond/#:~:text=By%202021%2C%20more%20than%2050,Individual%20apps%20are%20out.&text=In%20the%20%E2%80%9Cpost%2Dapp%20era,the%20way%20apps%20are%20built.">
<p>
50% of enterprises will spend more on bots than traditional mobile app development by 2021
</p>
<figcaption>—<cite>Gartner</cite></figcaption>
</blockquote>
</figure>

Jump directly to relevant parts of this article:

<ul>
  <li><a href="#DFE">How Dialogflow Essentials works</a></li>
  <li><a href="#complexity">How the industry is changing its complexity and how Google acts on top of this</a></li>
  <li><a href="#DFCX">Where Dialogflow CX fits in</a></li>
  <li><a href="#DFCXExplained">Dialogflow CX product explained</a></li>
  <li><a href="#is-it-expensive">Dialogflow pricing explained</a></li>
  <li><a href="#DFESvsDFCX">Dialogflow CX vs. Dialogflow ES, biggest differences to expect</a></li>
  <li><a href="#conclusion">Conclusion</a></li>
</ul>


![Dialogflow consumption overtime](dialogflow-usage.png "Dialogflow consumption over time")

<p style="font-size: 10px;">Note this figure, you will see how popular the bot builder platform Dialogflow Essentials is. It has a user base of more than 1.6M, stated at the beginning of 2021. Dialogflow was previously called API.AI; Google acquired API.AI in September 2016 and renamed it to Dialogflow, making it part of Google Cloud. Dialogflow became so popular because of the outstanding underlying NLU machine learning models (like Natural Language Understanding, intent classification, and entity extraction) similar to the Google Assistant.</p>


<h2><a name="DFE">How Dialogflow Essentials works</a></h2>

Dialogflow Essentials is a development suite for building conversational UIs.

Thus chatbots, voice bots, phone gateways. You can all build it with the same tool, and you can even support multiple channels in over 20 different languages. Dialogflow UX designers (agent modelers, linguists) or developers create intents by specifying training phrases to train an underlying machine learning model. 

An **intent** categorizes a user's intention. For each Dialogflow ES agent, you can define many intents, where your combined intents can handle a complete conversation. Each intent can contain parameters and responses.

Matching an intent is also known as **intent classification** or** intent matching**. This is the main concept in Dialogflow ES. Once an intent is matched it can return a response, gather parameters (entity extraction) or trigger webhook code (fulfillment), for example, to fetch data from a database.

When an end-user writes or says something in a chatbot, referred to as a **user expression** or **utterance**, Dialogflow ES matches the expression to your Dialogflow agent's best intent, based on the training phrases. The under the hood Dialogflow ES Machine Learning model was trained on those training phrases.

Dialogflow ES works with a concept called **context**. Just like a human, Dialogflow ES can remember the context in a 2nd and 3rd turn-taking turn. This is how it can keep track of previous user utterances.

<h2><a name="complexity">How the industry is changing its complexity</a></h2>

Large enterprises have been using Dialogflow ES over the past years. Here's an observation I see at Google: At the beginning (2016), most conversational AIs were simple chatbots. (voice assistant bots, FAQ bots…), for web or voice bots, like the Google Assistant. It typically uses 1 or 2 turn-taking turns. For example: "Hey Google, what's currently playing on ABC?" - "The Bachelor started at 8 p.m, an episode you have never seen before!"

As we all know, building conversational UIs is an ongoing process. When you capture the right chatbot insights, you will see what your customers are asking for. When you continue to build conversations on top of an existing agent, that bot becomes more complex over the years.

So **conversation complexity** is one observation. The other perception I made is that **businesses want to be where their customers are**. And thus, their chatbots will need to connect to more channels to create **omnichannel** experiences. Instead of building a single chatbot, companies now want to develop complete conversational platforms fed by a data lake and automate processes with RPA. Think of complex use cases such as replacing your customer care or HR department by robots. Having overloaded call centers and employees burned out by undervalued monotonous tasks, automation through chatbots and virtual (voice) agents can trim huge business costs. Through conversational AI in contact centers, businesses can reduce call time, on-hold time and offer 24/7 availability while improving our processes by capturing analytics.

<figure class="homecard">
<blockquote cite="https://www.juniperresearch.com/new-trending/analystxpress/july-2017/chatbot-conversations-to-deliver-8bn-cost-saving"><p>
Chatbots are expected to help cut business costs by more than 
$8 billion per year by the year 2022
</p>
<figcaption>—<cite>Juniper Research</cite></figcaption>
</blockquote>
</figure>

<h2><a name="DFCX">Where Dialogflow CX fits in</a></h2>

Dialogflow Essentials has been praised for its simplicity. You can build a chatbot or voice bot quickly. These are chat and voice applications, where a short utterance matches one intent, with a few turn-taking turns. For example, a retail chat or voice app, where you can say: "_Put milk on my shopping list._" 

Now imagine you are building a voice robot for the telephony helpdesk of a grocery store. This time, customers are not speaking a few sentences, no instead they speak with whole stories: "_Yesterday, right at opening time, I bought milk at So-And-So Store together with my 4-month-old baby, and when I came home, and I wanted to put the milk in the refrigerator, I noticed that the date is past the expiration date. I opened the carton and noticed the odd smell, but the taste was fine_." Suddenly it becomes much more tricky to match the intent. For a human, it can become challenging to understand the intention; for an AI, this is difficult too! Because are we talking about _buying milk_, _bad products_, or_ requesting a refund_? 

The conversation is long-running, the dialogue is large and can have many turn-taking turns, where we need to remember the context—branched off in hundreds of possible outcomes. And look, I am not even mentioning the technical complexity of dealing with multiple speakers, interruptions, background noises, etc.

![Advanced dialogues](advanced-dialogues.png "Advanced dialogues contain reusable intents and flows, and can branch of in many outcomes")

Creating a virtual (voice) agent for a contact center or creating an automated bot platform is far more complicated where it reaches the borders of Dialogflow Essentials. Sure, when you have a large team of developers, they can tailor-made a solution on top of Dialogflow ES, as users have been doing so in the past. But that means that you have to develop and maintain additional software rather than focussing on designing conversations. 

Until now... ...with the release of Dialogflow CX.

<h2><a name="DFCXExplained">Dialogflow CX product explained</a></h2>

Dialogflow CX empowers your team to accelerate creating enterprise-level conversational experiences through visual bot builders, reusable intents, and the ability to address multi-turn conversations.

It allows you to quickly create agents with:

*   Large and complex flows. Think of giant agent implementations with hundreds or thousands of intents.
*   More than three turn-taking turns (keeping context) and conversations that branch off from each other in various outcomes.
*   Repeatable dialogue parts in the flow (Think of a login feature, saying yes/no to questions, etc.)
*   Understanding the intent and context of a long utterances. 
*   Working with teams collaborating on large implementations.
*   Native Contact Center features such as DTMF, one-click telephony partner integration, barge-in, live agent hand-off.
*   Agents were additional languages, and regionalization (for example GDPR) are important.


![Dialogflow CX Flow](dialogflow-cx-flows.png "Dialogflow CX Flow in the Visual Flow Builder")

Flows with various outcomes and repeatable parts. For example, filing taxes. Usually this requires you to fill out lots of forms, where questions jump to each other. - If you would build a chatbot for this use-case, Dialogflow CX would be great for this, because of the reusable flows, intents and branching of answers.

Dialogflow CX has advanced their NLU. Even though Dialogflow ES is popular because of the outstanding NLU results, we saw a notable quality improvement by basing our NLU on the BERT language model.

It introduces new concepts such as **Pages** and **Flows** for creating reusable flows and branching, and on top of that, it comes with a **visual flow builder** to quickly preview and understand the flow of dialogues.

<h2><a name="is-it-expensive">Dialogflow pricing explained</a></h2>

The [Dialogflow pricing page explains the pricing between both products Essentials vs. Customer Experience](https://cloud.google.com/dialogflow/pricing?utm\_source=blog&utm\_medium=partner&utm\_campaign=CDR\_lee\_aiml\_leedialogflowblog\_personal\_).

Dialogflow Essentials has a **free trial**. The **pay-as-you-go version is based on the number of requests** you make, and you will have to pay extra for additional features such as sentiment analysis, knowledge bases, phone gateways, etc.

A request is defined as any call to the Dialogflow service, whether direct with API usage or indirect with integration or console usage. 

With Dialogflow CX, you **pay per session**. A session is a conversation between an end-user and a Dialogflow agent. A session remains active, and its data is stored for 30 minutes after the last request is sent for the session. A session can be either a chat session or a voice session. 

The pricing seems expensive, but if you consider that you don't need a team of developers solving complex problems in fulfillment webhooks to facilitate large enterprise-scale bots plus, you don't need to pay extra for all additional features; Enterprise customers actually might be better off by using Dialogflow CX.

Besides, each new user will receive a **$600 credit for a free** trial of Dialogflow CX. This credit is automatically activated upon using Dialogflow CX for the first time and expires after 12 months. This is a Dialogflow-specific extension of the Google Cloud [free trial](https://cloud.google.com/free/docs/gcp-free-tier#free-trial?utm\_source=blog&utm\_medium=partner&utm\_campaign=CDR\_lee\_aiml\_leedialogflowblog\_personal\_); this should be more than enough to play around with the tool and get started!


<h2><a name="conclusion">Conclusion</a></h2>

Dialogflow CX is a separate product that will coexist with Dialogflow Essentials. Developers and businesses can choose which bot building suite is the right tool for them.

<h3><a name="DFESvsDFCX">Dialogflow CX vs. Dialogflow Essentials: when to use which tool</a></h3>

When you are a freelancer, start-up, or small business, when you are building a single chat or voice bot, for example, for the Google Assistant or building an FAQ bot, Dialogflow Essentials might be a better choice for you. **This tool is often choosen for it's simplicity**.

When you are an enterprise customer building a large & complex chatbot platform or contact center customer experience, when data regionalization is crucial for you (for example because of GDPR) or your conversation requires lots of turn-taking turns and dialogue branches, Dialogflow CX is the tool to use. **This tool addresses the need for businesses to build more complex chat & contact center voice bots.**

<p>
<a target="_blank" rel="noreferrer noopener" href="https://dialogflow.cloud.google.com/cx/projects?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_">Try out the new Dialogflow CX Console</a>
</p>

<div class="card w-100 youtubeblock" style="margin-top: 20px;">
    <div class="shadow-lg">
    <div class="embed-responsive embed-responsive-16by9">
        <iframe id="youtubeFrame" class="embed-responsive-item" src="https://www.youtube.com/embed/E96x7t4PmOw" allowfullscreen></iframe>
    </div>
    </div>
</div>


<script type="application/ld+json">
    {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "An introduction to Dialogflow CX",
    "description": "Dialogflow CX is a separate product that will coexist with Dialogflow Essentials. When you are an enterprise customer building a large & complex chatbot platform or contact center customer experience when data regionalization is crucial for you (because of GDPR) or your conversation requires lots of turn-taking turns and dialogue branches, Dialogflow CX is the tool to use.",
    "thumbnailUrl": [
        "https://img.youtube.com/vi/E96x7t4PmOw/default.jpg",
        "https://img.youtube.com/vi/E96x7t4PmOw/0.jpg",
        "https://img.youtube.com/vi/E96x7t4PmOw/sddefault.jpg",
        "https://img.youtube.com/vi/E96x7t4PmOw/mqdefault.jpg",
        "https://img.youtube.com/vi/E96x7t4PmOw/hqdefault.jpg",
        "https://img.youtube.com/vi/E96x7t4PmOw/maxresdefault.jpg"
        ],
    "uploadDate": "2020-11-10T08:00:00.000Z",
    "contentUrl": "https://www.leeboonstra.dev/Chatbots/dialogflow-cx-introduction/",
    "embedUrl": "https://www.youtube.com/embed/E96x7t4PmOw "
    }
</script>