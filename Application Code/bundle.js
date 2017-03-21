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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Register the user on the Smart Docs Users Datamodel
 * Make a Ajax Request to get the worker and then call update service 
 */
let userInformation = "No start";

function registerUseronSmartDocs() {
    let workerUserRegister = $.ajax({
        method: "GET",
        dataType: "script",
        url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=0a558148-e0b1-411e-928e-ec031a352447&attachmentId=689823"
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

            console.log(e.data);
            userInformation = "Worker Response Ok";
            //reference.userRegister = e.data;
            //reference.loadWorkerCurrentTime(true);
            //reference.cleanConsole();
        }, false);

        worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

        console.log("Smart Register User has Loaded");

    }).fail(function () {
        console.log("Smart Register User has Failed");
    });
}


module.exports = {
    userInformation: "Nothing yet",
    registerUser: function () {
        let reference;
        let workerUserRegister = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=0a558148-e0b1-411e-928e-ec031a352447&attachmentId=689823"
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

                console.log("Response: " + e.data);
                reference.userInformation = "Data was chenged";
                reference.getCurrentTime();
                //reference.userRegister = e.data;
                //reference.loadWorkerCurrentTime(true);
                //reference.cleanConsole();
            }, false);

            worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

            console.log("Smart Register User has Loaded");

        }).fail(function () {
            console.log("Smart Register User has Failed");
        });
    },
    currentTime: "",
    getCurrentTime: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            let workerCurrentTime = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=14e84949-6f60-45ae-a265-ed28ae81ab0c&attachmentId=689745"
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
                    //reference.currentTime = e.data;
                    console.log(e.data);
                    reference.currentTime = e.data;
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("Current Time has Loaded");

            }).fail(function (error) {
                reject(error);
                console.log("Current Time has Failed");
            });
        });


    },
    passInformation: function () {
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

let workers = __webpack_require__ (0);
let smart = {};
smart.onInit = function(){
    console.log("Start Application");
    workers.getCurrentTime().then(function(data){
        console.log("Data" + data);
        console.log("Current Time: " + workers.currentTime);
    });
}

smart.onInit();

/***/ })
/******/ ]);