let workers = require ("./loadsWorkers");
let tickets = require ("./tickets");
module.exports ={
    allTemplates: "",
    templateSelected : "",
    template : "",
    loadTemplates: function(project){
        let reference = this;
        return new Promise(function(resolve,reject){
         workers.getTemplates(project).then(function(data){
            reference.allTemplates = JSON.parse(data).results; 
            console.log("All Tempates",reference.allTemplates);
            console.log("Type Of:"+ typeof (reference.allTemplates));
            resolve();
        }).catch(function(error){
            reject(error);
        });    
        });
       
    },
    loadTemplate:function(batchIdWeb,attachmentWeb,batchIdPdf,attachmentPdf){
        let reference = this;
        return new Promise(function (resolve,reject){
            workers.getTemplate(batchIdWeb,attachmentWeb,batchIdPdf,attachmentPdf).then(function(loadTemplateResponse){
                reference.template = loadTemplateResponse;
                console.log(reference.template);
                resolve();
            }).catch(function (error){
                reject(error);
            });
        });
    }
}