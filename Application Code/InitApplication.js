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
            }).then(function(){
                console.log("JS Low 2 were loaded");
                message.changeMessageLoader("pageLoaderContent", "Js Low 2  were loaded");
                return jsLibs.loadcustomJS();
            })
            .then(function () {
                console.log("JS Load custom were loaded");
                message.changeMessageLoader("pageLoaderContent", "JS Load custom were loaded");
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