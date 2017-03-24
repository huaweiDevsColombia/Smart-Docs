let workers = require ("./loadsWorkers");
let tickets = require ("./tickets");
module.exports ={
    allTemplates: "",
    templateSelected : "",
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
       
    }
}