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
        var content = zip.generate();
        location.href = "data:application/zip;base64," + content;
        reference.promptRefreshMessage();
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