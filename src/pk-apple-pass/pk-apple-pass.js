(function (angular, moment) {
    angular.module('pk-pass-display').component('pkApplePass', {
        controller: ['$http', PKApplePassController],
        templateUrl:"pk-apple-pass.html",
        bindings: {
            passId: '@',
            language: '@',
            bgColor: '@',
            apiRoot: '@',
            onError: '&',
            onLoaded: '&'
        }
    });

    function PKApplePassController($http) {
        var ctrl = this;
    
        ctrl.$onChanges = onChanges;

        function onChanges(changesObj) {
            if (changesObj.hasOwnProperty("passId") && ctrl.passId != undefined) {
                getPass(ctrl.passId);
            }
            if (changesObj.hasOwnProperty("language") && ctrl.language != undefined) {
                selectLanguage(ctrl.language);
            }
        }

        var original;
        var passHasLoaded = false;

        //Scope vars
        ctrl.passIsExpired = false;
        ctrl.eventIsStripFormat = false;
        ctrl.noAppleBarcode = false;
        ctrl.flip = false;
        ctrl.transitType = "";
        ctrl.mergedAuxSecFields = [];

        //Scope objs
        ctrl.display = {};
        ctrl.selectedLanguage = {};
        ctrl.passData = {};
        ctrl.images = {};
        ctrl.barcode = {};
        ctrl.fields = {};

        //Scope funcs
        ctrl.flipPass = flipPass;
        ctrl.barcodeIsSquare = barcodeIsSquare;

        function getPass(passId) {
            if (typeof passId !== "string" || passId == "") {
                return;
            }
            passHasLoaded = false;

            var requestRoot = "https://api-pass.passkit.net/";
            if (typeof ctrl.apiRoot === "string" && ctrl.apiRoot != "") {
                requestRoot = ctrl.apiRoot;
            }
            $http({
                method: 'GET',
                url: requestRoot + "v2/passes/" + passId + "/json"
            }).then(function (response) {
                passHasLoaded = true;
                var pass = response.data;
                original = pass;
                if (pass.hasOwnProperty("appleWallet")) {
                    ctrl.display.wallet = "appleWallet";
                    ctrl.display.type = pass.appleWallet.passType;
                    ctrl.passData = pass.appleWallet.data;
                    ctrl.images = JSON.parse(JSON.stringify(original[ctrl.display.wallet].images));
                    if (pass.appleWallet.data[pass.appleWallet.passType].hasOwnProperty('transitType')) {
                        appleTransit(pass.appleWallet.data[pass.appleWallet.passType].transitType);
                    }

                    if (typeof ctrl.language === "string" && ctrl.language != "") {
                        selectLanguage(ctrl.language);
                    } else {
                        selectLanguage(original[ctrl.display.wallet].defaultLang);
                    }

                    if (ctrl.selectedLanguage.hasOwnProperty('images')) {
                        ctrl.eventIsStripFormat = ctrl.images.hasOwnProperty('strip') || ctrl.selectedLanguage.images.hasOwnProperty('strip');
                    } else {
                        ctrl.eventIsStripFormat = ctrl.images.hasOwnProperty('strip');
                    }
                    
                    //if the pass is voided, or the expiration date has passed, then the pass is expired
                    if(ctrl.passData.voided || (ctrl.passData.hasOwnProperty("expirationDate") && (new Date() > new Date(ctrl.passData.expirationDate)))) {
                        ctrl.passIsExpired = true;
                    }
                }
                ctrl.onLoaded({pass: pass});
            }, function (response) {
                ctrl.onError({err: "Error: "+ response.status + " - " + JSON.stringify(response.data)});
            });
        }

        function flipPass() {
            ctrl.flip = !ctrl.flip;
        }

        function appleTransit(transitCode) {
            var appleTransitFormats = {
                "PKTransitTypeAir": "fa-plane",
                "PKTransitTypeBoat": "fa-ship",
                "PKTransitTypeBus": "fa-bus",
                "PKTransitTypeGeneric": "fa-arrow-right",
                "PKTransitTypeTrain": "fa-train"
            };
            ctrl.transitType = appleTransitFormats[transitCode];
        }

        function appleBarcode(barcodes, lang) {
            var appleBarcodeFormats = {
                "PKBarcodeFormatQR": "qrcode",
                "PKBarcodeFormatPDF417": "pdf417",
                "PKBarcodeFormatAztec": "azteccode",
                "PKBarcodeFormatCode128": "code128p"
            };
            var selectedBarcode = {};
            if (barcodes.length > 1) {
                // first try to find if there is a code128 barcode stored
                for (var i = 0; i < barcodes.length; i++) {
                    if (barcodes[i].format == "PKBarcodeFormatCode128") {
                        selectedBarcode = barcodes[i];
                    }
                }
                // else just load the first barcode available
                if (!selectedBarcode.hasOwnProperty("format")) {
                    selectedBarcode = barcodes[0];
                }
            } else {
                selectedBarcode = barcodes[0];
            }

            var altText = selectedBarcode.altText,
                message = selectedBarcode.message;
            if (altText != null) {altText = langReplace(altText, lang);}
            if (message != null) {message = langReplace(message, lang);}

            ctrl.barcode = {
                message: message,
                format: appleBarcodeFormats[selectedBarcode.format],
                altText: altText
            };
        }

        function selectLanguage(lang) {
            if (!passHasLoaded) {
                return;
            }
            if (lang === undefined || typeof ctrl.language !== "string" || lang == "") {
                lang = original[ctrl.display.wallet].defaultLang;
            }
            moment.locale(lang);
            ctrl.fields = JSON.parse(JSON.stringify(original[ctrl.display.wallet].data[original[ctrl.display.wallet].passType]));
            mergeAuxSecFields(ctrl.fields);
            if (original[ctrl.display.wallet].locales.hasOwnProperty(lang)) {
                ctrl.selectedLanguage = JSON.parse(JSON.stringify(original[ctrl.display.wallet].locales[lang]));
                if (ctrl.passData.hasOwnProperty('logoText')) {
                    ctrl.passData.logoText = langReplace(JSON.parse(JSON.stringify(original[ctrl.display.wallet].data.logoText)), ctrl.selectedLanguage);
                }
            } else {
                ctrl.selectedLanguage = {};
            }

            if (ctrl.display.wallet == "appleWallet" && original.appleWallet.data.hasOwnProperty('barcodes')) {
                appleBarcode(JSON.parse(JSON.stringify(original.appleWallet.data.barcodes)), ctrl.selectedLanguage);
            } else {
                ctrl.noAppleBarcode = true;
            }
        }

        function langReplace(inputStr, lang) {
            if (lang != null && lang.hasOwnProperty("text")) {
                for (var key in lang.text) {
                    if (lang.text.hasOwnProperty(key) && inputStr == key) {
                        inputStr = lang.text[key];
                    }
                }
            }
            return inputStr;
        }

        function mergeAuxSecFields(fields) {
            ctrl.mergedAuxSecFields = [];
            if (fields.hasOwnProperty('auxiliaryFields') || fields.hasOwnProperty('secondaryFields')) {
                if (fields.hasOwnProperty('auxiliaryFields') && fields.hasOwnProperty('secondaryFields')) {
                    ctrl.mergedAuxSecFields = fields.secondaryFields.concat(fields.auxiliaryFields);
                } else if (fields.hasOwnProperty('auxiliaryFields')) {
                    ctrl.mergedAuxSecFields = fields.auxiliaryFields;
                } else {
                    ctrl.mergedAuxSecFields = fields.secondaryFields;
                }
            }
        }

        function barcodeIsSquare() {
            return ctrl.hasOwnProperty('barcode') && ctrl.barcode.hasOwnProperty('format') && (ctrl.barcode.format == 'qrcode' || ctrl.barcode.format == 'azteccode');
        }
    }
})(window.angular, window.moment);