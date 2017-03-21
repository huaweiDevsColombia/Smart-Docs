let workers = require("./loadsWorkers");
let libs = require("./loadStyleLibs");

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
        libs.loadFonts.then(function(){
            console.log("Fonts libs were loaded");
            return libs.loadIcons;
        }).then(function(){
            console.log("Icons libs were loaded");
            return libs.loadCSS;
        }).then(function(){
            console.log("CSS libs were loaded");
        });
    },
    userRegisterOnSmart : "",
    currentTime : ""
}

smart.onInit();