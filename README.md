#PassKit Pass Display

##Usage
Include in your index file:
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/pk-pass-display/dist/pk-pass-display.min.js"></script>

Include in angular app:
    var app = angular.module("myApp", ["pk-pass-display"]); 

Use as directive:
    <div pk-pass-display="passId"></div>

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