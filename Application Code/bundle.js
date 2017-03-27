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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
 * Get the information from Users Datamodel
 * Make a Ajax Request to get the worker and then call get user service
 */
function getUserInformation() {
    return new Promise(function (resolve, reject) {
        let workerUserInformation = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=3e9d8bc0-999e-434f-aeeb-dda673659611&attachmentId=88315474-b2b2-4751-9e8a-2ab077c8ac94"
        });
        $.when(workerUserInformation).done(function (workerUserInformationResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerUserInformation')
                .text(workerUserInformationResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerUserInformation").text()
            ], { type: "text/javascript" })
            var worker = new Worker(URL.createObjectURL(blob));

            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - User Information has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - User Information User has Failed");
            reject(error);
        });
    });
}

/**
 * Get the Groups from Users Groups Datamodel
 * Make a Ajax Request to get the worker and then call get user groups service
 */
function getUserGroups() {
    return new Promise(function (resolve, reject) {
        let workerUserGroups = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=77d6e69f-f30e-4519-804e-65e5ec407dbf&attachmentId=350e4762-971a-4651-a771-b326b710f0eb"
        });
        $.when(workerUserGroups).done(function (workerUserGroupsResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerUserGroups')
                .text(workerUserGroupsResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerUserGroups").text()
            ], { type: "text/javascript" })
            var worker = new Worker(URL.createObjectURL(blob));

            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - User Information has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - User Information User has Failed");
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
    getUserInformation: getUserInformation(),
    getUserGroups: getUserGroups(),
    getReports: /**
 * Get the Reports from Reports Datamodel
 * Make a Ajax Request to get the worker and then call get report get list service
 */
    function getReports(group) {
        return new Promise(function (resolve, reject) {
            let workerReports = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=323a10d1-c070-4c7b-b9f7-f13056e5043c&attachmentId=377833db-d7f8-4292-bbbe-744a82568070"
            });
            $.when(workerReports).done(function (workerReportsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerReports')
                    .text(workerReportsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerReports").text()
                ], { type: "text/javascript" })

                $("#workerReports").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId, "group": group }); // Send data to our worker.

                console.log("[Wk] - Get Reports has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Reports User has Failed");
                reject(error);
            });
        });
    },
     getTickets: /**
 * Get the Tickets from Reports Datamodel
 * Make a Ajax Request to get the worker and then call get tickets get list service
 */
    function getTickets() {
        return new Promise(function (resolve, reject) {
            let workerTickets = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=36b8f29d-79cf-488a-9e6d-70d118e81dec&attachmentId=689fcf33-651c-4345-bf20-97c738c2dc13"
            });
            $.when(workerTickets).done(function (workerTicketsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTickets')
                    .text(workerTicketsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTickets").text()
                ], { type: "text/javascript" })

                $("#workerTickets").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

                console.log("[Wk] - Get Tickets has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Tickets has Failed");
                reject(error);
            });
        });
    },
    getTemplates:
    /**
 * Get the templates from Templates Datamodel
 * Make a Ajax Request to get the worker and then call get templates get list service
 */
function getTemplates(project) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=8bc8f750-9601-49f1-b953-c79f1f45b795&attachmentId=602b101b-d920-4357-8f3a-a92f1e6ebb67"
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId, "project":project }); // Send data to our worker.

                console.log("[Wk] - Get Templates has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Templates has Failed");
                reject(error);
            });
        });
    },
    getTemplate: 
    function getTemplate(batchIdWeb,attachmentIdWeb,batchIdPdf,attachmentIdPdf) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=ffea72c8-47f1-4c10-9516-426e55cf2270&attachmentId=c7dea7cc-1246-4cdb-80af-53f25b4b4b1e"
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({"batchIdWeb":batchIdWeb,"attachmentIdWeb":attachmentIdWeb,"batchIdPdf":batchIdPdf,"attachmentIdPdf":attachmentIdPdf}); // Send data to our worker.

                console.log("[Wk] - Get Template has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Template has Failed");
                reject(error);
            });
        });
    }
    
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

let workers = __webpack_require__(0);

module.exports = {
    allTickets: "",
    loadTickets: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            workers.getTickets().then(function (data) {
                reference.allTickets = JSON.parse(data)[0];
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    ticketSelected:""
}

/***/ }),
/* 2 */
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
    "loadLowJS":function () {
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
    "loadLow2JS":function(){
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports = {
    addMessageLoder: function (selector,location) {
        $(location).addClass("loader");
        $(location).append("<div id='loader' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Recursos <div id='"+selector+"'> </div> </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
    },
    changeMessageLoader: function (selector, msg) {
        console.log("Selector: "+ selector);
        console.log("Message: " + msg);
        $("#" + selector).text(msg);
    },
    removeMessageLoader: function (location){
        $("#loader").remove();
        $(location).removeClass("loader");
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

let tickets = __webpack_require__(1);
let reports = __webpack_require__(6);
let templates = __webpack_require__(7);

module.exports = {
    loadAllPages: function () {
        let reference = this;
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
                    reference.pages = JSON.parse(http.response).results;
                    resolve();
                }
                else if (http.readyState == 4 && http.status != 200) {
                    reject(http.status);
                }
            }
            http.send(params);
        });
    },
    pages: "",
    userGroup: "",
    filterPage: function (id_page) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            var pageFilter = reference.pages.filter(function (page) {
                return page.id_page == id_page;
            });
            console.log(pageFilter);

            var attachmentId = pageFilter[0].page_file.attachment[0].attachmentId;
            var batchId = pageFilter[0].page_file.attachment[0].batchId;

            $.get("https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId, function (pageCode) {
                resolve(pageCode);
            }).fail(function (error) {
                reject("error");
            })
        });
    },
    bootstrapMenu: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            reference.filterPage('page-022').then(function (pageCode) {
                reference.changeMenuContent(pageCode);
                reference.addEventsToMenuItems();
                return reference.filterPage("page-004");
            }).then(function (pageCode) {
                reference.changeMainContent(pageCode);
                //reference.loadResources("page-004");
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    bootstrapPage: function (page_id) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            reference.filterPage(page_id).then(function (pageCode) {
                reference.changeMainContent(pageCode);
                reference.loadResources(page_id);
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    changeMenuContent: function (pageCode) {
        $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
        $('body').addClass("flat-blue");
        $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
        $('.content-container').append(pageCode);
    },
    changeMainContent: function (pageCode) {
        $("#mainContent2").html("");
        $('#mainContent2').append(pageCode);
    },
    menuItems: function () {
        let items = [
            { id: "itemInicio", id_page: "page-004" },
            { id: "itemTareas", id_page: "page-008" },
            { id: "itemReportes", id_page: "page-014" },
            { id: "itemDeveloper", id_page: "" },
            { id: "itemTesting", id_page: "" },
            { id: "itemCreator", id_page: "" },
            { id: "itemFaq", id_page: "" }
        ];
        return items;
    },
    addEventsToMenuItems: function () {
        let reference = this;
        for (let menu_item of reference.menuItems()) {
            $("#" + menu_item.id).click(function () {
                reference.bootstrapPage(menu_item.id_page).then(function () {
                    reference.changeActiveMenu(menu_item.id);
                });
            });
        }
    },
    changeActiveMenu: function (id_page) {
        $(".active").removeClass("active");
        $("#" + id).addClass("active");
    },
    showUserInformationNav: function (userInformation) {
        $("#userFullname").text(userInformation.fullname);
        $("#userFullname").append("<span class='caret'></span>");
        $("#userRol").text(userInformation.userGroups);
        $("#userGroup").text(userInformation.userGroup);
        $("#explainUserGroup").text("Group Information");
        $("#userAccount").text(userInformation.username);
        $("#userEmail").text(userInformation.email);
    },
    hideMenuItems: function (userGroup) {
        let reference = this;
        reference.userGroup = userGroup;
        switch (userGroup) {
            case "Quality":
                $("#itemInicio").show();
                $("#itemTareas").hide();
                $("#itemReportes").show();
                $("#itemInventarios").show();
                $("#itemUsers").hide();
                $("#itemDeveloper").hide();
                $("#itemTesting").hide();
                $("#itemCreator").show();
                $("#itemFaq").show();
                break;
            case "FME":
                $("#itemInicio").show();
                $("#itemTareas").show();
                $("#itemReportes").show();
                $("#itemInventarios").show();
                $("#itemUsers").hide();
                $("#itemDeveloper").hide();
                $("#itemTesting").hide();
                $("#itemCreator").hide();
                $("#itemFaq").show();
                break;
            case "Developer":
                $("#itemInicio").show();
                $("#itemTareas").hide();
                $("#itemReportes").hide();
                $("#itemInventarios").hide();
                $("#itemUsers").show();
                $("#itemDeveloper").show();
                $("#itemTesting").show();
                $("#itemCreator").show();
                $("#itemFaq").hide();
                break;
            case "Admin":
                $("#itemInicio").show();
                $("#itemTareas").hide();
                $("#itemReportes").show();
                $("#itemInventarios").show();
                $("#itemUsers").show();
                $("#itemDeveloper").hide();
                $("#itemTesting").hide();
                $("#itemCreator").hide();
                $("#itemFaq").hide();
                break;

        }
    },
    loadResources: function (page_id) {
        let reference = this;
        switch (page_id) {
            //Home Page
            case "page-004":
                reports.loadStatistic(reference.userGroup).then(function () {
                    reports.changeBoxStatistic(reports.allReports);
                });
                //reference.loadStatistic("", "statisticTotal");
                //reference.loadStatistic("SM-Status002", "statisticCompleted");
                //reference.loadStatistic("SM-Status003", "statisticApproved");
                //reference.loadStatistic("SM-Status004", "statisticRejected");
                //reference.deletePageLoader();
                break;
            //All Tickets Page    
            case "page-008":
                tickets.loadTickets().then(function () {
                    reference.changeTicketsPage(tickets.allTickets);
                });
                break;
            //All Templates Page    
            case "page-007":
                templates.loadTemplates(tickets.ticketSelected.project).then(function () {
                    reference.changeTemplatesPage(templates.allTemplates);
                });
                break;
            //New Report Page
            case "page-005":
                let templateSelected = templates.templateSelected;
                
                templates.loadTemplate(templateSelected.template_web.attachment[0].batchId,
                templateSelected.template_web.attachment[0].attachmentId,
                templateSelected.template_pdf.attachment[0].batchId,
                templateSelected.template_pdf.attachment[0].attachmentId).then(function (){
                    console.log("Load Template: ", templates.template);
                });

                break;
            //My Reports    
            case "page-014":
                reports.fillMyReports();
                break;
            //Detail Report    
            case "page-021":

                break;
            //Upload File
            case "page-013":

        }
    },
    changeBoxStatistic: function (allReports) {
        let reference = this;
        let statusFME = [
            { status: "SM-Status002", selector: "statisticCompleted", labelSel: "labelStatisticCompleted", label: "Reportes Completados (SOLO YO)" },
            { status: "SM-Status003", selector: "statisticApproved", labelSel: "labelStatisticApproved", label: "Reportes Aprobados (SOLO YO)" },
            { status: "SM-Status004", selector: "statisticRejected", labelSel: "labelStatisticRejected", label: "Reportes Rechazados (SOLO YO)" },
        ]

        let statusQUALITY = [
            { status: "SM-Status002", selector: "statisticCompleted", labelSel: "labelStatisticCompleted", label: "Reportes Completados (EN EL SISTEMA)" },
            { status: "SM-Status003", selector: "statisticApproved", labelSel: "labelStatisticApproved", label: "Reportes Aprobados (EN EL SISTEMA)" },
            { status: "SM-Status004", selector: "statisticRejected", labelSel: "labelStatisticRejected", label: "Reportes Rechazados (EN EL SISTEMA)" },
        ]

        switch (reference.userGroup) {
            case "FME":

                $("#labelStatisticTotal").text("Total Reportes (Solo Yo)");
                $("#statisticTotal").text(allReports.length);

                for (let statusFilter of statusFME) {
                    var reportFiltered = allReports.filter(function (report) {
                        return report.status_id == statusFilter.status;
                    });
                    $("#" + statusFilter.labelSel).text(reportFiltered.label);
                    $("#" + statusFilter.selector).text(reportFiltered.length);
                }

                break;

            case "Quality":
                $("#labelStatisticTotal").text("Total Reportes (SISTEMA)");
                $("#statisticTotal").text(allReports.length);

                for (let statusFilter of statusFME) {
                    var reportFiltered = allReports.filter(function (report) {
                        return report.status_id == statusFilter.status;
                    });
                    $("#" + statusFilter.labelSel).text();
                    $("#" + statusFilter.selector).text(reportFiltered.length);
                }
                break;
        }
    },
    changeTicketsPage: function (allTickets) {
        let reference = this;
        let PMLength = (allTickets.PM != undefined) ? allTickets.PM.total : 0;
        let CMLength = (allTickets.CM != undefined) ? allTickets.CM.total : 0;
        let PMLLength = (allTickets.PLM != undefined) ? allTickets.PLM.total : 0;
        let ticketsType = ["PM", "CM", "PLM"];

        if (PMLength == 0) {
            ticketsType.splice(ticketsType.indexOf("PM"), 1)
        }
        if (CMLength == 0) {
            ticketsType.splice(ticketsType.indexOf("CM"), 1)
        }
        if (PMLLength == 0) {
            ticketsType.splice(ticketsType.indexOf("PLM"), 1)
        }

        if (PMLength > 0 || CMLength > 0 || PMlLength > 0) {
            $("#ticketsNotFound").remove();
            let cont = 0;
            for (let ticket_type of ticketsType) {
                for (let ticket of allTickets[ticket_type].results) {
                    ticket.ticket_priority = (ticket.ticket_priority == undefined) ? " N/A" : ticket.ticket_priority;
                    $("#allTicketsDiv").append("<div class='col-sm-12 col-md-6 col-lg-3'><div class='pricing-table yellow'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + ticket.subject + "</div><div class=pricing-type> Reportes Asociados: 0 </div></div></div><div class=pt-body><h4>" + ticket.type + " - " + ticket.project + "</h4><ul class=plan-detail><li><b>Region :</b> " + ticket.region + " - " + ticket.city + "<li><b>Prioridad : </b>" + ticket.ticket_priority + "<li><b>Estado : </b>" + ticket.status + "<li><b>Ticket Id:<br></b>CM-" + ticket.orderid + "</ul></div><div class=pt-footer><button id='doReport_" + cont + "' class='btn btn-warning'type=button>Realizar Reporte</button></div></div></div>");
                    $("#doReport_" + cont).on("click", {
                        val:
                        {
                            "project": ticket.project,
                            "region": ticket.region,
                            "site_id": ticket.site,
                            "site_name": ticket.site_name,
                            "ticket_id": ticket_type + "-" + ticket.orderid,
                            "work_client": ticket.customer_tt,
                            "supplier": ticket.site_contractor
                        }
                    }, function (event) {
                        console.log("Click on Report", event.data.val);
                        tickets.ticketSelected = event.data.val;
                        reference.bootstrapPage("page-007");

                    });
                    cont++;
                }
            }
        }
    },
    changeTemplatesPage: function (allTemplates) {
        let reference = this;
        let attachmentId;
        let batchId;
        let cont = 0;
        if (allTemplates.length > 0) {
            $("#templatesNotFound").remove();
            for (let template of allTemplates) {
                attachmentId = template.icon_template.attachment[0].attachmentId;
                batchId = template.icon_template.attachment[0].batchId;
                $("#allTemplatesDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + template.template_name + "</div><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + template.id_template + "!--></div></div></div><div class=pt-footer><p><b>Ultima Actualizacion: </b> " + template.template_date + " </p><button id='createTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button>Crear Reporte</button></div></div></div>");
                $("#createTemplate_" + cont).on("click", {
                    val:
                    { id_template: template.id_template, template_name: template.template_name, template_pdf: template.template_pdf, template_project: template.template_project, template_web: template.template_web }
                }, function (event) {
                    templates.templateSelected = event.data.val;
                    console.log(templates.templateSelected);
                    reference.bootstrapPage("page-005");
                });
                cont += 1;
            }
        }
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

let workers = __webpack_require__(0);
module.exports = {
    allReports: "",
    allTickets:"",
    userGroup: "",
    loadStatistic: function (userGroup) {
        let reference = this;
        reference.userGroup = userGroup;
        return new Promise(function (resolve, reject) {
            workers.getReports(userGroup).then(function (data) {
                reference.allReports = JSON.parse(data)[0].results;
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    fillMyReports: function () {
        let reference = this;
        //Save the reference of one report to don't add again
        let wrapReports = [];

        let reportsFiltered = reference.allReports.filter(function (report) {
            console.log(wrapReports.indexOf(report.ticket_id));
            if(wrapReports.indexOf(report.ticket_id) == -1){
                wrapReports.push(report.ticket_id);
                return report;
            }
        });

        console.log("Wrap Reports: " , reportsFiltered)
        
       /*
        let cont = 0;
        for (let recordsContainer of reports) {
            for (let records of recordsContainer.results) {

                $("#" + table + " > tbody").append("<tr class=" + records.class_sm + "><td style='cursor:pointer' id='" + item_name + cont + "'>" + records.ticket_id + "</td><td>" + records.template_name + "</td><td>" + records.site_id + "</td><td>" + records.site_name + "</td><td>" + records.work_client + "</td><td>" + records.project + "</td><td>" + records.region + "</td><td style='text-align:-webkit-center'>" + records.status + "</td><td>" + records.creation_date + "</td><td>" + records.author + "</td><td>" + records.id_report + "</td><td><input id='" + item_name + cont + "Details' type='image' name='image' src='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/eye-24-20.png'></td></tr>");

                $('#' + item_name + cont).add('#' + item_name + cont + "Details").on("click",
                    {
                        "approval_date": records.approval_date,
                        "approver": records.approver,
                        "author": records.author,
                        "comment": records.comment,
                        "completed_date": records.completed_date,
                        "creation_date": records.creation_date,
                        "file": records.file,
                        "file_location": records.file_location,
                        "id_report": records.id_report,
                        "last_modification": records.last_modification,
                        "modified_by": records.modified_by,
                        "project": records.project,
                        "region": records.region,
                        "rejected_date": records.rejected_date,
                        "site_id": records.site_id,
                        "site_name": records.site_name,
                        "status": records.status,
                        "status_id": records.status_id,
                        "supplier": records.supplier,
                        "ticket_id": records.ticket_id,
                        "web_template": records.template_name,
                        "web_template_location": records.web_template_location,
                        "web_template_form": records.web_template_form,
                        "work_client": records.work_client,
                        "class_sm": records.class_sm
                    }
                    , function (event) {
                        let ticket_selected = {
                            "approval_date": (event.data.approval_date == undefined) ? "" : event.data.approval_date,
                            "approver": (event.data.approver == undefined) ? "" : event.data.approver,
                            "author": (event.data.author == undefined) ? "" : event.data.author,
                            "comment": (event.data.comment == undefined) ? [] : event.data.comment,
                            "completed_date": (event.data.completed_date == undefined) ? "" : event.data.completed_date,
                            "creation_date": (event.data.creation_date == undefined) ? "" : event.data.creation_date,
                            "file": (event.data.file == undefined) ? "" : event.data.file,
                            "file_location": (event.data.file_location == undefined) ? "" : event.data.file_location,
                            "id_report": (event.data.id_report == undefined) ? "" : event.data.id_report,
                            "last_modification": (event.data.last_modification == undefined) ? "" : event.data.last_modification,
                            "modified_by": (event.data.modified_by == undefined) ? "" : event.data.modified_by,
                            "project": (event.data.project == undefined) ? "" : event.data.project,
                            "region": (event.data.region == undefined) ? "" : event.data.region,
                            "rejected_date": (event.data.rejected_date == undefined) ? "" : event.data.rejected_date,
                            "site_id": (event.data.site_id == undefined) ? "" : event.data.site_id,
                            "site_name": (event.data.site_name == undefined) ? "" : event.data.site_name,
                            "status": (event.data.status == undefined) ? "" : event.data.status,
                            "status_id": (event.data.status_id == undefined) ? "" : event.data.status_id,
                            "supplier": (event.data.supplier == undefined) ? "" : event.data.supplier,
                            "ticket_id": (event.data.ticket_id == undefined) ? "" : event.data.ticket_id,
                            "web_template": (event.data.web_template == undefined) ? "" : event.data.web_template,
                            "web_template_location": (event.data.web_template_location == undefined) ? "" : event.data.web_template_location,
                            "web_template_form": (event.data.web_template_form == undefined) ? "" : event.data.web_template_form,
                            "work_client": (event.data.work_client == undefined) ? "" : event.data.work_client,
                            "class_sm": (event.data.class_sm == undefined) ? "" : event.data.class_sm
                        };

                    })
                cont += 1;
            }

        }
            */
    }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

let workers = __webpack_require__ (0);
let tickets = __webpack_require__ (1);
module.exports ={
    allTemplates: "",
    templateSelected : "",
    template : "",
    loadTemplates: function(project){
        let reference = this;
        return new Promise(function(resolve,reject){
         workers.getTemplates(project).then(function(data){
            reference.allTemplates = JSON.parse(data).results; 
            console.log("All Tempates",reference.allTemplates);
            console.log("Type Of:"+ typeof (reference.allTemplates));
            resolve();
        }).catch(function(error){
            reject(error);
        });    
        });
       
    },
    loadTemplate:function(batchIdWeb,attachmentWeb,batchIdPdf,attachmentPdf){
        let reference = this;
        return new Promise(function (resolve,reject){
            workers.getTemplate(batchIdWeb,attachmentWeb,batchIdPdf,attachmentPdf).then(function(loadTemplateResponse){
                reference.template = loadTemplateResponse;
                console.log(reference.template);
                resolve();
            }).catch(function (error){
                reject(error);
            });
        });
    }
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

$(function () {
    let workers = __webpack_require__(0);
    let cssLibs = __webpack_require__(3);
    let jsLibs = __webpack_require__(2);
    let message = __webpack_require__(4);
    let pages = __webpack_require__(5);

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

            message.addMessageLoder("pageLoaderContent", "body");
            cssLibs.loadFonts.then(function () {
                console.log("Fonts libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Fonts Libs were loaded");
                return cssLibs.loadIcons;
            }).then(function () {
                console.log("Icons libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Icons libs were loaded");
                return cssLibs.loadCSS;
            }).then(function () {
                console.log("CSS Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "CSS Libs were loaded");
                return cssLibs.loadCustomCss;
            }).then(function () {
                console.log("CSS Custom Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "CSS Custom Libs were loaded");
                return jsLibs.loadHighJS();
            }).then(function () {
                console.log("High JS were loaded");
                message.changeMessageLoader("pageLoaderContent", "High JS were loaded");
                return jsLibs.loadMediumJS();
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Medium Libs were loaded");
                return jsLibs.loadLowJS();
            }).then(function () {
                console.log("JS Low Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Low Libs were loaded");
                return jsLibs.loadLow2JS();
            }).then(function () {
                console.log("JS Low 2 were loaded");
                message.changeMessageLoader("pageLoaderContent", "Js Low 2  were loaded");
                return pages.loadAllPages();
            }).then(function (data) {
                message.changeMessageLoader("pageLoaderContent", "Pages were loaded");
                pages.bootstrapMenu("page-022").then(function () {
                    return workers.getUserGroups;
                }).then(function (data) {
                    message.changeMessageLoader("pageLoaderContent", "User Groups was loaded");
                    let userGroups = JSON.parse(data).results;
                    let userGroupsEdited = []
                    for (let group of userGroups) {
                        userGroupsEdited.push({ group_id: group.group_id, group_fullname: group.group_fullname });
                    }
                    reference.userGroups = userGroupsEdited;
                    console.log("User Groups: " + reference.userGroups);
                    return workers.getUserInformation;
                })
                    .then(function (data) {
                        message.changeMessageLoader("pageLoaderContent", "User Information was loaded");
                        reference.userInformation = JSON.parse(data).result;
                        pages.showUserInformationNav(reference.userInformation);
                        reference.grantPermissions(reference.userGroups);
                    });
            })
                .catch(function (error) {
                    console.log(error);
                    message.changeMessageLoader("pageLoaderContent", "Ha ocurrido un error: " + JSON.stringify(error));
                });
        },
        userRegisterOnSmart: "",
        currentTime: "",
        userInformation: "",
        userGroups: "",
        userGroup: "",
        groupSelected: "",
        grantPermissions: function (userGroups) {
            let reference = this;
            let groups = "";
            for (let group of userGroups) {
                groups += group.group_id;
            }
            let quality = (groups.indexOf("Quality") >= 0) ? 1 : 0;
            let fme = (groups.indexOf("FME") >= 0) ? 1 : 0;
            let admin = (groups.indexOf("Admin") >= 0) ? 1 : 0;
            let developer = (groups.indexOf("Developer") >= 0) ? 1 : 0;

            let userGroup = fme + "-" + quality + "-" + admin + "-" + developer;
            let invalidGroups = [];
            console.log("Combination user Groups: " + userGroup);
            switch (userGroup) {
                //N/A
                case "0-0-0-0":
                    invalidGroups.push("Ninguno Grupo Asociado");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Dev
                case "0-0-0-1":
                    reference.userGroup = "Developer";
                    reference.openSmatApp();
                    //reference.loadMainMenu();
                    break;
                //Adm-Dev
                case "0-0-1-1":
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Adm-Dev
                case "0-1-1-1":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Dev
                case "0-1-0-1":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Adm
                case "0-1-1-0":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Adm
                case "0-0-1-0":
                    reference.userGroup = "Admin";
                    reference.openSmatApp();
                    //reference.loadMainMenu();
                    break;
                //Qua
                case "0-1-0-0":
                    reference.userGroup = "Quality";
                    reference.openSmatApp();
                    //reference.loadMainMenu();
                    break;
                //All
                case "1-1-1-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua-Adm
                case "1-1-1-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua
                case "1-1-0-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    reference.launchSelectGroupModal(invalidGroups);
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme
                case "1-0-0-0":
                    reference.userGroup = "FME";
                    reference.openSmatApp();
                    //reference.loadWorkerAllTickets();
                    break;
                //Fme-Adm
                case "1-0-1-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Admin");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Dev
                case "1-0-0-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua-Dev
                case "1-1-0-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Admin-Dev
                case "1-0-1-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    //reference.launchErrorModalGroups(invalidGroups);
                    break;

            }
        },
        launchSelectGroupModal: function (groups_to_select) {
            let reference = this;
            let list = "";
            for (let group of groups_to_select) {
                list += "<li id='" + group + "' value='" + group + "'class='list-group-item col-md-6'> <b>" + group + "</b> <input class='form-control' name='groupSelected' value='" + group + "' type='radio' checked='checked'></li>";
            }
            $("#groupError").remove();
            $("body").append("<div class='fade modal modal-danger'aria-hidden=true aria-labelledby=myModalLabel1 id=groupError role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Selecciona el tipo de usuario </h4></div><div class=modal-body><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=f17f55c8-66ba-4d50-a9d1-04ef3cd111b0&attachmentId=671658' style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center> El usuario tienes grupos varios grupos asociados, selecciona un rol.</h4><h5 style=text-align:center>Grupos Asociados:<br> <ul class='list-group' id='listGroups'></ul></h5><div class='text-center'><button class='btn btn-default' id='btnAccessToSmart'> Ingresar a Smart Docs </button></div></div></div></div></div>");
            $("#listGroups").append(list);
            $("#btnAccessToSmart").click(function () {
                let groupSelected = $("input[name='groupSelected']:checked").val();
                console.log("Group Selected :" + groupSelected);
                reference.userGroup = groupSelected;
                $("#userGroup").text(groupSelected);
                $("#groupError").modal('hide');
                reference.openSmatApp();
            });
            $("#groupError").modal({ backdrop: 'static', keyboard: false });
        },
        openSmatApp: function () {
            let reference = this;
            pages.hideMenuItems(reference.userGroup);
            message.removeMessageLoader("body");
        }
    }

    smart.onInit();

});

/***/ })
/******/ ]);