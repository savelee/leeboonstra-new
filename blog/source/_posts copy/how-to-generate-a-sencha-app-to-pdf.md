---
title: How to generate a PDF from an Ext JS app
description: Learn how to generate a PDF from an Ext JS app.
tags:
  - express
  - node
  - nodejs
  - pdf
  - pdf generation
  - PhantomJS
  - screencapture
categories:
  - Ext JS
date: 2015-11-26 13:23:02
alias: /developer/how-to-generate-a-sencha-app-to-pdf/
---

Often I get the question if it’s possible to generate a PDF from a Sencha app. Well yes that’s possible, but not with Ext JS code only. Though, Ext JS has an exporter, to export grid/pivot data into an XML or Excel file, and you can export charts to images. Out of the box we can’t generate PDFs from full Sencha apps, with the framework.

What you will need is an additional script, often these solutions are handled on the backend, but there are also solutions which can do this client-side.
<!-- more-->
To name few, see the list below. I didn’t use them all. But I’ve done it before on the client-side with JavaScript, with PHP and back in the days also once in Java.

*   You can generate PDFs with Node and [PhantomJS](http://phantomjs.org)
*   You can view PDFs with JavaScript on the client-side with [Mozilla PDF.js](https://mozilla.github.io/pdf.js/) or generate with [JSPDF](https://parall.ax/products/jspdf)
*   You can generate PDFs with PHP. For example with [TCPDF](http://www.tcpdf.org/index.php), [HTML2PDF](http://sourceforge.net/projects/html2ps/), [DOMPDF](https://github.com/dompdf/dompdf), [Zend PDF](http://framework.zend.com/manual/1.12/en/zend.pdf.html) or [FPDF](http://www.fpdf.org/)
*   PDF generation for Java. For example: [PDFBox](http://pdfbox.apache.org/), [PDFJet](http://pdfjet.com/), [JPod](http://sourceforge.net/projects/jpodlib/) or [PDF Clown](http://pdfclown.org/)
*   PDF generation for .NET. For example: [PDFClown](http://pdfclown.org/), [PDFJet](http://pdfjet.com/), [Apose](http://www.aspose.com/.net/pdf-component.aspx) or [Foxit](https://www.foxitsoftware.com/products/sdk/generator/)
*   Perl PDF generation, [PDF-API](http://search.cpan.org/dist/PDF-API2/), [PDF-Create](http://search.cpan.org/dist/PDF-Create/) or [PDF Template](http://search.cpan.org/dist/PDF-Template/)

Nowadays, I love Node JS! So I’ll show you how I recently created a generator with JavaScript for NodeJS and PhantomJS. PhantomJS?PhantomJS is a headless Webkit browser formerly written by (ex Sencha employee) Ariya Hidayat. You will need to install PhantomJS on your environment, but once installed you can run PhantomJS from your command-line. Why is this so powerful? Well you can use it, to:

*   **Headless website testing**  
    Run functional tests with frameworks such as Jasmine, QUnit, Mocha, Capybara, WebDriver, and many others.
*   **Page automation & screenscraping**  
    Access and manipulate webpages with the standard DOM API, or with usual libraries like jQuery.
*   **Network monitoring**  
    Monitor page loading and export as standard HAR files. Automate performance analysis using YSlow and Jenkins
*   **Screen capturing**  
    Programmatically capture web contents, including SVG and Canvas. Create web site screenshots with thumbnail preview etc

The last usecase, is where I am using it for. To let PhantomJS visit my Ext JS app, and capture the screen, by generating it to a PDF.

Nice to know, Sencha is using PhantomJS inside Sencha Cmd, for example we use it to generate images from CSS3 features that aren’t supported in legacy browsers and recently we compile Sass stylesheets with JavaScript, to production ready CSS (Fashion). How did I do this?

1. Let’s say you have an environment with Node JS and a web server with Express installed, how can you make a PDF from an Ext JS app? I’m not an Node/PhantomJS expert, but I can show you some simple steps, which you can do too!
    
You will need to create a route that listens to an URL that should invoke PhantomJS. For example:

``` JavaScript
var PdfHelp = require('./libs/pdfgenerator-help');
router.get('/pdfgenerator/', function(req, res){
  var pdf = new PdfHelp();
  pdf.generatePdf(req, res);
});
```


2. On your environment (dev and production), you will need to install PhantomJs, you can install it via the [npm package manager](https://www.npmjs.com/package/phantomjs): `npm install phantomjs -s`.

Once it’s installed, you can run PhantomJS JavaScript pages, by running: `phantomjs scriptname.js` from the command-line.
    
3. I created a simple helper script which can listen to an argument that passes in a URL of my Sencha app. This probably doesn’t make much sense for your own app, but you will get the idea on how to do this.
    
I use a Node child process, to execute PhantomJS from my environment. It passes in two arguments; the phantomjs script to execute (generate.js - see below), and in my case the URL to the Sencha app.

``` JavaScript
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var childArgs = [
  path.join(__dirname, 'phantomjs-script.js'),
  'some other argument (passed to phantomjs script)'
];

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results
});
```

4. What’s important to know when working with PhantomJS
    
* I’m configuring the page, like paper size, margins, and headers and footers: [http://phantomjs.org/api/webpage/property/paper-size.html](http://phantomjs.org/api/webpage/property/paper-size.html)
* Then I let PhantomJS open the URL to my Sencha app: [http://phantomjs.org/api/webpage/method/open.html](http://phantomjs.org/api/webpage/method/open.html)

5. The big magic trick here, is that you’ll need to wait till the headless browser loaded the Sencha app with the framework completely in its memory. Otherwise you would print an empty page, (because index.html files in Sencha apps are usually pretty empty, since Ext JS generates the browser DOM elements).
    
Take a look into the `waitFor()` method I used. The first argument is a test function. This test function, (see line 94), tries to find the **Ext** namespace in my Sencha app. When it’s there, I still don’t want to immediately make the screenshot, because maybe my stores are not loaded yet. So I wrote another evaluation: `Ext.ComponentQuery.query('grid')[0].getStore().count();` If there is data in my store, then go ahead and generate the PDF.
    
Again, this probably doesn’t make sense for your application, but you will get the idea.
    
6. You render the page with `page.render('my-pdf-name.pdf');` and then you exit the phantomjs process ( `phantom.exit()`).
    
7. Back into my PDF helper class, I wrote the following lines, to set the filename of the PDF and directly open it in my browser. It’s important that you set the page headers and content type to application/pdf:

``` JavaScript
    var filename = "test.pdf";
    filename = encodeURIComponent(filename);
    
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    
    var fs = require('fs');
    fs.readFile(filename, function(err,data) {
    		res.contentType("application/pdf");
    		res.end(data);
    });
```

And that’s it! As you can see when using PhantomJS for visiting your Sencha app, you might want to deal with the timing issues. As by default the index.html in a Sencha app is empty, and a Sencha app is generated in the DOM.

There are lots of ways on how you can create PDFs or images from Sencha apps. Which technologies and tricks did you use?

### Update:

Ext JS 6.2 Premium, ships with a data exporter package for grids and pivot grids. It will be possible to export all the records which are visible in a grid to: _XML, CSV, TSV, HTML_ and _Excel_ format. Shikhir Singh, lately wrote a nice post about; how to extend from Ext.grid.plugin.Exporter to easily export to PDF.[https://www.sencha.com/blog/exporting-data-from-an-ext-js-grid-to-pdf/](https://www.sencha.com/blog/exporting-data-from-an-ext-js-grid-to-pdf/)