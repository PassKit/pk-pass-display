#PassKit Pass Display

##Usage
Include in your index file:
    <link rel="stylesheet" type="text/css" href="node_modules/pk-pass-display/dist/pk-pass-display.min.css">

    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/moment/min/moment-with-locales.min.js"></script>
    <script src="node_modules/pk-pass-display/dist/pk-pass-display.min.js"></script>

Include in angular app:
    var app = angular.module("myApp", ["pk-pass-display"]); 

Use as component (see index.html for example):
    <pk-pass-display pass-id="passId"></pk-pass-display>
Optional attributes are:
    language="en" // can be any language code available on your pass
    bg-color="blue" // can be any css color

##Development
(Requires Node.js https://nodejs.org)
Make sure npm is up to date (comes with Node.js)
Run `npm i`

###Modifying
To have dist update while you modify the files:
Run `gulp watch`
/dist will be updated whenever you save changes

###Deploying
Modify files as required
Run `gulp`
/dist will now contain updated files and package version can be updated