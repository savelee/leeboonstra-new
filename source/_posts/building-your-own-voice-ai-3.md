---
title: Building your own conversational voice AI which streams audio from a browser microphone to a server (part III)
description: A best practice for streaming audio from a browser microphone to Dialogflow & Speech To Text. Your own conversational voice AI in a web application.
tags:
  - Dialogflow ES
  - Dialogflow
  - Voice AI
  - Google Speech to Text
  - Google Assistant
  - Chatbots
  - Best practice
  - STT
  - Speech to Text
categories:
  - Chatbots
featured: architecture2
date: 2021-01-03 10:00:00
---

This is the third blog in the series:
A best practice for streaming audio from a browser microphone to Dialogflow & Google Cloud Speech To Text.

In case you haven’t read the other blogs, I recommend to browse back to these blogs:

* Blog 1: [Introduction to the GCP conversational AI components, and integrating your own voice AI in a web app](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-1/).
* Blog 2: [Building a client-side web application which streams audio from a browser microphone to a server.](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-2/)
  
In the next blog of this series, I will receive the audio bytes from the browser microphone on the server-side, so I can use this to make Dialogflow Detect Intent or Speech to Text transcribe calls!

<!--more-->

These blogs [contain simple code snippets](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples), and a demo application; [the Airport Self Service Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming), which will be used as a reference architecture.

## Server-side Implementation

![App Architecture](architecture2.png)

Below are the steps for creating a Node.js Express application which integrates with the Google APIs such as Dialogflow, Speech to Text and Text to Speech.

You will need a working front-end application as described in the previous blog, in order to get AudioBuffers live from an HTML5 microphone. Make sure you have read Blog 2, before you continue.

Before writing any Node.js server code, let’s quickly preview the configuration and the NPM libraries that I am using:

### My application configuration: .env

In my code base; for the simple examples, and for the end-to-end Airport Self Service Kiosk, I’m storing all my speech configurations outside the project. So it will be easy to play around with settings, without browsing through all the code. This is why I’ve created an **.env** system environments file.

Later in my application code, I can make use of the npm library [dotenv](https://www.npmjs.com/package/dotenv). It loads environment variables from a .env file into [process.env](https://nodejs.org/docs/latest/api/process.html#process_process_env). In case I deploy my application later in a container, or with App Engine Flexible Environments, I can specify these environment variables in a **GKE configmap** or in the **app.yaml.**

Here’s how my **.env** file looks like:

```
    PROJECT_ID=gcp-project-id
    LANGUAGE_CODE=en-US
    ENCODING=AUDIO_ENCODING_LINEAR_16
    SAMPLE_RATE_HERZ=16000
    SINGLE_UTTERANCE=false
    SPEECH_ENCODING=LINEAR16
    SSML_GENDER=FEMALE
```

For Dialogflow, an AudioConfig as part of the [DetectIntentRequest](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2beta1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#detectintentrequest), is essential. It instructs the speech recognizer how to process the speech audio. Check the RPC reference for all the possible [configurations](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.InputAudioConfig).

For Speech to Text it’s important to pass an [RecognitionConfig](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1#google.cloud.speech.v1.RecognitionConfig) and [RecognitionAudio](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1#google.cloud.speech.v1.RecognitionAudio) to the [RecognizeRequest](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1#google.cloud.speech.v1.RecognizeRequest).

**RecognitionAudio** contains audio data in the encoding specified in the **RecognitionConfig**. Either **content** or **uri** must be supplied.

The **RecognitionConfig** provides information to the recognizer that specifies how to process the request.

For Text to Speech the following configurations are important to make a [SynthesizeSpeechRequest](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1#synthesizespeechrequest) call. [SynthesisInput](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.texttospeech.v1.SynthesisInput) (which can be text or SSML), [VoiceSelectionParams](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.texttospeech.v1.VoiceSelectionParams) (to describe which voice to use) and an [AudioConfig](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.texttospeech.v1.AudioConfig) (to describe the Audio data to be synthesized).

### The NPM libraries that I am using: package.json

Since my example application makes use of Node.js and NPM, I will need to download external Node libraries. Here you can find [my package.json](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/examples/package.json).

The npm packages which are important to build speech integration:

* [dialogflow](https://www.npmjs.com/package/dialogflow): to interact with Dialogflow and do intent matching (on speech)
* [@google-cloud/speech](https://www.npmjs.com/package/@google-cloud/speech): to interact with STT and to transcribe speech
* [@google-cloud/text-to-speech](https://www.npmjs.com/package/@google-cloud/text-to-speech): to interact with TTS and to synthesize text

The following packages came in handy too:

* [pb-util](https://www.npmjs.com/package/pb-util): Utilities for working with common protobuf types. It can be used with the Dialogflow intent response.
* [stream](https://www.npmjs.com/package/stream), [util](https://www.npmjs.com/package/util), [through2](https://www.npmjs.com/package/through2): For working with streams. To pipe streams together and destroy all of them if one of them closes.
* [recordrtc](https://www.npmjs.com/package/recordrtc): WebRTC JavaScript Library for Audio+Video+Screen+Canvas Recording. I don’t need it on the server-side, but it’s in my package.json file, so I can host the library locally (instead from a CDN).
* [socket.io](https://www.npmjs.com/package/socket.io): Socket.IO enables real-time bidirectional event-based communication.
* [socket.io-stream](https://www.npmjs.com/package/socket.io-stream): This is the module for bidirectional binary data transfer with Stream API through Socket.io
* [uuid](https://www.npmjs.com/package/uuid): to generate Universally Unique IDentifiers

### Setup Dialogflow

Navigate to: [http://console.dialogflow.com](http://console.dialogflow.com/?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_) and create a new agent. Make sure you have enabled **Beta features** in settings, because we will make use of **Knowledge Base connectors** to import web-based FAQs and this feature is currently in beta.

Once, it’s enabled we can create a new **knowledge base FAQ**, with **text/html** as a **mime-type**. For the Airport Self Service Kiosk demo, I am loading San Francisco Airport Questions and answers into my agent from a live website: [https://www.flysfo.com/faqs](https://www.flysfo.com/faqs)

As soon as the FAQs are imported, you will see all the questions and answers listed in Dialogflow. We will now need to specify the answer to the Text and SSML response: **$Knowledge.Answer[1]**

Dialogflow will use this response (the first answer from the Knowledge Base Q and A) to synthesize as an AudioBuffer.

![Knowledge Base Connector](knowledgebase.png)

**Note:**

In my Airport Self Service Kiosk demo, I am also showing the Question and Answer as readable text in my Angular web app. How did I do that? By creating a **custom payload** next to the Text & SSML response:

``` JSON
    {
    "knowledgebase": true,
    "QUESTION": "$Knowledge.Question[1]",
    "ANSWER": "$Knowledge.Answer[1]"
    }
```

### Writing the server code

Typically, the server-side code will exist of the following parts:

* Importing all the required libraries
* Loading the environment vars
* Setting up the Express server with Socket.IO listeners
* Google Cloud API Calls: Dialogflow Audio DetectIntent & DetectStream calls, Speech to Text Recognize & StreamingRecognize calls, Text to Speech synthesize calls

For demo purposes, I won’t discuss how to setup a Node.js application with an express server. But as a reference, you can have a look into my [simple server code](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/examples/simpleserver.js), which has been used for the simple [client-side examples](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples). And you can also have a look into [the code of the Airport Self Service Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/server), an end-to-end example. This example makes use of Cloud Speech to Text [StreamingRecognize](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.Speech.StreamingRecognize), Dialogflow [DetectIntent](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.Sessions.DetectIntent), and Text to Speech [SynthesizeSpeech](https://cloud.google.com/text-to-speech/docs/reference/rpc/google.cloud.texttospeech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.texttospeech.v1.TextToSpeech.SynthesizeSpeech).

When you browse through these code snippets, you will be able to see the Express server. They all communicate via Socket.io like this:

{% gist ed39c217b8346a2eb67cff4b41fd3560 %}

 1. With Socket.io instantiated, I can listen to the connect emit. As soon as a Socket.io client connects to the server, this code will execute.
 2. When connected to a socket, and the ‘message’ event was fired by the client, execute this code. It will retrieve the data which was set when stopping the WebRTC recorder. To recall from my previous blog, I have created an object with a child object, which contains the mime-type (**audio/webm**), and the **audioDataURL**, which is the Base64 string containing the audio recording. Let’s take that Base64 string and convert it to a Node.js file Buffer.
 3. With that **fileBuffer** I could call my custom Dialogflow **DetectIntent** implementation, explained later in this article:

``` JavaScript
    const results = await detectIntent(fileBuffer);
    client.emit('results', results);
```

Or I could call my custom Speech to Text Recognize implementation, explained later in this article:

``` JavaScript
    const results = await transcribeAudio(fileBuffer);
    client.emit('results', results);
```

Both calls are asynchronous and return a Promise with the results. These results will be sent to the client-side app.
The client could listen to the socket emit like this:

``` JavaScript
    socketio.on('results', function (data) {
        console.log(data);
    });
```

4. Here’s an example of a 2nd event fired by the client. In this case a streaming event. Now, I will retrieve the data when the WebRTC recorder streams chunks of audio data in the **ondataavailable** listener. Note, that the client socket is wrapped with **socket.io-stream **for streaming binary data transfers.
I am retrieving the audio chunks, plus additional data, such as the stream name (a string). This can be used to store a temporary audio file on the server, in which I can pipe the incoming audio stream. It’s used as a holder, to activate my custom Dialogflow or Speech to Text implementations.
5. Like the DetectIntentStreaming implementation, explained later in this article:

``` JavaScript
    detectIntentStream(stream, function(results){
        client.emit('results', results);
    });
```

Or the Speech to Text StreamingRecognize implementation, explained later in this article:

``` JavaScript
    transcribeAudioStream(stream, function(results){
        client.emit('results', results);
    });
```

Both calls, pass in the stream, and a callback function to execute once the results are in. These results will be sent to the client-side app.

The client could listen to the socket emit like this:

``` JavaScript
    socketio.on('results', function (data) {
        console.log(data);
    });
```

### API Calls to Dialogflow

Dialogflow is an AI-powered tool for building text and voice-based conversational interfaces such as chatbots and voice apps. It uses Machine Learning models such as Natural Language Understanding to detect the intentions of a conversation.

The way how Dialogflow intent detection works is, it first tries to understand the user utterance. Then, it will check the Dialogflow agent, which contains intents (chat flows), based on the training phrases. The intent with the best match (highest confidence score), will return the answer, which could be a text response, audio response or a response from a system through a fulfillment.

I will use the Dialogflow Node.js client SDK to manually detect the intent, based on finished audio buffers and incoming audio streams.

`const df = require(‘dialogflow’);`

Let’s first prepare the client and the request. Later I can modify the request by adding the audio input:

{% gist fcd1c22b55e2b64420a10938584dacba#file-simpleserver-js %}

 1. Dialogflow will need a session ID. Let’s use UUID to generate a random [https://www.ietf.org/rfc/rfc4122.txt](https://www.ietf.org/rfc/rfc4122.txt) RFC4122 id, in a format like: ‘1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed’.
 2. Afterwards let’s create a Dialogflow Session Path. The session path can be created from a Dialogflow Session Client object. It needs a session ID to make each Dialogflow session unique. And it needs the GCP project id, which points to a GCP project that has a working Dialogflow agent. **Note: **Each Google Cloud Platform project can have only one Dialogflow agent. In case your Dialogflow Agent needs a test and development version. You either can make use of the [versions](https://cloud.google.com/dialogflow/docs/agents-versions?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_) feature in Dialogflow. Or you could create more GCP projects, one for the test agent and one for the development agent.
 3. Let’s already setup a request object, which will be used for each Dialogflow API call.In case this request will be used when streaming audio, this request will be used as the initial request. Which means it first connects to the SDK without the audio stream, but prepares the API with audio configurations it can use. Afterwards the chunks of audio will stream in. It needs to have a sessionPath (which now will point to a client session and a particular Dialogflow agent). Even without the audio input I can already setup the **queryInput**.
 4. Since my application works with speech, I will need to set the [**audioConfig](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.InputAudioConfig)** object. The **audioConfig** object requires a sample rate hertz, (this number has to be the same as the **desiredSampleRateHerz** from your client-side code). It requires a languageCode which contains the language of the spoken text, and it should be a language that was set in Dialogflow. It will need to have an encoding, which also needs to be the same as the encoding used in the client. In my code demos, I am using the configurations from the **.env **file.

Now let’s have a look into both calls, [DetectIntent](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.Sessions.DetectIntent) and [StreamingDetectIntent](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.Sessions.StreamingDetectIntent).

### DetectIntent

DetectIntent it receives the intent match results after all audio has been sent and processed. I’m creating an asynchronous function, which takes the AudioBuffer and adds it to the request. Next I’m calling detectIntent, by passing in the request. It returns a promise, which will be chainable:

``` JavaScript
    async function detectIntent(audio){
        request.inputAudio = audio;
        const responses = await sessionClient.detectIntent(request);
        return responses;
    }
```

Here’s how the response would look like: [DetectIntentResponse](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.DetectIntentResponse). You will likely be interested in the **queryResult**. In case you passed in the **DetectIntentRequest** an output audio config, you will be able to retrieve audio data bytes generated based on the values of the default platform text responses found in the **queryResult.fulfillmentMessages** field. If multiple default text responses exist, they will be concatenated when generating audio. If no default platform text responses exist, the generated audio content will be empty.

### StreamingDetectIntent

The StreamingDetectIntent performs bidirectional streaming intent detection: receive results while sending audio. This method is only available via the gRPC API (not REST).

{% gist 4e8d03d74d6928daf8c52cd9703e5ece %}

 1. I’m creating an asynchronous function, which takes the AudioBuffer and adds it to the request, and the name of the callback function which will execute with the results once the API fetches the results.
 2. Execute the **streamingDetectIntent()** call.
 3. There’s an **on(‘data’)** event listener, which executes once audio chunks are streamed in. You could create some conditional logic here, in case there’s a **data.recognitionResult **in the response, then the intermediate transcript is recognized. Otherwise, likely the intent has been detected (or a fallback intent was triggered, in case there wasn’t a match). I’m returning the results by executing the callback function.
 4. You could also listen to **error** events, when something went wrong with the request. Or you could listen to **end** events, when streaming to Dialogflow stopped.
 5. The way how this works, is first we will let the Dialogflow API know that there will be a **streamingDetectIntent** call with all the **queryInput** and **audioConfigs** that can be retrieved from the requests. Afterwards, all the other messages that will come in, will contain the audio stream via **inputAudio**.
 6. Let’s use a small node module called **pump**, which pipes the streams together and destroys all of them if one closes.
 7. Here, I will transform the stream, so the request will now also contain **inputAudio** with the audioBuffer streaming in.

Here’s how the response would look like. [StreamingDetectIntentResponse](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2.StreamingDetectIntentResponse). You will likely be interested in the queryResult. In case you passed in the **StreamingDetectIntentRequest** and output audio config, you will be able to retrieve audio data bytes generated based on the values of the default platform text responses found in the **queryResult.fulfillmentMessages** field. If multiple default text responses exist, they will be concatenated when generating audio. If no default platform text responses exist, the generated audio content will be empty.

Here’s how it would look like in a real production application, using TypeScript: [https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/server/dialogflow.ts](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/server/dialogflow.ts)

## API Calls to Speech to Text

The Speech to Text API transcribes spoken words to written text. This is great for when you want to generate subtitles in a video, generate text transcripts from meetings, etc. You could also combine it with chatbots (detect intent from texts) to synthesize the chatbot answers.

Speech to Text is very powerful, as the API call response will return the written transcript with the highest confidence score, also return an array with alternative transcript options. It’s also possible to bias the recognizer, by sending phrase hints to the API.

Here, I will use the Speech Node.js client SDK to transcribe voices to written text.

<code>const speech = require('@google-cloud/speech');</code>

Let’s first prepare the client and the request. Later I can modify the request by adding the audio input:

{% gist 7d78feb8f956cb981dfd034ab7acc151#file-simpleserver-js %}

 1. First, let’s instantiate the Speech Client.
 2. Here I will describe the request object. Since our application works with speech, we will need to set the recognition [**config](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.RecognitionConfig)** object. The **config** object requires a sample rate hertz, (this number has to be the same as the desiredSampleRateHerz from your client-side code). It requires a languageCode which contains the language of the spoken text. And it will need to have an encoding, which also needs to be the same as the encoding used in the client. In my code demos, I am using the configurations from the **.env **file.

Now let’s have a look into both calls, [Recognize](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.Speech.Recognize) and [StreamingRecognize](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.Speech.StreamingRecognize).

### Recognize

The Recognize call performs synchronous speech recognition. It receives results after all audio has been sent and processed.

I’m creating an asynchronous function, which takes the AudioBuffer and adds it to the [request](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.RecognitionAudio). Next; I’m calling the **recognize** method from the speech client, by passing in the request. It returns a promise, which will be chainable:

``` JavaScript
    async function transcribeAudio(audio){
        request.audio = {
            content: audio
        };
        const responses = await speechClient.recognize(request);
        return responses;
    }
```

Here’s how the response would look like: [RecognizeResponse](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.RecognizeResponse). It will return [SpeechRecognitionResults](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.SpeechRecognitionResult), which will contain an array with [alternatives](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.SpeechRecognitionAlternative). Each alternative contains the transcript, confidence score (The confidence estimate between 0.0 and 1.0. A higher number indicates an estimated greater likelihood that the recognized words are correct.) and an array with all the words. Alternatives are sorted on confidence level, with the highest confidence first in the array.

### StreamingRecognize

StreamingRecognize performs bidirectional streaming speech recognition: receive results while sending audio. This method is only available via the gRPC API (not REST).

{% gist c8f5646ed3cf63ea397cc92f11ab052b#file-simpleserver-js %}

 1. I’m creating an asynchronous function, which takes the AudioBuffer and adds it to the request, and the name of the callback function which needs to return with the results.
 2. Execute the streamingRecognize() call by passing in the speech request.
 3. There’s an on(‘data’) event listener, which executes once audio chunks are streamed in. I’m returning the results by executing the callback function.
 4. You could also listen to **error** events, when something went wrong with the request. Or you could listen to **end** events, when streaming to Dialogflow stopped.
 5. Finally we pipe the recognizeStream together with the incoming audio.

Here’s how the response would look like: [StreamingRecognizeResponse](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.StreamingRecognizeResponse). It will return [StreamingRecognitionResult](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.StreamingRecognitionResult), which will contain an array with [alternatives](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.speech.v1.SpeechRecognitionAlternative). Each alternative contains the transcript, confidence score (The confidence estimate between 0.0 and 1.0. A higher number indicates an estimated greater likelihood that the recognized words are correct.) and an array with all the words. Alternatives are sorted on confidence level, with the highest confidence first in the array.

By now, you have seen how to build a web application which streams audio from a microphone on your local device through your browser to a back-end application, and fetches results from Google Cloud Speech to Text or Dialogflow and displays it in the User Interface.

It would be even nicer, when the browser could play the audio streams. [This is what the next blog is all about!](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-3/)
