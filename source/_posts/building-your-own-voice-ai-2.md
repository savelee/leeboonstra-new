---
title: Building your own conversational voice AI which streams audio from a browser microphone to a server (part II)
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
featured: architecture2
date: 2021-01-02 10:00:00
---

This is the second blog in the series:
A best practice for streaming audio from a browser microphone to Dialogflow & Google Cloud Speech To Text.

[In this first blog, I have introduced all the conversational components, and I addressed why customers would integrate their own conversational AI compared to building for the Google Assistant](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-1/).

Today, I will make a start by building a client-side web application which uses a HTML5 Microphone with WebRTC, streaming the audio bytes to a Node.js backend.

<!--more-->

Later in this blog series, I will show you how to use the Google Cloud Conversational AI APIs to transcribe texts or to return answers with Text to Speech.

These blogs [contain simple code snippets](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples), and a demo application; [the Airport Self Service Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming/), which will be used as a reference architecture.

Let’s start with the creation of the client-side HTML & JavaScript code. Whether you want to transcribe voice to written text (STT), or use voice to trigger a chatbot agent to answer (Dialogflow), the client-side code base is very similar.

![Architecture](architecture2.png)

## Client-side WebRTC Implementation

Here are some code snippets, which you can run to play around with this.

You can run these examples, by cloning this repository. [The instructions are written here](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples).

* [Client-Side Code: DetectIntent](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples/example1.html) — Dialogflow
* [Client-Side Code: Transcribe ](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples/example4.html)— STT

These examples make use of the following JavaScript libraries:

* [Socket.io](https://www.npmjs.com/package/socket.io) — Socket.IO enables real-time bidirectional event-based communication.
* [Socket.io-Stream](https://www.npmjs.com/package/socket.io-stream) — for binary stream transfers through Socket.io
* [RecordRTC](https://github.com/muaz-khan/RecordRTC) — RecordRTC is WebRTC JavaScript library for audio/video as well as screen activity recording.

In these demos I am using 2 buttons, a start recording and a stop recording button.

Also I have created a textarea field, which later will display the results.

```
    <div>
    <button id="start-recording" disabled>Start Recording</button>
    <button id="stop-recording" disabled>Stop Recording</button>
    </div>
    <textarea id="results" style="width: 800px; height: 300px;"></textarea>
```

In case you want to see an end-to-end example, please have a look into the [Airport Self Service Kiosk demo](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/client/src). It’s an Angular web app, which contains one record button which needs to be pressed once, to record audio streams. It will display the results in the middle of the screen.

![Front-end Code: Airport Self Service Kiosk demo](selfservicedesk.png)

I wrote some JavaScript code, which is embedded in the HTML simple example:

{% gist 42da2831f9451dd9c5c54e11a89a9179#file-index-js %}

1. First I will create some pointers to the start & stop buttons.
2. Next, I am instantiating socket.io, and I am opening a connection.
3. I’ve created 2 event listeners for starting and stopping the recording. The start button onclick event, will disable the start button, so you can’t press the button twice and therefore record audio twice.
4. [navigator.getUserMedia()](https://www.html5rocks.com/en/tutorials/getusermedia/intro/) is an important part of the code. It’s part of a set of WebRTC APIs which provides the means to access the user’s local camera/microphone stream. In our case, we only use the microphone (**audio: true**). This gives us access to the stream.
5. Now, I am making use of the library RecordRTC. I could have chosen to write this part of code by myself. But RecordRTC solves a lot of complicated stuff. Such as converting buffers (from Float32 to Int16), cross browser support, etc.
6. RecordRTC takes 2 arguments. The first argument is the MediaStream from the getUserMedia() call. The second argument is a configuration object, with settings to optimize the stream.There are a couple of important settings that I am making, which should be in line with your settings, later in the server side code (Documentation for [InputAudioConfig](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2beta1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#google.cloud.dialogflow.v2beta1.InputAudioConfig) in Dialogflow or [RecognitionConfig](https://cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v1?utm_source=blog&utm_medium=partner&utm_campaign=CDR_lee_aiml_leedialogflowblog_personal_#recognitionconfig) in STT):

* The mimetype is set to **audio/webm** — which would be a good setting when using **AUDIO_ENCODING_LINEAR_16** or **LINEAR16** as an AudioEncoding config in Dialogflow or STT.
* The sampleRate is the input sampling frequency in hertz. I am resampling it to 16000Hz (desiredSampleRate) so the size of the messages over the network will be smaller, and match the sample herz setting in my Dialogflow or STT calls.
* Also Dialogflow & STT require mono sound, which means, I should set the numberOfAudioChannels to 1. RecorderType StereoAudioRecorder allows me to change the number of audio channels from 2 to 1.

## Record Single Utterances

Short utterances / detect intent. This means your end-user presses a record button, speaks, and when they press stop, we collect the audio stream to return results. In your code, this means once the client web app collects the full audio recording, it sends it to the server, so the server can do a call to Dialogflow or the Speech to Text API. For this use case, the magic will be in the stop button onclick event listener:

{% gist 954802a2afaf64d6a2b5d637f0a40410#file-index-js %}

 1. When you click stop, it will first reset the buttons, then stop the recording. And while stopping the recording, in a callback function, it will request the audioDataURL which is part of the [RecordRTC API](https://recordrtc.org/). This will return a string dataURL, with a Base64 string that contains your audio stream. This long string looks like this: **data:audio/wav;base64,UklGRiRgAgBXQVZFZm10IBAAAAABAAEARKwAA**
 2. We can create an object from it, which also sets the audio type, and then we are sending it to the server, with socket io: **socketio.emit(‘message’, files);** We will set a name. Once the server makes a connection to this socket, it will look for the ‘message’ event name, to respond on. And it will receive the files object.
 3. The last part of this script will run once the server made a call to Dialogflow / Speech API and made a websockets call back to the server to return the results. In this example, I am just printing the results in a textarea box. For Dialogflow, the **fulfillmentText** is part of the queryResult. When using STT, you want to print the **transcript** string from the **alternatives** array.

## Record Audio Streams

Recording streams means your end-user presses the record button, speaks, and will see the results on the fly. When detecting intents with Dialogflow, it could mean that it will detect better matches once you have spoken more, or it could collect multiple results. In your code, this means the client starts making a bi-directional stream and streams chunks to the server so the server can make a call with event listeners on incoming data and thus it’s real-time.

You might choose this approach because the audio you are expecting is long. Or in the case of Dialogflow, you might want to show intermediate results on the screen, in real time, while speaking. In this case, you don’t need the stopRecording callback function, which sends the base64 URL string to the server. Instead it will send the stream to the server in real-time!

Have a look into the following examples:

Client-Side Code: [DetectStreamingIntent](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/examples/example2.html) — you can run these examples, by cloning this repository. [The instructions are written here](https://github.com/dialogflow/selfservicekiosk-audio-streaming/tree/master/examples).

{% gist 9283fd2abea90bae44d5dc2fce0bfe29#file-index-js %}

The magic in this case, is in the RecordRTC object and the **ondataavailable** event listener:

 1. First, you will need to set a **timeSlice.** The timeSlice sets intervals for creating audio chunks. In the case of Dialogflow, you likely might not want to detect the intents each second (as you might not be finished speaking a sentence), and rather build in a timer. timeSlice is set to **milliseconds**, so I am using 4000 (4 seconds).

 2. Then there is the **ondataavailable** event listener, which gets triggered once there is data, and will contain chunks of blobs (audio buffers), in my case every 4 seconds.

 3. Here’s where **socketio-stream** comes in. I am making use of bi-directional streams (i’m sending a stream with chunks every 4 seconds, but I also might want to receive results from the server in between). So I am creating the stream, which will be temporarily stored on my local drive. with **ss(socket).emit()** I am streaming it to the server, and while I do so, I am piping the audio buffer into the stream. The purpose of **stream.pipe()** is to limit the buffering of data to acceptable levels such that sources and destinations of differing speeds will not overwhelm the available memory.

In case you want to see an end-to-end example, please have a look into the [Airport Self Service Kiosk demo microphone class](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/client/src/app/microphone/microphone.component.ts). It’s written in TypeScript, which implements the HTML5 microphone.

## Running your app on iOS

When running your application on iOS devices, you might run into various problems. First of all, iOS doesn’t support the JavaScript **getUserMedia** and WebRTC methods in any other mobile browser than Safari.

In my application, [I’m showing a pop-up when it’s opened on an iOS browser other than mobile Safari](https://github.com/dialogflow/selfservicekiosk-audio-streaming/blob/master/client/src/app/app.component.ts).

To make use of the getUserMedia() WebRTC method, you will need to allow the permissions popup, which only shows up once running from **HTTPS**.

One important limitation remains on iOS: Web Audio is effectively muted until user activation. To play and record audio in iOS, it requires a user interaction (such as touch start).

That’s it for now. [In the next blog of this series, I will receive the audio bytes on the server-side, so I can use this to make Dialogflow Detect Intent or Speech to Text transcribe calls!](https://www.leeboonstra.dev/Chatbots/building-your-own-voice-ai-3/)
