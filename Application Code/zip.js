module.exports = {
    "generateZipFile": function (answerImages) {
        let reference = this;
        reference.disabledPromptRefreshMessage();
        var zip = new JSZip();
        // Add a text file with content about the report
        zip.file("details.txt", "Este archivo fue descargado el " + new Date().toString().split("GMT")[0], 10 + " \n Huawei Smart Docs @OWS");
        var img = zip.folder("images");

        answerImages.forEach(function (answer) {
            answer[0].forEach(function (answerVal) {
                img.file(answerVal.sel + ".png", answerVal.val.replace("data:image/png;base64,", ""), { base64: true });
            });
        });
        var content = zip.generate({ type: "blob" });
        /*
        var contentType = 'data:application/zip';
        var blob = reference.b64toBlob(contentType,content);
        var blobUrl = URL.createObjectURL(blob);
        */
        var blobUrl = window.URL.createObjectURL(content);
        console.log(blobUrl);

        var saveData = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (blobUrl, fileName) {
                url = blobUrl;
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

        var url = blobUrl,fileName = "Smart Report.zip";

        saveData(url, fileName);

        //location.href = "data:application/zip;base64," + content;

        reference.promptRefreshMessage();
    },
    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    },
    disabledPromptRefreshMessage: function () {
        window.onbeforeunload = "";
    },
    promptRefreshMessage: function () {
        window.onbeforeunload = function () {
            return "";
        };
    }
}