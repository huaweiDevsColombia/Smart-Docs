let workers = require("./loadsWorkers");
let cssLibs = require("./loadStyleLibs");
let jsLibs = require("./loadJSLibs");

let smart = {
    onInit: function () {
        let reference = this ;
        workers.getCurrentTime.then(function (data) {
            reference.currentTime = data;
            console.log("CurrentTime" + reference.currentTime);
        });
        workers.checkUserSmart.then(function (data) {
            reference.userRegisterOnSmart = (Object.keys(data).length === 0);
            console.log("Check User Smart:" + reference.userRegisterOnSmart);
        });

        cssLibs.loadFonts.then(function(){
            console.log("Fonts libs were loaded");
            return cssLibs.loadIcons;
        }).then(function(){
            console.log("Icons libs were loaded");
            return cssLibs.loadCSS;
        }).then(function(){
            console.log("JS High Libs were loaded");
            return jsLibs.loadMediumJS;
        }).then(function(){
            console.log("JS Medium Libs were loaded");
            return jsLibs.LoadLowJS;
        }).then(function(){
            console.log("JS Low Libs were loaded");
            return jsLibs.LoadLowJS2;
        }).then(function(){
            console.log("JS Low 2 were loaded");
        }).then(function(){
            console.log("CSS libs were loaded");
            return jsLibs.loadHighJS;
        }).catch(function(error){
            console.log(error);
        });
    },
    userRegisterOnSmart : "",
    currentTime : ""
}

smart.onInit();