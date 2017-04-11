module.exports = {
    /**
 * Load JS hierarchically - loadHighJS
 * bootstrap  
 */
    "loadHighJS": function () {
        return new Promise(function (resolve, reject) {
            let bootstrap = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            });
            $.when(bootstrap).done(function (bootstrapResponse) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
        });
    },
    /**
     * Load JS hierarchically - loadMediumJS
     * Boostrap Switch - JqueryMinHeight - Jquery Datatables
     */
    "loadMediumJS": function loadMediumJS() {
        return new Promise(function (resolve, reject) {
            let bootstrapSwitch = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js"
            });
            let jqueryMinHeight = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js"
            });
            /*let jqueryDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=20cb4446-a397-434d-bf86-02ca0d83618c&attachmentId=3140a49c-5b12-4641-8c00-d249346fcb7c"
            });*/
            let pdfmake = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/pdfmake.min.js"
            });
            $.when(bootstrapSwitch, jqueryMinHeight, /*jqueryDataTables,*/ pdfmake)
                .done(function (bootstrapSwitchResponse, jqueryMinHeightResponse, /*jqueryDataTablesResponse,*/ pdfmakeResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
        });
    },
    /**
     * Load JS hierarchically - LoadLowJS
     * Bootstrap Datatables - buttonsDatatble - vs_fonts
     */
    "loadLowJS": function () {
        return new Promise(function (resolve, reject) {
            let bootstrapDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"
            });
            let vs_fonts = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/vfs_fonts.js"
            });
            $.when(bootstrapDataTables, vs_fonts)
                .done(function (bootstrapDataTablesResponse, vs_fontsResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
        });
    }, "loadPlugins": function () {
        return new Promise(function (resolve, reject) {
            let jqueryDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=20cb4446-a397-434d-bf86-02ca0d83618c&attachmentId=3140a49c-5b12-4641-8c00-d249346fcb7c"
            });

            $.when(jqueryDataTables)
                .done(function (jqueryDataTablesResponse) {
                    console.log("Jquery Datatables was loaded");
                    let buttonsDataTables = $.ajax({
                        method: "GET",
                        dataType: "script",
                        url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=80ec9329-9477-4da7-a497-d89a79b0d94d&attachmentId=614a3478-6f9d-4f33-9b81-202dfca8363c"
                    });

                    $.when(buttonsDataTables)
                        .done(function (buttonsDataTablesReponse) {
                            console.log("Buttons Datatables was loaded");
                            let buttonsHTML5 = $.ajax({
                                method: "GET",
                                dataType: "script",
                                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=15cd3450-8033-4cdb-8ec8-b25497efba12&attachmentId=466f53d5-55c0-4810-aa33-46c65b4790b3"
                            });
                            $.when(buttonsHTML5)
                                .done(function (buttonsHTML5Reponse) {

                                    console.log("Buttons HML5 was loaded");
                                    let jsZip = $.ajax({
                                        method: "GET",
                                        dataType: "script",
                                        url: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.js"
                                    });

                                    $.when(jsZip)
                                        .done(function (jsZipReponse) {
                                            console.log("Js Zip  was loaded");
                                            resolve();

                                        }).fail(function (error) {
                                            console.log(error);
                                            reject(error);
                                        });
                                }).fail(function (error) {
                                    console.log(error);
                                    reject(error);
                                });
                        }).fail(function (error) {
                            console.log(error);
                            reject(error);
                        });
                }).fail(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    },
    "loadPlugins_1": function () {
        return new Promise(function (resolve, reject) {
            let buttonsDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=80ec9329-9477-4da7-a497-d89a79b0d94d&attachmentId=614a3478-6f9d-4f33-9b81-202dfca8363c"
            })
            $.when(buttonsDataTables)
                .done(function (buttonsDataTablesResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
        })
    },
    "loadPlugins_2": function () {
        return new Promise(function (resolve, reject) {
            let buttonsHTML5 = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=15cd3450-8033-4cdb-8ec8-b25497efba12&attachmentId=466f53d5-55c0-4810-aa33-46c65b4790b3"
            });

            $.when(buttonsHTML5)
                .done(function (buttonsHTML5) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
        });
    },
    "loadPlugins_3": function () {
        return new Promise(function (resolve, reject) {
            let jszip = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.js"
            });

            $.when(jszip)
                .done(function (jszipResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
        });
    }
}