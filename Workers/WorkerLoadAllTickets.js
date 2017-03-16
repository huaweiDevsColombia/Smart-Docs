self.addEventListener('message', function (e) {
    var allTickets = [];

    var data = e.data;
    var generalParams = "&start=0&limit=100&statuses=0003&fme_assigned=user:"+e.data.username;

    var promise = get("cuttm_pm_troubleticket_getList", e.data.username, e.data.tenantId, generalParams);
    promise.then(function (pmTicketsResponse) {
        allTickets.push({PM:JSON.parse(pmTicketsResponse)});
        console.log("PM Tickets: ", JSON.parse(pmTicketsResponse));
        return get("cuttm_cm_troubleticket_getList", "ROOT_1018482294", "100l", generalParams);
    }).then(function (cmTicketsResponse) {
        allTickets.push({CM:JSON.parse(cmTicketsResponse)});
        console.log("CM Tickets: ", JSON.parse(cmTicketsResponse));
		return get("cuttm_plm_troubleticket_getList", "ROOT_1018482294", "100l", generalParams);
    }).then(function (plmTicketsResponse) {
        allTickets.push({PLM:JSON.parse(plmTicketsResponse)});
        console.log("PLM Tickets: ", JSON.parse(plmTicketsResponse));
         self.postMessage(JSON.stringify(allTickets));
    })
    .catch(function (error) {
            console.log(error);
        });

    function get(serviceName, username, tenantId, params) {
        return new Promise(function (resolve, reject) {
            var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:"+serviceName+",username:"+username+",tenantId:"+tenantId+"}";
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




