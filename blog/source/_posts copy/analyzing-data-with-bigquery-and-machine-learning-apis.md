---
title: Analyzing data with BigQuery and Machine Learning APIs
description: Learn about data science and machine learning on Google Cloud Platform.
tags:
  - BigQuery
  - Cloud launcher
  - Compute Engine
  - GCP
  - Natural Language API
  - Translate API
  - Virtual Machines
categories:
  - Google Cloud Platform
alias: /developer/analyzing-data-with-bigquery-and-machine-learning-apis/
date: 2017-03-18 08:00:31
---

## Forecast the Dutch elections based on social media presence. 

Wednesday the 15th of March 2017, was a big day for the Netherlands, at that day it was the Dutch general election, where the Dutch elected members of the house of representatives. The House of Representatives (the Second Chamber) is composed of 150 seats elected by proportional representation in a single nationwide constituency. There are 28 political parties, where the Dutch can vote the members from. Since I recently started working with Google Cloud Platform, I thought it would be a great idea, to predict the winning political party based on social media presence and sentiment. This idea is based on the blog post of Sara Robinson: [Comparing tweets about Trump & Hillary with natural language processing.](https://medium.com/google-cloud/comparing-tweets-about-trump-hillary-with-natural-language-processing-a0064e949666)

<!--more -->


This blog post will contain the following technical pieces: 

* **Compute Engine** (1) - To deploy our data scraping script on a VM. 
* **Machine Learning APIs** - To use Natural Language API (4) to understand the context of the data, and since our data is in Dutch (and the Natural Language API doesn’t support the Dutch language yet), we will need the Translate API (2) to translate. 
* **BigQuery** (5) - To collect a lot of data. To analyze this data we use BigQuery and run some queries on it. 
* **DataStudio** - To visualize our result set, we will make use of Google’s Data Studio (6). We can use some nice charts! 

To do the social media data scraping, we use the **Twitter Streaming API**. The application code is written in JavaScript for Node.js. Let’s get started with this tutorial, and see if we can predict which Dutch political party will win the elections!

![Application Architecture with the various Google Cloud solutions](/images/analyze-bq-ml-1-500x300.png)

*NOTE: This blog post won’t contain any political opinions from me, neither from Google. This is a blog post to demonstrate the various solutions of the Google Cloud Platform, on how you can be creative with data. Please see the [disclaimer](#disclaimer), at the end of this article.* 

### Prerequisites 

* [Node JS](https://nodejs.org/en/) 
* Node [Express](http://expressjs.com/) framework ( `$ npm install express --save `) 
* A GCP Account (or create a [free trial account](https://cloud.google.com/free-trial/)) 

## Getting Started 

To get started, open the GCP console, and create a new project. 
Go to: [https://console.cloud.google.com](https://console.cloud.google.com) and click: [Create new project](https://cloud.google.com/resource-manager/docs/creating-managing-projects), and enter an easy to remember project name, which will be used as the project id. You will have to remember this. 
Next, on your local machine, generate an empty Node Express application: `$ express` 

*NOTE: Technically, for this demo, you don’t need Express, since Express is a Web framework for Node.js. I choose it though, since I prefer working from this folder structure. My code will be future proof, should I ever plan to port it to a web app.* Once, the generation is done, you can open the **package.json** file, and add the following lines of code dependencies: 

```json 
"dotenv": "~4.0.0", 
"google-cloud": "~0.47.0", 
"user-stream": "~0.0.8", 
"nodemon": "~1.11.0", 
```

After, you are done; run the following command in your terminal: `$ npm install` Go back to the [GCP console](https://console.cloud.google.com/) and click the hamburger menu icon, and select: **IAM > Service Accounts > Create Service Account** Service account name: **nodeapp** Role: **Project > Owner** Click: **Create > Close** Click the **button with the 3 dots** next to nodeapp, to open an extra menu. Select: **Create key**. Choose **JSON**. Click **Create**. A key has been saved to your local machine. Rename this -.json file, as: **cloudkey.json**, and copy it into your freshly generated Express app, root folder. Also, create an **.env** file in the root of your Express app folder. It should have the following contents: `GCLOUD_PROJECT= GCLOUD_KEY_FILE=./cloudkey.json`.

Later in this tutorial, you will also need to add the keys for the Twitter Streaming API in here. ## Twitter Streaming API The [Twitter Streaming APIs](https://dev.twitter.com/streaming/overview) give developers low latency access to Twitter’s global stream of Tweet data. A streaming client that pushes tweets, without any of the overhead associated with polling a REST endpoint. Exactly, what we need, to monitor the Twitter newsfeed during election day, so we can see which party is popular on Twitter. We will need to create a [Twitter API account](https://dev.twitter.com/resources/signup). (and if you don’t have Twitter, also a Twitter account). With the Twitter API account, you can create an application, and generate the tokens. These tokens, you will need to copy to the **.env** file in the root of your Node project. It has the following contents: `CONSUMER_KEY= CONSUMER_SECRET= ACCESS_TOKEN_KEY= ACCESS_TOKEN_SECRET=` 

Create a folder called: **lib** Create the following file in the **lib** folder: **twitter.js** The **twitter.js** file will contain the following content:

{% gist bf0afb23c5a6606c8aa3b1afbe49f873 %}

Now you can start testing your twitter stream. In your terminal run the following command from your Express root folder: `$ node bin/www` Now, look in your terminal, you should see the data based on your search terms streaming in. To close the data stream hit **CTRL + c**. 

## Machine Learning APIs 

Nice all that data, but how will we know that people are talking good or bad about a certain political party? Just counting all the tweets, wouldn’t be the correct thing to do, we actually need to understand the context of the data. Hmm, how can we automate this? For this, you can actually use machine learning. Machine learning is not only for data scientists and experts, you and I can make use of it as well. The Google Cloud platform provides a bunch of APIs which are easy to use. Think about machine learning APIs such as: *Speech API* (which can convert speech to text), *Vision API* (which can get insights from pictures), *Translate API* (to translate text to a certain language), *Video Intelligence API* (to retrieve metadata from videos) and *[Natural Language API](https://cloud.google.com/natural-language/)* (to derive insights from unstructured text). Google is planning to release much more machine learning APIs to the cloud platform, and on top of that; if you are a data scientists you could write your own machine learning models. The last mentioned API is what we need to understand pieces of our Twitter data. However...

Unfortunately, the NLP API won’t understand the Dutch language yet. So here’s the test case: Would it work if we translate the text from Dutch to English first? Afterall, the only thing we need to know is if the context of the tweet is positive or negative. Let’s give it a try. We make use of the [Translate API](https://cloud.google.com/translate/) first, afterwards the Natural Language API. Later, we will store in BigQuery the original tweet, but with a ranking total score column. Go to the [cloud console](https://console.cloud.google.com) and click on the **menu** (hamburger) button. Click **API Manager > Dashboard** and click **Enable APIs**. Click **Natural Language API** from the Google Cloud Machine Learning API section. Click **Enable**. Go back to the previous screen, and select **Translation API** and hit **Enable** again. In the **lib** folder, create the following file: **ml.js** which contains these contents: (see the comments in the JavaScript code for further explanation). 

{% gist fb2c637e981ae582aeae520d01c4a3d3 %}

In **twitter.js**, add the following line somewhere in the top of the file: 

``` JavaScript 
var path = require('path'); 
var machinelearning = require( path.resolve( __dirname, "ml.js" ) ); 
```

You can test the MachineLearning APIs by adding the following example code lines to the end of the file: 

``` JavaScript 
getSentiment('I love Milkshakes', function(results){ 
  console.log(results.sentences); 
}); 
getTranslation('Ik houd van Milkshakes.', function(results){ 
  console.log(results); 
});
```

The sentiment score is a number between -1.0 (negative sentiment) and 1.0 (positive sentiment). The magnitude is a non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment regardless of score (positive or negative). To change the language, change the `from` input parameter on line 11, to another language, such as `es` for Spanish, or `fr` for French. Feel free to play arround with it, and pass in different text strings, or language API settings. From the terminal run: `$ node bin/www` Now, you will have to add these pieces of code, within the `stream.on()` function, right after the `console.log` line. (let’s say line 42). This will be a callback, in a callback, in a callback... *pffff*. ...and we also need to bind to the original scope! So I solved it this way: 

{% gist 89d57616b54474134106db24211f3ae5 %}

Once done with it, start the node app again. You should see the Twitter lines, streaming in, with translations and sentiment detection. The next step will be to push these data into BigQuery! 

## BigQuery 

The next challenge is to store this data in the BigQuery storage in the Google cloud. BigQuery is a fast, economical and fully-managed enterprise data warehouse for large-scale data analytics. BigQuery can query terabytes of data in seconds and petabytes in minutes! The code to save the data in BigQuery is not so difficult. Please have a look:


{% gist 11490d86a942f0b0acb83b55009cac95 %}


In **twitter.js** you will need to require the file: 
``` JavaScript 
var bigquery = require( path.resolve( __dirname, "bigQuery.js" ) );
```

And within the most inner callback (on line 127), you can enable the `insertBq()` method: 

``` JavaScript
bigquery.insertInBq(row); 
```

Run the node app for a while. This will load new content into BigQuery. We can now run a bunch of queries to analyze our data. Click **Compose Query**, write: 

``` sql
SELECT SUM(score) as totalscore, party, COUNT(party) as totalparties 
FROM dutchelectionstweets.dutchelections GROUP BY party ORDER BY totalscore DESC 
```

This query, will sum the *total sentiment score* per party. Also, it counts and it groups the parties. Click **Run**, to run the query. You will see the results in the table below. When the results look ok to you, you can save the view. This will create a new view (which is like a table, but it includes the query). It contains the unique result set. We will need this later for Data Studio. Let’s create a few more views. Such as the 3 most positive parties: 

``` sql 
SELECT SUM(score) as totalscore, party FROM dutchelectionstweets.dutchelections 
GROUP BY party ORDER BY totalscore DESC LIMIT 3 
```

The total amount of tweets per party: 

``` sql 
SELECT party, COUNT(party) as totalparties FROM dutchelectionstweets.dutchelections 
GROUP BY party ORDER BY totalparties DESC
```

And the total amount of tweets: 

``` sql 
SELECT COUNT(text) as totaltweets FROM dutchelectionstweets.dutchelections 
```

In case you want to browse through all the tweets you can use: 

``` sql 
SELECT text, party, score FROM dutchelectionstweets.dutchelections 
```

### Data Studio

Instead of displaying the results in *"boring"* tables, we could very easily display the result sets in charts. I’ve used [Google Data Studio](https://datastudio.google.com) for this. 

![Image](/images/analyze-bq-ml-2-500x250.png)

When you drop a chart on the stage, you will need to **Create a new Data Source**. Which you can set to **BigQuery Connector**. From there, you select your project, your dataset, and then your table set or table views. From that moment, you can start using all your data within the Studio. You can easily refresh the data, by clicking on the **Refresh Data** button: 

![Refresh data in Data Studio](/images/analyze-bq-ml-3.png) 

With Google Data Studio you can drag and drop charts, images and visualizations on the stage. It turns your data into informative dashboards and reports which are easy to read and share. Google Data Studio is currently in beta. It’s not part of Google Cloud Platform, it’s a Google Analytics solution. You can read more about this tool on: [https://www.google.com/analytics/data-studio/] 

## Compute Engine / Cloud Launcher 

Ok, so we’re done with writing the code to fetch and analyze our data! Although you could keep your terminal open on your local machine for a full day, it’s not ideal. At the end, this process will take some processing power. A better use case would be to move it to a virtual machine.

![Image](/images/analyze-bq-ml-4-500x166.png)

Let’s create a virtual machine. Open the [Cloud console](https://console.cloud.google.com/) in your browser. You could create a virtual machine, manually yourself by clicking the **Compute Engine** menu option. But since we need an image which requires Node.js installed, we will do it the easy way, instead make use of **Cloud Launcher**! 

1. Click [https://console.cloud.google.com/launcher/] 
2. Search for **Node.js** 
3. Choose the 2nd Node.js image, (the one from **Bitnami**.) 
4. Click the **Launch on Compute Engine** button. 
5. Specify a name, and a zone (I am in Europe, so I choose **europe-west-1b**) 
6. Choose **micro machine** type. 
7. Hit the **Deploy** button. Notice, how fast it will launch this virtual machine for you! 

After you deployed the Bitnami Node.js app, you will see the IP address where your VM will be available. There’s an **SSH** dropdown. Hit it, and click **View SSH command**. It will show you the command that you can paste in your local terminal. For example: `gcloud compute --project "myproject" ssh --zone "europe-west1-b" "nodejs-1-vm"` This will log you in on the virtual machine. When you run this command the first time, you will need to create a passphrase. It will automatically create a public key on your machine. Once you’re logged in, you can verify if nodejs was properly installed. Enter: `$ node -v` It should output the nodejs version number. 

The next step is to transfer our project on this virtual machine. You can use Github for this, or you can use Google Cloud Development repositories. (I choose Github, since I want to share my public Github repository, with you. When you have your own project running locally on your machine, you can follow the steps from the **Development** screen instead.) Pull the code, from some repository in the root of your vm: `$ git clone https://github.com/savelee/gcloud-bq-election-demo.git` 
Navigate into the folder: `$ cd gcloud-bq-election-demo/` 
Install all the nodejs packages: `$ npm install` 

We aren’t done yet! We need to have all our keys available on the virtual machine. That’s the **.env** file and the **cloudkeys.json** file. Obviously, I didn’t put these files in my public Github repo. Hmm, so how can we move these files to the VM? With AppEngine or ContainerEngine, you probably would work with Docker images, so you can easily put these keys in the Docker file. For this demo, we use Compute Engine, so we should make use of [Google Cloud Storage](https://cloud.google.com/storage/) instead. 
We can create a bucket, and upload our keys into it. Open the Cloud console in your browser. Click on **Storage > Create Bucket**. Give the bucket a name. (For example *-contents>*). Make sure this bucketname is unique, and remember it, because you will use it later. Select **Regional**, and select the same region as the VM you have choosen before. (so *europe-west1* in my case.) Click **Create**. Once the bucket is created, we upload the files from the command-line. In your terminal on your local development machine enter the following two commands: `$ gsutil cp .env gs://` `$ gsutil cp cloudkey.json gs://` Both files are now in the bucket. The next step will be to download it, from the bucket into your virtual machine. Open the terminal which runs on your VM. Enter the following command, to download everything from the bucket, into the root of your vm: `$ gsutil cp gs:///* .` If you want, you can remove your bucket in the console. (Although, it probably wouldn’t cost much, to save 2 small files.) And now you can start the Node.js service: `$ nodemon bin/www` And now you can start the Node.js service. 

You might have noticed, that when you start running nodemon, and you close the VM console, that your script stops as well. What you will need is a Node module, which can run your script “forever”. `$ npm install forever -g` And then start your script like: `$ sudo /opt/bitnami/nodejs/bin/forever start bin/www` (with `sudo forever stopall` you can stop the script again) You should see the Tweets coming by. When you query in BigQuery you will see the results! Awesome, now let’s keep this process running for a while! *TIP: In case you rather want to schedule your script to go on, on a certain time, you could use Cron for this.* *First create a symlink to the correct node folder:* `$ sudo ln -s /opt/bitnami/nodejs /usr/bin/node` *Then start a crontab* `$ crontab -e` *Inside the crontab you code probably would look something like:* `SHELL=/bin/shell` `0 0 15 3 * PATH=$PATH:/opt/bitnami/nodejs cd ~/gcloud-bq-election-demo/ && sudo /opt/bitnami/nodejs/bin/forever start bin/www` *This means, at 0:00:00 time, on the 15th of March, navigate to the gcloud-bq-election-demo directory, and start the nodemon script. You can request the VM time by running `date` in the console.* 
*You can check if it all worked out, by viewing the logs:* `$ tail -f /var/log/syslog`

## Conclusion

By now, you have learned how to work with various Google Cloud services. We have been looking into: **Compute Engine** and **Cloud Launcher** to spin off a VM in the cloud, **Machine Learning APIs** like the **Natural Language API** and **Translation API** to understand the data, **BigQuery** to analyze the data and **Data Studio** to visualize the data in nice charts. Did I predict the Dutch elections well? Well, in some extend. The top 2 most positively spoken parties on Twitter, got the 2nd and 3rd place in the final results. So that was as expected. The PvdA didn’t do well at all, and the VVD got the first place in the elections, with the most votes. If I do random checks on the collected data, I can see that the sentiment detection has been calculated correctly. There is just no real direct relation between popularity on social media vs. the voting process. But mind you every person can only vote once, but can post unlimited positive or negative tweets. All my code will be in Github [https://github.com/savelee/gcloud-bq-election-demo]. Feel free to use my code, to run a similar case. I will put the instructions on how to setup, in the readme file. In case you are new to Google Cloud platform. You can create [a free trial account](https://cloud.google.com/free-trial/), which includes $300 dollars that can be used to spend on cloud services which expire after 12 months. That should be enough money to try out this demo.

### The costs

To run this tutorial for one day in a Compute VM created by Cloud Launcher, with the use of machine learning APIs and streaming and querying within BigQuery, costed me about 14 dollars. 

This included the VM running for 5 days (which costed me a dollar). My data wasn’t that big, so I didn’t had any costs for executing BigQuery queries. I was worried about the amount of API calls that I would made, but by running the script for a large part of the election day, I managed to still stay mostly within the free Natural Language API call request tier. So most of my money has been used on the large amount of tweets that has been translated. Let’s drill a little more into the costs of GCP. 

BigQuery storage will cost, $0.02 per GB Streaming data in BigQuery: $0.05 per GB (loading data is free). To execute Queries, will cost you $5.00 per TB but the first TB per month is free. [BigQuery Pricing](https://cloud.google.com/bigquery/pricing). Note, that Data Studio makes use of a BigQuery connector, which basically fires queries in BigQuery. 

The price for a micro virtual machine will cost less than 5 dollar a month. But for a computing demo like this, you will probably only run it for a bit, and pay for your use. With Compute Engine, you will pay per minute, with a 10 minute minimum. The prices for translation and language detection is about 20 dollars for a million characters. It will become cheaper, once your amount is over the 1.5 billion characters. See [Translate API pricing](https://cloud.google.com/translate/pricing). 

The Natural Language API has a free tier, if the amount of text records stays under the 5k, for pricing info see: [Natural Language Pricing](https://cloud.google.com/natural-language/pricing). Another great way, for checking and estimating costs, is by making use of the [GCP Pricing calculators](https://cloud.google.com/pricing/calculators). 

In case you are concerned about the prices, you can setup a billing alert. Which can send an email to you once you reach your quota. From the Cloud console, you can enable this, by clicking: **Billing > Budgets & Alerts**. In this screen, you can select the project, and your quota. - You can get emails once you get closer to your quota.

## Disclaimer

This blog post won’t contain any political opinions from me, neither from Google. This is a blog post to demonstrate the various solutions of the Google Cloud Platform, on how you can be creative with data. I have collected a large part of the day all the Dutch political tweets, posted on Twitter. Though, my results can not be considered as the ultimate truth. I use the Natural Language API in combination with the Translation API, translating first from Dutch to English before doing a sentiment analysis. Whether this always results, in the right score is the question. But based on some random tests, the majority of the tweets seem to have a reasonable score. At the end I only need to figure out if the score is positive or negative.

Let’s look into an example: Here’s the translation of the `translate.translate()` call with the following text: `Partij XYZ is mijn favoriete partij. Met de meeste stellingen ben ik het eens.`. It will be translated to this: `Party XYZ is my favorite party. With most positions, I agree.` 
If I would have translated it myself, I probably would have said it a little different: "Party XYZ is my favorite party. I agree with most of the positions they take on issues." However, to detect the sentiment, it doesn’t really matter, the score seems to be positive and correct: `{ magnitude: 0.800000011920929, score: 0.800000011920929 }`

There are certain tweets which I left out the *totalscore* calculation for sentiment analysis. For example, tweets which contain multiple opinions for multiple political parties in one single tweet: *Here’s the result of the `language.detectSentiment()` call with the following text: `I love Milkshakes.` : `{ magnitude: 0.699999988079071, score: 0.699999988079071 }`* 

Here’s the result of the `language.detectSentiment()` call with the following text: `I really hate Whipcream.` : `{ magnitude: 0.5, score: -0.5 }` 

Here’s the result for the `language.detectSentiment()` call with the following text: `I love Milkshakes but I really hate Whipcream.` : `{ magnitude: 0, score: 0 }`
I’m sure there are ways on how you can calculate this more nicely, but for now it’s out of scope for this blog post. (I came to this conclusion after seeing tweets (in single sentences) were people tag 5 different parties, with good and bad opinions about those.) Then there are also tweets, which are very hard for a machine to detect; for example tweets that contain sarcasm: 

Here’s the result for the `language.detectSentiment()` call with the following text: `Such a great idea, yeah, and monkeys can fly!` : `{ magnitude: 0.5, score: 0.5 }`

I left these tweets in my score calculation, assuming that people will use sarcasm for every political party, with both a positive and negative meaning. Last but not least, not everyone who votes, shares their thoughts on Twitter, and some people with strong political opinions might tweet more, to use it as a personal outlet. But in real-life, a person can obviously only vote once. It’s interesting anyway and I was curious to see, if my analysis results come close to the final scores of the Dutch elections. At the end, I had a lot of fun by writing the code, and I learned a lot about the Google Cloud Platform. BTW; do you want to receive more insights about the Dutch Elections? Google has a [Google Trends](https://trends.google.nl/trends/story/NL_cu_l5QQ-lkBAADe7M_en) page. 

## Handy Links 

* [Create a free GCP trial account]([https://cloud.google.com/free-trial/) 
* [Node JS](https://nodejs.org/en/) 
* [Express](http://expressjs.com/) 
* [Twitter Streaming APIs](https://dev.twitter.com/streaming/overview) 
* [Translate API](https://cloud.google.com/translate/) 
* [Translate API pricing](https://cloud.google.com/translate/pricing) 
* [Natural Language API](https://cloud.google.com/natural-language/) 
* [Natural Language Pricing](https://cloud.google.com/natural-language/pricing) 
* [BigQuery](https://cloud.google.com/bigquery/) 
* [BigQuery pricing]([https://cloud.google.com/bigquery/pricing]) 
* [Data Studio]([https://www.google.com/analytics/data-studio/]) 
* [Run Google Data Studio](https://datastudio.google.com) 
* [Cloud Launcher](https://cloud.google.com/launcher/) 
* [Cloud Storage](https://cloud.google.com/storage/) 
* [GCP Pricing calculators](https://cloud.google.com/pricing/calculators) 
* [Comparing tweets about Trump & Hillary with natural language processing.](https://medium.com/google-cloud/comparing-tweets-about-trump-hillary-with-natural-language-processing-a0064e949666)