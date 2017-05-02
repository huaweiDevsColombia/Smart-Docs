module.exports = {
    "generateUID": function () {
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "UIDGenerator",
                data: {
                },
                success: function (data) {
                    resolve(data.result.uid);
                }
            });
        });
    }
}