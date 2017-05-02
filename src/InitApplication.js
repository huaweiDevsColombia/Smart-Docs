$(function () {
    let workers = require("./bootstrap/loadsWorkers");
    let cssLibs = require("./bootstrap/loadStyleLibs");
    let jsLibs = require("./bootstrap/loadJsLibs");
    let message = require("./message/messages");
    let pages = require("./pageFlow/pages");

    let smart = {
        onInit: function () {
            let reference = this;
            $("link").remove();
            $("script").remove();
            reference.disabledBackButton();
            reference.promptRefreshMessage();
            /*
            workers.checkUserSmart.then(function (userSmartResponse) {

                var userRegisterOnSmart = (Object.keys(JSON.parse(userSmartResponse)).length === 0);
                var data = {};
                switch (userRegisterOnSmart) {
                    case true:
                        //User not exist in Smart Docs Users Database
                        data["account_id"] = e.data.userInformation.account_id;
                        data["name"] = e.data.userInformation.name;
                        data["user_id"] = e.data.userInformation.user_id;
                        params = "&csrfToken=" + e.data.token + "&account_id=" + data.account_id + "&name=" + data.name + "&user_id=" + data.user_id + "&serviceId=co_sm_users_create"
                        return reference.get("co_sm_users_create", e.data.username, "100l", params);
                        break;
                    case false:
                        var userSmart = JSON.parse(userSmartResponse).result;
                        console.log("Times " + userSmart.start_times);
                        data["start_times"] = parseInt(userSmart.start_times) + 1;
                        data["account_id"] = userSmart.account_id;
                        return reference.update("co_sm_users_update", data);
                        break;
                }
            }).then(function () {
                console.log("Visti registered");
            }).catch(function (error) {
                console.log(error);
            });
            */

            message.addMessageLoder("pageLoaderContent", "body");
            cssLibs.loadFonts.then(function () {
                console.log("Fonts libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Las fuentes han sido cargadas");
                return cssLibs.loadIcons;
            }).then(function () {
                console.log("Icons libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Iconos han sido cargados");
                return cssLibs.loadCSS;
            }).then(function () {
                console.log("CSS Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Estilos Primarios han sido cargados");
                return cssLibs.loadCustomCss;
            }).then(function () {
                console.log("CSS Custom Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Estilos Secundarios han sido cargados");
                return jsLibs.loadHighJS();
            }).then(function () {
                console.log("High JS were loaded");
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 1/4 han sido cargadas");
                return jsLibs.loadMediumJS();
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 2/4 han sido cargadas");
                return jsLibs.loadLowJS();
            })
                .then(function () {
                    console.log("JS Low Libs were loaded");
                    message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 3/4 han sido cargadas");
                    return jsLibs.loadDataTables();
                })
                .then(function () {
                    console.log("JS Low 2 were loaded");
                    message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 4/4 han sido cargadas");
                    return pages.loadAllPages();
                }).then(function (data) {
                    message.changeMessageLoader("pageLoaderContent", "Las Paginas han sido cargadas");
                    pages.bootstrapMenu("page-022").then(function () {
                        return jsLibs.loadTranslate();
                    })
                        .then(function () {
                            return workers.getUserGroups;
                        })
                        .then(function (data) {
                            message.changeMessageLoader("pageLoaderContent", "Se ha obtenido los grupos del usuario");
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
                            message.changeMessageLoader("pageLoaderContent", "La informacion del usuario ha sido cargada");
                            reference.userInformation = JSON.parse(data).result;
                            pages.userInformation = reference.userInformation;
                            pages.showUserInformationNav(reference.userInformation);
                            console.log("User Groups :" + JSON.stringify(reference.userGroups));
                            reference.grantPermissions(reference.userGroups);
                            return workers.checkUserSmart;
                        })
                        .then(function (userSmartResponse) {
                            //message.changeMessageLoader("pageLoaderContent", "Registrando Visita en la aplicacion");
                            var userRegisterOnSmart = (Object.keys(JSON.parse(userSmartResponse)).length === 0);
                            var data = {};
                            switch (userRegisterOnSmart) {
                                case true:
                                    //User not exist in Smart Docs Users Database
                                    data["account_id"] = username;
                                    data["name"] = reference.userInformation.fullname;
                                    data["user_id"] = USER_ID;
                                    return reference.update("co_sm_users_create", data);
                                    break;
                                case false:
                                    var userSmart = JSON.parse(userSmartResponse).result;
                                    console.log("Times " + userSmart.start_times);
                                    data["start_times"] = parseInt(userSmart.start_times) + 1;
                                    data["account_id"] = userSmart.account_id;
                                    return reference.update("co_sm_users_update", data);
                                    break;
                            }
                        }).then(function () {
                            console.log("Visti registered");
                        })
                })
                .catch(function (error) {
                    console.log(error);
                    message.changeMessageLoader("pageLoaderContent", "Ha ocurrido un error: " + JSON.stringify(error));
                });
        },
        get: function (serviceName, username, tenantId, params) {
            return new Promise(function (resolve, reject) {
                var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:" + serviceName + ",username:" + username + ",tenantId:" + tenantId + "}";
                var parameters = "serviceId=" + serviceName;
                parameters = parameters + params;
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", url, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.onreadystatechange = function () {//Call a function when the state changes.
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        resolve(xhttp.response);
                    }
                }
                xhttp.onerror = function () {
                    reject(xhttp.statusText);
                };
                xhttp.send(parameters);
            })
        },
        update: function (serviceName, params) {
            return new Promise(function (resolve, reject) {
                MessageProcessor.process({
                    serviceId: serviceName,
                    data: params,
                    success: function (data) {
                        console.log(data);
                        resolve();
                    }
                });
            });
        },
        userRegisterOnSmart: "",
        userInformation: "",
        userGroups: "",
        userGroup: "",
        userSubGroup: "",
        groupSelected: "",
        disabledBackButton: function () {
            window.location.hash = "no-back-button";
            window.location.hash = "Again-No-back-button";//again because google chrome don't insert first hash into history
            window.onhashchange = function () { window.location.hash = "no-back-button"; }
        },
        promptRefreshMessage: function () {
            window.onbeforeunload = function () {
                return "";
            };
        },
        grantPermissions: function (userGroups) {
            let reference = this;
            reference.userGroups = userGroups;
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
                    reference.grantPermissionPosition();
                    //reference.openSmatApp();
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
                    reference.grantPermissionPosition();
                    //reference.openSmatApp();
                    //reference.loadMainMenu();
                    break;
                //Qua
                case "0-1-0-0":
                    reference.userGroup = "Quality";
                    console.log("User Group : " + reference.userGroup);
                    /* Check for subGroups */
                    for (let group of userGroups) {
                        if (group.group_id == "SERDAN") {
                            reference.userSubGroup = "SERDAN";
                        }
                        if (group.group_id == "TEKA") {
                            reference.userSubGroup = "TEKA";
                        }
                    }

                    reference.grantPermissionPosition();
                    //reference.openSmatApp();
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
                    reference.grantPermissionPosition();
                    //reference.openSmatApp();
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
            $(".app-container").attr("style", "display:none");
            let list = "";
            for (let group of groups_to_select) {
                list += "<li id='" + group + "' value='" + group + "'class='list-group-item col-md-6'> <b>" + group + "</b> <input class='form-control' name='groupSelected' value='" + group + "' type='radio' checked='checked'></li>";
            }
            $("#groupError").remove();
            $("body").append("<div class='fade modal modal-danger'aria-hidden=true aria-labelledby=myModalLabel1 id=groupError role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Selecciona el tipo de usuario </h4></div><div class=modal-body><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=f17f55c8-66ba-4d50-a9d1-04ef3cd111b0&attachmentId=671658' style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center> El usuario tienes varios grupos asociados </h4><h5 style=text-align:center>Selecciona uno para ingresar a la aplicacion:<br> <ul class='list-group' id='listGroups'></ul></h5><div class='text-center'><button class='btn btn-default' id='btnAccessToSmart'> Ingresar a Smart Docs </button></div></div></div></div></div>");
            $("#listGroups").append(list);
            $("#btnAccessToSmart").click(function () {
                $(".app-container").removeAttr("style");
                let groupSelected = $("input[name='groupSelected']:checked").val();
                console.log("Group Selected :" + groupSelected);
                reference.userGroup = groupSelected;
                /* Check for subGroups */
                for (let group of reference.userGroups) {
                    if (group.group_id == "SERDAN") {
                        reference.userSubGroup = "SERDAN";
                    }
                    if (group.group_id == "TEKA") {
                        reference.userSubGroup = "TEKA";
                    }
                }

                $("#groupError").modal('hide');
                reference.grantPermissionPosition();
                //reference.openSmatApp();
                pages.loadResources('page-004');
            });
            $("#groupError").modal({ backdrop: 'static', keyboard: false });
        },
        grantPermissionPosition: function () {
            let reference = this;
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            function success(pos) {
                var crd = pos.coords;
                console.log('Your current position is:');
                console.log('Latitude : ' + crd.latitude);
                console.log('Longitude: ' + crd.longitude);
                console.log('More or less ' + crd.accuracy + ' meters.');
                reference.openSmartApp();
            };

            function error(err) {
                reference.launchErrorPosition();
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };

            navigator.geolocation.getCurrentPosition(success, error, options);
        },
        launchErrorPosition: function () {
            $("#errorPosition").remove();
            $("body").append("<div class='fade modal modal-danger'aria-hidden=true aria-labelledby=myModalLabel2 id=errorPosition role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>No has permitido el acceso a tu localizacion </h4></div><div class=modal-body><img src='https://cdn4.iconfinder.com/data/icons/flatified/128/map.png' style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center> Por favor, configura tu dispositivo correctamente </h4><h5 style=text-align:center>El accesor a la localizacion ha sido bloqueado <br> <b> Solucion> </b> Ingresa a la configuracion del navegador y modifica los permisos de localizacion </h5><div class='text-center'></div></div></div></div></div>");
            $("#errorPosition").modal({ backdrop: 'static', keyboard: false });
        },
        openSmartApp: function () {
            let reference = this;
            $("#userGroup").text(reference.userGroup + " - " + reference.userSubGroup);
            pages.hideMenuItems(reference.userGroup, reference.userSubGroup);
            pages.bootstrapPage('page-004').then(function () {
                message.removeMessageLoader("body");
            });
        }
    }

    smart.onInit();

});

