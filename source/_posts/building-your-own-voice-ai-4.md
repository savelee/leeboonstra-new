---
title: Getting Audio Data from Text (Text to Speech) and play it in your browser. (part IV)
description: A best practice for streaming audio from a browser microphone to Dialogflow & Speech To Text. Your own conversational voice AI in a web application.
tags:
  - Dialogflow ES
  - Dialogflow
  - Voice AI
  - Google Speech to Text
  - Google Assistant
  - Chatbots
  - Best practice
  - TTS
  - Text to Speech
categories:
  - Chatbots
featured: dialogflow-architecture
date: 2021-01-04 10:00:00
---

This is the fourth blog in the series:
A best practice for streaming audio from a browser microphone to Dialogflow & Google Cloud Speech To Text.

In case you haven’t read the other blogs, I recommend to browse back to these blogs:

* Blog 1: [Introduction to the GCP conversational AI components, and integrating your own voice AI in a web app](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-1/).
* Blog 2: [Building a client-side web application which streams audio from a browser microphone to a server.](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-2/)
* Blog 3: [Building a web server which receives a browser microphone stream and uses Dialogflow or the Speech to Text API for retrieving text results.](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-3/)

In the next blog of this series, I will take text (or Dialogflow QueryResult text data) that’s currently available on the server-side, pass it to the Text to Speech API (to synthesize the text) and return the audio bytes back to the client app, to play it in the browser. It has to play the audio bytes automatically.

<!--more-->

These blogs [contain simple code snippets](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples), and a demo application; [the Airport Self Service Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming), which will be used as a reference architecture.

## Architecture

When you make a Text to Speech call, either with Text to Speech or by using the built-in speech return from Dialogflow, it will return audio byte data. Both TTS and Dialogflow can be called from server-side code. In order to stream and play this in a browser, you could make use of websockets. Once the AudioBuffer (ArrayBuffer in browser JavaScript code) is returned to the client, it can be played by using WebRTC methods.

Here’s an example of a browser flow when using the Text to Speech API. In this example a user types text of which the synthesized speech will be played in the browser:

![TTS Architecture](tts-architecture.png)

Here’s an example of a browser flow by using Dialogflow. In this example a user speaks in the microphone (similar as the examples above), but Dialogflow returns an AudioBuffer as the result.

![Dialogflow Speech Architecture](dialogflow-architecture.png)

## Client-side Code to play the audio

The JavaScript code which runs in your browser will look like this:

* [Client-Side Code: Play TTS output in the browser ](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/examples/example6.html)— TTS

I’m loading Socket.io and Socket.io with stream support (for bidirectional binary data transfer), from the CDN:

Socket.IO is a real time, bidirectional event-based communication library. One of the transports that it uses are websockets, but it also provides other transports (XHR/JSONP), not just as a fallback but also for situations where websockets aren’t supported/required/wanted.

```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io-stream/0.9.1/socket.io-stream.js"></script>
```

I created the Socket.IO object, and made sure it connects.

I’ve created an on **‘results’** listener, which will run once the data from the server-side is retrieved in the browser. This will call my **playOutput** method, which I will show later:

``` JavaScript
    const socketio = io();
    const socket = socketio.on('connect', function() {});
        socketio.on('results’', function (data) {
        console.log(data);
        playOutput(data);
    });
```

In my simple demo, I’ve create a textarea field, and a JavaScript method, which will be called on a button click , that takes the value from the field, and emits this via Socket.IO to the back-end:

``` JavaScript
    const inputTextEl = document.getElementById('inputText');
    function submitTTSCall(){
        var input = inputTextEl.value;
        if (input) ss(socket).emit('tts', input, {});
    }
```

Now this is just a simple demo. But in a real-world application, a text prompt, or an incoming chatbot answer could trigger TTS to read it out loud in the browser. I’m doing this in the [Airport Self Service Kiosk application](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/client/src/app/dialogflow/dialogflow.component.ts), which you can try out on this URL: [http://selfservicedesk.appspot.com/](http://selfservicedesk.appspot.com/)

Here’s the code for playing the output in your browser from your device speakers:

{% gist e794f97dc7210942330c066f90e9a541 %}

<ol>
   <li>Here’s the <code>playOutput</code> function, which takes the <code>arrayBuffer</code> that I retrieved from the back-end code that calls the Text to Speech API. Here, I can create a new <code>AudioContext</code> object. The AudioContext interface represents an audio-processing graph built from audio modules linked together, each represented by an AudioNode. An audio context controls both the creation of audio nodes it contains and the execution of the audio processing, or decoding.</li>
   <li>Now, let’s create an audio source for Web Audio API from an ArrayBuffer. The decoded AudioBuffer is resampled to the AudioContext’s sampling rate, then passed to a callback.</li>
   <li>A user agent could block autoplay, hence why I run <code>audioContext.resume</code> as a trick first. Afterwards, create a new AudioBufferSourceNode to connect to the audioContext destination, which are in our case the device speakers. The <code>buffer</code> property of the AudioBufferSourceNode interface provides the ability to play back audio using an AudioBuffer as the source of the sound data. Finally, let’s play the audio.</li>
</ol>

## Server-side code to convert text to an AudioBuffer

Since I’m writing JavaScript code on the back-end for Node.js, I can make use of a Google Cloud client-side SDK for [TTS](https://www.npmjs.com/package/@google-cloud/text-to-speech).

Run <code>npm install @google-cloud/text-to-speech</code> to install the latest package in your project. Once you downloaded the package, you can require the package in the top of your code:

<code>const textToSpeech = require(‘@google-cloud/text-to-speech’);</code>

First, I instantiate the **TextToSpeechClient()** from the textToSpeech npm package. Then create a request object, which contains settings such as the voice language, voice gender and the audioEncoding. [Here’s an overview of all the settings](https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_).

``` JavaScript
    let ttsClient, requestTTS;
    ttsClient = new textToSpeech.TextToSpeechClient();
    requestTTS = {
        voice: {
            languageCode: 'en-US', //https://www.rfc-editor.org/rfc/bcp/bcp47.txt
            ssmlGender: 'NEUTRAL' // ‘MALE|FEMALE|NEUTRAL’
        },
        audioConfig: {
            audioEncoding: encoding,    //’LINEAR16|MP3|AUDIO_ENCODING_UNSPECIFIED/OGG_OPUS’
        }
    };
```

This part finally makes the **synthesizeSpeech** call, which is asynchronous, the await operator is used to wait for a Promise, from the response, I return the audioContent that contains the audio buffer:

``` JavaScript
    async function textToAudioBuffer(text) {
        requestTTS.input = { text: text }; // text or SSML
        const response = await ttsClient.synthesizeSpeech(requestTTS);
        return response[0].audioContent;
    }
```

## TTS in Dialogflow

Dialogflow, the tool to create chat agents, can also return AudioBuffers once it detected the intent. You would only need to specify an **outputAudioConfig** in the Dialogflow [DetectIntentRequest](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#detectintentrequest), in order to also get an AudioBuffer as part of the response:

``` JavaScript
    outputAudioConfig: {
        audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
    },
```


[You can follow this guide, for the full code.](https://cloud.google.com/dialogflow/docs/detect-intent-tts?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_) To play it in the browser, you can use the same instructions as I showed, when working with the Text to Speech API directly.

The back-end listens to the ‘tts’ event, which was fired from the client-side.

You can find the full creation of the [Express server code here](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/examples/simpleserver.js). In case you want to run this yourself. Call the method: **textToAudioBuffer**() it will pass the string text as a parameter, and it returns a Promise to chain a function that passes the response (which eventually will be the AudioBuffer), to the client-side via Socket.IO emit:

``` JavaScript
    ss(client).on('tts', function(text) {
        textToAudioBuffer(text).then(function(results){
            console.log(results);
            client.emit('results', results);
        }).catch(function(e){
            console.log(e);
        });
    });
```

**Caution**: Be aware of using Dialogflow detect intent on streaming audio. When you use simple detectIntent calls without streaming, you stop the microphone and you will play the TTS audio buffer. However, when you do streaming, you keep your microphone open. You don’t want to end-up in an endless loop, where the speech synthesizer records new streams based on the TTS response, through your microphone. :-)

The [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode) has an onended event handler. Which will run once the AudioBufferSourceNode stopped playing the audio. In case you want to solve the above problem, you could set a **boolean flag; isPlaying**, which should block the recorder from sending the stream to the back-end when it’s set to true.

Congratulations! By reading this blog series, you now know how to build an end-to-end solution for streaming audio from a microphone to a server, and stream & play the audio results back in the browser!

Do you want to play around with these examples? I am [hosting a web demo online](http://selfservicedesk.appspot.com/). Also I’ve [a video recording of one of my conference talks](https://youtu.be/6JD8WC1LV7g)!

![Lee presenting this content](conference.png)
