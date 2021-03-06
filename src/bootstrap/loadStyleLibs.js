/**
 * Load Fonts from Google Apis
 * Family = Lato & Family = Roboto
 */
function loadFonts() {
    return new Promise(function (resolve, reject) {
        let latoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Lato",
            cache: false
        });
        let robotoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Roboto",
            cache: false
        });
        $.when(latoFonts, robotoFonts).done(function (latoFontsResponse, robotoFontsResponse) {
            $('<style />').text(latoFontsResponse).appendTo($('head'));
            $('<style />').text(robotoFontsResponse).appendTo($('head'));
            resolve();
            console.log("loadFontsLibs has Loaded");
        }).fail(function (error) {
            console.log("loadFontsLibs has Failed");
            reject(error);
        })
    });
}
/**
 * Load Icons from fontAwesome
 */
function loadIcons() {
    return new Promise(function (resolve, reject) {
        let fontAwesome = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://use.fontawesome.com/4e0d3cfdd0.js",
            cache: false
        });
        $.when(fontAwesome).done(function (fontAwesomeResponse) {
            resolve();
            console.log("loadIconLibs has Loaded");
        }).fail(function (error) {
            reject(error);
            console.log("loadIconLibs has Failed");
        });
    });
}
/**
 * Load CSS Libs like Bootstrap, Datatables , Animate, DataButtons...
 */
function loadCSS() {
    return new Promise(function (resolve, reject) {
        let bootstrap = $.ajax({
            method: "GET",
            url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
            cache: false
        });
        let animate = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css",
            cache: false
        });
        let select2 = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css",
            cache: false
        });
        
        let buttonsDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css",
            cache: false
        });
        let bootstrapDataTables = $.ajax({
            method: "GET",
            url: "http://cdn.datatables.net/plug-ins/e9421181788/integration/bootstrap/3/dataTables.bootstrap.css",
            cache: false
        });
        /*
        let jqueryDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"
        });
        */
        
        /*let dataTables = $.ajax({
            method: "GET",
            //url: "https://cdn.datatables.net/v/bs/jszip-2.5.0/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-html5-1.2.4/datatables.min.css"
            //url:"https://cdn.datatables.net/v/bs/jszip-2.5.0/dt-1.10.13/b-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/datatables.min.css"
        });
        */

        $.when(bootstrap, animate, select2 , buttonsDataTables, bootstrapDataTables/* ,jqueryDataTables, dataTables*/)
            .done(function (bootstrapRespond, animateRespond, select2Respond , buttonsDataTablesRespond, bootstrapDataTablesRespond/*, jqueryDataTablesRespond , datatablesResponse*/) {

                $('<style />').text(bootstrapRespond).appendTo($('head'));
                $('<style />').text(animateRespond).appendTo($('head'));
                $('<style />').text(select2Respond).appendTo($('head'));
                $('<style />').text(buttonsDataTablesRespond).appendTo($('head'));
                $('<style />').text(bootstrapDataTablesRespond).appendTo($('head'));
                //$('<style />').text(jqueryDataTablesRespond).appendTo($('head'));
                //$('<style />').text(datatablesResponse).appendTo($('head'));
                resolve();
                console.log("loadCssLibs has Loaded");
            }).fail(function (error) {
                reject(error);
                console.log("loadCssLibs has failed");
            });
    });
}
/**
 * Load Custom Libs from OWS CSS Datamodel 
 */
function loadCustomLibs(){
    return new Promise(function(resolve,reject){
        let style = $.ajax({
                method: "GET",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=2219d2ef-e6bf-4775-ac56-c1933f4feeca&attachmentId=666945",
                cache: false
            });
            let flat_blue = $.ajax({
                method: "GET",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=8c80323c-54c5-4372-b413-d08542b94fca&attachmentId=638599",
                cache: false
            });
            $.when(style, flat_blue).done(function (styleResponse, flat_blueResponse) {
                $('<style />').text(styleResponse).appendTo($('head'));
                $('<style />').text(flat_blueResponse).appendTo($('head'));
                resolve();
                console.log("loadCustomLibs has Loaded");
            }).fail(function (error) {
                console.log("loadCustomLibs has Failed");
                reject(error);
            });
    });
}
module.exports = {
    "loadFonts": loadFonts(),
    "loadIcons": loadIcons(),
    "loadCSS":loadCSS(),
    "loadCustomCss":loadCustomLibs()
}