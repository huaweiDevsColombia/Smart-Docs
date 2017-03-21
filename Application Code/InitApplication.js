$(function () {
    let workers = require("./loadsWorkers");
    let cssLibs = require("./loadStyleLibs");
    let jsLibs = require("./loadJSLibs");
    let pages = require("./loadPages");


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