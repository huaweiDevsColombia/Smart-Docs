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
};