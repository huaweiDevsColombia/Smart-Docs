let workers = require("./loadsWorkers");
let tickets = require("./tickets");
let reports = require("./reports");
let templates = require("./templates");
let smartEngine = require("./smartEngine");
let message = require("./messages");
let uid = require("./uid");

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
    loadNavBar: function () {
        $("#_homePage").remove();
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
    },
    makeProgressive: function () {
        $("head").append("<meta name='mobile-web-app-capable' content='yes'>");
        $("head").append("<link rel='icon' sizes='192x192' href='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=6296cedb-8b8b-4d71-8b18-2985a3cc43e6&attachmentId=666870'>");
    },
    pages: "",
    userGroup: "",
    userInformation: "",
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
                reference.loadNavBar();
                reference.makeProgressive();
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
    reziseOWSFileInputs: function () {
        /* Form Upload OWS */
        $("#mainContent").append($("#formUploadTemplates"));
        $("#formUploadTemplates").css("margin", "0 auto");
        $("#formUploadTemplates").css("width", "250px");
        //$(".e_btn_gary > a").remove();
        $("#web_template_file_UploadBtn_bifFile").html("<button id='btnEnviarWeb' class='btn btn-primary'><i class='fa fa-plus' aria-hidden='true'></i> &nbsp Agregar WEB Template (SOLO .JSON)</button>");
        $("#pdf_template_file_UploadBtn_bifFile").html("<button id='btnEnviarPdf' class='btn btn-primary'><i class='fa fa-plus' aria-hidden='true'></i> &nbsp Agregar PDF Template (SOLO .JSON)</button>");
        $("#web_template_file_UploadBtn_bifFile > span").remove();
        $("#pdf_template_file_UploadBtn_bifFile > span").remove();
        $("#web_template_file_div > span").remove();
        $("#pdf_template_file_div > span").remove();
        $("#ext-gen2UploadBtn").remove();
        $("#ext-gen2UploadBtn").remove();
        $("#formUploadTemplates").hide();
    },
    showOWSFileInputs: function () {
        $("#templatesDiv").append($("#formUploadTemplates"));
        $("#formUploadTemplates").show();
    },
    removeOWSFileInputs: function () {
        $("#mainContent").append($("#formUploadTemplates"));
        $("#formUploadTemplates").hide();
    },
    changeMenuContent: function (pageCode) {
        let reference = this;
        $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
        $('body').addClass("flat-blue");
        $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
        $('.content-container').append(pageCode);
        reference.reziseOWSFileInputs();
    },
    changeMainContent: function (pageCode) {
        let reference = this;
        reference.removeOWSFileInputs();
        $("#mainContent2").html("");
        $('#mainContent2').append(pageCode);
    },
    menuItems: function () {
        let items = [
            { id: "itemInicio", id_page: "page-004" },
            { id: "itemTareas", id_page: "page-008" },
            { id: "itemReportes", id_page: "page-014" },
            { id: "itemTemplates", id_page: "page-007" },
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
                reference.hideNavBar();
                reference.bootstrapPage(menu_item.id_page).then(function () {
                    reference.changeActiveMenu(menu_item.id);
                });
            });
        }
    },
    hideNavBar: function () {
        $(".app-container").removeClass("expanded");
        $(".navbar-expand-toggle").removeClass("fa-rotate-90");
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
                $("#itemTemplates").show();
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
                $("#itemTemplates").hide();
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
                $("#pageName").text("Inicio");
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Reportes en @OWS Datamodel");
                reports.loadStatistic(reference.userGroup).then(function () {
                    message.removeMessageLoader("#mainContent2");
                    reference.changeBoxStatistic(reports.allReports);
                });
                //reference.loadStatistic("", "statisticTotal");
                //reference.loadStatistic("SM-Status002", "statisticCompleted");
                //reference.loadStatistic("SM-Status003", "statisticApproved");
                //reference.loadStatistic("SM-Status004", "statisticRejected");
                //reference.deletePageLoader();
                break;
            //All Tickets Page    
            case "page-008":
                $("#pageName").text("Mis Tareas");
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Tickets en @OWS SDM Application");
                tickets.loadTickets().then(function () {
                    message.removeMessageLoader("#mainContent2");
                    reference.changeTicketsPage(tickets.allTickets);
                });
                break;
            //All Templates Page    
            case "page-007":
                $("#pageName").text("Plantillas");
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Plantillas en @OWS Datamodel");

                if (tickets.ticketSelected.project != undefined) {
                    templates.loadTemplates(tickets.ticketSelected.project).then(function () {
                        message.removeMessageLoader("#mainContent2");
                        reference.changeTemplatesPage(templates.allTemplates);
                    });
                }
                else {
                    templates.loadTemplates(templates.templateProject).then(function () {
                        message.removeMessageLoader("#mainContent2");
                        reference.changeTemplatesPageAdm(templates.templateProject, templates.allTemplates);
                    });
                }

                break;
            //New Report Page
            case "page-005":
                $("#pageName").text("Edicion Reporte");
                let templateSelected = templates.templateSelected;
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Plantilla en @OWS Datamodel");
                message.changeMessageLoader("loaderMessage", "Generando Plantilla");
                smartEngine.executeEngine(templates.template[0].jsonWeb);
                $('#templateNavTabs a:first').tab('show');
                reference.loadEventSaveReport();
                message.changeMessageLoader("loaderMessage", "Cargando Reporte Almacenado");
                for (let reportAnswer of reports.reportResponseImages) {
                    if (Array.isArray(reportAnswer.images)) {
                        smartEngine.matchAnswers(reportAnswer.images[0]);
                        if (Array.isArray(reportAnswer.images_1)) {
                            smartEngine.matchAnswers(reportAnswer.images_1[0]);
                        }
                    }
                }

                for (let reportAnswer of reports.reportResponse) {
                    if (Array.isArray(reportAnswer)) {
                        if (reportAnswer.length > 0) {
                            smartEngine.matchAnswers(reportAnswer[0]);
                        }
                    }
                }
                message.removeMessageLoader("#mainContent2");
                /*
                templates.loadTemplate(templateSelected.template_web, templateSelected.template_pdf).then(function () {
                    message.changeMessageLoader("loaderMessage", "Generando Plantilla");
                    smartEngine.executeEngine(templates.template[0].jsonWeb);
                    $('#templateNavTabs a:first').tab('show');
                    reference.loadEventSaveReport();

                    if (reports.reportSelected.id_report != undefined) {
                        message.changeMessageLoader("loaderMessage", "Cargando Reporte Almacenado");
                        reports.loadReport().then(function () {
                            console.log("Load Report: ", reports.reportResponse);
                            console.log("Load Report Images: ", reports.reportResponseImages);
                            for (let reportAnswer of reports.reportResponseImages) {
                                if (Array.isArray(reportAnswer.images)) {
                                    smartEngine.matchAnswers(reportAnswer.images[0]);
                                    if (Array.isArray(reportAnswer.images_1)) {
                                        smartEngine.matchAnswers(reportAnswer.images_1[0]);
                                    }
                                }
                            }

                            for (let reportAnswer of reports.reportResponse) {
                                if (Array.isArray(reportAnswer)) {
                                    if (reportAnswer.length > 0) {
                                        smartEngine.matchAnswers(reportAnswer[0]);
                                    }
                                }
                            }
                            message.removeMessageLoader("#mainContent2");
                        });
                    }
                    else {
                        message.removeMessageLoader("#mainContent2");
                        console.log("Loading Report From DataModel");
                    }

                });
                */
                break;
            //My Reports    
            case "page-014":
                $("#pageName").text("Mis Reportes");
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Reportes en @OWS Datamodel");
                reports.loadStatistic(reference.userGroup).then(function () {
                    message.removeMessageLoader("#mainContent2");
                    reference.fillDataTableMyReports(reports.fillMyReports());
                    $('#allReportsNavTab a:first').tab('show');
                });
                break;
            // My Reports Related
            case "page-024":
                $("#pageName").text("Reportes Relacionados");
                reference.fillBoxesReportsRelated(reports.fillMyReportsRelated());
                break;
            //Detail Report    
            case "page-021":
                $("#pageName").text("Detalle del Reporte");
                message.addMessageLoder("loaderMessage", "#mainContent2");
                message.changeMessageLoader("loaderMessage", "Consultando Reporte en @OWS Datamodel");
                reports.loadStatistic(reference.userGroup).then(function () {
                    message.removeMessageLoader("#mainContent2");
                    reference.changeDataReport();
                });
                break;
            // New Report
            case "page-025":
                reference.showOWSFileInputs();
                reference.getProjects().then(function (projects) {
                    reference.fillProjects("template_project", projects);
                    reference.enableCreateTemplateButtons();
                });
                break;
            // Edit Report
            case "page-026":
                reference.showOWSFileInputs();
                reference.fillTemplateData();
                reference.getProjects().then(function (projects) {
                    reference.fillProjects("template_project", projects);
                    reference.enableEditTemplatesButtons();
                });
                break;
        }
    },
    changeBoxStatistic: function (allReports) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Cargando Estadisticas");
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
        message.removeMessageLoader("#mainContent2");
    },
    changeTicketsPage: function (allTickets) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Cargando Tickets");
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

        if (PMLength > 0 || CMLength > 0 || PMLLength > 0) {
            $("#ticketsNotFound").remove();
            let cont = 0;
            for (let ticket_type of ticketsType) {
                for (let ticket of allTickets[ticket_type].results) {
                    ticket.ticket_priority = (ticket.ticket_priority == undefined) ? " N/A" : ticket.ticket_priority;
                    $("#allTicketsDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class='pricing-table'><div class=pt-header style='background-color:#dbdbdb'><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + ticket.subject + "</div><div class=pricing-type> Reportes Asociados: 0 </div></div></div><div class=pt-body style='background-color:#aeaeae'><h4>" + ticket.type + " - " + ticket.project + "</h4><ul class=plan-detail><li><b>Region :</b> " + ticket.region + " - " + ticket.city + "<li><b>Prioridad : </b>" + ticket.ticket_priority + "<li><b>Estado : </b>" + ticket.status + "<li><b>Ticket Id:<br></b>CM-" + ticket.orderid + "</ul></div><div class=pt-footer><button id='doReport_" + cont + "' class='btn btn-primary'type=button>Seleccionar Plantilla</button></div></div></div>");
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
        message.removeMessageLoader("#mainContent2");
    },
    changeTemplatesPage: function (allTemplates) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Cargando Plantillas");
        $("#templateBoxesButtonsAdm").remove();
        $("#templateBoxesFilterAdm").remove();
        let cont = 0;
        if (allTemplates.length > 0) {
            $("#templatesNotFound").remove();
            for (let template of allTemplates) {
                $("#allTemplatesDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + template.template_name_web + "</div><img src='" + template.icon_template.substr(1).slice(0, -1) + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + template.id_template + "!--></div></div></div><div class=pt-footer><p><b>Ultima Actualizacion: </b> " + template.template_date + " </p><button id='createTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button>Crear Reporte</button></div></div></div>");
                $("#createTemplate_" + cont).on("click", {
                    val:
                    {
                        id_template: template.id_template,
                        icon_template: template.icon_template,
                        template_date: template.template_date,
                        template_name_export: template.template_name_export,
                        template_name_web: template.template_name_web,
                        template_pdf: template.template_pdf,
                        template_project: template.template_project,
                        template_web: template.template_web,
                        author: template.author
                    }
                }, function (event) {
                    templates.templateSelected = event.data.val;
                    reports.reportSelected = "";
                    console.log(templates.templateSelected);
                    reports.reportResponse = [];
                    reports.reportResponseImages = [];
                    let templateSelected = { "template_web": templates.templateSelected.template_web, "template_pdf": templates.templateSelected.template_pdf };
                    templates.loadTemplate(templateSelected.template_web, templateSelected.template_pdf).then(function () {
                        reference.bootstrapPage("page-005");
                    });
                });
                cont += 1;
            }
        }
        message.removeMessageLoader("#mainContent2");
    }
    ,
    changeTemplatesPageAdm: function (project, allTemplates) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Cargando Plantillas");
        reference.getProjects().then(function (projects) {
            reference.fillProjects("projectsFilter", projects);
            $("#projectsFilter").val((templates.templateProject == "") ? "None" : templates.templateProject);
            $("#totalTemplates").text(allTemplates.length);
            $("#projectsFilter").on("change", function () {
                templates.templateProject = ($("#projectsFilter").val() == "None") ? "" : $("#projectsFilter").val();
                reference.bootstrapPage('page-007');
            })
            $("#new_templateBtn").click(function () {
                reference.bootstrapPage("page-025");
            });
            let cont = 0;
            if (allTemplates.length > 0) {
                $("#templatesNotFound").remove();
                for (let template of allTemplates) {
                    $("#allTemplatesDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + template.template_name_web + "</div><img src='" + template.icon_template.substr(1).slice(0, -1) + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + template.id_template + "!--></div></div></div><div class=pt-footer><p><b>Ultima Actualizacion: </b> " + template.template_date + " </p><button id='previewTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button> <i class='fa fa-eye' aria-hidden=true></i> Visualizar </button><button id='editTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button><i class='fa fa-pencil-square-o' aria-hidden=true></i> Editar</button><button id='deleteTemplate_" + cont + "'class='btn btn-danger' style='margin-right:5px' type=button><i class='fa fa-trash-o' aria-hidden=true></i> Eliminar</button></div></div></div>");
                    $("#editTemplate_" + cont).on("click", {
                        val:
                        {
                            id_template: template.id_template,
                            icon_template: template.icon_template,
                            template_date: template.template_date,
                            template_name_export: template.template_name_export,
                            template_name_web: template.template_name_web,
                            template_pdf: template.template_pdf,
                            template_project: template.template_project,
                            template_web: template.template_web,
                            author: template.author
                        }
                    }, function (event) {
                        templates.templateSelected = event.data.val;
                        console.log(templates.templateSelected);
                        reference.bootstrapPage("page-026");
                    });
                    $("#previewTemplate_" + cont).on("click", {
                        val:
                        {
                            id_template: template.id_template,
                            icon_template: template.icon_template,
                            template_date: template.template_date,
                            template_name_export: template.template_name_export,
                            template_name_web: template.template_name_web,
                            template_pdf: template.template_pdf,
                            template_project: template.template_project,
                            template_web: template.template_web,
                            author: template.author
                        }
                    }, function (event) {
                        templates.templateSelected = event.data.val;
                        console.log(templates.templateSelected);
                        reference.bootstrapPage("page-005").then(function () {
                            $("#btnSave").remove();
                            $("#saveZoneDiv").append("<button id='btnGoBack' class='btn btn-primary'>Volver Atrás</button>");
                            $("#btnGoBack").click(function () {
                                reference.bootstrapPage('page-007');
                                templates.templateSelected = "";
                            });
                        });
                    });
                    $("#deleteTemplate_" + cont).on("click", {
                        val:
                        {
                            id_template: template.id_template,
                            icon_template: template.icon_template,
                            template_date: template.template_date,
                            template_name_export: template.template_name_export,
                            template_name_web: template.template_name_web,
                            template_pdf: template.template_pdf,
                            template_project: template.template_project,
                            template_web: template.template_web,
                            author: template.author,
                            id: template.id
                        }
                    }, function (event) {
                        templates.templateSelected = event.data.val;
                        console.log(templates.templateSelected);
                        $("#deleteTemplate").modal('show');
                    });
                    cont += 1;
                }
            }
            $("#btnDeleteReportTrue").click(function () {
                templates.deleteTemplate().then(function () {
                    $("#deleteTemplate").modal('hide');
                    reference.bootstrapPage("page-007");
                });
            });
            message.removeMessageLoader("#mainContent2");
        });
    },
    loadEventSaveReport: function () {
        let reference = this;
        $("#btnSave").click(function () {

            let id_reportResponse = "";
            let answer = smartEngine.saveAnswer();
            let comments = [];
            let moreInformation;
            let status = (answer.completed) ? "SM-Status002" : "SM-Status001";
            let idReport; let contImages;
            let answerDate; let answerDateTime; let answerTime; let answerWeek; let answerMonth;
            let answerText; let answerTextArea; let answerNumber; let answerRadio; let answerCheckbox;
            let answerSelect; let answerMultiSelect; let answerList; let answerTable; let answerImages;

            if (reports.reportSelected.id_report) {
                console.log("El reporte ya existe");
                comments = reports.reportSelected.comments; //Take the comments that the report has
                workers.getCurrentTime.then(function (currentTimeResponse) {
                    switch (status) {
                        case "SM-Status001":
                            comments.push({ "author": reference.userInformation.fullname, "comment": "El reporte ha sido modificado exitosamente en el sistema", "time": JSON.parse(currentTimeResponse).result.localDateTime, "status": status })
                            moreInformation = {}
                            break;
                        case "SM-Status002":
                            comments.push({ "author": reference.userInformation.fullname, "comment": "El reporte ha sido completado exitosamente en el sistema", "time": JSON.parse(currentTimeResponse).result.localDateTime, "status": status })
                            moreInformation = { "completed_date": JSON.parse(currentTimeResponse).result.localDateTime }
                            break;
                    }
                    var answersArr = JSON.parse(answer.userAnswer);
                    reference.userAnswer = answersArr;
                    reference.launchSaveModal();
                    reference.changeSaveModalText("Creando Paquetes de Respuestas");
                    answerDate = reference.filterByAnswerType('date');
                    answerDateTime = reference.filterByAnswerType('datetime');
                    answerTime = reference.filterByAnswerType('time');
                    answerWeek = reference.filterByAnswerType('week');
                    answerMonth = reference.filterByAnswerType('month');
                    answerText = reference.filterByAnswerType('text');
                    answerTextArea = reference.filterByAnswerType('textArea');
                    answerNumber = reference.filterByAnswerType('number');
                    answerTime = reference.filterByAnswerType('time');
                    answerRadio = reference.filterByAnswerType('radio');
                    answerCheckbox = reference.filterByAnswerType('checkbox');
                    answerSelect = reference.filterByAnswerType('select');
                    answerMultiSelect = reference.filterByAnswerType('multiSelect');
                    answerList = reference.filterByAnswerType('list');
                    answerTable = reference.filterByAnswerType('table');
                    console.log("Updating the Report");
                    idReport = reports.reportSelected.id_report;
                    reference.changeSaveModalText("Abriendo Comunicacion con @OWS");
                    let updateReportInfo = reference.updateDatamodel(idReport, status, comments, moreInformation);
                    let saveAnswerDate = reference.saveAnswerReport("date_answer", answerDate, idReport);
                    let saveAnswerDateTime = reference.saveAnswerReport("datetime_answer", answerDateTime, idReport);
                    let saveAnswerTime = reference.saveAnswerReport("time_answer", answerTime, idReport);
                    let saveAnswerWeek = reference.saveAnswerReport("week_answer", answerWeek, idReport);
                    let saveAnswerMonth = reference.saveAnswerReport("month_answer", answerMonth, idReport);
                    let saveAnswerText = reference.saveAnswerReport("text_answer", answerText, idReport);
                    let saveAnswerNumber = reference.saveAnswerReport("number_answer", answerNumber, idReport);
                    let saveAnswerRadio = reference.saveAnswerReport("radio_answer", answerRadio, idReport);
                    let saveAnswerCheckBox = reference.saveAnswerReport("radio_answer", answerCheckbox, idReport);
                    let saveAnswerSelect = reference.saveAnswerReport("select_answer", answerSelect, idReport);
                    let saveAnswerMultiSelect = reference.saveAnswerReport("multiselect_answer", answerMultiSelect, idReport);
                    let saveAnswerList = reference.saveAnswerReport("list_answer", answerList, idReport);
                    let saveAnswerTable = reference.saveAnswerReport("table_answer", answerTable, idReport);
                    answerImages = reference.filterByAnswerTypeImage();
                    contImages = 0;
                    do {
                        this["answerImages_" + contImages] = answerImages.splice(0, 2);
                        contImages++;
                    }
                    while (answerImages.length > 0);
                    reports.reportTemp["total_images"] = contImages;
                    reports.reportTemp["total_images_saved"] = 0;

                    //Check save images must be equals like creation - Currently is not working 

                    Promise.all([updateReportInfo, saveAnswerDate, saveAnswerDateTime, saveAnswerTime, saveAnswerWeek, saveAnswerMonth, saveAnswerText, saveAnswerNumber, saveAnswerRadio, answerCheckbox, saveAnswerSelect, saveAnswerMultiSelect, saveAnswerList, saveAnswerTable]).then(values => {
                        let contProImg = 0; let subIdNumber = 0; let subId = "-SB";
                        let promisesSave = [saveAnswerDate, saveAnswerDateTime, saveAnswerTime, saveAnswerWeek, saveAnswerMonth, saveAnswerNumber, saveAnswerText, saveAnswerRadio, saveAnswerSelect, saveAnswerMultiSelect, saveAnswerList, saveAnswerTable];
                        do {
                            console.log(this["answerImages_" + contProImg]);
                            if (contProImg % 2 == 0) {
                                this["saveAnswerImage_" + contProImg] = reference.saveAnswerReportImagesCreate("[" + JSON.stringify(this["answerImages_" + contProImg]) + "]", idReport + subId + subIdNumber, idReport);
                                promisesSave.push(this["saveAnswerImage_" + contProImg]);
                                subIdNumber++;
                            }
                            console.log(contProImg);
                            contProImg++;
                        }
                        while (contProImg <= contImages);
                        contProImg = 0; subIdNumber = 0;



                        console.log(promisesSave);
                        Promise.all(promisesSave).then(function (values) {
                            let promisesUpdate = [];
                            do {
                                console.log(this["answerImages_" + contProImg]);
                                if (contProImg % 2 != 0) {
                                    this["saveAnswerImage_" + contProImg] = reference.saveAnswerReportImagesUpdate("[" + JSON.stringify(this["answerImages_" + contProImg]) + "]", idReport + subId + subIdNumber, idReport);
                                    promisesUpdate.push(this["saveAnswerImage_" + contProImg]);
                                    subIdNumber++;
                                }
                                console.log(contProImg);
                                contProImg++;
                            }
                            while (contProImg <= contImages);

                            Promise.all(promisesUpdate).then(function (values) {
                                reference.changeSaveModalText("Se ha guardado exitosamente tu progreso");
                                reference.removeSaveModal();
                                if (answer.completed) {
                                    reference.launchAnswerCompletedModal();
                                }
                                else {
                                    reference.launchAnswerInCompleteModal(answer.fieldsEmpty);
                                }
                                reference.bootstrapPage('page-021');
                            });

                        });

                        /*
                        Promise.all(promisesUpdate).then(function (values) {
                            reference.changeSaveModalText("Se ha guardado exitosamente tu progreso");
                            reference.removeSaveModal();
                            if (answer.completed) {
                                reference.launchAnswerCompletedModal();
                            }
                            else {
                                reference.launchAnswerInCompleteModal(answer.fieldsEmpty);
                            }
                            reference.bootstrapPage('page-021');
                        });
                        */
                    });
                })
            }
            else {
                workers.getCurrentTime.then(function (currentTimeResponse) {
                    comments.push({ "author": username, "comment": "El reporte ha sido creado exitosamente en el sistema", "time": JSON.parse(currentTimeResponse).result.localDateTime, "status": status })
                    var answersArr = JSON.parse(answer.userAnswer);
                    reference.userAnswer = answersArr;
                    answerDate = reference.filterByAnswerType('date');
                    answerDateTime = reference.filterByAnswerType('datetime');
                    answerTime = reference.filterByAnswerType('time');
                    answerWeek = reference.filterByAnswerType('week');
                    answerMonth = reference.filterByAnswerType('month');
                    answerText = reference.filterByAnswerType('text');
                    answerTextArea = reference.filterByAnswerType('textArea');
                    answerNumber = reference.filterByAnswerType('number');
                    answerTime = reference.filterByAnswerType('time');
                    answerRadio = reference.filterByAnswerType('radio');
                    answerCheckbox = reference.filterByAnswerType('checkbox');
                    answerSelect = reference.filterByAnswerType('select');
                    answerMultiSelect = reference.filterByAnswerType('multiSelect');
                    answerList = reference.filterByAnswerType('list');
                    answerTable = reference.filterByAnswerType('table');
                    answerImages = reference.filterByAnswerTypeImage();
                    contImages = 0;
                    do {
                        this["answerImages_" + contImages] = answerImages.splice(0, 2);
                        contImages++;
                    }
                    while (answerImages.length > 0);
                    reports.reportTemp["total_images"] = contImages;
                    reports.reportTemp["total_images_saved"] = 0;
                    message.addMessageLoder("loaderMessage", "#mainContent2");
                    message.changeMessageLoader("loaderMessage", "Guardando Relacion del Reporte con Ticket");
                    console.log("Creating the Report");
                    return reference.saveDatamodel(status, comments, tickets.ticketSelected.project, tickets.ticketSelected.region,
                        tickets.ticketSelected.site_id, tickets.ticketSelected.supplier, tickets.ticketSelected.ticket_id, templates.templateSelected.id_template, tickets.ticketSelected.work_client)

                }).then(function (idReport) {
                    reports.reportSelected = { "id_report": idReport };
                    //reports.reportSelected["id_report"] = contImages ;
                    //message.changeMessageLoader("loaderMessage", "Guardando Reporte");
                    reference.launchSaveModal();
                    reference.changeSaveModalText("Abriendo comunicacion con @OWS Datamodel");
                    //idReport = idReportRes;
                    let saveAnswerDate = reference.saveAnswerReport("date_answer", answerDate, idReport);
                    let saveAnswerDateTime = reference.saveAnswerReport("datetime_answer", answerDateTime, idReport);
                    let saveAnswerTime = reference.saveAnswerReport("time_answer", answerTime, idReport);
                    let saveAnswerWeek = reference.saveAnswerReport("week_answer", answerWeek, idReport);
                    let saveAnswerMonth = reference.saveAnswerReport("month_answer", answerMonth, idReport);
                    let saveAnswerText = reference.saveAnswerReport("text_answer", answerText, idReport);
                    let saveAnswerNumber = reference.saveAnswerReport("number_answer", answerNumber, idReport);
                    let saveAnswerRadio = reference.saveAnswerReport("radio_answer", answerRadio, idReport);
                    //let saveAnswerCheckBox = reference.saveAnswerReport("radio_answer", answerCheckbox, idReport);
                    let saveAnswerSelect = reference.saveAnswerReport("select_answer", answerSelect, idReport);
                    let saveAnswerMultiSelect = reference.saveAnswerReport("multiselect_answer", answerMultiSelect, idReport);
                    let saveAnswerList = reference.saveAnswerReport("list_answer", answerList, idReport);
                    let saveAnswerTable = reference.saveAnswerReport("table_answer", answerTable, idReport);

                    let contProImg = 0; let subIdNumber = 0; let subId = "-SB";
                    let promisesSave = [saveAnswerDate, saveAnswerDateTime, saveAnswerTime, saveAnswerWeek, saveAnswerMonth, saveAnswerNumber, saveAnswerText, saveAnswerRadio, saveAnswerSelect, saveAnswerMultiSelect, saveAnswerList, saveAnswerTable];
                    do {
                        console.log(this["answerImages_" + contProImg]);
                        if (contProImg % 2 == 0) {
                            this["saveAnswerImage_" + contProImg] = reference.saveAnswerReportImagesCreate("[" + JSON.stringify(this["answerImages_" + contProImg]) + "]", idReport + subId + subIdNumber, idReport);
                            promisesSave.push(this["saveAnswerImage_" + contProImg]);
                            subIdNumber++;
                        }
                        console.log(contProImg);
                        contProImg++;
                    }
                    while (contProImg <= contImages);
                    contProImg = 0; subIdNumber = 0;
                    console.log(promisesSave);
                    Promise.all(promisesSave).then(function (values) {
                        let promisesUpdate = [];
                        do {
                            console.log(this["answerImages_" + contProImg]);
                            if (contProImg % 2 != 0) {
                                this["saveAnswerImage_" + contProImg] = reference.saveAnswerReportImagesUpdate("[" + JSON.stringify(this["answerImages_" + contProImg]) + "]", idReport + subId + subIdNumber, idReport);
                                promisesUpdate.push(this["saveAnswerImage_" + contProImg]);
                                subIdNumber++;
                            }
                            console.log(contProImg);
                            contProImg++;
                        }
                        while (contProImg <= contImages);
                        //console.log(promisesUpdate);
                        Promise.all(promisesUpdate).then(function (values) {
                            message.removeMessageLoader("#mainContent2");
                            reference.changeSaveModalText("Se ha guardado exitosamente tu progreso");
                            reference.removeSaveModal();
                            if (answer.completed) {
                                reference.launchAnswerCompletedModal();
                            }
                            else {
                                reference.launchAnswerInCompleteModal(answer.fieldsEmpty);
                            }
                            reference.bootstrapPage('page-021');
                        });
                    });
                });
            }
        });
    },
    userAnswer: "",
    filterByAnswerType: function (type) {
        let reference = this;
        var answerFiltered = reference.userAnswer.filter(function (e, index) {
            if (e.type == type) {
                //reference.userAnswer.splice(index, 1);
                return e;
            }
        });
        return (answerFiltered.length == 0) ? JSON.stringify(answerFiltered) : "[" + JSON.stringify(answerFiltered) + "]";

    },
    filterByAnswerTypeImage: function () {
        let reference = this;
        var answerFiltered = reference.userAnswer.filter(function (e, index) {
            if (e.type == 'image1Label' || e.type == "image2Labels") {
                //reference.userAnswer.splice(index, 1);
                return e;
            }
        });
        return answerFiltered;

    },
    saveDatamodel: function (status, comment, project, region, site, supplier, ticket, template, workClient) {
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_report_create",
                data: {
                    "status": status,
                    "comments": JSON.stringify(comment),
                    "project": project,
                    "region": region,
                    "site_id": site,
                    "supplier": supplier,
                    "ticket_id": ticket,
                    "web_template": template,
                    "work_client": workClient
                },
                success: function (data) {
                    console.log(data);
                    reports.reportSelected = { "id_report": data.id_report };
                    resolve(data.id_report);
                }
            });
        });
    },
    updateDatamodel: function (idReport, status, comment, moreInformation) {
        let data = {
            "id_report": idReport,
            "status": status,
            "comments": JSON.stringify(comment),
        };
        switch (status) {
            case "SM-Status002":
                data["completed_date"] = moreInformation["completed_date"];
                data["approval_date"] = "";
                data["approver"] = "";
                data["rejected_date"] = "";
                data["rejecter"] = "";
                break;
            case "SM-Status003":
                data["completed_date"] = "";
                data["approval_date"] = moreInformation["approval_date"];
                data["approver"] = moreInformation["approver"];
                data["rejected_date"] = "";
                data["rejecter"] = "";
                break;
            case "SM-Status004":
                data["completed_date"] = "";
                data["approval_date"] = "";
                data["approver"] = "";
                data["rejected_date"] = moreInformation["rejected_date"];
                data["rejecter"] = moreInformation["rejecter"];
                break;

        }

        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_report_update",
                data: data,
                success: function (data) {
                    console.log(data);
                    resolve();
                }
            });
        });
    },
    saveAnswerReport: function (type, answer, idReport) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            let data = {};
            data["id_report"] = idReport;
            data[type] = answer;
            MessageProcessor.process({
                serviceId: "co_sm_report_update",
                data: data,
                success: function (data) {
                    console.log(data);
                    reference.changeSaveModalText("Se han guardado " + type);
                    //message.changeMessageLoader("mainContent2", "Se ha guardado exitosamente " + type);
                    resolve();
                }
            });
        });
    },
    saveAnswerReportImagesCreate: function (answer, idReportImg, idReport) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            let data = {};
            data["report_img_id"] = idReportImg;
            data["id_report"] = idReport;
            data["images"] = answer;
            MessageProcessor.process({
                serviceId: "co_sm_report_images_create",
                data: data,
                success: function (data) {
                    console.log(data);
                    reports.reportTemp.total_images_saved += 2;
                    reference.changeSaveModalText("Se han guardado " + reports.reportTemp.total_images_saved + " imagenes de " + reports.reportTemp.total_images * 2);
                    //message.changeMessageLoader("mainContent2", "Se han guardado algunas imagenes");
                    resolve();
                }
            });
        });
    },
    saveAnswerReportImagesUpdate: function (answer, idReportImg, idReport) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            let data = {};
            data["report_img_id"] = idReportImg;
            data["image_1"] = answer;
            MessageProcessor.process({
                serviceId: "co_sm_report_images_update",
                data: data,
                success: function (data) {
                    console.log(data);
                    reports.reportTemp.total_images_saved += 2;
                    reference.changeSaveModalText("Se han guardado " + reports.reportTemp.total_images_saved + " imagenes de " + reports.reportTemp.total_images * 2);
                    //message.changeMessageLoader("mainContent2", "Se han guardado algunas imagenes");
                    resolve();
                }
            });
        });
    },
    changeDataReport: function () {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Cargando Detalles del Reporte");
        let reportSelected = reports.reportSelected;
        let allReports = reports.allReports;
        console.log(allReports);
        var reportFiltered = allReports.filter(function (report) {
            if (report.id_report == reportSelected.id_report) {
                return report;
            }
        });
        console.log(reportFiltered);
        reportFiltered = reportFiltered[0];
        reports.reportSelected = reportFiltered;
        reference.enableButtonsDetailReport();
        reportFiltered.completed_date = (reportFiltered.completed_date == undefined) ? "" : reportFiltered.completed_date;
        reportFiltered.approval_date = (reportFiltered.approval_date == undefined) ? "" : reportFiltered.approval_date;
        reportFiltered.rejected_date = (reportFiltered.rejected_date == undefined) ? "" : reportFiltered.rejected_date;
        reportFiltered.approver = (reportFiltered.approver == undefined) ? "" : reportFiltered.approver;
        $("#templateName").text(reportFiltered.web_template_name);
        $("#reportStatus").text(reportFiltered.status_name);
        $("#reportCompletedDate").html("<b>Completed Date : </b> " + reportFiltered.completed_date);
        $("#reportApprovalDate").html("<b>Approval Date : </b>" + reportFiltered.approval_date);
        $("#reportRejectedDate").html("<b>Rejected Date : </b>" + reportFiltered.rejected_date);
        $("#reportId").html("<b>Id Report: </b>" + reportFiltered.id_report);
        $("#reportTicketId").html("<b>Id Ticket: </b>" + reportFiltered.ticket_id);
        $("#reportTicketCustomer").html("<b>Id Ticket Cliente: </b>" + reportFiltered.work_client);
        $("#reportProject").html("<b>Project: </b>" + reportFiltered.project);
        $("#reportRegion").html("<b>Region: </b>" + reportFiltered.region);
        $("#reportSiteId").html("<b>Id Site: </b>" + reportFiltered.site_id);
        $("#reportSiteName").html("<b>Site Name: </b>" + reportFiltered.site_name);
        $("#reportApprover").html("<b>Approver: </b>" + reportFiltered.approver);
        $("#reportAuthor").html("<b>Author: </b>" + reportFiltered.author);
        $("#ticketBackground").addClass(reportFiltered.status_background);

        let class_background_comment = "";
        let status = "";
        $("#showComments").html("");
        for (let comment of reportFiltered.comments) {
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

        templates.templateSelected = { "template_web": reports.reportSelected.template_web, "template_pdf": reports.reportSelected.template_pdf };

        let templateSelected = templates.templateSelected;
        message.changeMessageLoader("loaderMessage", "Consultando Reporte en @OWS Datamodel");
        templates.loadTemplate(templateSelected.template_web, templateSelected.template_pdf).then(function () {
            if (reports.reportSelected.id_report != undefined) {
                message.changeMessageLoader("loaderMessage", "Consultando Datos Almacenados en @OWS Datamodel");
                reports.loadReport().then(function () {
                    console.log("Load Report: ", reports.reportResponse);
                    console.log("Load Report Images: ", reports.reportResponseImages);
                    reference.generateReportDatatable();
                    message.removeMessageLoader("#mainContent2");
                });
            }
            else {
                message.removeMessageLoader("#mainContent2");
            }
        });
    },
    generateReportDatatable: function () {
        let answerReport = reports.reportResponse;
        for (let answerType of answerReport) {
            if (Array.isArray(answerType)) {
                if (Array.isArray(answerType[0])) {
                    for (let answer of answerType[0]) {
                        $("#dataTableReport > thead > tr").append("<th>" + answer.sel + "</th>");
                        $("#dataTableReport > tbody > tr").append("<td>" + answer.val + "</td>");
                        $("#dataTableReport > tfoot > tr").append("<th>" + answer.sel + "</th>");
                    }
                }
            }
        }
        console.log("I've finish generate Report Datatable");
    },
    enableButtonsDetailReport: function () {
        let reference = this;

        $("#detail_ticket_edit").click(function () {
            templates.templateSelected = { "template_web": reports.reportSelected.template_web, "template_pdf": reports.reportSelected.template_pdf };
            reference.bootstrapPage('page-005');
        });

        if (reports.reportSelected.status == 'SM-Status002' && reference.userGroup == 'Quality') {
            $("#detail_ticket_approve").click(function () {
                reference.launchApproveModal();
            });
            $("#detail_ticket_reject").click(function () {
                reference.launchRejectModal();
            });
        }
        else {
            $("#detail_ticket_approve").remove();
            $("#detail_ticket_reject").remove();
        }

        $("#view_ticket_pdf").click(function () {
            //templates.templateSelected = { "template_web": reports.reportSelected.template_web, "template_pdf": reports.reportSelected.template_pdf };
            message.addMessageLoder("loaderMessage", "#mainContent2");
            message.changeMessageLoader("loaderMessage", "Generando PDF del Reporte");
            let answerReport = reports.reportResponse;
            for (let reportAnswer of reports.reportResponseImages) {
                if (Array.isArray(reportAnswer.images)) {
                    answerReport.push([reportAnswer.images[0]]);
                    if (Array.isArray(reportAnswer.images_1)) {
                        answerReport.push([reportAnswer.images_1[0]]);
                    }
                }
            }

            workers.loadPDF(templates.template[0].jsonPdf, "Template Name", true, "Ticked id", answerReport, reference.userInformation.fullname)
                .then(function (loadPdfResponse) {
                    console.log("Pdf Response was correct");
                    //console.log(loadPdfResponse);
                    let preview_pdf = JSON.parse(loadPdfResponse);

                    let pdfUID = uid.generateUID().then(function (uidCode) {
                        preview_pdf.footer = function (currentPage, pageCount) {
                            var text = {};
                            text["text"] = "Este reporte fue generado en Huawei Smart Docs @OWS App - " + new Date().toString().split("GMT")[0] + "\n Security Code : " + uidCode + " Pag " + currentPage + " de " + pageCount;
                            text["alignment"] = "center";
                            text["fontSize"] = 6;
                            text["link"] = "https://100l-app.teleows.com/servicecreator/spl/CO_SMART_DOCS/CO_SMART_DOCS_WELCOME.spl";
                            return text;
                        };
                        pdfMake.createPdf(preview_pdf).download("Test" + " - " + " Works" + ".pdf");
                        message.removeMessageLoader("#mainContent2");
                    });
                });
        });

        /*
        templates.loadTemplate(templates.templateSelected.template_web, templates.templateSelected.template_pdf).then(function () {
            console.log("Load Template was correct");
            reports.loadReport(reports.reportSelected.id_report).then(function () {
                console.log("Load Report was correct");
            });
        });
        */
    },
    convertToDatatable: function (tableName, filename) {
        $('#' + tableName).DataTable({
            dom: 'Bfrtip',
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            buttons: [
                {
                    extend: 'excelHtml5',
                    responsive: true,
                    text: '<i class="fa fa-file-excel-o" aria-hidden="true"> Excel </i>',
                    title: filename,
                    key: {
                        key: 'e',
                        altkey: true
                    },
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
                    key: {
                        key: 'c',
                        altkey: true
                    },
                    exportOptions: {
                        modifier: {
                            page: 'current'
                        }
                    }
                },
                {
                    extend: 'print',
                    text: "<i class='fa fa-print' aria-hidden='true'> Imprimir </i>",
                    key: {
                        key: 'p',
                        altkey: true
                    }
                }],
            colReorder: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.childRowImmediate,
                    type: ''
                }
            }
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
        /*$('#' + tableName + ' tfoot th').each(function () {
            var title = $(this).text();
            if (title != ".") {
                $(this).html('<input type="text" id="' + title.replace(/\s/g, "") + 'All" class="form-control" placeholder="Buscar ' + title + '" />');
            }
        });
        */
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

        $("tfoot").css("display", "table-footer-group");

        $(".dt-buttons").addClass("pull-right");

        $(".dt-buttons > a[aria-controls=" + tableName + "").attr("class", "btn btn-primary")

        $(".dt-buttons > a[aria-controls=" + tableName + "").css("margin-right", "20px");

        $("#" + tableName + "_filter").addClass("pull-left");

    },
    fillDataTableMyReports: function (reportsFiltered) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Filtrando Reportes por Ticket de SDM");
        console.log("Wrap Reports: ", reportsFiltered)
        let cont = 0;
        for (let report of reportsFiltered) {
            $("#dataTableAllReport > tbody").append("<tr><td style='cursor:pointer' id='allReports" + cont + "'>" + report.ticket_id + "</td><td>" + 0 + "</td><td>" + report.site_id + "</td><td>" + report.site_name + "</td><td>" + report.project + "</td><td>" + report.region + "</td><td style='text-align:-webkit-center'>" + report.work_client + "</td><td><input id='allReports" + cont + "Details' type='image' name='image' src='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/eye-24-20.png'></td></tr>");
            $('#allReports' + cont).add('#allReports' + cont + "Details").on("click", { "id_ticket": report.ticket_id }
                , function (event) {
                    reports.reportSelected = { "ticket_id": event.data.id_ticket };
                    reference.bootstrapPage('page-024');
                });
            cont += 1;
        }
        reference.convertToDatatable("dataTableAllReport", "Mis Reportes - " + new Date().toString().split("GMT")[0]);
        message.removeMessageLoader("#mainContent2");
    },
    fillBoxesReportsRelated: function (reportsFiltered) {
        let reference = this;
        message.addMessageLoder("loaderMessage", "#mainContent2");
        message.changeMessageLoader("loaderMessage", "Filtrando Reportes Relacionados");
        let cont = 0;
        for (let report of reportsFiltered) {
            $("#allReportsRelatedDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class='pricing-table " + report.status_background + "'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + report.web_template_name + "</div><div class=pricing-type> Ultima Modificacion:" + report.last_modification + "</div></div></div><div class=pt-body><h4>" + report.status_name + "</h4><ul class=plan-detail><li><b>Autor :</b> " + report.author + "<li><b>Ultima Modificacion : </b>" + report.modified_by + "<li><b>Report Id:<br></b>" + report.id_report + "</ul></div><div class=pt-footer><button id='viewReport_" + cont + "' class='btn btn-" + report.status_class + "'type=button>Ver Detalles</button></div></div></div>");
            $("#viewReport_" + cont).on("click", {
                val: { "id_report": report.id_report }
            }, function (event) {
                reports.reportSelected = { "id_report": event.data.val.id_report };
                reference.bootstrapPage('page-021');
            });
            cont++;
        }
        $("#sdmTicket").text(reports.reportSelected.ticket_id);
        message.removeMessageLoader("#mainContent2");
    },
    launchSaveModal: function () {
        let reference = this;
        $("#save_report_modal").remove();
        $("body").append("<div class='fade modal modal-warning'aria-hidden=true aria-labelledby=myModalLabel1 id=save_report_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Se esta guardando el reporte </h4></div><div class=modal-body><div class='loader-container text-center' style='color:black'><div><i style='color:black' class='fa fa-spinner fa-pulse fa-3x'></i></div></div><h4 style='text-align:center'>Por favor no cierres la aplicacion, estamos guardando tu progreso .</h4><br><h5 style='text-align:center'><b> Estado : </b><div id='save_report_status'></div></h5></div></div></div></div>");
        $("#save_report_modal").modal({ backdrop: 'static', keyboard: false });
    },
    changeSaveModalText: function (msg) {
        $("#save_report_status").html(msg);
    },
    removeSaveModal: function () {
        $("#save_report_modal").modal('hide');
    },
    launchAnswerCompletedModal: function () {
        $("#completedReport").remove();
        $("body").append("<div class='fade modal modal-info'aria-hidden=true aria-labelledby=myModalLabel1 id=completeReport role=dialog style=display:none tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel8>Todos los campos fueron completados</h4></div><div class=modal-body><img src=https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/512/Tick_Mark-256.png style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center>Todos los campos obligatorios fueron completados.</h4></div><div class=modal-footer><input class='btn btn-info'data-dismiss=modal type=button value='Guardar el reporte'></div></div></div></div>");
        $("#completedReport").modal({ backdrop: 'static', keyboard: false });
    },
    launchAnswerInCompleteModal: function (emptyFields) {
        $("#incompleteReport").remove();
        $("body").append("<div class='fade modal modal-info'aria-hidden=true aria-labelledby=myModalLabel1 id=incompleteReport role=dialog style=display:none tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel7>Algunos campos no fueron completados</h4></div><div class=modal-body><img src=https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-256.png style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center>Todos los campos obligatorios no fueron completados</h4><h5 id=emptyFieldsText style=text-align:center></h5></div><div class=modal-footer><input class='btn btn-info'data-dismiss=modal type=button value=Entendido></div></div></div></div>");
        $("#emptyFieldsText").text(emptyFields);
        $("#incompleteReport").modal({ backdrop: 'static', keyboard: false });
    },
    launchApproveModal: function () {
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
            let comment = $("#approve_report_comment").val();
            let comments = reports.reportSelected.comments;
            workers.getCurrentTime.then(function (currentTimeResponse) {
                comments.push({ "author": reference.userInformation.fullname, "comment": "El reporte se ha aprobado correctamente en el sitema - Comentario:  " + comment, "time": JSON.parse(currentTimeResponse).result.localDateTime, "status": 'SM-Status003' })
                let moreInformation = {
                    "approval_date": JSON.parse(currentTimeResponse).result.localDateTime,
                    "approver": reference.userInformation.fullname
                }
                reference.updateDatamodel(reports.reportSelected.id_report, "SM-Status003", comments, moreInformation);
                $('#approve_report_modal').modal('hide');
                reference.bootstrapPage("page-021");
            });
        });
    },
    launchRejectModal: function () {
        let reference = this;
        $("#reject_report_modal").remove();
        $("body").append("<div class='fade modal modal-danger'aria-hidden=true aria-labelledby=myModalLabel1 id=reject_report_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>Rechazar Reporte </h4></div><div class=modal-body> <label> Deja un comentario </label> <input id='reject_report_comment' type='text' class='form-control' placeholder='El comentario minimo debe ser de 5 caracteres'><br><p style='text-align: center'><b>Nota:</b> Este comentario sera visible en la seccion de Historia del Reporte</p></div><div class='modal-footer'><input type='button' id='reject_report_btn' disabled=true class='btn btn-danger' data-dismiss='modal' value='Rechazar'></div></div></div></div>");
        $("#reject_report_modal").modal('show');
        $("#reject_report_comment").on('input', function () {
            let comment_size = $("#reject_report_comment").val().length;
            if (comment_size > 4) {
                $("#reject_report_btn").attr("disabled", false);
            }
            else {
                $("#reject_report_btn").attr("disabled", true);
            }
        });

        $("#reject_report_btn").click(function () {
            let comment = $("#reject_report_comment").val();
            let comments = reports.reportSelected.comments;
            workers.getCurrentTime.then(function (currentTimeResponse) {
                comments.push({ "author": reference.userInformation.fullname, "comment": "El reporte fue rechazado exitosamente en el sistema - Comentario :  " + comment, "time": JSON.parse(currentTimeResponse).result.localDateTime, "status": 'SM-Status004' })
                let moreInformation = {
                    "rejected_date": JSON.parse(currentTimeResponse).result.localDateTime,
                    "rejecter": reference.userInformation.fullname
                }
                reference.updateDatamodel(reports.reportSelected.id_report, "SM-Status004", comments, moreInformation);
                $('#reject_report_modal').modal('hide');
                reference.bootstrapPage("page-021");
            });
        });
    },
    enableCreateTemplateButtons: function () {
        let reference = this;
        $("#create_template").prop("disabled", false);

        $("#template_logo_input").on('change', function () {
            console.log("The Image changes");
            smartEngine.imgTo64(this, "template_logo");
        });

        $("#create_template").click(function () {
            try {
                let template_icon = $("#template_logo").attr("src");
                let template_web_name = $("#template_web_name").val();
                let template_pdf_name = $("#template_pdf_name").val();
                let template_project = $("#template_project").val();
                let template_web_batchId = $("#web_template_file").val();
                let template_web_attachmentId = $("#web_template_file_div > .filelist_cls").attr("id").split('div_')[1];
                let template_pdf_batchId = $("#pdf_template_file").val();
                let template_pdf_attachmentId = $("#pdf_template_file_div > .filelist_cls").attr("id").split('div_')[1];
                let templateToCreate = {
                    "icon_template": template_icon,
                    "template_name_web": template_web_name,
                    "template_name_export": template_pdf_name,
                    "template_project": template_project,
                    "template_web": "/get?batchId=" + template_web_batchId + "&attachmentId=" + template_web_attachmentId,
                    "template_pdf": "/get?batchId=" + template_pdf_batchId + "&attachmentId=" + template_pdf_attachmentId
                };
                templates.createTemplate(templateToCreate).then(function () {
                    console.log("The template was created");
                    $("#web_template_file_div > .filelist_cls").remove();
                    $("#pdf_template_file_div > .filelist_cls").remove()
                    reference.bootstrapPage('page-007');
                });
            }
            catch (error) {
                $("#errorTemplate").modal('show');
            }
        });
    },
    getProjects: function () {
        return new Promise(function (resolve, reject) {
            var http = new XMLHttpRequest();
            var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:project_item_getList,userId:" + USER_ID + ",tenantId:" + tenantId + "}";
            var params = "start=0&limit=100&csrfToken=" + csrfToken + "&serviceId=project_item_getList";
            http.open("POST", url, true);

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    resolve(JSON.parse(http.response).results);
                }
            }
            http.send(params);
        });
    },
    fillProjects: function (selector, projects) {
        for (let project of projects) {
            $("#" + selector).append("<option vaue=" + project.project + ">" + project.project_name + "</option>");
        }
    },
    enableEditTemplatesButtons: function () {
        let reference = this;

        $("#template_logo_input").on('change', function () {
            console.log("The Image changes");
            smartEngine.imgTo64(this, "template_logo");
        });

        $("#template_web_name").add("#template_pdf_name").on('input', function () {

            let template_web_name_length = $("#template_web_name").val().length;
            let template_pdf_name_length = $("#template_pdf_name").val().length;
            if (template_web_name_length > 5 & template_pdf_name_length > 5) {
                $("#update_template").attr("disabled", false);
            }
            else {
                $("#update_template").attr("disabled", true);
            }
        });
        $("#update_template").click(function () {
            try {
                let template_id = $("#template_id_template").val();
                let template_icon = $("#template_logo").attr("src");
                let template_web_name = ($("#template_web_name").val());
                let template_pdf_name = $("#template_pdf_name").val();
                let template_project = $("#template_project").val();
                let template_web = $("#template_web_route").val();
                let template_pdf = $("#template_pdf_route").val();
                if ($("#web_template_file_div > .filelist_cls").attr("id") != undefined) {
                    let template_web_batchId = $("#web_template_file").val();
                    let template_web_attachmentId = $("#web_template_file_div > .filelist_cls").attr("id").split('div_')[1];
                    template_web = "/get?batchId=" + template_web_batchId + "&attachmentId=" + template_web_attachmentId;
                }
                if ($("#pdf_template_file_div > .filelist_cls").attr("id") != undefined) {
                    let template_pdf_batchId = $("#pdf_template_file").val();
                    let template_pdf_attachmentId = $("#pdf_template_file_div > .filelist_cls").attr("id").split('div_')[1];
                    template_pdf = "/get?batchId=" + template_pdf_batchId + "&attachmentId=" + template_pdf_attachmentId;
                }
                let templateToEdit = {
                    "id_template": template_id,
                    "icon_template": template_icon,
                    "template_name_web": template_web_name,
                    "template_name_export": template_pdf_name,
                    "template_project": template_project,
                    "template_web": template_web,
                    "template_pdf": template_pdf
                };
                templates.updateTemplate(templateToEdit).then(function () {
                    console.log("The template was created");
                    $("#web_template_file_div > .filelist_cls").remove();
                    $("#pdf_template_file_div > .filelist_cls").remove()
                    reference.bootstrapPage('page-007');
                });
            }
            catch (error) {
                $("#errorTemplate").modal('show');
            }
        });
    },
    fillTemplateData: function () {
        let reference = this;
        $("#template_logo").attr('src', templates.templateSelected.icon_template.substr(1).slice(0, -1));
        $("#template_id_template").val(templates.templateSelected.id_template);
        $("#template_web_name").val(templates.templateSelected.template_name_web);
        $("#template_pdf_name").val(templates.templateSelected.template_name_web);
        $("#template_project").val(templates.templateSelected.template_project);
        $("#template_web_route").val(templates.templateSelected.template_web);
        $("#template_pdf_route").val(templates.templateSelected.template_pdf);
        $("#template_web_route_link").attr('href', "https://100l-app.teleows.com/servicecreator/fileservice" + templates.templateSelected.template_web);
        $("#template_pdf_route_link").attr('href', "https://100l-app.teleows.com/servicecreator/fileservice" + templates.templateSelected.template_pdf);
    }
}