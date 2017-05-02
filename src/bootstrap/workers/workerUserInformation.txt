self.addEventListener('message', function (e) {
    var data = e.data;
    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:um_user_get,userId:" + e.data.userId + ",tenantId:" + e.data.tenantId + "}";
    var params = "user_id="+e.data.userId+"&serviceId=um_user_get&csrfToken="+e.data.token;
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            self.postMessage(http.response);
            self.close();
        }
    }
    http.send(params);
}, false);




