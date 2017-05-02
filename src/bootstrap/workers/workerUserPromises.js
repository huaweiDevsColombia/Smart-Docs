self.addEventListener('message', function (e) {

    //Review: Promises Working but dont save data
    /*
    var promise = get("co_smart_docs.currentTime",e.data.username,e.data.tenantId,"");
    promise.then(function (currentTime) {
        console.log("CURRENT TIME"+ currentTime);
        return get("co_sm_users_update",e.data.username,e.data.tenantId,"&account_id="+e.data.username+"&last_login=TEST_WORKER&start_times="+9999);
    }).then(function (userUpdate) {
        console.log("User Updated"+ userUpdate);
        console.log(userUpdate);
        self.postMessage('WORKER STARTED: ' + userUpdate);

    }).catch(function (error) {
        console.log(error);
    });
    */

 
    var data = e.data;
    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_users_get,username:" + e.data.username + ",tenantId:" + e.data.tenantId + "}";
    var params = "account_id=" + e.data.username + "&serviceId=co_sm_users_get";
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(JSON.parse(http.response));
            self.postMessage(http.response);
            self.close();
        }
    }
    http.send(params);
    

}, false);



function get(serviceName, username, tenantId, params) {
    return new Promise(function (resolve, reject) {
        var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:" + serviceName + ",username:" + username + ",tenantId:" + tenantId + "}";
        var parameters = "serviceId=" + serviceName;
        parameters += parameters + params;
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", url, true);
        xhttp.onload = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                resolve(xhttp.response);
            }
            else {
                reject(xhttp.statusText);
            }
        }
        xhttp.onerror = function () {
            reject(xhttp.statusText);
        };
        xhttp.send(parameters);
    })
}



