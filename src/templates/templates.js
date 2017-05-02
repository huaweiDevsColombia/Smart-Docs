let workers = require("./../bootstrap/loadsWorkers");
let tickets = require("./../tickets/tickets");
module.exports = {
    allTemplates: "",
    templateSelected: "",
    template: "",
    templateProject:"",
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
    loadTemplate: function (web_location,pdf_location) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            workers.getTemplate(web_location,pdf_location).then(function (loadTemplateResponse) {
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
    },
    updateTemplate: function (template) {
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_template_update",
                data: {
                    "id_template":template.id_template,
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
    },
    deleteTemplate: function(){
        let reference = this;
        return new Promise(function (resolve, reject) {
            MessageProcessor.process({
                serviceId: "co_sm_template_batch_delete",
                data: {
                    "id":reference.templateSelected.id
                },
                success: function (data) {
                    console.log(data);
                    resolve();
                }
            });
        });
    }
}