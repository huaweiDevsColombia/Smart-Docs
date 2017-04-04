self.addEventListener('message', function (e) 
{
    var responseWebJson;
    var response = [];

    var promise = get(e.data.web_location);

    promise.then(function(jsonWebResponse){
       responseWebJson = jsonWebResponse;
        return get(e.data.pdf_location);
    }).then(function (jsonPdfResponse){
        response.push({jsonWeb:responseWebJson,jsonPdf:jsonPdfResponse});
        self.postMessage(response);
        self.close();
    });
    function get(location) {
        return new Promise(function (resolve, reject) {
            var url = "https://100l-app.teleows.com/servicecreator/fileservice"+location;
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, true);
            xhttp.responseType = 'json';
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
             xhttp.onreadystatechange = function () {//Call a function when the state changes.
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            resolve(xhttp.response);
        }
    }
            xhttp.onerror = function () {
                reject(xhttp.statusText);
            };
            xhttp.send();
        })
    }

}, false);




