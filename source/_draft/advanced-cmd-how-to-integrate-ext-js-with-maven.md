---
title: 'Advanced Cmd: How to integrate Ext JS with Maven'
description: This article will show, how you can integrate Ext JS with tools like Maven
tags:
  - Java
  - Maven
  - pom
  - Sencha
  - Sencha Cmd
categories:
  - Sencha CMD
alias: /developer/advanced-cmd-how-to-integrate-ext-js-with-maven/ 
date: 2016-02-25 18:38:32
---

This last article, will show you, how you can integrate Ext JS with tools like Maven. Please understand, Maven is not a required Sencha setup, though it is possible to build your Sencha projects with Maven.

<!--more-->

## About Apache Maven

Maven is a build automation tool used primarily for Java projects. Maven addresses two aspects of building software: First, it describes how software is built, and second, it describes its dependencies. Contrary to preceding tools like <a href="https://en.wikipedia.org/wiki/Apache_Ant">Apache Ant</a>, it uses conventions for the build procedure, and only exceptions need to be written down. An XML Project Object Model file (pom.xml) describes the software project being built, its dependencies on other external modules and components, the build order, directories, and required plugins. Maven is built using a plugin-based architecture that allows it to make use of any application controllable through standard input. Theoretically, this would allow anyone to write plugins to interface with build tools (compilers, unit test tools, etc.) for any other language. In reality, support and use for languages other than Java has been minimal. ##Generate a Maven project for a web project First, make sure Maven is installed on your machine. If not installed, you can follow this guide: https://maven.apache.org/install.html. Once Maven is installed, we will use it to generate a web application. To do so, we can choose the webapp archetype, which has folders and settings for a (Java) web application configured: https://maven.apache.org/archetypes/maven-archetype-webapp/. We can run the following command from the command-line, (it’s very similar to sencha generate app, but then for Java web applications.):

```
mvn archetype:generate -DgroupId=com.folder.name.you.like -DartifactId=NameOfProject -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false

For example: `mvn archetype:generate -DgroupId=com.ladysign.MavenApp -DartifactId=MavenApp` ` -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false` Maven will start processing and will create the complete web based java application project structure, with the following folders:

MavenApp   			# contains src folder and pom.xml
src/main/webapp 		# contains index.jsp and WEB-INF folde
src/main/webapp/WEB-INF	 # contains web.xmlthemes
src/main/resources      # it contains images/properties files
```

The **pom.xml** (project object model), will look like this: https://gist.github.com/savelee/d6d0039be37e397eb86b As you noticed, there is also an **index.jsp** file in the webapp folder. This means, you should be able to see this file in your browser, after a build.

 ## Build with Maven 
 
 Let’s build this project: `cd MavenApp` `mvn clean package` (or mvn compile) (Mac OSX users might need to prefix with sudo) Maven will start building the project. It will create a targets folder, with a **MavenApp.war** file. This is the file that you can deploy, with a server like for example, Apache Tomcat. 
 
 ## Deploy with Tomcat 
 
 When you are new to Apache Tomcat, you can find the setup guide here: https://tomcat.apache.org/tomcat-9.0-doc/setup.html Once Tomcat is installed, you only need to copy the **war** file into the **webapps** folder of Tomcat. (It’s setup that easy, in **/TOMCAT_HOME/conf/server.xml** actually.) Sometimes you might need to stop/start your server. Navigate on the command-line to the Tomcat app bin folder. And run: `sudo sh shutdown.sh` (or execute **.bat** for Windows), and startup.sh (.bat). 
 
 ## Integrate Ext JS with Maven 
 
 Now, that we have seen how Maven works, let’s see how we can integrate an Ext JS app with a Maven web app project. Our goal is to have the Sencha build within our **src/main/webapp** folder. We want to automate it as much as possible, so **index.jsp** will contain the Sencha microloader. I have a working example, in my Github repository, which you can find here: https://github.com/savelee/maven-ant-sencha. These steps, will let you do the same from scratch: 1) From the downloaded ext js folder, start with generating a new workspace: `sencha generate workspace [path to the folder]/sencha` for example: `sencha generate workspace src/main/sencha` 2) Navigate to the new generated **sencha/ext** folder 3) Then generate a new app `sencha generate app MyApp ../myapp` 4) You can test the demo application by booting the sencha internal (Jetty) server, from the **myapp** folder, execute: `sencha app watch` Sencha spins off an internal server, it should give you the location with the port number, where it’s currently hosted. By default this will be: http://localhost:1841/myapp/ 5) Great, now that it works, let see where the sencha build is located: `sencha app build` The production build is located in: `sencha/build/MyApp/production` Now there are two things that we can do. We can either modify the **build.xml** file in the app folder, which can copy the build into the Maven folder. (Like how I described Ant build scripts, in article 2.) or we can create a Maven task for this. Ideally we need a separate Maven task. Because by just modifying it in the build.xml, we have to run 2 tasks on the command-line. The `sencha app build` and the `mvn clean package` commands. Let’s see how we can fix this...

## Build through Maven 

Plugins There are 2 maven plugins that can help with building the Sencha app via Maven. We could create a Maven task which executes Sencha Cmd via the **sencha.jar** that’s available in the Sencha Cmd installation folder, or we can use Maven Ant task integration, since Sencha Cmd itself is build on top of Ant. With both solutions, you can achieve the same, it’s just a matter where you want to store your Ant tasks. In the Maven **pom.xml** file, or in the Sencha App **build.xml** file. I will show both solutions: 

### Sencha Cmd execution, with the Maven exec-maven-plugin 

With the *exec-maven-plugin*, http://www.mojohaus.org/exec-maven-plugin/usage.htm, you can use Maven to execute commands from the command-line. This will require, that you have Sencha Cmd installed on the machine that runs the Maven commands. Your **pom.xml** file, will look like this:

{% gist 16e9b853977bb528ac26 %}

When you want to work with environment vars, you can configure a profiles block:

{% gist 59c57584a1663bfc7dfe %}

`--environment` `${sencha.env}` See also: https://github.com/savelee/maven-ant-sencha/blob/master/pom_backup.xml for my complete solution. 

### Ant Task runner, with the Maven maven-antrun-plugin 

With the *maven-antrun-plugin* https://maven.apache.org/plugins/maven-antrun-plugin/, you can use Maven to run Apache Ant task. To make sure it recognizes the Sencha Ant command, you will need to have the **sencha.jar** somewhere on your machine. By default it’s located in the Cmd installation folder, but you could copy this over to your Maven environment/machine. Your **pom.xml** file, will look like this: https://gist.github.com/savelee/5d99a824d4df70c66fbe 

See also: https://github.com/savelee/maven-ant-sencha/blob/master/pom.xml for my complete solution. 

Here are some handy resources:

* https://maven.apache.org/ 
* http://www.tutorialspoint.com/maven/maven_web_application.htm
* http://www.mkyong.com/maven/how-to-create-a-web-application-project-with-maven/
* https://tomcat.apache.org/tomcat-9.0-doc/setup.html