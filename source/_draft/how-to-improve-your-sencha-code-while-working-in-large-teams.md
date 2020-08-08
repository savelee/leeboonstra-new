---
title: How to improve your Sencha code while working in large teams?
description: Learn how to work with large enterprise teams on Sencha code.
categories: Ext JS
tags:
  - Teamwork
  - Cmd
  - Environment
  - Ext JS
  - Git
  - Jasmine
  - Enterprise
  - TDD
date: 2015-06-05 10:00:28
alias: /developer/how-to-improve-your-sencha-code-while-working-in-large-teams/
---

Often I get questions from people on how to work efficiently with Sencha while developing in a large team environment.. This question is especially popular for people coming from the Java world, who are familiar with tooling for Java and build processes. I can tell you that it’s not much different for web projects.

This article will discuss the following concepts:

*   Source Control
*   Sencha Architect for teams
*   Editors & IDEs and configuration
*   Code analysis tools
*   Code reviews
*   Test tools
*   Build processes

<!--more-->

## Source Control

Use a versioning / source control system, to track changes, share your code and save your code revisions as easy backups. A popular Versioning Control tool is Git. (but you can use any versioning tool of choice, such as SVN, CVS, Mercurial, etc...)

### Working with Git

Internally at Sencha we use Git & Github. What’s important to know, is that you don’t want to check-in certain files and folders. When you do check in the framework or build folders, keep in mind that there are more changes on Git conflicts, and your code base will become extremely large. To make sure you don’t check-in these files by accident, create a **.gitignore** file in your project root. I am often using these ignore rules:

``` .gitignore
# OS generated files #
######################

*/.DS_Store
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
Icon?
ehthumbs.db
Thumbs.db

# Packages #
############

# it's better to unpack these files and commit the raw source
# git has its own built in compression methods

*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip

# Sencha Development #
######################

.architect
.project
.sencha/
.sass-cache/
ext/
touch/
temp/
build/
```

**TIP:** Wait? You didn't check in the frameworks? Yep. Usually I prefer it to keep my version control light and clean. (I can tell you how much pain it is, when whole versions of Ext JS are checked into GIT, and how horrible it is, to use the GIT client, while it's slow or crashing down.) - To give you an impression, the Sencha sdk is over 100 MB.  So not checking in the sdk, means, you will have to generate a new application/workspace, with the same name space; and copy over the files. **TIP:** In case you by accident already committed certain files to Git, you have to remove them first from Git before ignoring them. For example: `**git rm file1.txt** **git commit -m "remove file1.txt"** **git push**` In case you have all these annoying OS generated files in Git, you can remove them like this: `**find . -name '*.DS_Store' -type f -delete**` For more information about Git, checkout:

*   [http://git-scm.com/](http://git-scm.com/)
*   [http://www.github.com](http://www.github.com)

### What about Git and Sencha Architect?

When you're familiar with Git you shouldn’t have problems collaborating with multiple developers using Sencha Architect. The Sencha Architect metadata code and resultant JavaScript are very source-control friendly. But it is good to know that Sencha Architect creates meta data. (see metadata folder in your folder structure of an Sencha Architect. project). These metadata are used to generate the JavaScript in the app folder. (_Basically, you don’t need to add the app folder under source control. Since Sencha Architect auto generates these files once you open and save the project in Sencha Architect_.) 
Because of this metadata it is possible to work in the same Sencha Architect project with multiple developers. As you can see in the screenshot, the metadata maps a similar folder structure as the application file structure. Every Sencha class has its own meta data file, which is basically a JSON object. As long as you don’t work on the same files, there won’t be any conflicts. For more information about using Sencha Architect in project teams, take a look into this serie of blog posts written by Richard G Milone who works for CNX. It explains the process really well:

*   [http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-1-of-3/](http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-1-of-3/)
*   [http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-2-of-3/](http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-2-of-3/)
*   [http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-3-of-3/](http://www.sencha.com/blog/sencha-architect-team-development-in-the-real-world-part-3-of-3/)
*   [http://docs.sencha.com/architect/3/getting_started/developing_team_apps.html](http://docs.sencha.com/architect/3/getting_started/developing_team_apps.html)

### **Sencha & Git in general**

Whether you are working with Sencha Architect, or just writing code yourself, the best practice would be to define (smaller) classes, and nesting it through xtypes. 

Every (view) component, should have its own class, with its own namespace. 
We don’t need to worry about all these separate files since the Sencha build process (with Sencha Cmd / Sencha Architect uses Sencha Cmd in the background), concatenates and minifies all these classes into one single small file. This improves readability, usability and maintainability but think about it. It also will improve your workflow with source control systems. Cause smaller single files, reduces the change on working with your co-worker on the same file. 

When you develop your application with Sencha Architect, and you are dragging your components into the design canvas... ...by default all these views will be nested into one single file. (the viewport). You can promote these smaller view pieces to its own classes, so it will become a single class file, which will be nested via its xtype. 
For example, when you have a viewport with a form with fields, and a component with a template. You can promote the form and the detail component to its own class, by right clicking on the form (or detail component), and select: **Promote To Class**. After you selected that, you will see a link icon, which indicates that its a linked to its own class. You can start re-using it now too! 

Just sometimes, you are both working on the same file. This will result into a merge conflict as soon as you push your version to Git. Git will reject it. I know, this is not nice, but it’s not the end of the world. Always make a backup of your own file, to somewhere else in your file system. You can merge a file. There are various tools available for your editors / IDEs that deal with merging files. Also Git provides a Graphical User Interface which can show the differences. Another solution can be to accept or revert the changes and merge it yourself manually. 

**TIP:** Traditionally we recommend that users do not check in the **.architect** file or the framework and build folders into their source control systems. In situations where it is necessary to check these into the repository (for example, because you want to run the application directly in your browser after fetching the project), we suggest that you check it in and then add it to the ignore list so that there will not be further conflicts. Last but not least, the overall best solution for working in a team with source control, is communication! It’s just so much easier if you let your co-worker know, on which file / part of the app you are working on!

## Editors & IDEs

While writing Sencha code you can use any editor or IDE of choice. Here are a couple of suggestions:

*   **WebStorm / IntelliJ IDEA** from JetBrains - [https://www.jetbrains.com/](https://www.jetbrains.com/)

IDEA is an IDE great for Java developers. WebStorm is their JavaScript version of the IDE. What’s nice of WebStorm is that it recognizes the Sencha frameworks, and therefore you can use code auto completion. WebStorm is commercial. IDEA has an oper source version.

*   _**_Eclipse_**_ _-_ [_https://eclipse.org/_](https://eclipse.org/)

_Open source IDE mostly focussed on Java development._

*   _**_Sublime Text Editor_**_ _-_ [_http://www.sublimetext.com/_](http://www.sublimetext.com/)

_A simplistic editor for code and markup with amazing performance. (Commercial)_

*   _**_Brackets_**_ _-_ [_http://brackets.io/_](http://brackets.io/)

_A modern simplistic open source editor, great for web development._ All of these tools have the ability to use with plugins. For example, plugins to integrate code analysis tools or source control tools.

### **Editor / IDE configuration**

When you work in a team, what’s most important is that you have your editor/IDE configured the same. Common editor settings are:

*   **Indent Style**: set to tab or space to use hard tabs or soft tabs respectively.
*   **Indent Size**: a whole number defining the number of columns used for each indentation level and the width of soft tabs (when supported).
*   **Tab Width**: a whole number defining the number of columns used to represent a tab character.
*   **End of Line**: set to lf, cr, or crlf to control how line breaks are represented.
*   **Charset**: set to latin1, utf-8, utf-16be or utf-16le to control the character set.
*   **Trim trailing whitespace**: Enable to remove any whitespace characters preceding newline characters and false to ensure it doesn't.
*   **Insert final newline**: Enable to ensure file ends with a newline or not.

When these settings are out of sync in a team, you can run into many source control conflicts and hard to solve file merges.

## Code analysis tools

There are a couple of tools you can use to analyse your code. Popular tools for JavaScript development are:

*   **JSLint** - [http://www.jslint.com/](http://www.jslint.com/)

A JavaScript syntax checker and validator on coding rules written by Douglas Crockford.

*   **JSHint** - [http://jshint.com/](http://jshint.com/)

A community driven fork of JSLint, which is not as strict as JSLint. There are many plugins available for IDE’s and editors, to check the JavaScript code while writing using the above tools.

### Analysing code with Sencha Cmd

What’s also nice to know is Sencha Cmd does code checking. Every time when you run a sencha app build or sencha app build testing on the command-line, it will validate your JavaScript code. Lint errors will show up as parse warnings in your console. Not only it checks your JavaScript errors, it will also check your Sass stylesheet for errors, before compiling it to production ready CSS. Sencha Cmd has Rhino 1.7 and PhantomJS under the hood. These are JavaScript interpreters, it does not have the DOM implementation of a browser. Therefore it can run some nice things. Such as Linting/Validating or testing the code while building. For example Sencha Cmd uses PhantomJS for its image slicer. Because of PhantomJS, Sencha Cmd can make a screenshot, and slice it into images to serve to older browsers. For more information, see:

*   [https://developer.mozilla.org/en/docs/Rhino_documentation](https://developer.mozilla.org/en/docs/Rhino_documentation)
*   [http://phantomjs.org/](http://phantomjs.org/)

## Code Reviews

It is also possible to let Sencha check your code. You can hire a Sencha professional services consultant who can review your code during certain points in your development process. We will check for best practices and see how to optimize your application and performance.

## Tools for testing your Sencha Code

Let’s look into ways how to test your Sencha code:

*   **Jasmine** - [http://jasmine.github.io/](http://jasmine.github.io/)

Jasmine is an open source unit testing framework for JavaScript. Unit Tests attempt to isolate small pieces of code and objectively verify application logic. Jasmine aims to run on any JavaScript-enabled platform, to not intrude on the application nor the IDE, and to have easy-to-read syntax. See also: [https://vimeo.com/18100173](https://vimeo.com/18100173)

*   **Siesta** - [http://www.bryntum.com/products/siesta/](http://www.bryntum.com/products/siesta/)

Siesta is a JavaScript testing tool that can help you test any JavaScript code and also perform testing of the DOM and simulate user interactions. UI tests attempt to subjectively verify that elements on the screen behave (and often look) as expected, both statically (i.e. the flat render) and also dynamically (i.e. as users perform given actions). Siesta from Bryntum is the best tool on the market. Using the API, you can choose from many types of assertions ranging from simple logical JS object comparisons to verifying that an HTML element is visible in the DOM. It is possible to test JavaScript in the browser and you can automate your tests. Once you have created your test suite, you should consider running it in the cloud using great services we support, such as Sauce or BrowserStack. See also: [http://saucelabs.com/](http://saucelabs.com/) and [http://www.browserstack.com/](http://www.browserstack.com/)

## Build process

Sencha Cmd (and our build processes) run on top of Apache Ant. Apache Ant is a software tool for automating software build processes. It is implemented using the Java language therefore it requires the Java platform. You can write / wire up your own build process and code analysis tools as well. You can write these hooks in the **build.xml** file (in the project root). The file looks like this:

``` XML
<?xml version="1.0" encoding="utf-8"?>
<project name="BarFinder" default=".help">
<!--
The build-impl.xml file imported here contains the guts of the build process. It is
a great idea to read that file to understand how the process works, but it is best to
limit your changes to this file.
-->

<import file="${basedir}/.sencha/app/build-impl.xml"/>
<!--
The following targets can be provided to inject logic before and/or after key steps
of the build process:
The "init-local" target is used to initialize properties that may be personalized
for the local machine.
<target name="-before-init-local"/>
<target name="-after-init-local"/>

The "clean" target is used to clean build output from the build.dir.

<target name="-before-clean"/>
<target name="-after-clean"/>

The general "init" target is used to initialize all other properties, including
those provided by Sencha Cmd.

<target name="-before-init"/>
<target name="-after-init"/>

The "page" target performs the call to Sencha Cmd to build the 'all-classes.js' file.

<target name="-before-page"/>
<target name="-after-page"/>

The "build" target performs the call to Sencha Cmd to build the application.

<target name="-before-build"/>
<target name="-after-build"/>
-->
</project>
```

As you can see lots of code is commented out in here. So nothing is really happening yet. But you can create your own hooks. There’s a Sencha guide online, which contains the available tasks you can use: [http://docs.sencha.com/cmd/5.x/advanced_cmd/cmd_ant.html](http://docs.sencha.com/cmd/5.x/advanced_cmd/cmd_ant.html) For example, here’s a code snippet I have used to create different build packages, where the folder name of the build contains a date.

``` XML
<target name="-after-build">
<tstamp>
<format property="today" pattern="yyyy-MM-dd"/>
</tstamp>

<copy todir="${build.dir}/../../dist/${app.name}/${today}-mybuild" overwrite="true">
<fileset dir="${build.dir}">
<include name="**/*" />
</fileset>
</copy>

</target>
```

For more information, please see: [http://ant.apache.org/](http://ant.apache.org/)

## Conclusion

When you are building serious enterprise applications you will need to come up with a strategy on how to analyze, test and collaborate your code. As you can see, choosing Sencha empowers developers to design, develop, test and deploy in development teams of any size.