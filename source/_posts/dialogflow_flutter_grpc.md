---
title: Google Cloud, Dialogflow gRPC APIs The Hidden Manual for building a Flutter Dart integration
description: Learn how to use the gRPC API in Google Cloud. E.g., Dart & Flutter on Google Cloud, to stream audio data with Dialogflow on native mobile apps.
tags:
  - gRPC
  - Using gRPC APIs in Google Cloud
  - Dart on GCP
  - Flutter on GCP
  - Dialogflow gRPC
  - Dialogflow Flutter package
  - grpc vs rest
  - grpc advantages and disadvantages
categories:
  - APIs
featured: dialogflow_flutter
date: 2021-03-14 12:00:00

---

Learn how to use the gRPC API in Google Cloud. My usecase is to use Dart & Flutter on Google Cloud, to stream audio data with Dialogflow for native mobile Android & iOS apps.

<!--more-->

## Flutter & Dart on GCP to build streaming audio apps with Dialogflow

Are you a developer, and want to integrate one of the Google Cloud products in your web app or software? You are probably using the client-side GCP libraries. I guess the majority of developers on Google Cloud are using these. When you are a data scientist, you will likely use the Python library; when you are an enterprise developer, chances are you rather use the client-side library for Java. Web developers (like me) choose Node.js, and Go is also very popular. We also support C#, PHP, and Ruby.

This week, I wanted to build a native mobile app that integrates Dialogflow to build a chatbot. It needs to use the device microphone so that I can do some audio streaming. I want to support Android and iOS devices and additionally Web, macOS, and Windows as a nice to have. **Flutter 2** is the language of choice, as I only need to write my code once, and I don’t need to learn new programming languages. That said, I am actually new to Flutter, but as an ex [Sencha](https://www.sencha.com) engineer & technical trainer, I’ve noticed that the component & OOP concepts are very similar, so it was easy to use.

What’s the first thing that you do when you generated a fresh new project? Right, you will look on the [pub.dev](https://pub.dev/) (Dart & Flutter package management) website to see which Google Cloud & Dialogflow libraries you can use. And that’s where I discovered that (until now) there were no official Google packages available. Okay, then let’s dive into some of the open-source packages for Dialogflow that are available. I quickly discovered that no one of these packages supports audio streaming (the Dialogflow streamingDetectIntent call). The reason for this is simple, all the Dialogflow packages on pub.dev are making use of the underlying REST APIs. REST doesn’t support streaming. (You make a call over HTTP, and you are waiting for the request to complete. The browser won’t communicate progress, you will either get a success/error response, or you can expect a time-out if it takes too long. - When you use audio streaming, you basically keep the connection open to stream the audio chunks. This is something REST can’t do.) Fine, so that brings me to a conclusion, that I will have to build a Dialogflow package myself using gRPC.

I have always been staring at the [gRPC reference docs](https://cloud.google.com/dialogflow/es/docs/reference/rpc) in Google Cloud. I have done this a lot, as all the client-side APIs use gRPC, and often their documentation points to the Google Cloud docs. But I always wondered how you would implement the gRPC calls yourself. I couldn’t find any documentation on how to do so. Am I the only one who doesn’t know how this works, or are these docs just there to support the client-side libraries? Well, it seems there is some documentation missing. After researching, I figured out how this works, and I managed to build [my own Dialogflow gRPC package for Dart & Flutter](https://pub.dev/packages/dialogflow_grpc).

<img src="/images/dialogflow_flutter.png" alt="Dialogflow Flutter" width="390"/>

Let me explain to you how you can build your own integrations with gRPC on Google Cloud.

## About gRPC

In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. In my case, the mobile Flutter app is the client, and Google Cloud the server.

As in many RPC systems, gRPC is based on defining a service, specifying the methods that can be called remotely with their parameters and return types. Google Cloud (Dialogflow) implements this interface and runs a gRPC server to handle client calls. On the client-side, the client has a stub that provides the same methods as the server.


![How gRPC works](images/grpc.png "How gRPC works")

By default, gRPC uses [Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview), Google’s mature open source mechanism for serializing structured data (although it can be used with other data formats such as JSON).

When working with protocol buffers, the first step is to define the structure for the data you want to serialize in a _proto file_: this is an ordinary text file with a .proto extension.

[GoogleApis](https://github.com/googleapis/googleapis) provides proto files for all the Google and Google Cloud APIs. Protocol buffer data is structured as _messages_. Each message is a small logical record of information containing a series of name-value pairs called _fields_, which contain a field name (Dialogflow property) and a tag number. Let’s have a look at the Dialogflow [session.proto](https://github.com/googleapis/googleapis/blob/master/google/cloud/dialogflow/v2/session.proto) file to understand:


```
// The message returned from the DetectIntent method.
message DetectIntentResponse {
  string response_id = 1;
  QueryResult query_result = 2;
  google.rpc.Status webhook_status = 3;
  bytes output_audio = 4;
  OutputAudioConfig output_audio_config = 6;
}
```

With a .proto file, you can use a protocol buffer compiler called: **protoc** to generate data access classes in your preferred language(s) from your proto definition. These provide simple properties like queryResult and methods to retrieve the value .getField(int tagNumber) or to serialize/parse the whole structure to/from raw bytes. .toProto3Json();

So for my Flutter app, I will need to compile the Dialogflow protos to .dart files. Let’s give it a try!


## Working with gRPC and Dart/Flutter in Google Cloud

Create a folder **_proto** on your hard drive, in this folder, clone the following repositories. These are the repositories you will use each time you generate code:


```
git clone https://github.com/googleapis/googleapis
git clone https://github.com/protocolbuffers/protobuf
```

Also, create a **lib/src/generated** folder inside the **_proto** folder.


### **Install the tools**

For this example, you will obviously need Dart & Flutter on your machine.

I am using Flutter 2. and Dart 2.12.1

And as explained before, you will need the **protoc protobuf compiler**. 

Follow the steps from [https://grpc.io/docs/protoc-installation/](https://grpc.io/docs/protoc-installation/)

**Note: On macOS, this will install protoc to /usr/local/bin/protoc. Make sure you have version 3.15 or higher installed. (run protoc --version). Else remove protoc and re-install.**

```
brew reinstall protobuf
```

By default this will work for Java, Python, JS, PHP, Ruby, C#, and Objective C.

To do this for Dart, you will need an additional plugin (**[protoc-gen-dart)](https://pub.dev/packages/protoc_plugin)**, which you can install using the following command:


```
$ pub global activate protoc_plugin
```


Make sure you are downloading version 20.0.0 or higher.

Update your PATH so that the protoc compiler can find the plugin:



```
$ export PATH="$PATH":"$HOME/.pub-cache/bin"
```

## Making use of the Dialogflow gRPC APIs

First, make sure you have the Dialogflow API enabled:


```
gcloud services enable dialogflow.googleapis.com 
```


We will compile the Dialogflow protos to Dart files, from the googleapis repo.

Therefore, first set the following environment variables, where you point to the location on the two cloned repositories:


```
export PROTOBUF="$HOME/Documents/GitHub/_proto/protobuf"
export GOOGLEAPIS="$HOME/Documents/GitHub/_proto/googleapis"
```


Then save the below **generate-protos.sh** bash script in the **_proto** folder:

{% gist 19fcdc735ecd613faaaf13e5a2a5864e %}

and execute it: 

```
. generate-protos.sh
```

Then copy the **generated**folder to your Dart/Flutter projects **src/lib folder.**

Once the generated files are in your Android project. You can start using the RPC API. You can find the RPC reference documentation online:

[https://cloud.google.com/dialogflow/es/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.Sessions](https://cloud.google.com/dialogflow/es/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.Sessions)

For example, it's possible now to make use of SessionsClient(), it will import the following dart files:


```
import 'package:flutter_dialogflow_agent/generated/google/cloud/dialogflow/v2/audio_config.pb.dart';
import 'package:flutter_dialogflow_agent/generated/google/cloud/dialogflow/v2/session.pb.dart'
```


When you get started, you will probably be pleased just to see text messages going back and forth. But eventually, you will probably want to add rich responses such as buttons, clickable hyperlinks, cards, and other such rich responses.

The general approach for detecting intents in Dialogflow is a follows:


1. You will need a service account, which the Dialogflow gRPC API will need so your application can access APIs on behalf of a user or using a service account.
2. Choose which version of the API you want to make use of, V2, V2beta1, CX, or CX beta.
3. The Dialogflow [SessionClient](https://cloud.google.com/dialogflow/es/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.Sessions) lets you detectIntents, so you will need to create a SessionClient, which contains a sessionPath, containing the Dialogflow Project Id (so it talks to your chatbot) and a unique session string for each session. (This is also important when you want to log and find chats per session at some point.)
4. Make the [detectIntent](https://cloud.google.com/dialogflow/es/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.DetectIntentRequest) calls; it needs at least the session path and the query input, such as text and a language code.
5. You can get the fulfillment text out of the queryResult from the [detectIntentResponse](https://cloud.google.com/dialogflow/es/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.DetectIntentResponse).


## Conclusion: when to use the client-side library vs. REST. vs. gRPC?

You can access the Google Cloud APIs via REST, gRPC, or one of the provided client libraries (built on gRPC). 


### **Client-side library**

If the client libraries support your desired programming language (see the ones listed above), you should use this option. These libraries are maintained by Google, have built-in authentication and retries, and make efficient HTTP request bodies.

Else, you have to choose between REST or gRPC.


### **REST**

The advantage of **REST** is that you can create a simple JSON interface. Rest stands for “Representational State Transfer”. It is a set of rules that developers follow when they create their API. One of these rules states that you should be able to get a response when making a request. A request is made up of four things: the endpoint, the method (GET, POST, PUT, PATCH or DELETE), the headers, and the data (body). The language of your choice might already have a [googleapis](https://github.com/dart-lang/googleapis/tree/master/generated/googleapis) package, which can be used to make request requests.

Here’s an example that I have created to make detectIntent calls with the googleapis package, which is making use of REST under the hood:

[https://gist.github.com/savelee/7068e6cea695088bcf06031d9e435b48](https://gist.github.com/savelee/7068e6cea695088bcf06031d9e435b48) I’ve used the [googleapis_auth](https://pub.dev/packages/googleapis_auth) package to do the authentication.


### **gRPC**

gRPC is faster than REST, and as you have seen in my example, if the choice is between REST and gRPC, gRPC is the only streaming solution. But you will have to generate your own client from the Google-supplied protocol buffers, and you will also need to implement authentication.

I’ve built my own Dialogflow gRPC Dart / Flutter package this way.

When you want to build native Android or iOS applications, you can start using my package too!

[https://pub.dev/packages/dialogflow_grpc](https://pub.dev/packages/dialogflow_grpc)

 
