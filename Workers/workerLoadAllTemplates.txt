self.addEventListener('message', function (e) {
    var params = "&start=0&limit=1000&dir=ASC&sort=id_template&template_project=" + e.data.project;
    
    var promise = get("co_sm_template_getList", e.data.username, "100l", params);
    promise.then(function (templatesRespond) {
        self.postMessage(templatesRespond);
        self.close()
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




