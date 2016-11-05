#PassKit Pass Display

[![NPM version](https://img.shields.io/npm/v/pk-pass-display.svg)](https://npmjs.org/package/pk-pass-display)
[![Bower version](https://img.shields.io/bower/v/pk-pass-display.svg)](https://github.com/PassKitInc/pk-pass-display)

##Usage

Include in your index file:
    
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" type="text/css" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="node_modules/pk-pass-display/dist/pk-pass-display.min.css">
    </head>
    <body>
        <div data-ng-app="myApp" data-ng-controller="passCtrl">
            <pk-apple-pass pass-id="{{passId}}"></pk-apple-pass>
        </div>
        <script src="node_modules/angular/angular.min.js"></script>
        <script src="node_modules/moment/min/moment-with-locales.min.js"></script>
        <script src="node_modules/pk-pass-display/dist/pk-pass-display.min.js"></script>
        <script>
            (function (angular) {
                angular.module("myApp", ["pk-pass-display"])
                .config(["$locationProvider", function($locationProvider) {
                    $locationProvider.html5Mode({enabled:true,requireBase:false});
                }])
                .controller("passCtrl", ["$scope", "$location", passController]);
    
                function passController($scope, $location) {
                    $scope.passId = $location.search().pid;
                }
            })(window.angular);
        </script>
    </body>
    </html>

Use as component (see index.html for example):

    <pk-pass-display pass-id="passId"></pk-pass-display>

Optional attributes are:

    language="en" // can be any language code available on your pass
    bg-color="blue" // can be any css color
    on-error="errorHandler(err)" // function to handle error callback
    on-loaded="loadedHandler(pass)" // function to handle loaded callback

###Note on the callback functions:

For angular components, the variable name in the view must match the name in the component. So `pass` and `err` must keep that name within the view.
`on-loaded` passes back the `pass` object when loading is complete, `on-error` passes back an error string if there was an error loading the pass.

Example error handling:

    <pk-apple-pass pass-id="{{passId}}" on-error="errorHandler(err)"></pk-apple-pass>
    .
    .
    .
    function passController($scope, $location) {
        $scope.passId = $location.search().pid;
        $scope.errorHandler = function(errorMessage) {
            alert(errorMessage);
        }
    }

##Development

(Requires Node.js https://nodejs.org).  
Make sure npm is up to date (comes with Node.js).  
Run `npm i`

###Modifying

To have dist update while you modify the files:  
Run `gulp watch` /dist will be updated whenever you save changes.

###Deploying

Modify files as required.  
Run `gulp` "/dist" will now contain updated files and package version can be updated.

