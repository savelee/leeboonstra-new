---
title: Building your own conversational voice AI with Dialogflow & Speech To Text in web apps. (part I)
description: A best practice for streaming audio from a browser microphone to Dialogflow & Speech To Text. Your own conversational voice AI in a web application.
tags:
  - Dialogflow ES
  - Dialogflow
  - Voice AI
  - Google Speech to Text
  - Google Assistant
  - Chatbots
  - Best practice
categories:
  - Chatbots
featured: architecture1
date: 2021-01-01 10:00:00
---

This is the first blog in the series:

A best practice for streaming audio from a browser microphone to Dialogflow & Google Cloud Speech To Text.

In this first blog, I will address why customers would integrate their own conversational AI compared to building for the Google Assistant. I will introduce all the conversational AI components in Google Cloud and where you would use each component for.

<!--more-->

Later in this blog series, I will show you how to integrate an HTML5 microphone in your web application. How to stream audio streams to a (Node.js) back-end. How to use the Dialogflow API for audio streaming. How to use the Speech API. And, lastly, how to return audio (Text to Speech) to a client to play this in a browser.

These blogs contain [simple code snippets](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples), and a demo application; the [Airport Self Service Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming/), which will be used as a reference architecture.

## Google Assistant vs. a custom conversational AI

I often speak with customers and their wish to include the Google Assistant in their business web apps. Unless you are a manufacturer for tv setup boxes or headphones, I always answer;

“Is this really what you want? Or do you mean you want to extend your own app with a conversational AI?”

**- “Eh?”**

If you have one or more of the below requirements, you probably want to make direct use of the Google Cloud Speech and Dialogflow APIs, instead of [packing your voice AI as an action in the Google Assistant](https://developers.google.com/assistant?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_) or [wrapping the Google Assistant in your app](https://developers.google.com/assistant/sdk/overview?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_).

* This application shouldn’t be public available.
* This application doesn’t need to be available on the Google Assistant / Nest Home.
* You don’t want to start your app with the wake words: “Hey Google, talk to my app”.
* The application doesn’t need to answer native Google Assistant questions, such as: “what’s the weather in Amsterdam”.
* The application can only make use of the Google Cloud terms & conditions, instead of combining it with the consumer terms & conditions of the Google Assistant.

Convinced that you want to extend your own (mobile) web app by integrating voice AI capabilities? Here’s the ultimate developer guide, on implementing voice streaming from a web application to Google Cloud Speech and Dialogflow.

## Dialogflow versus Text-to-Speech API versus Speech-to-Text API

**Dialogflow** is an AI-powered tool for building text and voice-based conversational interfaces such as chatbots and voice apps. It uses Machine Learning models such as Natural Language Understanding to detect the intentions of a conversation.

The way how Dialogflow intent detection works is, it first tries to understand the user utterance. Then, it will check the Dialogflow agent, which contains intents (or chat flows), based on the training phrases. The intent with the best match (highest confidence score), will return the answer, which could be a text response or a response from a system through a fulfillment.

Although many of us will use Dialogflow with text input, for web or social media chatbots, it is also possible to do intent matching with your voice as audio input, and it can even return spoken text (TTS) as an audio result.

Dialogflow speech detection & output will have some overlap with Cloud Speech to Text API (STT) and Cloud Text to Speech (TTS). Even the API calls look similar! However those services are different, and they have been used in separate use cases.

**Speech to Text (STT)** transcribes spoken words to written text. This is great for when you want to generate subtitles in a video, generate text transcripts from meetings, etc. You could also combine it with Dialogflow chatbots (detect intent from text transcripts) to synthesize the chatbot answers, however STT doesn’t do intent detection like Dialogflow does. STT is very powerful, as the API call response will return the written transcript with the highest confidence score, and it will return an array with alternative transcript options.

With **Text to Speech (TTS)**, you can send text or SSML (text with voice markup) input and it will return audio bytes, which you can use to create an mp3 file or directly stream to an audio player (in your browser).

Compared to the **Google Assistant**, by extending your apps with a conversational AI manually with the above tools, you no longer are part of the Google Assistant ecosystem. That ecosystem is nice if you are building consumer or campaign apps (voice actions), that everyone can find by invoking it through the *Hey Google, talk to my app* wake phrase. But when you are an enterprise, that whole ecosystem might be overkill.

![Actions on Google ecosystem](actions-on-google-space.png)

For an enterprise who wants to integrate a voice AI in their own apps, the full Google Assistant ecosystem might be an overkill.

## Google Cloud Contact Center AI

There’s another Google solution, which is called **Google Cloud Contact Center AI **(CCAI).

This solution is for enterprises that want to deploy a voice AI in their existing telephone contact center (IVR). Dialogflow and Cloud Speech APIs are the key pieces in that architecture OEMed by a telephony partner (such as Genesys, Avaya, Cisco etc.) Since Contact Center AI is an out of the box solution, you don’t need to implement these APIs yourself.

## About the demo application; Airport Self Service Kiosk

Now that you know the differences between all the conversational GCP components, let’s see how we can implement these in an end-to-end web application. For this guide, I will make use of a demo app, which is a self service kiosk for an airport. (Self Service Kiosks are also common in retail or the finance sectors.)

You can ask the Self Service Kiosk; if’t okay to bring a lighter in your handbag, or what time boarding is. The results will be presented on the screen, and it will also be spoken out:

![Here’s a screenshot from my demo app: The Airport Self Service Kiosk](selfservicedesk.png)

Let me show you the best practice for streaming audio from your microphone through the browser to Dialogflow and then out through the speaker.

All the code is available on Github: [https://github.com/dialogflow/selfservicekiosk-audio-streaming](https://github.com/dialogflow/selfservicekiosk-audio-streaming)

And the final solution has been deployed with App Engine Flex: [http://selfservicedesk.appspot.com](http://selfservicedesk.appspot.com)

Building the demo application requires the following tools:

* NodeJS
* Dialogflow client SDK
* STT Node.js client SDK
* TTS Node.js client SDK
* [Socket.io](https://www.npmjs.com/package/socket.io) & [Socket.io-Stream](https://www.npmjs.com/package/socket.io-stream)
* [RecordRTC](https://github.com/muaz-khan/RecordRTC)
* AppEngine Flexible Environment (with websockets support & HTTPS)

## Architecture

Here’s the architecture that I have been using:

![The architecture I’ve used.](architecture1.png)

* Client website / app. For demo purposes I will show you two versions. A simple HTML page, and an example of a full web application in Angular, [such as the self service kiosk demo](https://github.com/dialogflow/selfservicekiosk-audio-streaming). It contains the **getUserMedia() WebRTC** call wrapped by the **RecordRTC** library, to record the audio streams from the browser microphone.
* A NodeJS server which will serve the static content (such as the HTML page) and connect to the GCP libraries, like Dialogflow, STT and TTS.
* You could use any other programming language as well. All GCP services have various client SDKs (such as Node.js, Java, Python, Go etc), and also Rest and GRPC libraries.
* The Dialogflow Agent, which contains intents, entities, and FAQ Knowledge bases.

The client app talks to the backend server via websockets. This is a common approach when building chatbots or chat applications because they can respond in real-time, without any page refreshes.

I am using the socket.io framework with the socket.io-stream plugin, since it’s easy to use and I need to make use of bi-directional streaming.

***Note:***

*I’ve seen solutions online where the microphone is directly streamed to the Dialogflow, without a server in between. The REST calls were made directly in the web client with JavaScript. I would consider this as an anti-pattern. You will likely expose your service account / private key in your client-side code. Anyone who is handy with Chrome Dev tools could steal your key and make (paid) API calls via your account. It’s a better approach to always let a server handle the Google Cloud authentication. This way the service account won’t be exposed to the public.*

## Short utterance vs. Streaming

There are typically 2 approaches on how to integrate voice in your application.

 1. Short utterances / detect intent. This means your end-user presses a record button, speaks, and when they press stop, we collect the audio stream to return results. In your code, this means once the client web app collects the full audio recording, it sends it to the server, so the server can do a call to Dialogflow or the Speech to Text API.
 2. Streaming of long utterances / detect intents in a stream. This means your end-user presses the record button, speaks, and will see the results on the fly. When detecting intents, it could mean that it will detect better matches once you have spoken more, or it could collect multiple results. In your code, this means the client starts making a bi-directional stream and streams chunks to the server so the server can make a call with event listeners on incoming data and thus it’s real-time.
 3. When there is an intent match, we can either show the results on screen by presenting the text, or we can synthesize (read out) the results by streaming an audio buffer back to the client, which will played via the WebRTC AudioBufferSourceNode (or audio player).

Stay tuned for my next blog. [In this blog I will make a start by building a client-side web application which uses a HTML5 Microphone with WebRTC, streaming the audio bytes to a Node.js backend.](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-2/)
