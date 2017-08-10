define(["./properties", "qlik", "jquery", "text!./background.css"],
    function(Props, qlik, $, cssContent) {
        'use strict';
        
		$('<style>').html( cssContent ).appendTo( 'head' );
        
        var app = qlik.currApp(this);
        //Function to enable console logging in debug mode.
        var logger = function() {
            var oldConsoleLog = null;
            var pub = {};
            pub.enableLogger = function enableLogger() {
                if (oldConsoleLog == null)
                    return;
                window['console']['log'] = oldConsoleLog;
            };

            pub.disableLogger = function disableLogger() {
                oldConsoleLog = console.log;
                window['console']['log'] = function() {};
            };
            return pub;
        }();

        return {
            // new object properties
            initialProperties: {
                version: 1.02,
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qDebugMode: true,
                    qInitialDataFetch: [{
                        qWidth: 10,
                        qHeight: 200
                    }]
                }
            },
            definition: Props,
            paint: function($element, layout) {

				function decimalToHex(d, padding) {
					var hex = Number(d).toString(16);
					padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

					while (hex.length < padding) {
						hex = "0" + hex;
					}

					return hex;
				}

				var BackgroundTrans = layout.background.transparency;

				function hexToRgb(hex) {
					var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
					return result ? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16)
					} : null;
				}

				var RGBAString = 'rgba(' + hexToRgb(layout.background.color).r + ',' + hexToRgb(layout.background.color).g  + ',' + hexToRgb(layout.background.color).b  + ',' + BackgroundTrans +')';

				$(document).ready(function () {
					console.log("ready");
					$('.qvt-sheet').css('background-color',RGBAString);
					var parentElement = $element[0].parentElement.parentElement.parentElement.parentElement.parentElement;
					$(parentElement).css("visibility","hidden");
				});


				if (layout.DebugMode == undefined) {
					var debugmode = false;
				} else {
					var debugmode = layout.DebugMode;
				}
				if (debugmode == true) {
					logger.enableLogger();
				} else {
					logger.disableLogger();
				}

			} //end return
                ////////////////////////////////////////////////////////
        } //close function
    }
); //close define