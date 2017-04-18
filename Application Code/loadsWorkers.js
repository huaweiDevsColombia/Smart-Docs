/**
 * Check if the user exist on Smart Docs Users Datamodel
 * Make a Ajax Request to get the worker and then call get smart users service
 */

function checkUserSmart() {
    return new Promise(function (resolve, reject) {
        let workerUserRegister = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=5a564cec-9b0e-4a96-a74a-2fbb9bbac180&attachmentId=fcd25cd8-9e5e-470d-8f33-3b5a51421a2f"
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
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - Smart Register User has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - Smart Register User has Failed");
            reject(error);
        });
    });
}

/**
 * Get the information from Users Datamodel
 * Make a Ajax Request to get the worker and then call get user service
 */
function getUserInformation() {
    return new Promise(function (resolve, reject) {
        let workerUserInformation = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=3e9d8bc0-999e-434f-aeeb-dda673659611&attachmentId=88315474-b2b2-4751-9e8a-2ab077c8ac94"
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
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - User Information has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - User Information User has Failed");
            reject(error);
        });
    });
}

/**
 * Get the Groups from Users Groups Datamodel
 * Make a Ajax Request to get the worker and then call get user groups service
 */
function getUserGroups() {
    return new Promise(function (resolve, reject) {
        let workerUserGroups = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=77d6e69f-f30e-4519-804e-65e5ec407dbf&attachmentId=350e4762-971a-4651-a771-b326b710f0eb"
        });
        $.when(workerUserGroups).done(function (workerUserGroupsResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerUserGroups')
                .text(workerUserGroupsResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerUserGroups").text()
            ], { type: "text/javascript" })
            var worker = new Worker(URL.createObjectURL(blob));

            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - User Information has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - User Information User has Failed");
            reject(error);
        });
    });
}


/**
 * Get the curren time on Local Time based on UTC Server Time 
 * Make a Ajax Request to get the worker and then call currentTime service 
 */


function currentTime() {
    return new Promise(function (resolve, reject) {
        let workerCurrentTime = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=425c4286-6102-43b0-9833-b151990734f5&attachmentId=19293cb6-5f7e-48a0-8e48-ab92abbfb207"
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
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - Current Time has Loaded");

        }).fail(function (error) {
            reject(error);
            console.log("[Wk] - Current Time has Failed");
        });
    });
}

module.exports = {
    checkUserSmart: checkUserSmart(),
    getCurrentTime: currentTime(),
    getUserInformation: getUserInformation(),
    getUserGroups: getUserGroups(),
    getReports: /**
 * Get the Reports from Reports Datamodel
 * Make a Ajax Request to get the worker and then call get report get list service
 */
    function getReports(group) {
        return new Promise(function (resolve, reject) {
            let workerReports = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=323a10d1-c070-4c7b-b9f7-f13056e5043c&attachmentId=377833db-d7f8-4292-bbbe-744a82568070"
            });
            $.when(workerReports).done(function (workerReportsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerReports')
                    .text(workerReportsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerReports").text()
                ], { type: "text/javascript" })

                $("#workerReports").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId, "group": group }); // Send data to our worker.

                console.log("[Wk] - Get Reports has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Reports User has Failed");
                reject(error);
            });
        });
    },
    getTickets: /**
 * Get the Tickets from Reports Datamodel
 * Make a Ajax Request to get the worker and then call get tickets get list service
 */
    function getTickets() {
        return new Promise(function (resolve, reject) {
            let workerTickets = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=36b8f29d-79cf-488a-9e6d-70d118e81dec&attachmentId=689fcf33-651c-4345-bf20-97c738c2dc13"
            });
            $.when(workerTickets).done(function (workerTicketsResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTickets')
                    .text(workerTicketsResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTickets").text()
                ], { type: "text/javascript" })

                $("#workerTickets").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

                console.log("[Wk] - Get Tickets has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Tickets has Failed");
                reject(error);
            });
        });
    },
    getTemplates:
    /**
 * Get the templates from Templates Datamodel
 * Make a Ajax Request to get the worker and then call get templates get list service
 */
    function getTemplates(project) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=015b8292-ebcc-40e6-8601-fbddeb2c0ef5&attachmentId=c24a203d-005f-4d20-ad92-4cd8b14b2cf8"
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId, "project": project }); // Send data to our worker.

                console.log("[Wk] - Get Templates has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Templates has Failed");
                reject(error);
            });
        });
    },
    getTemplate:
    function getTemplate(web_location, pdf_location) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=8117dc95-0e34-4ac6-abd4-530eefcaafb4&attachmentId=ad1b3ab2-6f5f-4049-a78b-9201a38de3a3"
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "web_location": web_location, "pdf_location": pdf_location }); // Send data to our worker.

                console.log("[Wk] - Get Template has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Template has Failed");
                reject(error);
            });
        });
    },
    saveAnswer:
    function saveAnswer(answer, status, comment, project, region, site, supplier, ticket, template, workClient) {
        return new Promise(function (resolve, reject) {
            let workerSaveAnswer = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=ba646758-8ac5-4612-805a-de96867dd631&attachmentId=0e9ba0e7-5491-4516-8d05-c5f1e27bb333"
            });
            $.when(workerSaveAnswer).done(function (workerSaveAnswerResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerSaveAnswer')
                    .text(workerSaveAnswerResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerSaveAnswer").text()
                ], { type: "text/javascript" })

                $("#workerSaveAnswer").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.addEventListener("error", function (error) {
                    console.log("Se ha producido un error : " + error);
                }
                    , false);

                worker.postMessage({ "answer": JSON.stringify(answer), "status": status, "comment": JSON.stringify(comment), "project": project, "region": region, "site": site, "supplier": supplier, "ticket": ticket, "template": template, "workClient": workClient, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId, }); // Send data to our worker.

                console.log("[Wk] - Get Template has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Template has Failed");
                reject(error);
            });
        });
    },
    loadPDF:
    function (template, template_name, watermark, ticket_id, answers, username) {
        return new Promise(function (resolve, reject) {
            let workerloadPDF = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=363902f3-6a73-4c10-b8a9-7223c82e22f8&attachmentId=6fe45630-56fa-49dc-98c8-5ff4543b03d0"
            });
            $.when(workerloadPDF).done(function (workerloadPDFResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerloadPDF')
                    .text(workerloadPDFResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerloadPDF").text()
                ], { type: "text/javascript" })

                $("#workerloadPDF").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.addEventListener("error", function (error) {
                    console.log("Se ha producido un error : " + error);
                }
                    , false);

                worker.postMessage({ "template":JSON.stringify(template), "template_name":template_name, "watermark":watermark, "ticket":ticket_id, "answers":JSON.stringify(answers), "username":username}); // Send data to our worker.

                console.log("[Wk] - Load PDF has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Load PDF has Failed");
                reject(error);
            });
        });
    }
};