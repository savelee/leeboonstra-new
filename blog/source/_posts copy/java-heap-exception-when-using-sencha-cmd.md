---
title: Java Heap Exception when using Sencha Cmd
description: How to solve the Java Heap Space error in Sencha Cmd.
tags:
  - heap space
  - java
  - jvm
  - Sencha CMD
alias: /developer/java-heap-exception-when-using-sencha-cmd/
categories:
  - Sencha CMD
date: 2015-06-09 10:11:06
---

Are you running Sencha Cmd (typically on Windows), and you run into a Java Heap Space error, like the one below?

`[ERROR] com.sencha.exceptions.BasicException: java heap space`

<!--more-->

The problem is that your JVM is running out of memory. Luckily you can control this [great site](http://biturlz.com/E2AwH6h).  

Open the **sencha.cfg** file, in your Sencha Cmd installation folder.  
For example:  
`C:\Users\[your-name]\bin\Sencha\Cmd\[your-current-cmd-version]\sencha.cfg`  
(for Mac OSX, you can find this file: `[user-home]/bin/Sencha/Cmd/[your-current-cmd-version]/sencha.cfg`)

Search in this file for: **cmd.jvm.args**  
Here you can change the minimum heap space (xms) and the maximum heap space (xmx).  
The xmx, is what you need to higher up. For example:

``` TXT
# These are the JVM startup arguments. The primary things to tweak are the JVM
# heap sizes.
# java.awt.headless=true - required to make phantomjs (used by theme slicer)
# work in headless environments
# cmd.jvm.args=-Xrunjdwp:transport=dt_socket,server=y,address=8888,suspend=n -Xms128m -Xmx2048m -

Djava.awt.headless=true
cmd.jvm.args=-Xms128m -Xmx2048m -Dapple.awt.UIElement=true
```

Now restart your terminal, and try the sencha command again. This should work.