$(function () {
    let workers = require("./loadsWorkers");
    let cssLibs = require("./loadStyleLibs");
    let jsLibs = require("./loadJSLibs");
    let message = require("./messages");
    let pages = require("./pages");


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
                return jsLibs.loadHighJS;
            }).then(function () {
                console.log("High JS were loaded");
                message.changeMessageLoader("pageLoaderContent", "High JS were loaded");
                return jsLibs.loadMediumJS;
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Medium Libs were loaded");
                return jsLibs.LoadLowJS;
            }).then(function () {
                console.log("JS Low Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Low Libs were loaded");
                return jsLibs.LoadLowJS2;
            }).then(function () {
                console.log("JS Low 2 were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Low 2 were loaded");
            }).then(function () {
                console.log("Js High was loader");
                message.changeMessageLoader("pageLoaderContent", "Js High was loaded");
                return pages.loadAllPages();
            }).then(function (data) {
                message.changeMessageLoader("pageLoaderContent", "Pages were loaded");
                pages.bootstrapMenu("page-022").then(function () {
                    message.removeMessageLoader("body");
                });
            })
                .catch(function (error) {
                    console.log(error);
                    message.changeMessageLoader("pageLoaderContent", "Ha ocurrido un error: " + JSON.stringify(error));
                });
        },
        userRegisterOnSmart: "",
        currentTime: "",
    }

    smart.onInit();
});