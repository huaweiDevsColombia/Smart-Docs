/**
 * Load All Pages - Side Menu
 * Make an Ajax Request to get all the pages from OWS HTML Datamodel
 */
function loadAllPages() {
    return new Promise(function (resolve, reject) {
        var pagesSaved = [];
        var http = new XMLHttpRequest();
        var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_html_pages_getList,userId:" + USER_ID + ",tenantId:" + tenantId + "}";
        var params = "start=0&limit=100&csrfToken=" + csrfToken + "&serviceId=co_sm_html_pages_getList";
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                let pages = JSON.parse(http.response).results;
                resolve(pages);
            }
            else if (http.readyState == 4 && http.status != 200) {
                reject(http.status);
            }
        }
        http.send(params);
    });
}

module.exports = {
    "loadAllPages": loadAllPages()
}