let reports = require("./reports");

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
                    reference.loadResources(menu_item.id_page);
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
                    reports.changeBoxStatistic(reports.allReports);
                });
                //reference.loadStatistic("", "statisticTotal");
                //reference.loadStatistic("SM-Status002", "statisticCompleted");
                //reference.loadStatistic("SM-Status003", "statisticApproved");
                //reference.loadStatistic("SM-Status004", "statisticRejected");
                //reference.deletePageLoader();
                break;
            //All Tickets Page    
            case "page-008":
                reports.loadTickets().then(function () {
                    reference.changeTicketsPage(reports.allTickets);
                });
                break;
            //All Templates Page    
            case "page-007":

                break;
            //New Report Page
            case "page-005":

                break;
            //My Reports    
            case "page-014":
                reports.fillMyReports();
                break;
            //Detail Report    
            case "page-021":

                break;
            //Upload File
            case "page-013":

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

        let PMLength = (allTickets.PM != undefined) ? allTickets.PM.total : 0;
        let CMLength = (allTickets.CM != undefined) ? allTickets.CM.total : 0;
        let PMLLength = (allTickets.PLM != undefined) ? allTickets.PLM.total : 0;
        let ticketsType = ["PM","CM","PLM"];
        
        if(PMLength == 0){
            ticketsType.splice(ticketsType.indexOf("PM"),1)
        } 
        if(CMLength == 0){
            ticketsType.splice(ticketsType.indexOf("CM"),1)
        }
        if(PMLLength == 0){
            ticketsType.splice(ticketsType.indexOf("PLM"),1)
        }
        
        if (PMLength > 0 || CMLength > 0 || PMlLength > 0) {
            $("#ticketsNotFound").remove();
            let cont = 0;
            for(let ticket_type of ticketsType){
                for (let ticket of allTickets[ticket_type].results) {
                ticket.ticket_priority = (ticket.ticket_priority == undefined) ? " N/A" : ticket.ticket_priority;
                $("#allTicketsDiv").append("<div class='col-sm-12 col-md-6 col-lg-3'><div class='pricing-table yellow'><div class=pt-header><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + ticket.subject + "</div><div class=pricing-type> Reportes Asociados: 0 </div></div></div><div class=pt-body><h4>" + ticket.type + " - " + ticket.project + "</h4><ul class=plan-detail><li><b>Region :</b> " + ticket.region + " - " + ticket.city + "<li><b>Prioridad : </b>" + ticket.ticket_priority + "<li><b>Estado : </b>" + ticket.status + "<li><b>Ticket Id:<br></b>CM-" + ticket.orderid + "</ul></div><div class=pt-footer><button id='doReport_" + cont + "' class='btn btn-warning'type=button>Realizar Reporte</button></div></div></div>");
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
                    console.log("Click on Report" + event.data.val);
                });
                cont++;
            }
            }
        }
    }
}