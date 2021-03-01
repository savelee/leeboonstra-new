---
title: Orchestrate multiple sub chatbots from one chat interface by using the Mega Agent feature in Dialogflow
description: Dialogflow has the Mega Agent feature. (At the time of writing, this feature is still in beta but ready to use.) This feature allows you to connect various sub Dialogflow agents to one single…
tags:
  - Dialogflow ES
  - Dialogflow
  - Chat Orchestrator
  - Mega Agent
  - Flows in Dialogflow ES
  - Sub Agents
categories:
  - Chatbots
featured: mega-agent-architecture
date: 2020-12-01 10:00:00
---

Dialogflow has the Mega Agent feature. (At the time of writing, this feature is still in beta but ready to use.) This feature allows you to connect various sub Dialogflow agents to one single Dialogflow agent which is connected to your integration channels, so your users can interact with one chatbot interface instead of many.

<!--more-->

When you are building a chatbot with Dialogflow, you might notice that at some moment you will reach the point that your chatbot performs less and becomes hard to maintain. If you have 1500 intents in one agent, likely you will have intents with training phrases that are quite similar to each other. The way you can solve this is in the Dialogflow settings panel, the **ML Settings** tab, to change the Machine Learning threshold for the confidence score. If the returned value is less than the threshold value, then a fallback intent will be triggered, or if there is no fallback intents defined, no intent will be triggered. This might solve your problem for then, but what if your agent has more than 2000 intents?

And how would you maintain that? Especially when working with large teams.

Imagine you would work for a large enterprise, such as a bank. The chatbot needs to address Bank Accounts/Cards, Mortgages and General Banking questions. When you would add all these intents to one Dialogflow agent, you will likely have intents colliding with each other. In fact, at a traditional bank people work in teams. There is a team working on chatbots for Bank Accounts vs. Mortgages etc. — These teams don’t know about the existence of each other’s Dialogflow intents.

Data governance is very important. Mega agents could solve these problems. As each team can work on their own chatbot. This means rapid changes without breaking the training phrases from other teams, better debugging, version control and agent reviews. But for the end user, it looks like one single chatbot which can address many features through one interface.

![Mega Agent Architecture](mega-agent-architecture.png)

As with all Dialogflow agents, you can only create only one agent per GCP project, so each sub-agent and mega agent will be associated with its own GCP project. The small talk feature won’t work, but you can include Knowledge Base articles per sub agent. A mega agent can have at most 10 sub-agents. Each Dialogflow agent can have 2000 intents. So this will give you a maximum of 20k intents.

When you detect an intent via the SDK, you would make a detectIntent call and use the mega agent’s project ID. Dialogflow will consider all of the sub-agents, and the best response from the sub-agents is returned.

However, it’s also possible to specify one or more sub-agents for a detect intent request by setting the subAgents field of QueryParameters.

``` JavaScript
    {
       "queryInput": {
          "text": {
             "text”: “How can I open a new bank account?",
             "languageCode": "en-US"
          }
       },

       "queryParams": {
          "subAgents": [
             {"project": "projects/dialogflow-mortgages"},
             {"project”: “projects/dialogflow-bankaccounts"}
          ]
       }
    }
```

## Configure a mega agent

Imagine you are a media retailer. Your shop sells video games and movies. The chatbot users can ask questions about video games which will under the hood be answered by the video games chatbot, or about movies, which will be answered under the hood by a movie chatbot.

 1. To set up the Mega Agent feature, you will need to have (or create), “normal” Dialogflow agents first, which later will become a sub agent.

 2. Next, you will **create a new agent**, from the drop down menu, under the logo.

 3. You will give the new agent a name for example: *mega-agent-media-retailer *and then you will flip the switch: **Set as Mega Agent** then hit **save**.

![Mega Agent settings in Dialogflow](mega-agent.png)

After you have created the Mega Agent, you will see a new menu item: *Sub Agents*, in your Dialogflow menu. Additionally, if your mega agent name doesn’t take too many characters, you will see the word: “*MEGA*” next to the agent name.

![Mega Agent settings in Dialogflow](mega-agent-2.png)

When it’s your first time setting up the Mega agent, you will need to assign the sub agents to it. Click No sub-agents yet. **Add the first one**.

You will get in a new screen and you can start to select other agents (from GCP projects) that are available to your Dialogflow user account (Google identity). While doing so, you can also see the **GCP project name**, select the **Dialogflow environment** or **include/exclude the knowledge base feature**. Hit **save**.

![Sub Agents in Dialogflow](sub-agents.png)

4. The Mega Agent will need to get access to each sub agent, and we can do this via the IAM roles page in the GCP console, by adding the service account email address to each sub agent. Here’s how we do this:

While in Dialogflow, make sure the Mega Agent is still active. click the **settings cog** icon next to mega agent name. Which will open the settings panel. When you scroll down in the **General** tab, you will see a service account like:

*dialogflow-<some-key>@<project name>.iam.gserviceaccount.com*

![Mega Agent settings in Dialogflow](mega-agent-3.png)

Copy this email address to your Notepad/Notes app, so you can use this one later to assign it to the other projects in the steps below.

5. You will need to browse back to the GCP console: [http://console.cloud.google.com](http://console.cloud.google.com?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_) and make sure that the **Dialogflow API** for each project id (the subs and the mega agent) is enabled. If it’s correct, it’s already enabled by default but it’s better to double check this. First you select the project in the blue top bar, and use the search form to search for *Dialogflow API. *When you see *the blue Disable API link*, you will know it’s enabled.

![Dialogflow API in Google Cloud Platform Console](dialogflow-api-gcp.png)

1. In the GCP console load one of the sub agent projects, and navigate to **IAM & Admin**. Click the **Add** button at the top.

In the next slide out screen you can **paste the service account email address** (from step 4) as a member. As a role, use the filter to search for **Dialogflow API Client**. (*Project Owner, Project Editor or Dialogflow Admin* roles would work as well, but for security reasons it’s always best to give the least / absolute necessary permissions to your service accounts.)

Repeat this step for each sub agent and hit **Save**.

7. From here you can test your mega agent in the Dialogflow simulator. However, if you want to integrate this in a real application, you will likely need to download the service account to your local drive.

To test the mega agent feature in Dialogflow, make sure you are still in the Mega Agent project. You can start typing questions (based on training phrases of each sub agent) in the simulator like:

* “Which games will be released on Nintendo Switch*” — it will return the response from the video games sub agent.

* “What movies are out on DVD?*” It would return an answer from the movies sub agent.

## Billing

Now, how does this work for billing? The pricing is based on the number of intents used to fulfill a user request. If a request explicitly specifies sub-agents, this is the sum of all intents for the supplied sub-agents. If a request does not specify sub-agents, this is the sum of all intents for all sub-agents of the mega agent. Thus, when any request is made with a potential for any one of N intents as a match, all N intents need to be examined. Dialogflow has to search through all N of those intents, so when N is large, the price will be increased.

For more information see the Dialogflow Documentation on Mega Agents: [https://cloud.google.com/dialogflow/docs/agents-mega](https://cloud.google.com/dialogflow/docs/agents-meg?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_)
