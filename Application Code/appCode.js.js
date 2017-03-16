(function () {

    var smart = {

        onInit: function () {
            this.loadWorkerPages2();
            this.loadWorkerAllReports();
            this.loadFontsLibs();
            this.loadIconLibs();
            this.loadCssLibs();
            this.loadJSLibsHigh();
        },
        changeLoadingMessage: function (msg) {
            $("#loaderContent").text(msg);
        },
        changeLoadingMessageLoaderPage: function (msg) {
            $("#loaderPageContent").text(msg);
        },
        pages: "",
        userRegister: "",
        currentTime: "",
        userGroups: "",
        userGroupSelected: "",
        userInformation: "",
        currentPage: "",
        loadWorkerPages2: function () {
            let reference = this;
            reference.changeLoadingMessage("Paginas desde OWS Datamodel");
            var pagesSaved = [];
            var http = new XMLHttpRequest();
            var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_html_pages_getList,username:ROOT_1018482294,tenantId:100l}";
            var params = "start=0&limit=100&serviceId=co_sm_html_pages_getList";
            http.open("POST", url, true);

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    console.log(JSON.parse(http.response));
                    var pages = JSON.parse(http.response).results;
                    pages.forEach(function (data) {
                        var attachmentId = data.page_file.attachment[0].attachmentId;
                        var batchId = data.page_file.attachment[0].batchId;
                        var page_id = data.id_page;

                        var http2 = new XMLHttpRequest();
                        var url2 = "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId;
                        http2.open("POST", url2, true);

                        //Send the proper header information along with the request
                        http2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                        http2.onreadystatechange = function () {//Call a function when the state changes.
                            if (http2.readyState == 4 && http2.status == 200) {
                                pagesSaved.push({ "page_id": page_id, "content": http2.response });
                                console.log("Pagina Guardada");
                                console.log(reference.pages);
                                reference.pages = pagesSaved;
                            }
                        }
                        http2.send();
                    });
                }
            }

            http.send(params);
        },
        loadWorkerUserRegister: function () {

            let reference = this;
            reference.changeLoadingMessage("Registrando Usuario");
            let workerUserRegister = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=44e32d76-84d5-45d5-b1e5-d2c9d353c008&attachmentId=692253"
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
                    reference.userRegister = e.data;
                    reference.loadWorkerCurrentTime(true);
                    //reference.cleanConsole();
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("Smart Register User has Loaded");

            }).fail(function () {
                console.log("Smart Register User has Failed");
            });

        },
        loadWorkerCurrentTime: function (updateLastLogin) {

            let reference = this;
            reference.changeLoadingMessage("Obteniendo la Hora Actual");
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
                    reference.currentTime = e.data;


                    if (updateLastLogin) {
                        if (reference.userRegister != "{}") {
                            reference.updateLastLogin();
                        }
                        else {
                            reference.createUseronSmart();
                        }

                    }
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("Current Time has Loaded");

            }).fail(function () {
                console.log("Current Time has Failed");
            });

        },
        createUseronSmart: function () {
            let reference = this;
            console.log(typeof (reference.userInformation));
            this.changeLoadingMessage("Registrando Usuario");
            MessageProcessor.process({
                serviceId: "co_sm_users_create",
                data: {
                    "user_id": JSON.parse(reference.userInformation).result.user_id,
                    "account_id": JSON.parse(reference.userInformation).result.account_id,
                    "name": JSON.parse(reference.userInformation).result.fullname,
                    "last_login": JSON.parse(reference.currentTime).result.localDateTime,
                    "start_times": "1"
                },
                success: function (data) {

                    $('#sucessRegistration').modal('show');
                }
            });

        },
        loadWorkerUserGroups: function () {

            let reference = this;
            reference.changeLoadingMessage("Obteniendo Grupos del Usuario");
            let workerUserGroups = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=80dbe269-548d-4ffa-b3c7-e276f430c082&attachmentId=689824"
            });
            $.when(workerUserGroups).done(function (workerUserGroupsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerUsersGroups')
                    .text(workerUserGroupsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerUsersGroups").text()
                ], { type: "text/javascript" })

                var worker = new Worker(URL.createObjectURL(blob));
                worker.addEventListener('message', function (e) {
                    reference.userGroups = e.data;
                    //reference.cleanConsole();
                    reference.grantPermissions();

                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("User Groups has Loaded");

            }).fail(function () {
                console.log("User Groups has Failed");
            });

        },
        loadWorkerUserInformation: function () {

            let reference = this;
            reference.changeLoadingMessage("Obteniendo Informacion del Usuario");
            let workerUserInformation = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=6986442d-814c-4989-95d7-ad4f832c0ff0&attachmentId=689863"
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

                    reference.userInformation = e.data;
                    //reference.cleanConsole();

                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("User Information has Loaded");

            }).fail(function () {
                console.log("User Information has Failed");
            });

        },
        loadWorkerReportView: function (watermark, template_name, ticket_id) {
            //Llamar al worker cuando se haga click
            let reference = this;
            reference.changeLoadingMessageLoaderPage("Generando Match");
            let workerReportPreview = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=ca00a1df-2458-4b2d-9f56-4d481f901d02&attachmentId=692438"
            });
            $.when(workerReportPreview).done(function (workerReportPreviewResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerReportPreview')
                    .text(workerReportPreviewResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerReportPreview").text()
                ], { type: "text/javascript" })

                var worker = new Worker(URL.createObjectURL(blob));
                worker.addEventListener('message', function (e) {
                    try {
                        console.log(e.data);
                        let preview_pdf = JSON.parse(e.data);
                        preview_pdf.footer = function (currentPage, pageCount) {
                            var text = {};
                            text["text"] = "Este reporte fue generado en Smart Docs \n HOY  - Codigo Auth: #Code \nPag " + currentPage + " de " + pageCount;
                            text["alignment"] = "center";
                            text["fontSize"] = 8;
                            text["link"] = "https://100l-app.teleows.com/servicecreator/spl/CO_SMART_DOCS/CO_SMART_DOCS_WELCOME.spl";
                            return text;
                        };
                        //pdfMake.createPdf(preview_pdf).download('optionalName.pdf');
                        //pdfMake.createPdf(preview_pdf).open();
                        reference.preview_pdf = preview_pdf;
                        /*
                        pdfMake.createPdf(preview_pdf).getDataUrl(function (dataURL) {
                            reference.changeLoadingMessageLoaderPage("Archivo PDF generado correctamente");
                            //reference.preview_pdf = dataURL;
                        });
                        */
                        reference.loadPage('page-021');
                    }
                    catch (e) {
                        console.log("Ha ocurrido un error" + e);
                    }
                    //reference.cleanConsole();
                }, false);
                worker.postMessage({ "template": reference.template_pdf, "answersTree": reference.answersTree, "watermark": watermark, "template_name": template_name, "ticket": ticket_id, "username": JSON.parse(reference.userInformation).result.fullname }); // Send data to our worker.
                console.log("User Information has Loaded");

            }).fail(function () {
                console.log("User Information has Failed");
            });
        },
        cleanConsole: function () {
            console.API;

            if (typeof console._commandLineAPI !== 'undefined') {
                console.API = console._commandLineAPI; //chrome
            } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
                console.API = console._inspectorCommandLineAPI; //Safari
            } else if (typeof console.clear !== 'undefined') {
                console.API = console;
            }

            console.API.clear();
        },
        sayWelcomeMessage: function () {
            let reference = this;
            var welcomeMsg = new SpeechSynthesisUtterance();
            welcomeMsg.lang = "es-US";
            welcomeMsg.text = "Bienvenido a Smart Docs";
            speechSynthesis.speak(welcomeMsg);
            var waitMsg = new SpeechSynthesisUtterance();
            waitMsg.lang = "es-US";
            waitMsg.text = "Aguarda un momento, estamos cargando algunos recursos";
            speechSynthesis.speak(waitMsg);

            this.loadWorkerUserRegister();
            this.loadWorkerUserGroups();
            this.loadWorkerUserInformation();

            /*
            $.ajax({
                method: "POST",
                url: "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_users_get,username:" + username + ",tenantId:" + tenantId + "}",
                data: {
                    start: 0,
                    limit: 100,
                    serviceId: "um_group_member_getList",
                    active: 1,
                    member_name: username
                }
            })
                .done(function (data) {
                    let groups = [];
                    data.results.forEach(function (valueGroup, indexGroup) {
                        groups[indexGroup] = valueGroup.group_id;
                    });
                    //reference.userInfo = groups;
                    reference.grantPermissions();
                });
            */
            /*
                        MessageProcessor.process({
                            serviceId: "um_group_member_getList",
                            data: {
                                "start": 0,
                                "limit": 100,
                                
                            },
                            success: function (data) {
            
                                let groups = [];
                                data.results.forEach(function (valueGroup, indexGroup) {
                                    groups[indexGroup] = valueGroup.group_id;
                                });
                                reference.userInfo = groups;
                                reference.grantPermissions();
            
            
                            }
                        });
                        */
        },
        updateLastLogin: function () {

            let reference = this;
            reference.changeLoadingMessage("Registrado visita");
            var start_time = parseInt(JSON.parse(reference.userRegister).result.start_times) + 1;
            var last_login = JSON.parse(reference.currentTime).result.localDateTime;

            MessageProcessor.process({
                serviceId: "co_sm_users_update",
                data: {
                    "account_id": username,
                    "last_login": JSON.parse(reference.currentTime).result.localDateTime,
                    "start_times": parseInt(JSON.parse(reference.userRegister).result.start_times) + 1,
                    "name": JSON.parse(reference.userRegister).result.name,
                    "user_id": JSON.parse(reference.userRegister).result.user_id
                },
                success: function (data) {
                    console.log(data);
                }
            });


            /*
            $.ajax({
                method: "POST",
                url: "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_users_update,username:ROOT_1018482294,tenantId:100l}",
                data: {
                    account_id: username,
                    last_login: "testWorker",
                    start_times: 1
                }
            })
                .done(function (updateLastLoginResponse) {
                    console.log(updateLastLoginResponse);
                    console.log("User Information was updated");
                });
 
            */

        },
        grantPermissions: function () {
            let reference = this;
            reference.changeLoadingMessage("Otorgando permisos al usuario");
            let groups = reference.userGroups;

            let quality = (groups.indexOf("Quality") >= 0) ? 1 : 0;
            let fme = (groups.indexOf("FME") >= 0) ? 1 : 0;
            let admin = (groups.indexOf("Admin") >= 0) ? 1 : 0;
            let developer = (groups.indexOf("Developer") >= 0) ? 1 : 0;

            let userGroup = fme + "-" + quality + "-" + admin + "-" + developer;
            let invalidGroups = [];
            switch (userGroup) {
                //N/A
                case "0-0-0-0":
                    invalidGroups.push("Ninguno Grupo Asociado");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Dev
                case "0-0-0-1":
                    reference.userGroup = "Developer";
                    reference.loadMainMenu();
                    break;
                //Adm-Dev
                case "0-0-1-1":
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Adm-Dev
                case "0-1-1-1":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Dev
                case "0-1-0-1":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Qua-Adm
                case "0-1-1-0":
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Adm
                case "0-0-1-0":
                    reference.userGroup = "Admin";
                    reference.loadMainMenu();
                    break;
                //Qua
                case "0-1-0-0":
                    reference.userGroup = "Quality";
                    reference.loadMainMenu();
                    break;
                //All
                case "1-1-1-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua-Adm
                case "1-1-1-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Admin");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua
                case "1-1-0-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme
                case "1-0-0-0":
                    reference.userGroup = "FME";
                    reference.loadWorkerAllTickets();
                    break;
                //Fme-Adm
                case "1-0-1-0":
                    invalidGroups.push("FME");
                    invalidGroups.push("Admin");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Dev
                case "1-0-0-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Qua-Dev
                case "1-1-0-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Quality");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;
                //Fme-Admin-Dev
                case "1-0-1-1":
                    invalidGroups.push("FME");
                    invalidGroups.push("Admin");
                    invalidGroups.push("Developer");
                    reference.launchErrorModalGroups(invalidGroups);
                    break;

            }
        },
        launchErrorModalGroups: function (groups) {
            let reference = this;
            let list = "";
            for (let group of groups) {
                list += "<li class='list-group-item'> <b>" + group + "</b></li>";
            }
            $("body").addClass("flat-blue");
            $("#groupError").remove();
            $("body").append("<div class='fade modal modal-danger'aria-hidden=true aria-labelledby=myModalLabel1 id=groupError role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Conexion Bloqueada </h4></div><div class=modal-body><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=f17f55c8-66ba-4d50-a9d1-04ef3cd111b0&attachmentId=671658' style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center> El usuario tienes grupos varios grupos asociados, valida tu usuario.</h4><h5 style=text-align:center>Grupos Asociados:<br> <ul class='list-group' id='listGroups'></ul></h5></div></div></div></div>");
            $("#listGroups").append(list);
            $("#groupError").modal({ backdrop: 'static', keyboard: false });

        },
        loadFontsLibs: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando fuentes");
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
                console.log("loadFontsLibs has Loaded");
            }).fail(function () {
                console.log("loadFontsLibs has Failed");
            });
        },
        loadIconLibs: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Iconos");
            let fontAwesome = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://use.fontawesome.com/4e0d3cfdd0.js"
            });
            $.when(fontAwesome).done(function (fontAwesomeResponse) {
                console.log("loadIconLibs has Loaded");
            }).fail(function () {
                console.log("loadIconLibs has Failed");
            });
        },
        loadCssLibs: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Estilos");
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
                    console.log("loadCssLibs has Loaded");
                    reference.loadCustomLibs();
                }).fail(function () {
                    console.log("loadCssLibs has failed");
                });
        },
        loadCustomLibs: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Estilos desde OWS Datamodel");
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
                console.log("loadCustomLibs has Loaded");
            }).fail(function () {
                console.log("loadCustomLibs has Failed");
            });
        },
        loadJSLibsHigh: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Scripts High");
            let bootstrap = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            });
            $.when(bootstrap).done(function (bootstrapResponse) {
                console.log("loadJSLibsHigh has Loaded");
                console.log(this);
                reference.loadJSLibsMedium();
            }).fail(function () {
                console.log("loadJSLibsHigh has Failed");
            });
        },
        loadJSLibsMedium: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Scripts Medium");
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
            let pdfmake = jqueryDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/pdfmake.min.js"
            });
            $.when(bootstrapSwitch, jqueryMinHeight, jqueryDataTables, pdfmake)
                .done(function (bootstrapSwitchResponse, jqueryMinHeightResponse, jqueryDataTablesResponse, pdfmakeResponse) {
                    console.log("loadJSLibsMedium has Loaded");
                    reference.loadJSLibsLow();
                }).fail(function () {
                    console.log("loadJSLibsMedium has Failed");
                });
        },
        loadJSLibsLow: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Scripts Low");
            let bootstrapDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"
            });
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

            let vs_fonts = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/vfs_fonts.js"
            });
            $.when(bootstrapDataTables, buttonsDataTables, jszip, buttonsHTML5, vs_fonts)
                .done(function (bootstrapDataTablesResponse, buttonsDataTablesResponse, jszipResponse, buttonsHTML5, vs_fontsResponse) {
                    console.log("loadJSLibsLow has Loaded");
                    reference.loadCustomJs();
                }).fail(function () {
                    console.log("loadJSLibsLow has Failed");
                });

        },
        loadCustomJs: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Scripts Custom");
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
                    console.log("loadCustomJs has Loaded");
                    reference.sayWelcomeMessage();
                }).fail(function () {
                    console.log("loadCustomJs has Failed");
                });
        },
        loadMainMenu: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Menu Principal");
            let menu_items = [
                { id: "itemInicio", page_id: "page-004" },
                { id: "itemTareas", page_id: "page-008" },
                { id: "itemReportes", page_id: "page-014" },
                { id: "itemDeveloper", page_id: "" },
                { id: "itemTesting", page_id: "" },
                { id: "itemCreator", page_id: "" },
                { id: "itemFaq", page_id: "" }
            ];
            MessageProcessor.process({
                serviceId: "co_sm_html_pages_get",
                data: {
                    "id_page": 'page-022',
                },
                success: function (data) {


                    var attachmentId = data.result.page_file.attachment[0].attachmentId;
                    var batchId = data.result.page_file.attachment[0].batchId;

                    $.get("https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId, function (pageCode) {

                        $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
                        $('body').addClass("flat-blue");
                        $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
                        $('.content-container').append(pageCode);

                        $(function () {
                            $(".navbar-expand-toggle").click(function () {
                                $(".app-container").toggleClass("expanded");
                                return $(".navbar-expand-toggle").toggleClass("fa-rotate-90");
                            });
                            return $(".navbar-right-expand-toggle").click(function () {
                                $(".navbar-right").toggleClass("expanded");
                                return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
                            });
                        });

                        $(function () {
                            return $(".side-menu .nav .dropdown").on('show.bs.collapse', function () {
                                return $(".side-menu .nav .dropdown .collapse").collapse('hide');
                            });
                        });


                        reference.hideMenuItems();

                        /* Form Upload OWS */
                        $(".content-container").append($("#formPanelUpload"))
                        $("#mainContent").append($("#formPanelUpload").val());
                        $("#formPanelUpload").css("margin", "0 auto");
                        $("#formPanelUpload").css("width", "250px");
                        $("#ext-gen2UploadBtn > span").remove();
                        $("#upload_file_div > span").remove();
                        $(".sdm_list_span").remove();
                        $("#ext-gen2UploadBtn").remove();
                        $("#FileInput1_UploadBtn_bifFile").append("<button id='btnEnviar' type='submit' class='btn btn-primary'>Subir Archivo (SOLO .JSON)</button>");
                        $("#FileInput1_UploadBtn_bifFile > span").remove();
                        $("#FileInput1_div > span").remove();
                        setTimeout(function () {
                            $("#subirArchivoDiv").append($("#formPanelUpload"));
                            $("#uploadFile_div > span").remove();
                            console.log("Form Upload Rezised");
                        }, 2000);

                        $("#formPanelUpload").hide();
                        reference.showUserInformation();
                        $("body").removeClass("loader");
                        $("loader").remove();
                        reference.loadPage('page-004');
                        reference.loadEventsMenuItems(menu_items);
                    });
                }
            });

        },
        showUserInformation: function () {
            let reference = this;
            console.log(JSON.parse(reference.userInformation));
            $("#userFullname").text(JSON.parse(reference.userInformation).result.fullname);
            $("#userFullname").append("<span class='caret'></span>");
            $("#userRol").text(JSON.parse(reference.userGroups));
            $("#userGroup").text(reference.userGroup);
            $("#explainUserGroup").text("Group Information");
            $("#userAccount").text(JSON.parse(reference.userInformation).result.username);
            $("#userEmail").text(JSON.parse(reference.userInformation).result.email);
        },
        hideMenuItems: function () {
            let reference = this;
            switch (reference.userGroup) {
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
        setCurrentPage: function (page_id) {
            this.currentPage = "" + page_id;
        },
        loadPage: function (page_id) {
            let reference = this;
            $("#mainContent2").html("");
            $("#mainContent2").addClass("loader");
            $("#mainContent2").append("<div id='loaderPage' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Pagina  </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
            let pages = reference.pages;

            var pageFilter = pages.filter(function (page) {
                return page.page_id == page_id;
            });

            $("#pageName").text("Dashboard");
            $('#mainContent2').append(pageFilter[0].content);

            $("#itemInicio").removeClass('active');
            $("#itemTareas").removeClass('active');
            $("#itemReportes").removeClass("active");
            $("#itemDeveloper").removeClass("active");
            $("#itemTesting").removeClass("active");
            $("#itemCreator").removeClass("active");
            $("#itemFaq").removeClass("active");


            switch (page_id) {
                //Home Page
                case "page-004":
                    $("#pageName").text("Inicio");
                    $("#itemInicio").addClass("active");
                    reference.loadStatistic("", "statisticTotal");
                    reference.loadStatistic("SM-Status002", "statisticCompleted");
                    reference.loadStatistic("SM-Status003", "statisticApproved");
                    reference.loadStatistic("SM-Status004", "statisticRejected");
                    reference.deletePageLoader();
                    break;
                //All Tickets Page    
                case "page-008":
                    $("#pageName").text("Reportes Pendientes");
                    $("#itemTareas").addClass("active");
                    reference.loadTickets("CM");
                    reference.loadTickets("PM");
                    reference.loadTickets("PLM");
                    reference.deletePageLoader();
                    break;
                //All Templates Page    
                case "page-007":
                    $("#pageName").text("Selecciona la Plantilla");
                    $("#itemTareas").addClass("active");
                    reference.loadTemplates();
                    break;
                //New Report Page
                case "page-005":
                    $("#pageName").text("Completa el Reporte");
                    $("#itemTareas").addClass("active");
                    reference.loadTemplate("", "");
                    break;
                //My Reports    
                case "page-014":
                    $("#pageName").text("Mis Reportes");
                    $("#itemReportes").addClass("active");
                    reference.fillTables();
                    reference.deletePageLoader();
                    break;
                //Detail Report    
                case "page-021":
                    $("#pageName").text("Detalle del Reporte");
                    $("#itemReportes").addClass("active");
                    reference.updateTicketDetail();
                    break;
                //Upload File
                case "page-013":
                    $("#pageName").text("Guardar Reporte");
                    $("#itemTareas").addClass("active");
                    $("#formPanelUpload").show();
                    reference.loadFormUploadEvent();
            }
        },
        loadPageEdit: function (templateLocation, answersLocation) {
            let reference = this;
            $("#mainContent2").html("");
            $("#mainContent2").addClass("loader");
            $("#mainContent2").append("<div id='loaderPage' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Pagina  </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
            let pages = reference.pages;

            var pageFilter = pages.filter(function (page) {
                return page.page_id == 'page-005';
            });

            $("#pageName").text("Dashboard");
            $('#mainContent2').append(pageFilter[0].content);

            $("#itemInicio").removeClass('active');
            $("#itemTareas").removeClass('active');
            $("#itemReportes").removeClass("active");
            $("#itemDeveloper").removeClass("active");
            $("#itemTesting").removeClass("active");
            $("#itemCreator").removeClass("active");
            $("#itemFaq").removeClass("active");

            $("#pageName").text("Edicion del Reporte");
            $("#itemReportes").addClass("active");
            reference.loadTemplateEdit(templateLocation, answersLocation);

        },
        allTickets: "",
        loadWorkerAllTickets: function () {
            let reference = this;
            reference.changeLoadingMessage("Cargando Tickets desde SDM");
            let workerAllTickets = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=1aac0229-ec93-4ff5-a884-53eea5b196b6&attachmentId=690927"
            });
            $.when(workerAllTickets).done(function (workerAllTicketsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerAllTickets')
                    .text(workerAllTicketsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerAllTickets").text()
                ], { type: "text/javascript" })

                var worker = new Worker(URL.createObjectURL(blob));
                worker.addEventListener('message', function (e) {
                    reference.allTickets = e.data;
                    console.log("All Tickets: " + reference.pages);
                    reference.loadMainMenu();
                    //reference.cleanConsole();
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.
                console.log("All Tickets has Loaded");

            }).fail(function () {
                console.log("All Tickets has Failed");
            });
        },
        allReports: "",
        loadWorkerAllReports: function () {
            let reference = this;
            let workerAllReports = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=4f890a0c-bd02-40fe-b528-bd9625e78788&attachmentId=691482"
            });
            $.when(workerAllReports).done(function (workerAllReportsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerAllReports')
                    .text(workerAllReportsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerAllReports").text()
                ], { type: "text/javascript" })

                var worker = new Worker(URL.createObjectURL(blob));
                worker.addEventListener('message', function (e) {
                    reference.allReports = e.data;
                    console.log("All Reports: ", JSON.parse(reference.allReports));
                    //reference.cleanConsole();
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.
                console.log("All Reports has Loaded");

            }).fail(function () {
                console.log("All Reports has Failed");
            });
        },
        loadStatistic: function (status, id_element) {
            MessageProcessor.process({
                serviceId: "co_sm_report_getList",
                data: {
                    "start": 0,
                    "limit": 1,
                    "status": status,
                    "author": username
                },
                success: function (data) {
                    $("#" + id_element).html(data.total);
                }
            });
        },
        loadEventsMenuItems: function (menu_items) {
            let reference = this;
            for (let menu_item of menu_items) {
                $("#" + menu_item.id).click(function () {
                    reference.loadPage(menu_item.page_id);
                });
            }
        },
        deletePageLoader: function () {
            $('#mainContent2').removeClass("loader");
            $('#loaderPage').remove();
        },
        loadFormUploadEvent: function (action) {
            let reference = this;
            reference.loadWorkerCurrentTime(false);
            $("#btnEnviar").click(function () {  
				console.log("Click on subir archivo");
                  setTimeout(function(){ 
                    console.log("Wait 3 Seconds");
                    if(screen.width < 576){
                      $(".ym-body  > iframe").attr("style","position:absolute;width:45%;height:100%;top:0;left:200px;opacity:1;");
                    } 
                  }, 3000);
				});
            var timer = setInterval(function () {
                let batchId = $("#FileInput1").val();
                console.log("Value BatchId:" + batchId);
                if (batchId != "") {
                    clearInterval(timer);
                    let attachmentId = $(".filelist_cls").attr("id").split('div_')[1];
                    $("#formPanelUpload").hide();
                    reference.createReport(batchId, attachmentId);
                }
            }, 1000);
            reference.deletePageLoader();
        },
        createReport: function (batchId, attachmentId) {
            let reference = this;
            console.log(reference.userInformation);
            console.log(JSON.parse(reference.userInformation));
            console.log(typeof (reference.userInformation));
            let ticket_selected = reference.ticket_selected;
            let quantity_ticket = Object.keys(ticket_selected).length;
            let comments = [];
            let comment;
            let completedDate;
            reference.reportStatusEditTemp;
            var url = "/get?batchId=" + batchId + "&attachmentId=" + attachmentId;

            switch (quantity_ticket) {
                //Create Report 
                case 7:
                    switch (reference.reportStatusEditTemp) {
                        case "SM-Status001":
                            comment = "He modificado exitosamente un ticket de reporte en Smart Docs"; completedDate = ""; break;
                        case "SM-Status002":
                            comment = "He completado exitosamente un ticket de reporte en Smart Docs"; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                    }

                    comments.push({ "author": JSON.parse(reference.userInformation).result.username, "comment": comment, "time": JSON.parse(reference.currentTime).result.localDateTime, "status": reference.reportStatusEditTemp })
                    MessageProcessor.process({
                        serviceId: "co_sm_report_create",
                        data: {
                            "author": JSON.parse(reference.userInformation).result.username,
                            "creation_date": JSON.parse(reference.currentTime).result.localDateTime,
                            "project": reference.ticket_selected.project,
                            "region": reference.ticket_selected.region,
                            "site_id": reference.ticket_selected.site_id,
                            "site_name": reference.ticket_selected.site_name,
                            "status": reference.reportStatusEditTemp,
                            "ticket_id": reference.ticket_selected.ticket_id,
                            "work_client": reference.ticket_selected.work_client,
                            "web_template": reference.template_selected.id,
                            "supplier": reference.ticket_selected.supplier,
                            "comment": JSON.stringify(comments),
                            "modified_by": JSON.parse(reference.userInformation).username,
                            "last_modification": JSON.parse(reference.currentTime).result.localDateTime,
                            "file_location": url,
                            "comment": JSON.stringify(comments),
                            "completed_date": completedDate
                        },
                        success: function (data) {
                            reference.launcModalReportCreated();
                        }
                    });
                    break;
                //Check for edit Report
                case 2:
                    switch (reference.reportStatusEditTemp) {
                        case "SM-Status001":
                            comment = "He modificado exitosamente un ticket de reporte en Smart Docs"; completedDate = ""; break;
                        case "SM-Status002":
                            comment = "He completado exitosamente un ticket de reporte en Smart Docs"; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                        case "SM-Status003":
                            comment = reference.reportComment; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                        case "SM-Status004":
                            comment = reference.reportComment; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                    }
                    comments.push({ "author": JSON.parse(reference.userInformation).result.username, "comment": comment, "time": JSON.parse(reference.currentTime).result.localDateTime, "status": reference.reportStatusEditTemp })
                    MessageProcessor.process({
                        serviceId: "co_sm_report_update",
                        data: {
                            "id_report": reference.ticket_selected.id_report,
                            "author": JSON.parse(reference.userInformation).result.username,
                            "creation_date": JSON.parse(reference.currentTime).result.localDateTime,
                            "project": reference.ticket_selected.project,
                            "region": reference.ticket_selected.region,
                            "site_id": reference.ticket_selected.site_id,
                            "site_name": reference.ticket_selected.site_name,
                            "status": reference.reportStatusEditTemp,
                            "ticket_id": reference.ticket_selected.ticket_id,
                            "work_client": reference.ticket_selected.work_client,
                            "web_template": reference.template_selected.id,
                            "supplier": reference.ticket_selected.supplier,
                            "comment": JSON.stringify(comments),
                            "modified_by": JSON.parse(reference.userInformation).username,
                            "last_modification": JSON.parse(reference.currentTime).result.localDateTime,
                            "file_location": url,
                            "comment": JSON.stringify(comments),
                            "completed_date": completedDate
                        },
                        success: function (data) {
                            reference.launcModalReportCreated();
                        }
                    });

                    break;
            }
        },
        editReport: function () {
            let reference = this;
            console.log(reference.userInformation);
            console.log(JSON.parse(reference.userInformation));
            console.log(typeof (reference.userInformation));
            let ticket_selected = reference.ticket_selected;
            let quantity_ticket = Object.keys(ticket_selected).length;
            let comments = reference.ticket_selected.comment;
            let comment;
            let completedDate;
            reference.reportStatusEditTemp;

            switch (reference.reportStatusEditTemp) {
                case "SM-Status001":
                    comment = "He modificado exitosamente un ticket de reporte en Smart Docs"; completedDate = ""; break;
                case "SM-Status002":
                    comment = "He completado exitosamente un ticket de reporte en Smart Docs"; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                case "SM-Status003":
                    comment = reference.reportComment; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
                case "SM-Status004":
                    comment = reference.reportComment; completedDate = JSON.parse(reference.currentTime).result.localDateTime; break;
            }

            var url = "/get?batchId=" + batchId + "&attachmentId=" + attachmentId;

            comments.push({ "author": JSON.parse(reference.userInformation).result.username, "comment": comment, "time": JSON.parse(reference.currentTime).result.localDateTime, "status": reference.reportStatusEditTemp })

            MessageProcessor.process({
                serviceId: "co_sm_report_create",
                data: {
                    "author": JSON.parse(reference.userInformation).result.username,
                    "creation_date": JSON.parse(reference.currentTime).result.localDateTime,
                    "project": reference.ticket_selected.project,
                    "region": reference.ticket_selected.region,
                    "site_id": reference.ticket_selected.site_id,
                    "site_name": reference.ticket_selected.site_name,
                    "status": reference.reportStatusEditTemp,
                    "ticket_id": reference.ticket_selected.ticket_id,
                    "work_client": reference.ticket_selected.work_client,
                    "web_template": reference.template_selected.id,
                    "supplier": reference.ticket_selected.supplier,
                    "comment": JSON.stringify(comments),
                    "modified_by": JSON.parse(reference.userInformation).username,
                    "last_modification": JSON.parse(reference.currentTime).result.localDateTime,
                    "file_location": url,
                    "comment": JSON.stringify(comments),
                    "completed_date": completedDate
                },
                success: function (data) {
                    reference.launcModalReportEdited();
                }
            });
        },
        launcModalReportCreated: function () {
            let reference = this;
            $("#report_created_modal").remove();
            $("body").append("<div class='fade modal modal-success'aria-hidden=true aria-labelledby=myModalLabel1 id=report_created_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Se ha guardado el reporte correctamente</h4></div><div class=modal-body><img style='margin-left:auto;margin-right:auto;display:block' width='150px' src='https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/512/Tick_Mark-256.png'/><h5 style='text-align:center;'>Tu reporte ha sido guardado en la plataforma,ahora lo podras consultar en la <b>seccion Mis Reportes</b></h5></div><div class='modal-footer'><input type='button' id='createOtherReport' class='btn btn-primary' data-dismiss='modal' value='Crear Reporte Mismo Ticket'><input type='button' id='select_ticket' class='btn btn-primary' data-dismiss='modal' value='Seleccionar Nuevo Ticket'><input type='button' id='seeAllReports' class='btn btn-primary' data-dismiss='modal' value='Ver mis Reportes'></div></div></div></div>");
            $("#report_created_modal").modal({ backdrop: 'static', keyboard: false });

            $("#createOtherReport").click(function () {
                reference.loadPage('page-007');
            });

            $("#select_ticket").click(function () {
                reference.loadPage('page-008');
            });

            $("#seeAllReports").click(function () {
                reference.loadPage('page-014');
            });

        },
        launcModalReportEdited: function () {
            let reference = this;
            $("#report_edited_modal").remove();
            $("body").append("<div class='fade modal modal-success'aria-hidden=true aria-labelledby=myModalLabel1 id=report_edited_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Se ha guardado el reporte correctamente</h4></div><div class=modal-body><img style='margin-left:auto;margin-right:auto;display:block' width='150px' src='https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/512/Tick_Mark-256.png'/><h5 style='text-align:center;'>Tu reporte ha sido guardado en la plataforma,ahora lo podras consultar en la <b>seccion Mis Reportes</b></h5></div><div class='modal-footer'><input type='button' id='seeAllReports' class='btn btn-primary' data-dismiss='modal' value='Ver mis Reportes'></div></div></div></div>");
            $("#report_edited_modal").modal({ backdrop: 'static', keyboard: false });

            $("#seeAllReports").click(function () {
                reference.loadPage('page-014');
            });

        },
        loadTickets: function (ticket_type) {
            let reference = this;
            let cont = 0;
            let containterTickets = [];
            let allTickets = JSON.parse(reference.allTickets);
            switch (ticket_type) {
                case "PM":
                    if (allTickets[0].PM.total > 0) {
                        $("#ticketsNotFound").remove();
                    }
                    containterTickets = allTickets[0].PM.results;
                    break;
                case "CM":
                    if (allTickets[1].CM.total > 0) {
                        $("#ticketsNotFound").remove();
                    }
                    containterTickets = allTickets[1].CM.results;
                    break;
                case "PLM":
                    if (allTickets[2].PLM.total > 0) {
                        $("#ticketsNotFound").remove();
                    }
                    containterTickets = allTickets[2].PLM.results;
                    break;
            }


            for (let value of containterTickets) {

                if (value.ticket_priority == undefined) {
                    value["ticket_priority"] = " N/A";
                }
                $("#allTicketsDiv").append("<div class=col-sm-3><div class='pricing-table yellow'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + value.subject + "</div><div class=pricing-type> Reportes Asociados: " + 0 + "</div></div></div><div class=pt-body><h4>" + value.type + " - " + value.project + "</h4><ul class=plan-detail><li><b>Region :</b> " + value.region + " - " + value.city + "<li><b>Prioridad : </b>" + value.ticket_priority + "<li><b>Estado : </b>" + value.status + "<li><b>Ticket Id:<br></b>" + ticket_type + " - " + value.orderid + "</ul></div><div class=pt-footer><button id='doReport_" + ticket_type + cont + "' class='btn btn-warning'type=button>Realizar Reporte</button></div></div></div>");

                $("#doReport_" + ticket_type + cont).on("click", {
                    val:
                    {
                        "project": value.project,
                        "region": value.region,
                        "site_id": value.site,
                        "site_name": value.site_name,
                        "ticket_id": ticket_type + "-" + value.orderid,
                        "work_client": value.customer_tt,
                        "supplier": value.site_contractor
                    }
                }, function (event) {
                    reference.ticket_selected = event.data.val;
                    reference.loadPage('page-007');
                });
                cont++;
            }

        },
        loadTickets2: function (ticket_type) {
            let reference = this;
            let cont = 0;
            MessageProcessor.process({
                serviceId: "cuttm_" + ticket_type + "_troubleticket_getList",
                data: {
                    "start": 0, "limit": 1000, "statuses": '0003', "fme_assigned": "user:" + username
                },
                success: function (data) {

                    if (parseInt(data.total) != 0) {
                        $("#ticketsNotFound").remove();
                        data.results.forEach(function (value, index) {

                            MessageProcessor.process({
                                serviceId: "co_sm_report_getList_count",
                                data: {
                                    "start": 0, "limit": 1000, "ticket_id": value.orderid
                                },
                                success: function (dataSmart) {

                                    if (data.ticket_priority == undefined) {
                                        data["ticket_priority"] = " N/A";
                                    }
                                    $("#allTicketsDiv").append("<div class=col-sm-3><div class='pricing-table yellow'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + value.subject + "</div><div class=pricing-type> Reportes Asociados: " + dataSmart.total + "</div></div></div><div class=pt-body><h4>" + value.type + " - " + value.project + "</h4><ul class=plan-detail><li><b>Region :</b> " + value.region + " - " + value.city + "<li><b>Prioridad : </b>" + value.ticket_priority + "<li><b>Estado : </b>" + value.status + "<li><b>Ticket Id:<br></b>CM-" + value.orderid + "</ul></div><div class=pt-footer><button id='doReport_" + cont + "' class='btn btn-warning'type=button>Realizar Reporte</button></div></div></div>");

                                    $("#doReport_" + cont).on("click", {
                                        val:
                                        {
                                            "project": value.project,
                                            "region": value.region,
                                            "site_id": value.site,
                                            "site_name": value.site_name,
                                            "ticket_id": ticket_type + "-" + value.orderid,
                                            "work_client": value.customer_tt,
                                            "supplier": value.site_contractor
                                        }
                                    }, function (event) {
                                        reference.ticket_selected = event.data.val;
                                        reference.loadPage('page-007');
                                    });
                                    cont++;
                                }
                            });
                        });
                    }
                }
            });
        },
        ticket_selected: "",
        reportComment: "",
        launchApproveModal: function (groups) {
            let reference = this;
            $("#approve_report_modal").remove();
            $("body").append("<div class='fade modal modal-success'aria-hidden=true aria-labelledby=myModalLabel1 id=approve_report_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Aprobar Reporte </h4></div><div class=modal-body> <label> Deja un comentario </label> <input id='approve_report_comment' type='text' class='form-control' placeholder='El comentario minimo debe ser de 5 caracteres'><br><p style='text-align: center'><b>Nota:</b> Este comentario sera visible en la seccion de Historia del Reporte</p></div><div class='modal-footer'><input type='button' id='approve_report_btn' disabled=true class='btn btn-success' data-dismiss='modal' value='Aprobar'></div></div></div></div>");
            $("#approve_report_modal").modal('show');
            $("#approve_report_comment").on('input', function () {
                let comment_size = $("#approve_report_comment").val().length;
                if (comment_size > 4) {
                    $("#approve_report_btn").attr("disabled", false);
                }
                else {
                    $("#approve_report_btn").attr("disabled", true);
                }
            });

            $("#approve_report_btn").click(function () {
                reference.reportComment = $("#approve_report_comment").val();
                $('#approve_report_modal').modal('hide');
            });
        },
        loadTemplates: function () {
            let reference = this;
            reference.changeLoadingMessageLoaderPage("Cargando Plantillas");
            MessageProcessor.process({
                serviceId: "co_sm_web_template_getList",
                data: {
                    "start": 0,
                    "limit": 100,
                    "template_project": this.ticket_selected.project,
                    "active": 1,
                    "dir": true,
                    "sort": "template_name"
                },
                success: function (data) {
                    console.log(data);
                    if (data.total > 0) {
                        $("#templatesNotFound").remove();
                    }
                    var cont = 0;
                    var attachmentId;
                    var batchId;
                    var new_template_name;

                    data.results.forEach(function ShowResults(templateVal, templateIndex, Templatear) {

                        attachmentId = templateVal.icon_template.attachment[0].attachmentId;
                        batchId = templateVal.icon_template.attachment[0].batchId;

                        templateVal.template_name = templateVal.template_name.replace(" - ", "<br>");


                        $("#allTemplatesDiv").append("<div class=col-sm-4><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + templateVal.template_name + "</div><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + templateVal.id_template + "!--></div></div></div><div class=pt-footer><button id='crearTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button>Crear</button><button style:'display:none;' id='uploadJSON_" + cont + "' class='btn btn-primary'type=button>Subir (.JSON)</button> <button style='display:none;' id='visualizarTemplate_" + cont + "' class='btn btn-default btn-preview' type=button disabled>Visualizar</button></div></div></div>");


                        $("#crearTemplate_" + cont).on("click", { val: { id: templateVal.id_template, name: templateVal.template_name } }, function (event) {
                            reference.template_selected = event.data.val;
                            reference.loadPage("page-005");
                        });

                        /*
                    
                            $("#uploadJSON_"+cont).on("click", {val:templateVal.id_template}, function(event){
                            sessionStorage.setItem("template_id", event.data.val);
                            uploadJSON(event.data.val);
                            //$(location).attr('href',"https://100l-app.teleows.com/servicecreator/spl/CO_SMART_DOCS/CO_SMART_DOCS_NEW_REPORT.spl");
                        });
                    
                    
                        $("#visualizarTemplate_"+cont).on("click", {val:templateVal}, function(event){
                            console.log("Accion",event.data.val);
        
                            if(event.data.val.template_pdf == undefined){
        
                                $("#pdfNotFound").modal('show');
        
                            }
                            else{
        
                                console.log("Vista previa del PDF Ok");
        
                                $('#generatingPDF').modal({backdrop: 'static', keyboard: false});
        
                                var batchId = event.data.val.template_pdf.attachment[0].batchId ;
                                var attachmentId= event.data.val.template_pdf.attachment[0].attachmentId ;
        
                                console.log("batchId : " + batchId);
                                console.log("attachmentId : " + attachmentId);
        
        
                                $.getScript( "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId )
                                    .done(function( script, textStatus ) {
                                        console.log("PDF Script : "+textStatus);
        
                                    })
                                    .fail(function( jqxhr, settings, exception ) {
                                        console.log(settings);
                                        console.log( "Triggered ajaxError handler." + exception );
                                    });
        
                            }
        
                        });
                        */
                        cont += 1;
                    });
                    reference.deletePageLoader();
                }

            });
        },
        template_selected: "",
        loadTemplate: function () {
            let reference = this;
            reference.changeLoadingMessageLoaderPage("Obteniendo datos de la plantilla OWS Datamodel");
            MessageProcessor.process({
                serviceId: "co_sm_web_template_get",
                data: {
                    "id_template": reference.template_selected.id
                },
                success: function (data) {
                    var attachmentId = data.result.template_web.attachment[0].attachmentId;
                    var batchId = data.result.template_web.attachment[0].batchId
                    console.log("Template", data);
                    $("#titleReport").text(data.result.template_name);
                    $("#btnSave").click(function () {
                        //$(location).attr('href', 'https://100l-app.teleows.com/app/spl/CO_SMART_DOCS/CO_SMART_DOCS_UPLOAD_FILE.spl');
                    });

                    $("#btnsaveReportEmpty").click(function () {
                        $(location).attr('href', 'https://100l-app.teleows.com/app/spl/CO_SMART_DOCS/CO_SMART_DOCS_UPLOAD_FILE.spl');
                    });

                    $("#btnsaveReportNotEmpty").click(function () {
                        $(location).attr('href', 'https://100l-app.teleows.com/app/spl/CO_SMART_DOCS/CO_SMART_DOCS_UPLOAD_FILE.spl');
                    });

                    $.ajax({
                        //Cambiar a type: POST si necesario
                        type: "GET",
                        // Formato de datos que se espera en la respuesta
                        dataType: "json",
                        // URL a la que se enviará la solicitud Ajax
                        url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId,
                    })
                        .done(function (data, textStatus, jqXHR) {
                            if (console && console.log) {
                                console.log("La solicitud se ha completado correctamente.", jqXHR);
                                console.log("data", data);
                                executeEngine(data);
                                $("#templateNavTabs :first").addClass("active");
                                $("#templateTabsPanel :first").addClass("active");
                                reference.loadSaveButton();
                            }
                            reference.deletePageLoader();
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            if (console && console.log) {
                                console.log("La solicitud a fallado: " + textStatus);
                            }
                        });


                }
            })
        },
        loadTemplateEdit: function (template_location, answersLocation) {
            let reference = this;
            reference.changeLoadingMessageLoaderPage("Obteniendo datos de la plantilla OWS Datamodel");

            $.ajax({
                //Cambiar a type: POST si necesario
                type: "GET",
                // Formato de datos que se espera en la respuesta
                dataType: "json",
                // URL a la que se enviará la solicitud Ajax
                url: "https://100l-app.teleows.com/servicecreator/fileservice" + template_location,
            })
                .done(function (data, textStatus, jqXHR) {

                    console.log("La solicitud se ha completado correctamente.", jqXHR);
                    executeEngine(data);
                    $("#templateNavTabs :first").addClass("active");
                    $("#templateTabsPanel :first").addClass("active");
                    reference.loadSaveButton();
                    reference.changeLoadingMessageLoaderPage("Obteniendo datos almacenados OWS Datamodel");
                    $.ajax({
                        //Cambiar a type: POST si necesario
                        type: "GET",
                        // Formato de datos que se espera en la respuesta
                        dataType: "json",
                        // URL a la que se enviará la solicitud Ajax
                        url: "https://100l-app.teleows.com/servicecreator/fileservice" + answersLocation,
                    })
                        .done(function (data, textStatus, jqXHR) {
                            if (console && console.log) {
                                console.log("La solicitud se ha completado correctamente.", jqXHR);
                                console.log("data", data);
                                var array = JSON.parse("[" + data + "]");
                                macthAnswers(array[0]);
                                reference.deletePageLoader();
                            }
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            if (console && console.log) {
                                console.log("La solicitud a fallado: " + textStatus);
                            }
                        });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        console.log("La solicitud a fallado: " + textStatus);
                    }
                });


        },
        reportStatusEditTemp: "",
        loadSaveButton: function () {
            let reference = this;
            $("#btnSave").click(function () {
                let allReqFilled = saveAnswers(reference.ticket_selected.ticket_id, reference.template_selected.name);
                switch (allReqFilled.allFieldsReqCompleted) {
                    case false:
                        reference.reportStatusEditTemp = "SM-Status001";
                        reference.launchSaveJSONModal(allReqFilled.fieldsEmpty);
                        break;
                    case true:
                        reference.reportStatusEditTemp = "SM-Status002";
                        reference.launchSaveJSONModal("");
                        break;
                }
            });
        },
        launchSaveJSONModal: function (fieldsEmpty) {
            let reference = this;
            let title;
            let icon;
            let body;
            $("#saveJSONModal").remove();
            switch (reference.reportStatusEditTemp) {
                case "SM-Status001":
                    title = "Algunos campos no han sido completados...";
                    icon = "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-256.png";
                    body = "Te faltaron completar algunos campos obligatorios : <br>" + fieldsEmpty.toLowerCase();;
                    break;
                case "SM-Status002":
                    title = "Todos los campos obligatorios han sido completados";
                    icon = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/512/Tick_Mark-256.png";
                    body = "Todos los campos obligatorios fueron completados";
                    break;
            }
            $("body").append("<div class='fade modal modal-defalt'aria-hidden=true aria-labelledby=myModalLabel1 id=saveJSONModal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel8>" + title + "</h4></div><div class=modal-body><img style=margin-left:auto;margin-right:auto;display:block width=150px src='" + icon + "'><h4 style=text-align:center>" + body + "</h4></div><div class=modal-footer><input class='btn btn-default' data-dismiss='modal' type=button value='Volver a Llenar'> <input class='btn btn-primary'id=btnSaveReportJSONModal type=button value='Guardar el reporte'></div></div></div></div>");
            $("#saveJSONModal").modal({ backdrop: 'static', keyboard: false });

            $("#btnSaveReportJSONModal").click(function () {
                reference.loadPage('page-013');
                $('#saveJSONModal').modal('hide');
            });
        },
        fillTables: function () {
            let reference = this;
            let groups = reference.userGroup;
            if (groups.indexOf("Admin") >= 0) {

                //It's Administrator
                reference.fillReports("", "dataTableAllReport", "itemAll", "totalAll", "", "", "", "", "Admin", "My Reports [ALL] - Smart Docs");
                reference.fillReports("SM-Status001", "dataTableDraftReport", "itemDraft", "totalDraf", "", "", "", "", "Admin", "My Reports [DRAFT] - Smart Docs");
                reference.fillReports("SM-Status002", "dataTableCompletedReport", "itemComp", "totalCompleted", "", "", "", "Admin", "My Reports [COMPLETED] - Smart Docs");
                reference.fillReports("SM-Status003", "dataTableApproveReport", "itemApprov", "totalApproved", "", "", "", "Admin", "My Reports [APPROVED] - Smart Docs");
                reference.fillReports("SM-Status004", "dataTableRejectedTable", "itemRejec", "totalRejected", "", "", "", "Admin", "My Reports [REJECTED] - Smart Docs");
            }
            else if (groups.indexOf("Quality") >= 0) {

                //It's Quality
                let belongs = false;
                let groupBelong;
                let groupsQuality = ["SERDAN", "TEKA", "UNION ELECTRICA"];

                for (let i of groupsQuality) {

                    if (groups.indexOf(i) >= 0) {
                        groupBelong = i;
                        belongs = true;
                        break;
                    }

                }

                if (belongs == true) {
                    //User with group

                    reference.fillReports("", "dataTableAllReport", "itemAll", "totalAll", "", "", "", "", groupBelong, "My Reports [ALL] - Smart Docs");
                    reference.fillReports("SM-Status001", "dataTableDraftReport", "itemDraft", "totalDraf", "", "", "", "", groupBelong, "My Reports [DRAFT] - Smart Docs");
                    reference.fillReports("SM-Status002", "dataTableCompletedReport", "itemComp", "totalCompleted", "", "", "", "", groupBelong, "My Reports [COMPLETED] - Smart Docs");
                    reference.fillReports("SM-Status003", "dataTableApproveReport", "itemApprov", "totalApproved", "", "", "", "", groupBelong, "My Reports [APPROVED] - Smart Docs");
                    reference.fillReports("SM-Status004", "dataTableRejectedTable", "itemRejec", "totalRejected", "", "", "", "", groupBelong, "My Reports [REJECTED] - Smart Docs");

                }
                else {
                    //User without group
                    reference.fillReports("", "dataTableAllReport", "itemAll", "totalAll", "", "", "", "", "Quality", "My Reports [ALL] - Smart Docs");
                    reference.fillReports("SM-Status001", "dataTableDraftReport", "itemDraft", "totalDraf", "", "", "", "", "Quality", "My Reports [DRAFT] - Smart Docs");
                    reference.fillReports("SM-Status002", "dataTableCompletedReport", "itemComp", "totalCompleted", "", "", "", "Quality", "My Reports [COMPLETED] - Smart Docs");
                    reference.fillReports("SM-Status003", "dataTableApproveReport", "itemApprov", "totalApproved", "", "", "", "Quality", "My Reports [APPROVED] - Smart Docs");
                    reference.fillReports("SM-Status004", "dataTableRejectedTable", "itemRejec", "totalRejected", "", "", "", "Quality", "My Reports [REJECTED] - Smart Docs");
                }
            }
            else if (groups.indexOf("FME") >= 0) {

                reference.fillReports("", "dataTableAllReport", "itemAll", "totalAll", "", "", "", "", "FME", "My Reports [ALL] - Smart Docs");
                reference.fillReports("SM-Status001", "dataTableDraftReport", "itemDraft", "totalDraf", "", "", "", "", "FME", "My Reports [DRAFT] - Smart Docs");
                reference.fillReports("SM-Status002", "dataTableCompletedReport", "itemComp", "totalCompleted", "", "", "", "FME", "My Reports [COMPLETED] - Smart Docs");
                reference.fillReports("SM-Status003", "dataTableApproveReport", "itemApprov", "totalApproved", "", "", "", "FME", "My Reports [APPROVED] - Smart Docs");
                reference.fillReports("SM-Status004", "dataTableRejectedTable", "itemRejec", "totalRejected", "", "", "", "FME", "My Reports [REJECTED] - Smart Docs");
            }
        },
        fillReports: function (status, table, item_name, totalText, region, project, ticket_id, id_report, group, filename) {
            let reference = this;
            let dataRq = {};
            $("#" + table + " > tbody").html("");

            dataRq["start"] = 0;
            dataRq["limit"] = 1000;
            dataRq["status"] = status;
            dataRq["dir"] = "DESC";
            dataRq["sort"] = "id_report";
            dataRq["region"] = region;
            dataRq["project"] = project;
            dataRq["ticket_id"] = ticket_id;
            dataRq["id_report"] = id_report;

            switch (group) {
                case "FME": dataRq["author"] = username; break;
                case "SERDAN": case "TEKA": case "UNION ELECTRICA": dataRq["supplier"] = group; break;
            }
            let reports = JSON.parse(reference.allReports);
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
                            console.log("Click", this);
                            $("#mainContent2").addClass("loader");
                            $("#mainContent2").append("<div id='loaderPage' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Pagina <div id='loaderPageContent'></div> </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
                            reference.changeLoadingMessageLoaderPage("Obteniendo Datos del Registro desde OWS Datamodel");
                            reference.ticket_selected = ticket_selected;
                            reference.loadWorkerCurrentTime(false);
                            if (ticket_selected.file_location != undefined) {
                                $.ajax({
                                    method: "GET",
                                    dataType: 'json',
                                    url: "https://100l-app.teleows.com/servicecreator/fileservice" + ticket_selected.file_location,
                                })
                                    .done(function (answersTree) {
                                        reference.changeLoadingMessageLoaderPage("Obteniendo Respuesta del Reporte desde OWS Datamodel");
                                        console.log("Answers Tree Retrieved");
                                        reference.answersTree = answersTree;
                                        if (ticket_selected.web_template_location != "none") {
                                            $.ajax({
                                                //Cambiar a type: POST si necesario
                                                type: "GET",
                                                // Formato de datos que se espera en la respuesta
                                                dataType: "json",
                                                // URL a la que se enviará la solicitud Ajax
                                                url: "https://100l-app.teleows.com/servicecreator/fileservice" + ticket_selected.web_template_location,
                                            })
                                                .done(function (pdfTemplate) {
                                                    reference.template_pdf = pdfTemplate;
                                                    reference.changeLoadingMessageLoaderPage("Obteniendo Plantilla desde OWS Datamodel");
                                                    switch (ticket_selected.status_id) {
                                                        //Draft or Completed or Rejected
                                                        case "SM-Status001": case "SM-Status002": case "SM-Status004":
                                                            //Add Watermark
                                                            reference.loadWorkerReportView(true, "Test", "Ticket1");
                                                            break;
                                                        //Approve
                                                        case "SM-Status003":
                                                            reference.loadWorkerReportView(false, "Test", "Ticket1");
                                                            break;
                                                    }
                                                })
                                                .fail(function (jqXHR, textStatus, errorThrown) {
                                                    if (console && console.log) {
                                                        console.log("La solicitud a fallado: " + textStatus);
                                                    }
                                                });
                                        }
                                        else {
                                            console.log("PDF template not found");
                                        }
                                    })
                                    .fail(function (jqXHR, textStatus, errorThrown) {
                                        if (console && console.log) {
                                            console.log("La solicitud a fallado: " + textStatus);
                                            reference.changeLoadingMessageLoaderPage("No se ha encontrado las respuestas del Reporte");
                                        }
                                    });
                            }
                            else {
                                //Not Answers
                                console.log("Not Answer not found");
                            }

                        })
                    cont += 1;
                }

            }

            reference.newDatatable(table, filename);
            /*
            MessageProcessor.process({
                serviceId: "co_sm_report_getList",
                data: dataRq,
                success: function (data) {
                    
                    $("#" + table + " > tbody").html("");
                    var cont = 0;
                    data.results.forEach(function ShowResults(value, index, ar) {
                        $("#" + table + " > tbody").append("<tr class=" + data.results[index].class_sm + "><td style='cursor:pointer' id='" + item_name + cont + "'>" + data.results[index].ticket_id + "</td><td>" + data.results[index].template_name + "</td><td>" + data.results[index].site_id + "</td><td>" + data.results[index].site_name + "</td><td>" + data.results[index].work_client + "</td><td>" + data.results[index].project + "</td><td>" + data.results[index].region + "</td><td style='text-align:-webkit-center'>" + data.results[index].status + "</td><td>" + data.results[index].creation_date + "</td><td>" + data.results[index].author + "</td><td>" + data.results[index].id_report + "</td><td><input id='" + item_name + cont + "Details' type='image' name='image' src='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/eye-24-20.png'></td></tr>");
 
                        $('#' + item_name + cont).add('#' + item_name + cont + "Details").on("click",
                            {
                                "approval_date": data.results[index].approval_date,
                                "approver": data.results[index].approver,
                                "author": data.results[index].author,
                                "comment": data.results[index].comment,
                                "completed_date": data.results[index].completed_date,
                                "creation_date": data.results[index].creation_date,
                                "file": data.results[index].file,
                                "file_location": data.results[index].file_location,
                                "id_report": data.results[index].id_report,
                                "last_modification": data.results[index].last_modification,
                                "modified_by": data.results[index].modified_by,
                                "project": data.results[index].project,
                                "region": data.results[index].region,
                                "rejected_date": data.results[index].rejected_date,
                                "site_id": data.results[index].site_id,
                                "site_name": data.results[index].site_name,
                                "status": data.results[index].status,
                                "status_id": data.results[index].status_id,
                                "supplier": data.results[index].supplier,
                                "ticket_id": data.results[index].ticket_id,
                                "web_template": data.results[index].template_name,
                                "web_template_location": data.results[index].web_template_location,
                                "work_client": data.results[index].work_client,
                                "class_sm": data.results[index].class_sm
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
                                    "work_client": (event.data.work_client == undefined) ? "" : event.data.work_client,
                                    "class_sm": (event.data.class_sm == undefined) ? "" : event.data.class_sm
                                };
                                console.log("Click", this);
                                reference.ticket_selected = ticket_selected;
                                reference.loadWorkerCurrentTime(false);
                                if (ticket_selected.file_location != undefined) {
                                    $.ajax({
                                        method: "GET",
                                        dataType: 'json',
                                        url: "https://100l-app.teleows.com/servicecreator/fileservice" + ticket_selected.file_location,
                                    })
                                        .done(function (answersTree) {
                                            console.log("Answers Tree Retrieved");
                                            reference.answersTree = answersTree;
                                            if (ticket_selected.web_template_location != "none") {
                                                $.ajax({
                                                    //Cambiar a type: POST si necesario
                                                    type: "GET",
                                                    // Formato de datos que se espera en la respuesta
                                                    dataType: "json",
                                                    // URL a la que se enviará la solicitud Ajax
                                                    url: "https://100l-app.teleows.com/servicecreator/fileservice" + ticket_selected.web_template_location,
                                                })
                                                    .done(function (pdfTemplate) {
                                                        reference.template_pdf = pdfTemplate;
                                                        switch (ticket_selected.status_id) {
                                                            //Draft or Completed or Rejected
                                                            case "SM-Status001": case "SM-Status002": case "SM-Status004":
                                                                //Add Watermark
                                                                reference.loadWorkerReportView(true);
                                                                break;
                                                            //Approve
                                                            case "SM-Status003":
                                                                reference.loadWorkerReportView(false);
                                                                break;
                                                        }
                                                    })
                                                    .fail(function (jqXHR, textStatus, errorThrown) {
                                                        if (console && console.log) {
                                                            console.log("La solicitud a fallado: " + textStatus);
                                                        }
                                                    });
                                            }
                                            else {
                                                console.log("PDF template not found");
                                            }
                                        })
                                        .fail(function (jqXHR, textStatus, errorThrown) {
                                            if (console && console.log) {
                                                console.log("La solicitud a fallado: " + textStatus);
                                            }
                                        });
                                }
                                else {
                                    //Not Answers
                                    console.log("Not Answer not found");
                                }
 
                            })
                        cont += 1;
                    });
 
                    $("#" + totalText).text(data.total + " Reportes");
                    if (status = "SM-Status004") {
 
                        //$(".side-body").removeClass("loader");
                        //$("#loader").remove();
                    }
 
                    */
            //reference.newDatatable(table, filename);
        },
        newDatatable: function (tableName, filename) {
            $('#' + tableName).DataTable({
                dom: 'Bfrtip',
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                buttons: [{
                    extend: 'excelHtml5',
                    responsive: true,
                    text: '<i class="fa fa-file-excel-o" aria-hidden="true"> Excel </i>',
                    title: filename,
                    customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        $('row:first c', sheet).attr('s', '42');
                        var lastCol = sheet.getElementsByTagName('col').length - 1;
                        var colRange = createCellPos(lastCol) + '1';
                        //Has to be done this way to avoid creation of unwanted namespace atributes.
                        var afSerializer = new XMLSerializer();
                        var xmlString = afSerializer.serializeToString(sheet);
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                        var xlsxFilter = xmlDoc.createElementNS('http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'autoFilter');
                        var filterAttr = xmlDoc.createAttribute('ref');
                        filterAttr.value = 'A1:' + colRange;
                        xlsxFilter.setAttributeNode(filterAttr);
                        sheet.getElementsByTagName('worksheet')[0].appendChild(xlsxFilter);
                    }
                },
                {
                    extend: 'copy',
                    text: '<i class="fa fa-clipboard" aria-hidden="true"> Copiar </i>',
                    exportOptions: {
                        modifier: {
                            page: 'current'
                        }
                    }
                }]
            });


            function createCellPos(n) {
                var ordA = 'A'.charCodeAt(0);
                var ordZ = 'Z'.charCodeAt(0);
                var len = ordZ - ordA + 1;
                var s = "";

                while (n >= 0) {
                    s = String.fromCharCode(n % len + ordA) + s;
                    n = Math.floor(n / len) - 1;
                }

                return s;
            }

            // Setup - add a text input to each footer cell
            $('#' + tableName + ' tfoot th').each(function () {
                var title = $(this).text();
                if (title != ".") {
                    $(this).html('<input type="text" id="' + title.replace(/\s/g, "") + 'All" class="form-control" placeholder="Buscar ' + title + '" />');
                }
            });

            // DataTable
            var table = $('#' + tableName).DataTable();

            // Apply the search
            table.columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });

            });

            $("tfoot").css("display", "table-header-group");

            $(".dt-buttons").addClass("pull-right");

            $(".dt-buttons > a[aria-controls=" + tableName + "").attr("class", "btn btn-primary")

            $(".dt-buttons > a[aria-controls=" + tableName + "").css("margin-right", "20px");

            $("#" + tableName + "_filter").addClass("pull-left");

        },
        template_pdf: "",
        preview_pdf: "",
        answersTree: "",
        updateTicketDetail: function () {
            let reference = this;
            reference.changeLoadingMessageLoaderPage("Actualizando Pagina");
            //$("#detail_ticket_preview2").attr("data", reference.preview_pdf);
            $("#view_ticket_pdf").click(function () {
                pdfMake.createPdf(reference.preview_pdf).download(reference.ticket_selected.web_template + " - " + reference.ticket_selected.id_report + ".pdf");
            });
            //Revisar y enviar el ticket _id
            $("#detail_ticket_edit").click(function () {
                console.log("Web Template Location:" + reference.ticket_selected.web_template_form);
                reference.loadPageEdit(reference.ticket_selected.web_template_form, reference.ticket_selected.file_location);
            });
            $("#templateName").text(reference.ticket_selected.web_template);
            $("#reportStatus").text(reference.ticket_selected.status);
            $("#reportCompletedDate").html("<b>Completed Date : </b> " + reference.ticket_selected.completed_date);
            $("#reportApprovalDate").html("<b>Approval Date : </b>" + reference.ticket_selected.approval_date);
            $("#reportRejectedDate").html("<b>Rejected Date : </b>" + reference.ticket_selected.rejected_date);
            $("#reportId").html("<b>Id Report: </b>" + reference.ticket_selected.id_report);
            $("#reportTicketId").html("<b>Id Ticket: </b>" + reference.ticket_selected.ticket_id);
            $("#reportTicketCustomer").html("<b>Id Ticket Cliente: </b>" + reference.ticket_selected.work_client);
            $("#reportProject").html("<b>Project: </b>" + reference.ticket_selected.project);
            $("#reportRegion").html("<b>Region: </b>" + reference.ticket_selected.region);
            $("#reportSiteId").html("<b>Id Site: </b>" + reference.ticket_selected.site_id);
            $("#reportSiteName").html("<b>Site Name: </b>" + reference.ticket_selected.site_name);
            $("#reportApprover").html("<b>Approver: </b>" + reference.ticket_selected.approver);
            $("#reportAuthor").html("<b>Author: </b>" + reference.ticket_selected.author);

            //Change Ticket Detail Background Color 
            switch (reference.ticket_selected.class_sm) {
                case "danger": $("#ticketBackground").addClass('red'); break;
                case "info": $("#ticketBackground").addClass('blue'); break;
                case "success": $("#ticketBackground").addClass('green'); break;
                case "warning": $("#ticketBackground").addClass('yellow'); break;
            }

            switch (reference.userGroup) {
                case "FME":
                    $("#detail_ticket_approve").remove();
                    $("#detail_ticket_reject").remove();
                    $("#detail_ticket_view").remove();
                    switch (reference.ticket_selected.status_id) {
                        //Draft or Rejected
                        case "SM-Status001": case "SM-Status004":
                            break;
                        //Complete or Approve
                        case "SM-Status002": case "SM-Status003":
                            $("#detail_ticket_edit").remove();
                            break;
                    }
                    break;
                case "Quality":
                    switch (reference.ticket_selected.status_id) {
                        //Draft or Rejected or Approve
                        case "SM-Status001": case "SM-Status004": case "SM-Status003":
                            $("#detail_ticket_approve").remove();
                            $("#detail_ticket_reject").remove();
                            break;
                        //Complete 
                        case "SM-Status002":
                            reference.loadApproveAndRejectBtnEvents();
                            break;
                    }
                    break;
                case "Admin":
                    switch (reference.ticket_selected.status_id) {
                        //Draft or Rejected or Approve
                        case "SM-Status001": case "SM-Status004": case "SM-Status003":
                            $("#detail_ticket_approve").remove();
                            $("#detail_ticket_reject").remove();
                            break;
                        //Complete 
                        case "SM-Status002":
                            reference.loadApproveAndRejectBtnEvents();
                            break;
                    }
                    break;
            }

            let class_background_comment = "";
            let status = "";
            $("#showComments").html("");
            for (let comment of reference.ticket_selected.comment) {
                switch (comment.status) {
                    case "SM-Status001":
                        status = "DRAFT";
                        class_background_comment = "list-group-item list-group-item-warning";
                        break;
                    case "SM-Status002":
                        status = "COMPLETED";
                        class_background_comment = "list-group-item list-group-item-info";
                        break;
                    case "SM-Status003":
                        status = "APPROVE";
                        class_background_comment = "list-group-item list-group-item-success";
                        break;
                    case "SM-Status004":
                        status = "REJECTED";
                        class_background_comment = "list-group-item list-group-item-danger";
                        break;
                }
                $("#showComments").append("<li class='" + class_background_comment + "'><span class='badge'>" + comment.time + "<br>" + status + "</span>" + comment.comment + "<br>" + comment.author + "</li>");
            }

            reference.deletePageLoader();
        },
        loadApproveAndRejectBtnEvents: function () {
            let reference = this;
            $("#detail_ticket_approve").click(function () {
                reference.launchApproveModal();
            });
        }
    }
    $(function () {
        $("link").remove();
        $("head").append("<meta name='mobile-web-app-capable' content='yes'>");
        $("head").append("<link rel='icon' sizes='192x192' href='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=6296cedb-8b8b-4d71-8b18-2985a3cc43e6&attachmentId=666870'>");
        $("body").addClass("loader");
        $("body").append("<div id='loader' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Recursos <div id='loaderContent'> </div> </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
        $("#formPanelUpload").hide();
        smart.onInit();
    });
})()