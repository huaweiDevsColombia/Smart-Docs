let workers = require("./loadsWorkers");
console.log(workers);
let smart = {
    onInit: function () {
        let reference = this ;
        console.log("Start Application");
        workers.getCurrentTime.then(function (data) {
            reference.currentTime = data;
            console.log("CurrentTime" + reference.currentTime);
        });
        workers.checkUserSmart.then(function (data) {
            reference.userRegisterOnSmart = (Object.keys(data).length === 0);
            console.log("Check User Smart:" + reference.userRegisterOnSmart);
        });
    },
    userRegisterOnSmart : "",
    currentTime : ""
}

smart.onInit();