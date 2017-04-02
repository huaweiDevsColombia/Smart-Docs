let workers = require("./loadsWorkers");
let page = require("./pages");

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
        return reportsFiltered;
    },
    fillMyReportsRelated: function () {
        let reference = this;
        //Save the reference of one report to don't add again
        let wrapReports = [];

        let reportsFiltered = reference.allReports.filter(function (report) {
            if (report.ticket_id == reference.reportSelected.ticket_id) {
                return report;
            }
        });    
        return reportsFiltered;
    }
}