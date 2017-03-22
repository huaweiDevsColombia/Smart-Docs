module.exports = {
    /**
 * Load JS hierarchically - loadHighJS
 * bootstrap  
 */
    "loadHighJS":function () {
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
        let jqueryDataTables = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"
        });
        let pdfmake = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/pdfmake.min.js"
        });
        $.when(bootstrapSwitch, jqueryMinHeight, jqueryDataTables, pdfmake)
            .done(function (bootstrapSwitchResponse, jqueryMinHeightResponse, jqueryDataTablesResponse, pdfmakeResponse) {
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
    "LoadLowJS":function () {
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
        $.when(vs_fonts)
            .done(function ( vs_fontsResponse) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
    });
},
    "loadLow2JS":function loadLowJS2(){
     return new Promise(function (resolve, reject) {
        let buttonsDataTables = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/buttons/1.2.4/js/dataTables.buttons.min.js"
        });
        let jszip = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"
        });
        let buttonsHTML5 = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://cdn.datatables.net/buttons/1.2.4/js/buttons.html5.min.js"
        });

        $.when(buttonsDataTables, jszip, buttonsHTML5)
            .done(function (buttonsDataTablesResponse, jszipResponse, buttonsHTML5) {
                resolve();
            }).fail(function (error) {
                reject(error);
            });
    });
},
/**
 * Load Custom JS - OWS JS Datamodel
 * Smart Engine - Application
 */
    "loadcustomJS":function(){
    return new Promise(function(resolve,reject){
        let smart_Engine = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=ed57f477-55af-48ae-ad63-70633c2ea5a6&attachmentId=689849"
            });
            let app = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=5b674633-91a7-4b71-ba90-88431847ae47&attachmentId=655573"
            });
            $.when(smart_Engine, app)
                .done(function (smart_EngineResponse, appResponse) {
                    resolve();
                }).fail(function (error) {
                    reject(error);
                });
    });
}
}