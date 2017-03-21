/**
 * Load Fonts from Google Apis
 * Family = Lato & Family = Roboto
 */
function loadFonts() {
    return new Promise(function (resolve, reject) {
        let latoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Lato"
        });
        let robotoFonts = $.ajax({
            method: "GET",
            url: "https://fonts.googleapis.com/css?family=Roboto"
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
            url: "https://use.fontawesome.com/4e0d3cfdd0.js"
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
            url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        });
        let animate = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        });
        let select2 = $.ajax({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css"
        });
        let buttonsDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css"
        });
        let bootstrapDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/1.10.13/css/dataTables.bootstrap.min.css"
        });
        let jqueryDataTables = $.ajax({
            method: "GET",
            url: "https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"
        });

        $.when(bootstrap, animate, select2, buttonsDataTables, bootstrapDataTables, jqueryDataTables)
            .done(function (bootstrapRespond, animateRespond, select2Respond, buttonsDataTablesRespond, bootstrapDataTablesRespond, jqueryDataTablesRespond) {

                $('<style />').text(bootstrapRespond).appendTo($('head'));
                $('<style />').text(animateRespond).appendTo($('head'));
                $('<style />').text(select2Respond).appendTo($('head'));
                $('<style />').text(buttonsDataTablesRespond).appendTo($('head'));
                //$('<style />').text(bootstrapDataTablesRespond).appendTo($('head'));
                $('<style />').text(jqueryDataTablesRespond).appendTo($('head'));
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
                url: "https://100l-app.teleows.com/servicecreator/pageruntime/pageScript.action?appName=CO_SMART_DOCS&name=style%20&type=css"
            });
            let flat_blue = $.ajax({
                method: "GET",
                url: "https://100l-app.teleows.com/servicecreator/pageruntime/pageScript.action?appName=CO_SMART_DOCS&name=flat%20blue&type=css"
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
    "loadCSS":loadCSS()
}