module.exports = {
    addMessageLoder: function (selector,location) {
        $(location).addClass("loader");
        $(location).append("<div id='loader' class='loader-container text-center color-white'><div><i style='color:white' class='fa fa-spinner fa-pulse fa-3x'></i></div><div style='color:white'><h4>Smart Docs <br> <small> Cargando Recursos <div id='"+selector+"'> </div> </small> <br><small>... Se esta preparando para ti ...</small></h4><h5>Desarollado por: Huawei Colombia  <br> OSS IT Team </h5></div></div>");
    },
    changeMessageLoader: function (selector, msg) {
        console.log("Selector: "+ selector);
        console.log("Message: " + msg);
        $("#" + selector).text(msg);
    },
    removeMessageLoader: function (location){
        $("#loader").remove();
        $(location).removeClass("loader");
    },
    launchProcessImageModal: function(){
        $("#process_image_modal").remove();
        $("body").append("<div class='fade modal modal-warning'aria-hidden=true aria-labelledby=myModalLabel1 id=process_image_modal role=dialog style=display:block tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel13>La imagen esta siendo procesada </h4></div><div class=modal-body> <img src='https://image.flaticon.com/icons/svg/143/143984.svg' style='margin-left:auto;margin-right:auto;display:block' width='150px'><h4 style='text-align:center'> Espera un momento, este proceso puede tomar algunos segundos dependiendo de tu conexion</h4></div></div></div></div>");
        $("#process_image_modal").modal({ backdrop: 'static', keyboard: false });
    },
    removeProcessImageModal:function(){
        $("#process_image_modal").modal('hide');
    }
}