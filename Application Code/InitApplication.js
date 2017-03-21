let workers = require ("./loadsWorkers");
let smart = {};
smart.onInit = function(){
    console.log("Start Application");
    workers.getCurrentTime().then(function(data){
        console.log("Data" + data);
        console.log("Current Time: " + workers.currentTime);
    });
}

smart.onInit();