let workers = require("./loadsWorkers");
let tickets = require("./tickets");
module.exports = {
    allTemplates: "",
    templateSelected: "",
    template: "",
    loadTemplates: function (project) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            workers.getTemplates(project).then(function (data) {
                reference.allTemplates = JSON.parse(data).results;
                console.log("All Tempates", reference.allTemplates);
                console.log("Type Of:" + typeof (reference.allTemplates));
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });

    },
    loadTemplate: function (batchIdWeb, attachmentWeb, batchIdPdf, attachmentPdf) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            workers.getTemplate(batchIdWeb, attachmentWeb, batchIdPdf, attachmentPdf).then(function (loadTemplateResponse) {
                reference.template = loadTemplateResponse;
                console.log(reference.template);
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    createTemplate: function (template) {
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_template_create",
                data: {
                    "icon_template": JSON.stringify(template.icon_template),
                    "template_name_web": template.template_name_web,
                    "template_name_export": template.template_name_export,
                    "template_project": template.template_project,
                    "template_web": template.template_web,
                    "template_pdf": template.template_pdf
                },
                success: function (data) {
                    console.log(data);
                    resolve();
                }
            });
        });
    }
}