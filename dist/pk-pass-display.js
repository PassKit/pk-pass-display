/*
 * pk-pass-display v1.0.0
 * (c) 2016 PassKit, Inc. http://passkit.com
 * License: MIT
 */
(function (angular) {
    angular.module('pk-pass-display', []);
})(window.angular);
(function (angular, moment) {
    angular.module('pk-pass-display').component('pkApplePass', {
        controller: ['$http', PKApplePassController],
        template:'<style type="text/css">\n    #appleDisplay.pass .content .pass-value {color: {{$ctrl.passData.foregroundColor}} }\n    #appleDisplay.pass .content .pass-value:after {content: \'\'; color: {{$ctrl.passData.foregroundColor}} }\n    #appleDisplay.pass .content .pass-label {color: {{$ctrl.passData.labelColor}} }\n    #appleDisplay.pass .content {background-color: {{$ctrl.passData.backgroundColor}} }\n    #appleDisplay .boardingIcon path {fill: {{$ctrl.passData.labelColor}} }\n    #appleDisplay .primary-strip-img.show-img {background-image: url({{ $ctrl.images.strip || $ctrl.selectedLanguage.images.strip }}) }\n\n    #appleDisplay.pass-eventTicket .content:before{background: {{ $ctrl.bgColor || "#fff"}};}\n    .content:before, .content:after {background: linear-gradient(-45deg, transparent 10px, {{ $ctrl.bgColor || "#fff"}} 0), linear-gradient(45deg, transparent 10px, {{ $ctrl.bgColor || "#fff"}} 0);}\n    #appleDisplay.pass-boardingPass .pass-header {position: relative;}\n    #appleDisplay.pass-boardingPass .pass-header:before, #appleDisplay.pass-boardingPass .pass-header:after{\n        content: " ";\n        background-color: {{ $ctrl.bgColor || "#fff"}};\n        height: 10px;\n        width: 10px;\n        position: absolute;\n        bottom: -10px;\n        border-radius: 100%;\n    }\n    #appleDisplay.pass-boardingPass .pass-header:before{left: -15px;right: auto;}\n    #appleDisplay.pass-boardingPass .pass-header:after{left: auto;right: -15px;}\n</style><style type="text/css" ng-if="$ctrl.display.type == \'eventTicket\' &amp;&amp; !$ctrl.eventIsStripFormat">#appleDisplay.pass .content.show-img {background-image: url(\'{{ $ctrl.images.background || $ctrl.selectedLanguage.images.background }}\');background-size:cover; background-position:center;}</style><div id="appleDisplay" data-ng-class="{flipped: displayMode == \'back\'}" ng-if="$ctrl.display.wallet == \'appleWallet\'" class="pass pass-{{$ctrl.display.type}}"><div ng-class="{\'show-img\': $ctrl.display.type == \'eventTicket\' &amp;&amp; !$ctrl.eventIsStripFormat}" class="content"><div ng-class="{displayHide:$ctrl.flip}" class="flip-front"><div class="front"><div class="not-blurred"><div class="pass-header"><div class="row"><div data-ng-class="{\'col-xs-10\': $ctrl.fields.headerFields.length &lt; 2, \'col-xs-8\': $ctrl.fields.headerFields.length == 2, \'col-xs-6\': $ctrl.fields.headerFields.length == 3}" class="logo"><div class="image"><div class="image-wrapper"><img data-ng-src="{{ $ctrl.images.logo || $ctrl.selectedLanguage.images.logo }}"></div></div><div class="logoText pass-value">{{$ctrl.passData.logoText}}</div></div><div data-ng-class="{\'col-xs-2\': $ctrl.fields.headerFields.length &lt; 2, \'col-xs-4\': $ctrl.fields.headerFields.length == 2, \'col-xs-6\': $ctrl.fields.headerFields.length == 3}"><div class="row"><pk-apple-pass-field-group fields="$ctrl.fields.headerFields" data-type="header" lang="$ctrl.selectedLanguage" class="text-right"></pk-apple-pass-field-group></div></div></div></div><div data-ng-class="{\'show-img primary-strip-img normal\': $ctrl.display.type == \'coupon\' || $ctrl.display.type == \'storeCard\', \'show-img primary-strip-img event\': ($ctrl.display.type == \'eventTicket\' &amp;&amp; $ctrl.eventIsStripFormat)}"><div data-ng-if="$ctrl.display.type == \'boardingPass\'" class="primary row primary-boarding"><div class="col-xs-5"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div><div class="col-xs-2 text-center pass-label"><i class="fa fa-3x fa-fw {{ $ctrl.transitType }}"></i></div><div class="col-xs-5 text-right"><pk-apple-pass-field field="$ctrl.fields.primaryFields[1]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div></div><div data-ng-if="$ctrl.display.type == \'coupon\' || $ctrl.display.type == \'storeCard\'" class="primary row primary-strip"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div><div data-ng-if="$ctrl.display.type == \'eventTicket\' &amp;&amp; $ctrl.eventIsStripFormat" class="primary row primary-strip"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div><div data-ng-if="$ctrl.display.type == \'eventTicket\' &amp;&amp; !$ctrl.eventIsStripFormat" class="primary row"><div class="col-xs-9"><div class="primary row"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div><div class="secondary row"><pk-apple-pass-field-group fields="$ctrl.fields.secondaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div></div><div class="col-xs-3"><img data-ng-src="{{ $ctrl.images.thumbnail || $ctrl.selectedLanguage.images.thumbnail }}"></div></div><div data-ng-if="$ctrl.display.type == \'generic\'" class="primary row"><div data-ng-if="$ctrl.images.thumbnail || $ctrl.selectedLanguage.images.thumbnail"><div class="col-xs-8"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div><div class="col-xs-4"><img data-ng-src="{{ $ctrl.images.thumbnail || $ctrl.selectedLanguage.images.thumbnail }}"></div></div><div data-ng-if="!($ctrl.images.thumbnail || $ctrl.selectedLanguage.images.thumbnail)"><div class="col-xs-12"><pk-apple-pass-field field="$ctrl.fields.primaryFields[0]" lang="$ctrl.selectedLanguage"></pk-apple-pass-field></div></div></div></div><div class="extra-fields"><div data-ng-if="$ctrl.display.type == \'boardingPass\'"><div class="auxiliary row"><pk-apple-pass-field-group fields="$ctrl.fields.auxiliaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div><div class="secondary row"><pk-apple-pass-field-group fields="$ctrl.fields.secondaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div></div><div data-ng-if="$ctrl.display.type == \'coupon\' || $ctrl.display.type == \'storeCard\' || ($ctrl.display.type == \'generic\' &amp;&amp; $ctrl.barcodeIsSquare())"><div class="auxiliary secondary row"><pk-apple-pass-field-group fields="$ctrl.mergedAuxSecFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div></div><div data-ng-if="($ctrl.display.type == \'eventTicket\' &amp;&amp; $ctrl.eventIsStripFormat) || ($ctrl.display.type == \'generic\' &amp;&amp; !$ctrl.barcodeIsSquare())"><div class="secondary row"><pk-apple-pass-field-group fields="$ctrl.fields.secondaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div><div class="auxiliary row"><pk-apple-pass-field-group fields="$ctrl.fields.auxiliaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div></div><div data-ng-if="$ctrl.display.type == \'eventTicket\' &amp;&amp; !$ctrl.eventIsStripFormat"><div class="auxiliary secondary row"><pk-apple-pass-field-group fields="$ctrl.fields.auxiliaryFields" lang="$ctrl.selectedLanguage"></pk-apple-pass-field-group></div></div></div><div class="barcode-section barcodeRow text-center"><img class="footer" data-ng-src="{{ $ctrl.images.footer || $ctrl.selectedLanguage.images.footer }}"><div ng-class="{expired:$ctrl.passIsExpired}" data-ng-if="$ctrl.barcode"><div data-ng-if="!$ctrl.barcodeIsSquare()" class="row"><div class="col-xs-1"></div><div data-ng-if="!$ctrl.noAppleBarcode" class="col-xs-10 barcodeContainer"><img ng-src="https://d1ye292yvr7tf6.cloudfront.net/images/barcode.php?m={{$ctrl.barcode.message}}&amp;f={{$ctrl.barcode.format}}&amp;e=UTF-8&amp;x2=1" class="barcode rect"><div ng-show="!$ctrl.passIsExpired" class="text text-center">{{ $ctrl.barcode.altText }}</div><div ng-show="$ctrl.passIsExpired" class="text text-center text-muted">this pass has expired</div><div ng-if="!$ctrl.barcode.altText &amp;&amp; !$ctrl.passIsExpired" class="paddingInsteadOfAltText"></div></div><button ng-click="$ctrl.flipPass()" class="btn btn-default col-xs-1 info-button no-print">i</button></div><div data-ng-if="$ctrl.barcodeIsSquare()" class="row"><div class="col-xs-3"></div><div data-ng-if="!$ctrl.noAppleBarcode" class="col-xs-6 barcodeContainer"><img ng-src="https://d1ye292yvr7tf6.cloudfront.net/images/barcode.php?m={{$ctrl.barcode.message}}&amp;f={{$ctrl.barcode.format}}&amp;e=UTF-8&amp;x2=1" class="barcode square"><div ng-show="!$ctrl.passIsExpired" class="text text-center">{{ $ctrl.barcode.altText }}</div><div ng-show="$ctrl.passIsExpired" class="text text-center text-muted">this pass has expired</div><div ng-if="!$ctrl.barcode.altText &amp;&amp; !$ctrl.passIsExpired" class="paddingInsteadOfAltText"></div></div><div class="col-xs-3"></div><button ng-click="$ctrl.flipPass()" class="btn btn-default col-xs-1 info-button no-print">i</button></div></div><div data-ng-if="!$ctrl.barcode"><div class="row"><div class="col-xs-11"></div><button ng-click="$ctrl.flipPass()" class="btn btn-default col-xs-1 info-button no-print">i</button></div></div></div></div></div></div><div ng-class="{displayHide:!$ctrl.flip}" class="flip-back"><div class="back"><div class="row header"><button ng-click="$ctrl.flipPass()" translate class="btn btn-default col-xs-3 pull-right no-print">Done</button></div><div class="content-inner"><div data-ng-repeat="field in $ctrl.fields.backFields" class="back-field row"><pk-apple-pass-field field="field" lang="$ctrl.selectedLanguage" class="col-xs-12"></pk-apple-pass-field></div></div></div></div></div></div>',
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
(function (angular, moment) {
    angular.module('pk-pass-display').component('pkApplePassField', {
        controller: ["$sce", "$element", PKApplePassFieldController],
        template:'<div class="field"><div class="field-wrapper"><label class="pass-label">{{$ctrl.field.label}}</label> <span class="pass-value" data-ng-bind-html="$ctrl.getValue($ctrl.field)"></span></div></div>',
        bindings: {
            field: '<',
            lang: '<'
        }
    });

    function PKApplePassFieldController($sce, $element) {
        var ctrl = this;
    
        ctrl.$onChanges = onChanges;

        function onChanges(changesObj) {
            if (changesObj.hasOwnProperty("field") && ctrl.field != undefined) {
                fieldChange(ctrl.field);
            }
            if (changesObj.hasOwnProperty("lang") && ctrl.lang != undefined) {
                langReplace(ctrl.lang);
            }
        }

        //scope funcs
        ctrl.getValue = getValue;

        var TextAlignmentMap = {
            "PKTextAlignmentLeft":"left",
            "PKTextAlignmentCenter":"center",
            "PKTextAlignmentRight":"right",
            "PKTextAlignmentNatural":"justify"
        };
        
        var DateStyleMap = {
            "PKDateStyleNone":"none",
            "PKDateStyleShort":"short",
            "PKDateStyleMedium":"medium",
            "PKDateStyleLong":"long",
            "PKDateStyleFull":"full"
        };
        
        var CurrencyMap = {"AED":"د.إ.‏","AFN":"؋","ALL":"Lek","AMD":"դր.","ANG":false,"AOA":false,"ARS":"$","AUD":"$","AWG":false,"AZN":"man.","BAM":"KM","BBD":false,"BDT":"৳","BGN":"лв.","BHD":"د.ب.‏","BIF":false,"BMD":false,"BND":"$","BOB":"Bs","BOV":false,"BRL":"R$","BSD":false,"BTN":"Nu.","BWP":"P","BYR":"","BZD":"$","CAD":"$","CDF":false,"CHE":false,"CHF":"Fr.","CHW":false,"CLF":false,"CLP":"$","CNY":"￥","COP":"$","COU":false,"CRC":"₡","CUC":false,"CUP":false,"CVE":false,"CZK":"Kč","DJF":"Fdj","DKK":"kr","DOP":"RD$","DZD":"د.ج.‏","EGP":"ج.م.‏","ERN":"Nfk","ETB":false,"EUR":"€","FJD":false,"FKP":false,"GBP":"£","GEL":"","GHS":"GH₵","GIP":false,"GMD":false,"GNF":false,"GTQ":"Q","GYD":false,"HKD":"$","HNL":"L","HRK":"kn","HTG":false,"HUF":"Ft","IDR":"Rp","ILS":"₪","INR":"रु.","IQD":"د.ع.‏","IRR":"﷼","ISK":"kr","JMD":"$","JOD":"د.أ.‏","JPY":"￥","KES":false,"KGS":"сом","KHR":"៛","KMF":false,"KPW":false,"KRW":"₩","KWD":"د.ك.‏","KYD":false,"KZT":false,"LAK":"₭","LBP":"ل.ل.‏","LKR":"SL Re","LRD":false,"LSL":false,"LTL":"Lt","LVL":"Ls","LYD":"د.ل.‏","MAD":"د.م.‏","MDL":"","MGA":false,"MKD":"","MMK":"K","MNT":"₮","MOP":"MOP$","MRO":false,"MUR":false,"MVR":"ރ.","MWK":"","MXN":"$","MXV":false,"MYR":"RM","MZN":false,"NAD":false,"NGN":false,"NIO":"C$","NOK":"kr","NPR":"नेरू","NZD":"$","OMR":"ر.ع.‏","PAB":"B/.","PEN":"S/.","PGK":false,"PHP":"₱","PKR":"روپے","PLN":"zł","PYG":false,"QAR":"ر.ق.‏","RON":"RON","RSD":"дин.","RUB":"руб.","RWF":"RF","SAR":"ر.س.‏","SBD":false,"SCR":false,"SDG":"","SEK":"kr","SGD":"$","SHP":false,"SLL":false,"SOS":false,"SRD":false,"SSP":false,"STD":false,"SYP":"ل.س.‏","SZL":false,"THB":"฿","TJS":"сом","TMT":false,"TND":"د.ت.‏","TOP":"T$","TRY":"TL","TTD":"$","TWD":"NT$","TZS":"TSh","UAH":"₴","UGX":false,"USD":"$","USN":false,"USS":false,"UYI":false,"UYU":"$","UZS":"сўм","VEF":"Bs.F.","VND":false,"VUV":false,"WST":false,"XAF":false,"XAG":false,"XAU":false,"XBA":false,"XBB":false,"XBC":false,"XBD":false,"XCD":false,"XDR":false,"XFU":false,"XOF":"CFA","XPD":false,"XPF":false,"XPT":false,"XTS":false,"XXX":false,"YER":"ر.ي.‏","ZAR":"R","ZMK":false,"ZWL":false,"EEK":"kr"};
        
        var NumberStyleMap = {
            "PKNumberStyleDecimal":"decimal",
            "PKNumberStylePercent":"percent",
            "PKNumberStyleScientific":"scientific",
            "PKNumberStyleSpellOut":"spell",
        };
            
        function fieldChange(val) {
            if(val != null) {
                if(val.hasOwnProperty("textAlignment")) {
                    textAlign($element,TextAlignmentMap[val.textAlignment]);
                }
                if(val.hasOwnProperty("dateStyle")) {
                    /*
                        `json:"dateStyle,omitempty"`
                        `json:"ignoresTimeZone,omitempty"`
                        `json:"isRelative,omitempty"`
                        `json:"timeStyle,omitempty"`
                    */
                    ctrl.field.value = timeFormatValue(val.value, DateStyleMap[val.dateStyle]);
                }
                if(val.hasOwnProperty("currencyCode")) {
                    if(CurrencyMap[val.currencyCode]) {
                        ctrl.field.value = CurrencyMap[val.currencyCode] + val.value;
                    } else {
                        ctrl.field.value = val.currencyCode + val.value;
                    }
                }
                if(val.hasOwnProperty("numberStyle")) {
                    ctrl.field.value = numberFormat(val.value, NumberStyleMap[val.numberStyle]);
                }
            }
        }

        function langReplace(lang) {
            if (lang != null && lang.hasOwnProperty("text")) {
                for (var key in lang.text) {
                    if (lang.text.hasOwnProperty(key) && typeof ctrl.field !== "undefined") {
                        if(ctrl.field.hasOwnProperty("value") && ctrl.field.value == key) {
                            ctrl.field.value = lang.text[key];
                        }
                        if(ctrl.field.hasOwnProperty("label") && ctrl.field.label == key) {
                            ctrl.field.label = lang.text[key];
                        }
                        if(ctrl.field.hasOwnProperty("attributedValue") && ctrl.field.attributedValue == key) {
                            ctrl.field.attributedValue = lang.text[key];
                        }
                    }
                }
            }
        }

        function getValue(field) {
            var text = "";
            if(field != null) {
                if(field.hasOwnProperty("attributedValue")) {
                    text = field.attributedValue;
                } else {
                    text = field.value;
                }
            }
            return $sce.trustAsHtml(text.toString().replace(/\n/g, "<br>"));
        }
        
        function textAlign(e,alignment) {
            e.css('text-align', alignment);
        }
        
        //FIXME need to implement number format switch;
        function numberFormat(value, format) {
            switch(format) {
            case 'percent':
                return value+"%";
            default:
                return value;
            }
        }
        
        function timeFormatValue(date, style) {
            var format;
            switch(style) {
            case 'full': // Wednesday, July 17, 2019
                format = 'LLLL';
                break;
            case 'long': // July 17, 2019
                format = 'LL';
                break;
            case 'medium': // Jul 17, 2019
                format = 'll';
                break;
            case 'short': // 7/17/19 (short)
                format = 'l';
                break;
            default:
                return date;
            }
            return moment(date).format(format);
        }
    }
})(window.angular, window.moment);
(function (angular) {
    angular.module('pk-pass-display').component('pkApplePassFieldGroup', {
        controller: [PKApplePassFieldGroupController],
        template:'<div class="row field-group" ng-if="$ctrl.type == \'header\'" data-ng-repeat="field in $ctrl.fields.slice().reverse() track by $index" data-ng-style="{width: $ctrl.width}"><pk-apple-pass-field field="field" lang="$ctrl.lang"></pk-apple-pass-field></div><div class="row field-group" ng-if="$ctrl.type != \'header\'" data-ng-repeat="field in $ctrl.fields track by $index" data-ng-style="{width: $ctrl.width}"><pk-apple-pass-field field="field" lang="$ctrl.lang"></pk-apple-pass-field></div>',
        bindings: {
            fields: '<',
            lang: '<',
            type: '@'
        }
    });

    function PKApplePassFieldGroupController() {
        var ctrl = this;
    
        ctrl.$onChanges = onChanges;

        //Scope vars
        ctrl.width = "100%";

        function onChanges(changesObj) {
            if (changesObj.hasOwnProperty("fields") && ctrl.fields != undefined) {
                if(ctrl.fields != null) {
                    ctrl.width = Math.floor(100/ctrl.fields.length) + "%";
                }
            }
        }
    }
})(window.angular);