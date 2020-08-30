---
title: Mastering auto speech adaptation in Dialogflow for voice agents
description: Auto speech adaptation improves the speech recognition accuracy of your Dialogflow voice agent by effectively adding context to your conversations. In the Netherlands, we have this radio show called… 
categories:
  - Chatbots
tags:
  - Speech Adaptation
  - ML Bias
  - Dialogflow
  - Voicebots
  - Callbots
alias: /developer/mastering-auto-speech-adaptation-in-Dialogflow-for-voice-agents/
featured_image: 0_UZklk43Hek7Drmgu.png
thumbnail: 0_UZklk43Hek7Drmgu_1.jpg
date: 2020-03-23 14:41:36
---

Auto speech adaptation improves the speech recognition accuracy of your Dialogflow voice agent by effectively adding context to your conversations.

<!--more-->

In the Netherlands, we have this radio show called: "Mama Appelsap*". It makes fun of mishearing and misinterpreting phrases in lyrics. Another word for this phenomenon is a **mondegreen**. Mondegreens are most often created by a person listening to a poem or a song; the listener, being unable to clearly hear a lyric, substitutes words that sound similar and make some kind of sense. You can find on Youtube all kinds of mondegreens, such as the *Creedence Clearwater Revival song Bad moon rising*. You might have heard of it. Instead of hearing "there's a bad moon on the rise", you could also hear: "there's a bathroom on the right". (In fact, after hearing this once, it's hard to unhear this anymore.)

When we talk about Speech Machine Learning models, speech to text models have been trained by large datasets. Based on the audio examples it heard before, it tries to match text phrases out of it. With that being said, mishearing speech is not only hard for humans, it can be difficult for machines as well. However, we can bias the machine learning model by providing tips. In Dialogflow, when building voice agents, it's actually so easy; you just need to enable the **auto speech adaptation switch** which can be found in the **settings > speech** tab. Intents and (marked) entities will be used as hints.

![Dialogflow Speech Settings](/images/0_UZklk43Hek7Drmgu.png)

At the time of writing, this feature is beta. In case you can't find the speech tab in the settings panel, you will need to enable the beta features first. This can be found in the **Settings > General** tab:

![Settings > General](/images/0_mVVqNNDmLqAJrWyR.png)

Once you have enabled auto speech adaptation, you can build your Dialogflow voice agents in ways to take advantage of it.

You can either test it in the simulator by using your microphone, or if you are a developer, I would suggest you will use my Dialogflow Speech recognition example, because it will give you access to more debug information.
For best results, you'll also want to enable enhanced models:
https://cloud.google.com/dialogflow/docs/data-logging

**Note: Auto speech adaptation does not work for Actions on Google (Google Assistant), because with the AoG framework, speech recognition is performed by Actions on Google before sending data to Dialogflow.**

## Setting up a Speech Intent Detection example, to use your browser's microphone and run a Dialogflow script from the server.

I've created some code snippets which you can use in your browser to use your laptop microphone. You can speak out a user utterance, and it will match the intent. When you open the debug console, you can browse through the results and see the **query text**, the spoken text Dialogflow captured' and transformed to text.

Follow the [readme steps](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fdialogflow%2Fselfservicekiosk-audio-streaming), to download a service account key, setup Dialogflow and run an `npm install` from the examples folder. Once done, you can run the following command to run the script:

```
npm --EXAMPLE=1 --PORT=8080 --PROJECT_ID=[your-gcp-id] run start
```

When you browse to http://localhost:8080, you will see a screen like the one below and you can play around by creating examples in Dialogflow, which are similar to the examples in this blog.

![Demo](/images/0_pBJieu9ZjA-CLga5.png)

## Speech Adaptation Examples

The following examples show how speech recognition may be improved with certain changes to your agent:

### Custom Entities Hints

If you define entities for product or service names offered by your company, and the end user mentions these terms in an utterance, they are more likely to be recognized.
I have created an airlines voice AI; http://selfservicedesk.appspot.com/

Without Speech Adaptation enabled, when I mention airlines such as **Corendon Airlines** or **Flybe**, it won't interpret the correct names:

![Demo](/images/0_CIkyTopAoUic6cdL.png)

But when the speech adaptation is enabled, I can create a custom entity which points to the various airlines:

![Dialogflow](/images/0_kWM96gkUW4bT87o7.png)

Then I can create intents that use the **@Airlines** entity.

Next, when I test in the simulator (by using the microphone) "Corendon Airlines", it will understand which airline I meant.

![Dialogflow](/images/0_uMGN-7lPGHUDJh4r.png)

### System Entities Hints

The previous example makes use of **custom entities**. But I will work similar with system entities such as `@sys.number`. Think about user speech expressions when the user says "two", it may be recognized as "to", "too", "2" or "two". Or "for 4 to 5", "425", "four four two five" etc. The system entities will be used as hints.

### Intent Hints

If you define training phrases with a phrase like "We are going to Ibiza", a similar sounding user utterance is reliably recognized as "We are going to Ibiza" and not "We are going to eat pizza".

### Overriding speech hints in your code
You can also tweak the speech adaptation in your code. That's handy when you are implementing integrations through the SDK. Providing explicit **speech_contexts** in the **inputAudioConfig** will override the implicit speech context hints generated by auto speech adaptation for input audio (speech-to-text) configuration in the Dialogflow console. The **speechContexts** takes an object with an array of phrases[] containing words and phrases that the speech recognizer should recognize with a higher likelihood. See the [Cloud Speech documentation](https://medium.com/r/?url=https%3A%2F%2Fcloud.google.com%2Fspeech-to-text%2Fquotas) for usage limits.

The speechContexts object can also take an optional boost (float) property. Boost for this context compared to other contexts:

* If the boost is positive, Dialogflow will increase the probability that the phrases in this context are recognized over similar sounding phrases.
* If the boost is unspecified or non-positive, Dialogflow will not apply any boost.

Dialogflow recommends that you use boosts in the range (0, 20) and that you find a value that fits your use case with binary search.

**Note: phraseHints[] will be deprecated.**

Here you can find an example. Consider the following chat flow:

```
"What's my PNR for my flight to Rome?"
> I can send it to you per mail or per text message.
"Mail"
```

![Dialogflow](/images/0_wZ3O7K46c2LRLesg.png)

To make sure that the agent understands "Mail" and not "Male" or "Nail", I have provided **speechContexts** in the code:

{% gist 73af0549a2cbdc4bd945b90ea2fcfc7c %}

### SpeechContext code snippetSpeech Adaptation and supporting regular expressions

Currently speech recognition doesn't have built-in support for the built-in [regex entities](https://medium.com/r/?url=https%3A%2F%2Fcloud.google.com%2Fdialogflow%2Fdocs%2Fentities-regexp). The entity regex rules have no effect on auto speech adaptation. You might need alphanumeric sequences in your user expressions, for example to speak out an account id. With auto speech adaptation you can work around this limitation.

This example shows how to recognize an account id in a user utterance. An account id is a 8 character string of alpha and numeric characters. For example: AA12BB34

Create the following 2 entities with the following entries:

*Character*

* A, A
* B, B
* …
* Z, Z

*Digit*
* 0, 0
* 1, 1
* …
* 9, 9

*AccountId*
* @character @character @digit @digit @character @character @digit @digit

Use **@AccountId** as a parameter in a training phrase.

**Note: The @AccountId entity entry requires whitespace between consecutive entities in order to be a valid entity definition. Because of this, a user utterance of "AB12CD34" is not matched, but a user utterance of "A B 1 2 C D 3 4" is matched. This is not usually a problem, because a spoken user utterance is processed with whitespace padding for alphanumeric characters. This means, once the back-end receives the AccountId parameter, you will have to trim off the whitespace. As always, proper validation should be done in your webhook.**

In case of a flight-number (PNR) which is a 6 alphanumeric combination. We can make use of the system entity **@sys.flight-number** in an intent:

![Dialogflow](/images/0_j4fV4sj00UZdRY5g.png)

You can customize the **@sys.flightnumber** from the **entities > system** tab.

![Dialogflow System Entity](/images/0_dmUx8T_8ZtmMr2Q7.png)

Here we will add a regex to capture the right number of characters:

Which in our case will be 6 or 7 characters, which can be uppercase or lowercase characters or numbers:
**([A-Zaz0–9]){6,7}**

![Dialogflow Entity](/images/0_eq5MO4U2Lr-EL8up.png)

## Conclusion

Auto speech adaptation improves the speech recognition accuracy of your Dialogflow voice agent by effectively adding context to your conversations. In this article I've shown some examples within voice bots. This feature can improve the accuracy of the agent by more than 40%!

You can imagine that this will be a game changer, when you use voice agents in your IVR systems / contact centers. Up until now, IVRs were pretty basic and the user experience was such that people just shout trigger phrases like "speak to a 'representative'" to escape the flow as soon as possible. Dialogflow & CCAI want to help build experiences that help people get a high-quality service which doesn't require them to repeat themselves.
With SpeechContexts, developers and conversational UX designers can provide context and boost it to bias the model. Therefore fine-tune the likelihood that conversations will include wrong phrases. Lastly, Google has expanded the number of phrase hints per API request from 500 to 5,000.

*In case you wonder what the name of the radio show means, it's a mondegreen for the Michael Jackson song - Gonna be Startin'. Which has a phrase 'Ma ma se ma ma sa, ma ma coo sa.' Not the Dutch words 'Mama Appelsap' which is Dutch for: Mother Apple Juice.*