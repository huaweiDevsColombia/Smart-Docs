self.addEventListener('message', function (e) {

    var data = e.data;
    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:currentTime,userId:" + e.data.userId + ",tenantId:" + e.data.tenantId + "}";
    var params = "date=&csrfToken="+e.data.token+"&serviceId=currentTime";
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




