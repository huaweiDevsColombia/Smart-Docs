let workers = require("./loadsWorkers");
module.exports = {
    allReports: "",
    allTickets: "",
    userGroup: "",
    reportSelected: "",
    reportResponse: "",
    loadStatistic: function (userGroup) {
        let reference = this;
        reference.userGroup = userGroup;
        return new Promise(function (resolve, reject) {
            workers.getReports(userGroup).then(function (data) {
                reference.allReports = JSON.parse(data)[0].results;
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    loadReport: function (idReport) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            let idReport = reference.reportSelected.id_report;
            let getAnswerDate = reference.getAnswer("date_answer", idReport);
            let getAnswerDateTime = reference.getAnswer("datetime_answer", idReport);
            let getAnswerTime = reference.getAnswer("time_answer", idReport);
            let getAnswerWeek = reference.getAnswer("week_answer", idReport);
            let getAnswerMonth = reference.getAnswer("month_answer", idReport);
            let getAnswerText = reference.getAnswer("text_answer", idReport);
            let getAnswerRadio = reference.getAnswer("radio_answer", idReport);
            let getAnswerCheckbox = reference.getAnswer("radio_answer", idReport);
            let getAnswerSelect = reference.getAnswer("select_answer", idReport);
            let getAnswerMultiSelect = reference.getAnswer("multiselect_answer", idReport);
            let getAnswerList = reference.getAnswer("list_answer", idReport);
            let getAnswerTable = reference.getAnswer("table_answer", idReport);
            let getAnswerImage_1 = reference.getAnswer("image_answer_1", idReport);
            let getAnswerImage_2 = reference.getAnswer("image_answer_2", idReport);
            let getAnswerImage_3 = reference.getAnswer("image_answer_3", idReport);
            let getAnswerImage_4 = reference.getAnswer("image_answer_4", idReport);

            Promise.all([getAnswerDate, getAnswerDateTime, getAnswerTime, getAnswerWeek, getAnswerMonth, getAnswerText, getAnswerRadio, getAnswerCheckbox, getAnswerSelect, getAnswerMultiSelect, getAnswerList, getAnswerTable, getAnswerImage_1, getAnswerImage_2, getAnswerImage_3, getAnswerImage_4]).then(values => {
                console.log("Promise Resolve", values);
                reference.reportResponse = values;
                resolve();
            });
        });
    },
    getAnswer: function (service, idReport) {
        return new Promise(function (resolve, reject) {
            let data = {};
            data["id_report"] = idReport;
            MessageProcessor.process({
                serviceId: "co_sm_report_get_" + service,
                data: data,
                success: function (data) {
                    resolve(data.result[service]);
                }
            });
        });
    },
    fillMyReports: function () {
        let reference = this;
        //Save the reference of one report to don't add again
        let wrapReports = [];

        let reportsFiltered = reference.allReports.filter(function (report) {
            console.log(wrapReports.indexOf(report.ticket_id));
            if (wrapReports.indexOf(report.ticket_id) == -1) {
                wrapReports.push(report.ticket_id);
                return report;
            }
        });

        console.log("Wrap Reports: ", reportsFiltered)
        let cont = 0;
        for (let report of reportsFiltered) {
            $("#dataTableAllReport > tbody").append("<tr><td style='cursor:pointer' id='allReports" + cont + "'>" + report.ticket_id + "</td><td>" + 0 + "</td><td>" + report.site_id + "</td><td>" + report.site_name + "</td><td>" + report.project + "</td><td>" + report.region + "</td><td style='text-align:-webkit-center'>" + report.work_client + "</td><td><input id='allReports" + cont + "Details' type='image' name='image' src='https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/eye-24-20.png'></td></tr>");
            $('#allReports' + cont).add('#allReports' + cont + "Details").on("click", { "id_report": report.ticket_id }
                , function (event) {
                    let ticket_selected = { "id_report": event.data.id_report };
                    console.log(ticket_selected);
                });
        }
        /*
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
 
                     })
                 cont += 1;
             }
 
         }
             */
    }
}