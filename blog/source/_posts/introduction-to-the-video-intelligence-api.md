---
title: Introduction to the Video Intelligence API
description: Learn how to use machine learning on videos and get insights with Google Cloud
tags:
  - Pre-trained Model
  - Machine Learning
  - Video Intelligence Api
  - ML
  - AI
  - Google Cloud
categories:
  - Machine Learning
alias: /developer/introduction-to-the-video-intelligence-api/
date: 2017-04-10 15:59:18
---

## Search and discover your media content with powerful Cloud Video Intelligence API 

Google Cloud Video Intelligence API makes videos searchable, and discoverable, by extracting metadata with an easy to use REST API. You can now search every moment of every video file in your catalog and find every occurrence as well as its significance. It quickly annotates videos stored in Google [Cloud Storage](https://cloud.google.com/storage/), and helps you identify key nouns entities of your video, and when they occur within the video. Separate signal from noise, by retrieving relevant information at the video, shot or per frame. You can try this out, yourself: 

<!--more-->

1. Open: [https://cloud.google.com/video-intelligence/#demo](https://cloud.google.com/video-intelligence/#demo) 
2. Select a sample video from the list, for example: **Volleyball Court**, (which is a video made at the Google Mountain View office). Notice the labels. 
3. Select another sample video from the list: **Google Work**.
4. Click on the **Shots** tab. Notice all the keywords detected from the video, which are being renewed per video shot! 
5. Click on the **API** tab. Notice how the JSON response would look like. 
6. Now, lets try it with one of my own videos, which I’ve uploaded as a public available video in Cloud Storage: **gs://leeboonstra-videos/mov_bbb.mp4** 

## Write metadata on video upload 

Machine Learning for videos, can be super interesting, in case you want to implement it within your own systems. Let’s say you host a lot of videos on your website. Instead of manually writing meta per video; you could create an ETL job, (for example through Cloud Functions), which listens to the upload event of Google Cloud Storage, runs the Video Intelligence API, and writes the metadata in a database. This looks like a great use case! Let’s see if we can build this! ### Getting Started To get started, open the GCP console, and create a new project. 

Go to: [https://console.cloud.google.com](https://console.cloud.google.com) and click: [Create new project](https://cloud.google.com/resource-manager/docs/creating-managing-projects), and enter an easy to remember project name, which will be used as the *project id*. 

You will have to remember this. The project id will have to be unique. For this workshop, it might be a good practice to prefix it with your **[firstname][lastname]** 

### Enable the Cloud Functions API 

Click on the menu button. **Cloud Functions > Enable API**. 

### Enable the Video Intelligence API 

Click on the menu button. **API Manager**. Search for: **Google Cloud Video Intelligence**. **API > Enable** Click **Credentials > Create Credentials > Service Account** Choose **New Service Account** Service Account Name: **demoapp** Role: **Project Owner** Choose **JSON** Click **Create** Click **Manage Service Accounts** Click the menu button (the 3 vertical dots), and select **Create Key** This will download the key on your local machine. Create a folder on your machine called: **cloudfunctions-videoapi**, and move the file over. ### Create storage buckets When you write the JavaScript code for the cloud function, you will need to upload it somewhere. Under the hood, GCP will create a container with a Node environment for you, so you can execute your function. You can upload function code, in a bucket of the Google Storage. Let’s create a bucket which contains function code. You can create the bucket via the Cloud Console (menu > **Storage > Create Bucket**), or from the command-line, on your local machine (if you have the gcloud sdk installed), or from your online terminal in the Cloud Console: `gsutil mb -p [PROJECT_ID] gs://[BUCKET_NAME]` *Create two buckets, with the name of your [project id] + **-functions-src**, and one [project-id]**-videos**. (This way, your bucket will be unique.)* After you’ve created the videos bucket, you will need to make this bucket public, so your video’s get gs:// public urls. You can do this by clicking on the menu button of the bucket (the button with the 3 vertical dots). Click **Add Item**: *User - allAuthenticatedUsers - Reader* Click **Save**. 

![Screenshot](/images/Screen-Shot-2017-04-10-at-4.57.56-PM.png) 

### Client Library 

Since the client node js library is still in Alpha at the time of writing, we will download the alpha version and host it locally. Once the library gets publically available, you can ignore the next step, and instead link to the online version of the client library. (See: [https://www.npmjs.com/package/google-cloud](https://www.npmjs.com/package/google-cloud)) Download the alpha node client library: [https://storage.googleapis.com/videointelligence-alpha/videointelligence-nodejs.tar.gz](https://storage.googleapis.com/videointelligence-alpha/videointelligence-nodejs.tar.gz) 

Unzip the package. Create a new folder inside **cloudfunctions-video**, called: **local_modules**, and move the **videointelligence** folder into it. Create a cloudfunctions-video/**package.json** file. It should contain the following contents: ``` { "name": "videoapi", "description": "Webservice VideoAPI", "version": "0.0.1", "private": true, "license": "Apache-2.0", "author": "Lee Boonstra", "engines": { "node": "~4.2" }, "dependencies": { "@google-cloud/videointelligence": "file:local_modules/videointelligence", "dotenv": "^4.0.0" } } ```

### Create a Cloud Function 

Create a new hidden **.env** file, and give it the following content: ``` ENV=production GCLOUD_PROJECT=[project-id] GCLOUD_KEY_FILE=./[path to json service key file] ``` Afterwards, create the **index.js** file with these contents: https://gist.github.com/savelee/48d8642ffe0a99348cfeca56485181c2 

### Deploy your Cloud Function 

On the command-line, enter the following: ``` $ gcloud beta functions deploy [name-function] --stage-bucket [bucket name of the function-src bucket] --trigger-bucket [bucket name of the videos bucket] ``` For example: ``` $ gcloud beta functions deploy videoapi --stage-bucket leeboonstra-functions-src --trigger-bucket leeboonstra-videoapi ``` ### TimeOuts The way how the video api works, is that it first will read in the video to the memory. The machine learning under the hood, is similar to Google’s Cloud Vision API, which can detect what’s on an image. But for the Video Intelligence API this works per frame. Cloud functions can timeout. You will need to specify a timeout in seconds. By default it’s set to 60s. A number between 1 and 540 (9min) is required. A video with a long duration, will likely make that the cloud function will timeout. So becareful. You can either setup, the timeout in the **Cloud Functions /  **Logging** 

### Conclusion 

By now, you managed to test the Video Intelligence API with your own JavaScript code, within a cloud function based on file upload in a bucket. The power of this cloud function, is that you could easily build an application around this, which makes use of microservices (cloud functions). It wouldn’t be much work to create an interface (for example with Sencha Ext JS, or just with plain HTML, CSS and JavaScript), which shows a list of video’s and the tags. I’m logging the tags in the logs of Stack Driver. But instead I could save it in the data store. I could create another cloud function, based on an HTTP trigger which loads the data of the datastore and displays it in the front-end list. Another idea could be, to pass in the results of the Video Intelligence API into another Machine Learning API, such a translate. To translate the keywords to a different language, before saving it in the database. *TIP: In case you don’t want English meta data, it’s also possible to put the Translate API right after the Video Intelligence API call!* 

<iframe src="https://player.vimeo.com/video/213039480" width="640" height="420" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/213039480">Video Intelligence API</a> from <a href="https://vimeo.com/user13471554">Ladysign</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

### Resources

* [Cloud Functions Docs](https://cloud.google.com/functions/docs/reference) 
* [Video Intelligence Demo](https://cloud-ml-video.appspot.com/index_v1beta1.html)