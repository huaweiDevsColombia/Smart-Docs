self.addEventListener('message', function (e) {

    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/debugMessage";
    var messageData = { "modified_by": "", "author": "", "last_modification": "", "creation_date": "", "answer": e.data.answer, "approval_date": "", "approver": "", "comments": e.data.comment, "completed_date": "", "id_report": "", "project": e.data.project, "region": e.data.region , "rejected_date": "", "rejecter": "", "site_id": e.data.site, "status": e.data.status, "supplier": e.data.supplier, "ticket_id": e.data.ticket, "web_template": e.data.template, "work_client": e.data.workClient, "active": "", "actual_model_id": "" }
    var params = "comeFrom=page&messageId=10113&csrfToken="+e.data.token+"&messageData="+JSON.stringify(messageData);

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




