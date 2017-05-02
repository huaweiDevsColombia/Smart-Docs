let workers = require("./loadsWorkers");

module.exports = {
    allTickets: "",
    loadTickets: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            workers.getTickets().then(function (data) {
                reference.allTickets = JSON.parse(data)[0];
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    ticketSelected:""
}