self.addEventListener('message', function (e) {

    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_report_create,userId:" + e.data.userId + ",tenantId:" + e.data.tenantId + "}";
    var params = "answer="+e.data.answer+"&status="+e.data.status+"&comment="+e.data.comment+"&project="+e.data.project+"&region="+e.data.region+"&site_id="+e.data.site+"&supplier="+e.data.supplier+"&ticket_id="+e.data.ticket+"&web_template="+e.data.template+"&work_client="+e.data.workClient+"&csrfToken="+e.data.token+"&serviceId=co_sm_report_create";

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.readyState);
            console.log(http);
            self.postMessage(http.response);
            self.close();
        }
    }
    http.send(params);

}, false);




