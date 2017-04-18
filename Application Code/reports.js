let workers = require("./loadsWorkers");
let page = require("./pages");

module.exports = {
    allReports: "",
    allTickets: "",
    userGroup: "",
    reportSelected: "",
    reportTemp:{"total_images":0,"total_images_saved":0},
    reportResponse:"",
    reportResponseImages: "",
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
            let getAnswerNumber = reference.getAnswer("number_answer", idReport);
            let getAnswerRadio = reference.getAnswer("radio_answer", idReport);
            let getAnswerCheckbox = reference.getAnswer("radio_answer", idReport);
            let getAnswerSelect = reference.getAnswer("select_answer", idReport);
            let getAnswerMultiSelect = reference.getAnswer("multiselect_answer", idReport);
            let getAnswerList = reference.getAnswer("list_answer", idReport);
            let getAnswerTable = reference.getAnswer("table_answer", idReport);
            let totalImages = reference.getAnswerImageTotal(idReport);
            let getAnswerImages = [];
            Promise.all([getAnswerDate, getAnswerDateTime, getAnswerTime, getAnswerWeek, getAnswerMonth, getAnswerText, getAnswerNumber, getAnswerRadio, getAnswerCheckbox, getAnswerSelect, getAnswerMultiSelect, getAnswerList, getAnswerTable,totalImages]).then(values => {
                let contProImg = 0; let subIdNumber = 0; let subId = "-SB";
                reference.reportResponse = values;
                do{
                     this["getAnswerImage_" + contProImg] = reference.getAnswerImage(idReport + subId + subIdNumber);
                     getAnswerImages.push(this["getAnswerImage_" + contProImg]);
                     subIdNumber ++;
                     contProImg ++; 
                }
                while(contProImg < values[12]);
                Promise.all(getAnswerImages).then(function (values) {
                console.log("Promise Resolve", values);
                reference.reportResponseImages = values;
                resolve();
                });
            });
        });
    },
    getAnswer: function (service,idReport) {
        return new Promise(function (resolve, reject) {
            let data = {};
            data["id_report"] = idReport;
            MessageProcessor.process({
                serviceId: "co_sm_report_get_"+service,
                data: data,
                success: function (data) {
                    resolve(data.result[service]);
                }
            });
        });
    },
    getAnswerImage: function(idReportImg){
        return new Promise(function (resolve, reject) {
            let data = {};
            data["report_img_id"] = idReportImg;
            MessageProcessor.process({
                serviceId: "co_sm_report_images_get",
                data: data,
                success: function (data) {
                    resolve(data.result);
                }
            });
        });
    },
    getAnswerImageTotal: function(idReport){
        return new Promise(function (resolve, reject) {
            let data = {};
            data["id_report"] = idReport;
            data["start"]=0;
            data["limit"]=100;
            MessageProcessor.process({
                serviceId: "co_sm_report_images_getList",
                data: data,
                success: function (data) {
                    resolve(data.total);
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