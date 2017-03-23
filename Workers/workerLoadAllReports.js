self.addEventListener('message', function (e) {
    var allReports = [];
    var params = "&start=0&limit=1000&dir=DESC&sort=id";
    if(e.data.group=='FME'){
        params += "&author="+e.data.username;
    }
    var promise = get("co_sm_report_getList", e.data.username, "100l", params);
    promise.then(function (reportsRespond) {
        let reports = JSON.parse(reportsRespond);
        allReports.push(reports);
        if (reports.total > 1000) {
            return get("co_sm_report_getList", e.data.username, "100l", params).then(function (reportsRespond2) {
                allReports.push(JSON.stringify(allReports));
                self.postMessage(JSON.stringify(allReports));
                self.close();
            });
        }
        else{
            self.postMessage(JSON.stringify(allReports));
            self.close()
        }
    })
        .catch(function (error) {
            console.log(error);
        });

    function get(serviceName, username, tenantId, params) {
        return new Promise(function (resolve, reject) {
            var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:" + serviceName + ",username:" + username + ",tenantId:" + tenantId + "}";
            var parameters = "serviceId=" + serviceName;
            parameters = parameters + params;
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.onreadystatechange = function () {//Call a function when the state changes.
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    resolve(xhttp.response);
                }
            }
            xhttp.onerror = function () {
                reject(xhttp.statusText);
            };
            xhttp.send(parameters);
        })
    }

}, false);




