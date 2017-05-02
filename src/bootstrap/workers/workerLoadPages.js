self.addEventListener('message', function (e) {

    var data = e.data;
    var pagesSaved = [];
    var http = new XMLHttpRequest();
    var url = "https://100l-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_html_pages_getList,username:" + e.data.username + ",tenantId:" + e.data.tenantId + "}";
    var params = "start=0&limit=100&serviceId=co_sm_html_pages_getList";
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            var pages = JSON.parse(http.response).results;
            pages.forEach(function (data, index) {
                var attachmentId = data.page_file.attachment[0].attachmentId;
                var batchId = data.page_file.attachment[0].batchId;
                var page_id = data.id_page;

                var http2 = new XMLHttpRequest();
                var url2 = "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId;
                http2.open("POST", url2, true);
                //Send the proper header information along with the request
                http2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                http2.onreadystatechange = function () {//Call a function when the state changes.
                    if (http2.readyState == 4 && http2.status == 200) {
                        pagesSaved.push({ "page_id": page_id, "content": http2.response });
                        console.log("Pagina Guardada");
                        if(pages.length == index){
                            self.postMessage(pagesSaved);
                        }
                    }
                }
                http2.send();
                    
            });
        }
    }
    http.send(params);
}, false);



