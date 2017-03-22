$(function () {
    let workers = require("./loadsWorkers");
    let cssLibs = require("./loadStyleLibs");
    let jsLibs = require("./loadJSLibs");
    let pages = require("./loadPages");
    let message = require("./messages");

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
            message.addMessageLoder("pageLoaderContent","body");
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
                return pages.loadAllPages;
            }).then(function (data) {
                message.changeMessageLoader("pageLoaderContent", "Pages were loaded");
                reference.pages = data;
                reference.bootstrapMenu("page-022");
            })
                .catch(function (error) {
                    console.log(error);
                    message.changeMessageLoader("pageLoaderContent", "Ha ocurrido un error: "+ JSON.stringify (error));
                });
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