let workers = require("./loadsWorkers");
let tickets = require("./tickets");
let reports = require("./reports");
let templates = require("./templates");
let smartEngine = require("./smartEngine");

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
    pages: "",
    userGroup: "",
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
    changeMenuContent: function (pageCode) {
        $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
        $('body').addClass("flat-blue");
        $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
        $('.content-container').append(pageCode);
    },
    changeMainContent: function (pageCode) {
        $("#mainContent2").html("");
        $('#mainContent2').append(pageCode);
    },
    menuItems: function () {
        let items = [
            { id: "itemInicio", id_page: "page-004" },
            { id: "itemTareas", id_page: "page-008" },
            { id: "itemReportes", id_page: "page-014" },
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
                reference.bootstrapPage(menu_item.id_page).then(function () {
                    reference.changeActiveMenu(menu_item.id);
                });
            });
        }
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
    loadResources: function (page_id) {
        let reference = this;
        switch (page_id) {
            //Home Page
            case "page-004":
                reports.loadStatistic(reference.userGroup).then(function () {
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
                tickets.loadTickets().then(function () {
                    reference.changeTicketsPage(tickets.allTickets);
                });
                break;
            //All Templates Page    
            case "page-007":
                templates.loadTemplates(tickets.ticketSelected.project).then(function () {
                    reference.changeTemplatesPage(templates.allTemplates);
                });
                break;
            //New Report Page
            case "page-005":
                let templateSelected = templates.templateSelected;

                templates.loadTemplate(templateSelected.template_web.attachment[0].batchId,
                    templateSelected.template_web.attachment[0].attachmentId,
                    templateSelected.template_pdf.attachment[0].batchId,
                    templateSelected.template_pdf.attachment[0].attachmentId).then(function () {
                        smartEngine.executeEngine(templates.template[0].jsonWeb);
                        $('#templateNavTabs a:first').tab('show');
                        reference.loadEventSaveReport();
                    });
                if (reports.reportSelected.id_report != undefined) {
                    reports.loadReport().then(function () {
                        console.log("Load Report: ", reports.reportResponse);
                        for (let reportAnswer of reports.reportResponse) {
                            if (reportAnswer.length > 0) {
                                console.log(reportAnswer[0]);
                                smartEngine.matchAnswers(reportAnswer[0]);
                            }
                        }
                    });
                }
                break;
            //My Reports    
            case "page-014":
                reports.loadStatistic(reference.userGroup).then(function () {
                    reference.fillDataTableMyReports(reports.fillMyReports());
                    $('#allReportsNavTab a:first').tab('show');
                });
                break;
            // My Reports Related
            case "page-024":
                  reference.fillBoxesReportsRelated(reports.fillMyReportsRelated());
                break;
            //Detail Report    
            case "page-021":
                reports.loadStatistic(reference.userGroup).then(function () {
                    reference.changeDataReport();
                });
                break;
        }
    },
    changeBoxStatistic: function (allReports) {
        let reference = this;
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
    },
    changeTicketsPage: function (allTickets) {
        let reference = this;
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

        if (PMLength > 0 || CMLength > 0 || PMlLength > 0) {
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
    },
    changeTemplatesPage: function (allTemplates) {
        let reference = this;
        let attachmentId;
        let batchId;
        let cont = 0;
        if (allTemplates.length > 0) {
            $("#templatesNotFound").remove();
            for (let template of allTemplates) {
                attachmentId = template.icon_template.attachment[0].attachmentId;
                batchId = template.icon_template.attachment[0].batchId;
                $("#allTemplatesDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + template.template_name + "</div><img src='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + template.id_template + "!--></div></div></div><div class=pt-footer><p><b>Ultima Actualizacion: </b> " + template.template_date + " </p><button id='createTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px' type=button>Crear Reporte</button></div></div></div>");
                $("#createTemplate_" + cont).on("click", {
                    val:
                    { id_template: template.id_template, template_name: template.template_name, template_pdf: template.template_pdf, template_project: template.template_project, template_web: template.template_web }
                }, function (event) {
                    templates.templateSelected = event.data.val;
                    console.log(templates.templateSelected);
                    reference.bootstrapPage("page-005");
                });
                cont += 1;
            }
        }
    },
    loadEventSaveReport: function () {
        let reference = this;
        $("#btnSave").click(() => {

            let id_reportResponse = "";
            let answer = smartEngine.saveAnswer();
            let comments = [];
            let status = (answer.completed) ? "SM-Status002" : "SM-Status001";
            let idReport;
            let answerDate;
            let answerDateTime;
            let answerTime;
            let answerWeek;
            let answerMonth;
            let answerText;
            let answerTextArea;
            let answerNumber;
            let answerRadio;
            let answerCheckbox;
            let answerSelect;
            let answerMultiSelect;
            let answerList;
            let answerTable;
            let answerImages;
            let answerImages_1;
            let answerImages_2;
            let answerImages_3;
            let answerImages_4;

            if (reports.reportSelected.id_report) {
                console.log("El reporte ya existe");
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

                    answerImages_1 = answerImages.splice(0, 20);
                    answerImages_2 = answerImages.splice(0, 20);
                    answerImages_3 = answerImages.splice(0, 20);
                    answerImages_4 = answerImages.splice(0, 20);

                    console.log("Creating the Report");
                    idReport = reports.reportSelected.id_report;
                    let saveAnswerDate = reference.saveAnswer("date_answer", answerDate, idReport);
                    let saveAnswerDateTime = reference.saveAnswer("datetime_answer", answerDateTime, idReport);
                    let saveAnswerTime = reference.saveAnswer("time_answer", answerTime, idReport);
                    let saveAnswerWeek = reference.saveAnswer("week_answer", answerWeek, idReport);
                    let saveAnswerMonth = reference.saveAnswer("month_answer", answerMonth, idReport);
                    let saveAnswerText = reference.saveAnswer("text_answer", answerText, idReport);
                    let saveAnswerRadio = reference.saveAnswer("radio_answer", answerRadio, idReport);
                    let saveAnswerCheckBox = reference.saveAnswer("radio_answer", answerCheckbox, idReport);
                    let saveAnswerSelect = reference.saveAnswer("select_answer", answerSelect, idReport);
                    let saveAnswerMultiSelect = reference.saveAnswer("multiselect_answer", answerMultiSelect, idReport);
                    let saveAnswerList = reference.saveAnswer("list_answer", answerList, idReport);
                    let saveAnswerTable = reference.saveAnswer("table_answer", answerTable, idReport);
                    let saveAnswerImage_1 = reference.saveAnswer("image_answer_1", "[" + JSON.stringify(answerImages_1) + "]", idReport);
                    let saveAnswerImage_2 = reference.saveAnswer("image_answer_2", "[" + JSON.stringify(answerImages_2) + "]", idReport);
                    let saveAnswerImage_3 = reference.saveAnswer("image_answer_3", "[" + JSON.stringify(answerImages_3) + "]", idReport);
                    let saveAnswerImage_4 = reference.saveAnswer("image_answer_4", "[" + JSON.stringify(answerImages_4) + "]", idReport);

                    Promise.all([saveAnswerDate, saveAnswerDateTime, saveAnswerTime, saveAnswerWeek, saveAnswerMonth, saveAnswerText, saveAnswerRadio, answerCheckbox, saveAnswerSelect, saveAnswerMultiSelect, saveAnswerList, saveAnswerTable, saveAnswerImage_1, saveAnswerImage_2, saveAnswerImage_3, saveAnswerImage_4]).then(values => {
                        reference.bootstrapPage('page-021');
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

                    answerImages_1 = answerImages.splice(0, 20);
                    answerImages_2 = answerImages.splice(0, 20);
                    answerImages_3 = answerImages.splice(0, 20);
                    answerImages_4 = answerImages.splice(0, 20);

                    console.log("Creating the Report");
                    return reference.saveDatamodel(status, comments, tickets.ticketSelected.project, tickets.ticketSelected.region,
                        tickets.ticketSelected.site_id, tickets.ticketSelected.supplier, tickets.ticketSelected.ticket_id, templates.templateSelected.id_template, tickets.ticketSelected.work_client)

                }).then(function (idReportRes) {
                    reports.reportSelected = { "id_report": idReportRes };
                    idReport = idReportRes;
                    let saveAnswerDate = reference.saveAnswer("date_answer", answerDate, idReport);
                    let saveAnswerDateTime = reference.saveAnswer("datetime_answer", answerDateTime, idReport);
                    let saveAnswerTime = reference.saveAnswer("time_answer", answerTime, idReport);
                    let saveAnswerWeek = reference.saveAnswer("week_answer", answerWeek, idReport);
                    let saveAnswerMonth = reference.saveAnswer("month_answer", answerMonth, idReport);
                    let saveAnswerText = reference.saveAnswer("text_answer", answerText, idReport);
                    let saveAnswerRadio = reference.saveAnswer("radio_answer", answerRadio, idReport);
                    let saveAnswerCheckBox = reference.saveAnswer("radio_answer", answerCheckbox, idReport);
                    let saveAnswerSelect = reference.saveAnswer("select_answer", answerSelect, idReport);
                    let saveAnswerMultiSelect = reference.saveAnswer("multiselect_answer", answerMultiSelect, idReport);
                    let saveAnswerList = reference.saveAnswer("list_answer", answerList, idReport);
                    let saveAnswerTable = reference.saveAnswer("table_answer", answerTable, idReport);
                    let saveAnswerImage_1 = reference.saveAnswer("image_answer_1", "[" + JSON.stringify(answerImages_1) + "]", idReport);
                    let saveAnswerImage_2 = reference.saveAnswer("image_answer_2", "[" + JSON.stringify(answerImages_2) + "]", idReport);
                    let saveAnswerImage_3 = reference.saveAnswer("image_answer_3", "[" + JSON.stringify(answerImages_3) + "]", idReport);
                    let saveAnswerImage_4 = reference.saveAnswer("image_answer_4", "[" + JSON.stringify(answerImages_4) + "]", idReport);

                    Promise.all([saveAnswerDate, saveAnswerDateTime, saveAnswerTime, saveAnswerWeek, saveAnswerMonth, saveAnswerText, saveAnswerRadio, answerCheckbox, saveAnswerSelect, saveAnswerMultiSelect, saveAnswerList, saveAnswerTable, saveAnswerImage_1, saveAnswerImage_2, saveAnswerImage_3, saveAnswerImage_4]).then(values => {
                        /*reference.showCompleteModal();
                        if (answer.completed) {
                            reference.showCompleteModal();
                        }
                        else {
                            reference.showIncompleteModal();
                        }
                        */
                        reference.bootstrapPage('page-021');
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
    showCompleteModal: () => {
        $("#notEmptyFields").modal('show');
    },
    showIncompleteModal: (emptyFields) => {
        $("#emptyFieldsText").text(emptyFields);
        $("#emptyFields").modal('show');
    },
    saveDatamodel: function (status, comment, project, region, site, supplier, ticket, template, workClient) {

        return new Promise(function (resolve, reject) {
            /*
            var http = new XMLHttpRequest();
            var url = "https://100l-app.teleows.com/servicecreator/debugMessage";
            var messageData = { "modified_by": "", "author": "", "last_modification": "", "creation_date": "", "answer": answer, "approval_date": "", "approver": "", "comments": comment, "completed_date": "", "id_report": "", "project": project, "region": region, "rejected_date": "", "rejecter": "", "site_id": site, "status": status, "supplier": supplier, "ticket_id": ticket, "web_template": template, "work_client": workClient, "active": "", "actual_model_id": "" }
            var params = "comeFrom=page&messageId=10113&csrfToken=" + csrfToken + "&messageData=" + JSON.stringify(messageData);

            http.open("POST", url, true);

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    console.log("Se ha guardado Exitosamente");
                    console.log(http.readyState);
                    console.log(http.response);
                    resolve();
                }
            }
            http.send(params);
            */
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
    saveAnswer: function (type, answer, idReport) {
        return new Promise(function (resolve, reject) {
            let data = {};
            data["id_report"] = idReport;
            data[type] = answer;
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
    saveAnswerByChunks: function (answer, idReport) {
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_report_update_chunks",
                data: {
                    "id_report": idReport,
                    "answer": answer
                },
                success: function (data) {
                    console.log(data);
                    resolve();
                }
            });
        });
    },
    saveAnswerByChunksImages: function (answer, idReport) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            reference.saveAnswerByChunks("[" + JSON.stringify(answer.splice(0, 10)) + "]", idReport).
                then(function () {
                    if (answer.length >= 10) {
                        reference.saveAnswerByChunksImages(answer, idReport);
                    }
                    else {
                        reference.saveAnswerByChunks("[" + JSON.stringify(answer) + "]", idReport);
                    }
                });
            resolve();
        });
    },
    changeDataReport: function () {
        let reference = this;
        reference.enableButtonsDetailReport();
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
        reportFiltered.completed_date = (reportFiltered.completed_date == undefined) ? "" : reportFiltered.completed_date;
        reportFiltered.approval_date = (reportFiltered.approval_date == undefined) ? "" : reportFiltered.approval_date;
        reportFiltered.rejected_date = (reportFiltered.rejected_date == undefined) ? "" : reportFiltered.rejected_date;
        reportFiltered.approver = (reportFiltered.approver == undefined) ? "" : reportFiltered.approver;
        $("#templateName").text(templates.templateSelected.template_name);
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
    },
    enableButtonsDetailReport: function () {
        let reference = this;
        $("#detail_ticket_edit").click(function () {
            reference.bootstrapPage('page-005');
        });
    },
    fillDataTableMyReports: function (reportsFiltered) {
        let reference = this;
        console.log("Wrap Reports: ", reportsFiltered)
        let cont = 0;
        for (let report of reportsFiltered) {
            $("#dataTableAllReport > tbody").append("<tr><td style='cursor:pointer' id='allReports" + cont + "'>" + report.ticket_id + "</td><td>" + 0 + "</td><td>" + report.site_id + "</td><td>" + report.site_name + "</td><td>" + report.project + "</td><td>" + report.region + "</td><td style='text-align:-webkit-center'>" + report.work_client + "</td><td><input id='allReports" + cont + "Details' type='image' name='image' src='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/eye-24-20.png'></td></tr>");
            $('#allReports' + cont).add('#allReports' + cont + "Details").on("click", { "id_ticket": report.ticket_id }
                , function (event) {
                    reports.reportSelected = { "ticket_id": event.data.id_ticket };
                    reference.bootstrapPage('page-024');
                });
        }
    },
    fillBoxesReportsRelated: function (reportsFiltered) {
        let reference = this;
        let cont = 0;
        for (let report of reportsFiltered) {
            $("#allReportsRelatedDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class='pricing-table " + report.status_background + "'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + report.web_template + "</div><div class=pricing-type> Ultima Modificacion:" + report.web_template + "</div></div></div><div class=pt-body><h4>" + report.status_name + "</h4><ul class=plan-detail><li><b>Autor :</b> " + report.author + "<li><b>Ultima Modificacion : </b>" + report.modified_by + "<li><b>Report Id:<br></b>" + report.id_report + "</ul></div><div class=pt-footer><button id='viewReport_" + cont + "' class='btn btn-" + report.status_class + "'type=button>Ver Detalles</button></div></div></div>");
            $("#viewReport_" + cont).on("click", {
                val: { "id_report": report.id_report, }
            }, function (event) {
                reports.reportSelected = { "ticket_id": reference.reportSelected.ticket_id, "id_report": event.data.id_report };
                reference.bootstrapPage('page-005');

            });
            cont++;
        }
    }

}