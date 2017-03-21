/**
 * Register the user on the Smart Docs Users Datamodel
 * Make a Ajax Request to get the worker and then call update service 
 */
let userInformation = "No start";

function registerUseronSmartDocs() {
    let workerUserRegister = $.ajax({
        method: "GET",
        dataType: "script",
        url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=0a558148-e0b1-411e-928e-ec031a352447&attachmentId=689823"
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

            console.log(e.data);
            userInformation = "Worker Response Ok";
            //reference.userRegister = e.data;
            //reference.loadWorkerCurrentTime(true);
            //reference.cleanConsole();
        }, false);

        worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

        console.log("Smart Register User has Loaded");

    }).fail(function () {
        console.log("Smart Register User has Failed");
    });
}


module.exports = {
    userInformation: "Nothing yet",
    registerUser: function () {
        let reference;
        let workerUserRegister = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=0a558148-e0b1-411e-928e-ec031a352447&attachmentId=689823"
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

                console.log("Response: " + e.data);
                reference.userInformation = "Data was chenged";
                reference.getCurrentTime();
                //reference.userRegister = e.data;
                //reference.loadWorkerCurrentTime(true);
                //reference.cleanConsole();
            }, false);

            worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

            console.log("Smart Register User has Loaded");

        }).fail(function () {
            console.log("Smart Register User has Failed");
        });
    },
    currentTime: "",
    getCurrentTime: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
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
                    //reference.currentTime = e.data;
                    console.log(e.data);
                    reference.currentTime = e.data;
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "tenantId": tenantId }); // Send data to our worker.

                console.log("Current Time has Loaded");

            }).fail(function (error) {
                reject(error);
                console.log("Current Time has Failed");
            });
        });


    },
    passInformation: function () {
    }
};