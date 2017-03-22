/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
    /**
 * Load JS hierarchically - loadHighJS
 * bootstrap  
 */
    "loadHighJS":function () {
    return new Promise(function (resolve, reject) {
        let bootstrap = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
        });
        $.when(bootstrap).done(function (bootstrapResponse) {
            resolve();
        }).fail(function (error) {
            reject(error);
        });
    });
},
/**
 * Load JS hierarchically - loadMediumJS
 * Boostrap Switch - JqueryMinHeight - Jquery Datatables
 */
    "loadMediumJS": function loadMediumJS() {
    return new Promise(function (resolve, reject) {
        let bootstrapSwitch = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js"
        });
        let jqueryMinHeight = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js"
        });
        let jqueryDataTables = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"
        });
        let pdfmake = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/pdfmake.min.js"
        });
        $.when(bootstrapSwitch, jqueryMinHeight, jqueryDataTables, pdfmake)
            .done(function (bootstrapSwitchResponse, jqueryMinHeightResponse, jqueryDataTablesResponse, pdfmakeResponse) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
    });
},
/**
 * Load JS hierarchically - LoadLowJS
 * Bootstrap Datatables - buttonsDatatble - vs_fonts
 */
    "LoadLowJS":function () {
    return new Promise(function (resolve, reject) {
        let bootstrapDataTables = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"
        });
        let vs_fonts = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/vfs_fonts.js"
        });
        $.when(vs_fonts)
            .done(function ( vs_fontsResponse) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
    });
},
    "loadLow2JS":function loadLowJS2(){
     return new Promise(function (resolve, reject) {
        let buttonsDataTables = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/buttons/1.2.4/js/dataTables.buttons.min.js"
        });
        let jszip = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"
        });
        let buttonsHTML5 = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/buttons/1.2.4/js/buttons.html5.min.js"
        });

        $.when(buttonsDataTables, jszip, buttonsHTML5)
            .done(function (buttonsDataTablesResponse, jszipResponse, buttonsHTML5) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
    });
},
/**
 * Load Custom JS - OWS JS Datamodel
 * Smart Engine - Application
 */
    "loadcustomJS":function(){
    return new Promise(function(resolve,reject){
        let smart_Engine = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=ed57f477-55af-48ae-ad63-70633c2ea5a6&attachmentId=689849"
            });
            let app = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=5b674633-91a7-4b71-ba90-88431847ae47&attachmentId=655573"
            });
            $.when(smart_Engine, app)
                .done(function (smart_EngineResponse, appResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
    });
}
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Load All Pages - Side Menu
 * Make an Ajax Request to get all the pages from OWS HTML Datamodel
 */
function loadAllPages() {
    return new Promise(function (resolve, reject) {
        var pagesSaved = [];
        var http = new XMLHttpRequest();
        var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_html_pages_getList,userId:" + USER_ID + ",tenantId:" + tenantId + "}";
        var params = "start=0&limit=100&csrfToken=" + csrfToken + "&serviceId=co_sm_html_pages_getList";
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                let pages = JSON.parse(http.response).results;
                resolve(pages);
            }
            else if (http.readyState == 4 && http.status != 200) {
                reject(http.status);
            }
        }
        http.send(params);
    });
}

module.exports = {
    "loadAllPages": loadAllPages()
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Load Fonts from Google Apis
 * Family = Lato & Family = Roboto
 */
function loadFonts() {
    return new Promise(function (resolve, reject) {
        let latoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Lato"
        });
        let robotoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Roboto"
        });
        $.when(latoFonts, robotoFonts).done(function (latoFontsResponse, robotoFontsResponse) {
            $('<style />').text(latoFontsResponse).appendTo($('head'));
            $('<style />').text(robotoFontsResponse).appendTo($('head'));
            resolve();
            console.log("loadFontsLibs has Loaded");
        }).fail(function (error) {
            console.log("loadFontsLibs has Failed");
            reject(error);
        })
    });
}
/**
 * Load Icons from fontAwesome
 */
function loadIcons() {
    return new Promise(function (resolve, reject) {
        let fontAwesome = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://use.fontawesome.com/4e0d3cfdd0.js"
        });
        $.when(fontAwesome).done(function (fontAwesomeResponse) {
            resolve();
            console.log("loadIconLibs has Loaded");
        }).fail(function (error) {
            reject(error);
            console.log("loadIconLibs has Failed");
        });
    });
}
/**
 * Load CSS Libs like Bootstrap, Datatables , Animate, DataButtons...
 */
function loadCSS() {
    return new Promise(function (resolve, reject) {
        let bootstrap = $.ajax({
            method: "GET",
            url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        });
        let animate = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        });
        let select2 = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css"
        });
        let buttonsDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css"
        });
        let bootstrapDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/1.10.13/css/dataTables.bootstrap.min.css"
        });
        let jqueryDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"
        });

        $.when(bootstrap, animate, select2, buttonsDataTables, bootstrapDataTables, jqueryDataTables)
            .done(function (bootstrapRespond, animateRespond, select2Respond, buttonsDataTablesRespond, bootstrapDataTablesRespond, jqueryDataTablesRespond) {

                $('<style />').text(bootstrapRespond).appendTo($('head'));
                $('<style />').text(animateRespond).appendTo($('head'));
                $('<style />').text(select2Respond).appendTo($('head'));
                $('<style />').text(buttonsDataTablesRespond).appendTo($('head'));
                //$('<style />').text(bootstrapDataTablesRespond).appendTo($('head'));
                $('<style />').text(jqueryDataTablesRespond).appendTo($('head'));
                resolve();
                console.log("loadCssLibs has Loaded");
            }).fail(function (error) {
                reject(error);
                console.log("loadCssLibs has failed");
            });
    });
}
/**
 * Load Custom Libs from OWS CSS Datamodel 
 */
function loadCustomLibs(){
    return new Promise(function(resolve,reject){
        let style = $.ajax({
                method: "GET",
                url: "https://100l-app.teleows.com/servicecreator/pageruntime/pageScript.action?appName=CO_SMART_DOCS&name=style%20&type=css"
            });
            let flat_blue = $.ajax({
                method: "GET",
                url: "https://100l-app.teleows.com/servicecreator/pageruntime/pageScript.action?appName=CO_SMART_DOCS&name=flat%20blue&type=css"
            });
            $.when(style, flat_blue).done(function (styleResponse, flat_blueResponse) {
                $('<style />').text(styleResponse).appendTo($('head'));
                $('<style />').text(flat_blueResponse).appendTo($('head'));
                resolve();
                console.log("loadCustomLibs has Loaded");
            }).fail(function (error) {
                console.log("loadCustomLibs has Failed");
                reject(error);
            });
    });
}
module.exports = {
    "loadFonts": loadFonts(),
    "loadIcons": loadIcons(),
    "loadCSS":loadCSS(),
    "loadCustomCss":loadCustomLibs()
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Check if the user exist on Smart Docs Users Datamodel
 * Make a Ajax Request to get the worker and then call get smart users service
 */

function checkUserSmart() {
    return new Promise(function (resolve, reject) {
        let workerUserRegister = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=5a564cec-9b0e-4a96-a74a-2fbb9bbac180&attachmentId=fcd25cd8-9e5e-470d-8f33-3b5a51421a2f"
        });
        $.when(workerUserRegister).done(function (workerUserRegisterResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerUserRegister')
                .text(workerUserRegisterResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerUserRegister").text()
            ], { type: "text/javascript" })
            var worker = new Worker(URL.createObjectURL(blob));

            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - Smart Register User has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - Smart Register User has Failed");
            reject(error);
        });
    });
}

/**
 * Get the curren time on Local Time based on UTC Server Time 
 * Make a Ajax Request to get the worker and then call currentTime service 
 */

function currentTime() {
    return new Promise(function (resolve, reject) {
        let workerCurrentTime = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=425c4286-6102-43b0-9833-b151990734f5&attachmentId=19293cb6-5f7e-48a0-8e48-ab92abbfb207"
        });
        $.when(workerCurrentTime).done(function (workerCurrentTimeResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerCurrentTime')
                .text(workerCurrentTimeResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerCurrentTime").text()
            ], { type: "text/javascript" })

            var worker = new Worker(URL.createObjectURL(blob));
            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - Current Time has Loaded");

        }).fail(function (error) {
            reject(error);
            console.log("[Wk] - Current Time has Failed");
        });
    });
}

module.exports = {
    checkUserSmart: checkUserSmart(),
    getCurrentTime: currentTime(),
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

$(function () {
    let workers = __webpack_require__(3);
    let cssLibs = __webpack_require__(2);
    let jsLibs = __webpack_require__(0);
    let pages = __webpack_require__(1);


    let smart = {
        onInit: function () {
            let reference = this;
            $("link").remove();
            workers.getCurrentTime.then(function (data) {
                reference.currentTime = data;
                console.log("CurrentTime" + reference.currentTime);
            });
            workers.checkUserSmart.then(function (data) {
                reference.userRegisterOnSmart = (Object.keys(data).length === 0);
                console.log("Check User Smart:" + reference.userRegisterOnSmart);
            });
            reference.addMessageLoder();
            cssLibs.loadFonts.then(function () {
                console.log("Fonts libs were loaded");
                reference.changeMessageLoader("loaderContent", "Fonts Libs were loaded");
                return cssLibs.loadIcons;
            }).then(function () {
                console.log("Icons libs were loaded");
                reference.changeMessageLoader("loaderContent", "Icons libs were loaded");
                return cssLibs.loadCSS;
            }).then(function () {
                console.log("CSS Libs were loaded");
                reference.changeMessageLoader("loaderContent", "CSS Libs were loaded");
                return cssLibs.loadCustomCss;
            }).then(function () {
                console.log("CSS Custom Libs were loaded");
                reference.changeMessageLoader("loaderContent", "CSS Custom Libs were loaded");
                return jsLibs.loadHighJS;
            }).then(function () {
                console.log("High JS were loaded");
                reference.changeMessageLoader("loaderContent", "High JS were loaded");
                return jsLibs.loadMediumJS;
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                reference.changeMessageLoader("loaderContent", "JS Medium Libs were loaded");
                return jsLibs.LoadLowJS;
            }).then(function () {
                console.log("JS Low Libs were loaded");
                reference.changeMessageLoader("loaderContent", "JS Low Libs were loaded");
                return jsLibs.LoadLowJS2;
            }).then(function () {
                console.log("JS Low 2 were loaded");
                reference.changeMessageLoader("loaderContent", "JS Low 2 were loaded");
            }).then(function () {
                console.log("Js High was loader");
                reference.changeMessageLoader("loaderContent", "Js High was loaded");
                return pages.loadAllPages;
            }).then(function (data) {
                reference.changeMessageLoader("loaderContent", "Pages were loaded");
                reference.pages = data;
                reference.bootstrapMenu("page-022");
            })
                .catch(function (error) {
                    console.log(error);
                    reference.changeMessageLoader("loaderContent", "Ha ocurrido un error: "+ error);
                });
        },
        addMessageLoder: function () {
            $("body").addClass("loader");
            $("body").append("<div id='loader' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Recursos <div id='loaderContent'> </div> </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
        },
        changeMessageLoader: function (selector, msg) {
            $("#" + selector).text(msg);
        },
        userRegisterOnSmart: "",
        currentTime: "",
        pages: "",
        bootstrapMenu: function (id_page) {
            let reference = this;
            var pageFilter = reference.pages.filter(function (page) {
                return page.id_page == id_page;
            });
            console.log(pageFilter);

            var attachmentId = pageFilter[0].page_file.attachment[0].attachmentId;
            var batchId = pageFilter[0].page_file.attachment[0].batchId;

            $.get("https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId, function (pageCode) {

                $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
                $('body').addClass("flat-blue");
                $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
                $('.content-container').append(pageCode);
            })
        }
    }

    smart.onInit();
});

/***/ })
/******/ ]);