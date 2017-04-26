module.exports = {
    "users": "",
    "getUsers": function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_users_getList",
                data: {
                    start: 0,
                    limit: 1000
                },
                success: function (data) {
                    reference.users = data.results;
                    resolve();
                }
            });
        });
    },
    "fillTableUsers": function () {
        let reference = this;
        for (let user of reference.users) {
            $("#dataTableUsers > tbody").append("<tr><td>" + user.account_id + "</td><td>" + user.user_id + "</td><td>" + user.name + "</td><td>" + user.start_times + "</td><td>" + user.last_login + "</td></tr>");
        }
    }
}