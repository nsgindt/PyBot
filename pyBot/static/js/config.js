       
$(document).on('change','select', function(ev) {
    var $action = this.value;
    var $gp = $(this).parent().parent().parent().children().eq(1);
    var $step = $(this).parent().parent().children().eq(0).children().eq(1);
    switch ($action) {
        case "Run Powershell":
            $gp.html(rtnPShtml($step.val()));
            break;
        case "Run Robot Script":
            $gp.html(rtnROBOThtml($step.val()));
            break;
        case "Typing Bot":
            $gp.html(rtnTYPEBOThtml($step.val()));
            break;
        case "Hotkey Bot":
            $gp.html(rtnHOTKEYhtml($step.val()));
            break;
        case "Keypress Bot":
            $gp.html(rtnBUTTONhtml($step.val()));
            break;
        default:
            $gp.html("");                 
    }
    //alert( $step.val() );
});

$( "#add_step" ).click(function() {
    $('#step_list').append(rtnNEWSTEPhtml(getStepCount()));
});


function rtnPShtml(step){
    var rtn = "<label for=\"ps_path\">Powershell File Path</label>\
                <input type=\"text\" class=\"form-control\" id=\"ps_path\">";
    return rtn;
};

function rtnROBOThtml(step){
    var rtn = "<label for=\"action_path\">Action Script File Path</label>\
                <input type=\"text\" class=\"form-control\" id=\"action_path\">\
                <label for=\"data_path\">Data File Path</label>\
                <input type=\"text\" class=\"form-control\" id=\"data_path\">";
    return rtn;
};

function rtnTYPEBOThtml(step){
    var rtn = "<label for=\"text_input\">Text to be typed</label>\
                            <input type=\"text\" class=\"form-control\" id=\"text_input\">";
    return rtn;
};

function rtnBUTTONhtml(step){
    var rtn = "<label for=\"keypress_input\">Button to be Pressed</label>\
                            <input type=\"text\" class=\"form-control\" id=\"keypress_input\">";
    return rtn;
};

function rtnHOTKEYhtml(step){
    var rtn = "<label for=\"hotkey_input\">Hotkey to be pressed</label>\
                            <input type=\"text\" class=\"form-control\" id=\"hotkey_input\">"
    return rtn;
};

function rtnNEWSTEPhtml(step_cnt){
    step_num = parseInt(step_cnt) + 1
    var rtn = "<div id =\"step_" + step_num + "\" class=\"bot_step\">\
                <form>\
                    <div class=\"form-row\">\
                        <div class=\"form-group col-md-1\">\
                            <label for=\"step_num\">Step #</label>\
                            <input type=\"text\" class=\"form-control\" id=\"step_num\" value=\""+ step_num +"\" readonly>\
                        </div>\
                        <div class=\"form-group col-md-4\">\
                            <label for=\"select_action\">Action</label>\
                            <select class=\"form-control\" id=\"select_action\">\
                                <option></option>\
                                <option>Run Powershell</option>\
                                <option>Run Robot Script</option>\
                                <option>Typing Bot</option>\
                                <option>Hotkey Bot</option>\
                                <option>Keypress Bot</option>\
                            </select>\
                        </div>\
                        <div><a class=\"minus\"><span class=\"fas fa-trash-alt\"></span></a></div>\
                    </div>\
                    <div class=\"form-row\" id=\"action_detail\"></div>\
                </form>\
                <hr class=\"my-4\">\
                </div>"
    return rtn;
};

$(document).on( "click", ".minus", function(ev) {
    var $step = $(this).parent().parent().children().eq(0).children().eq(1);
    var $action = $(this).parent().parent().children().eq(1).children().eq(1);

    if ($action.val() !== ""){
        var r = confirm("Delete Step "+ $step.val() +"?")
        if (r == true){
            $(this).parent().parent().parent().parent().remove();
            updateStepNumber();
        };
    } else {
        $(this).parent().parent().parent().parent().remove();
        updateStepNumber();
    };
    //alert( $action.val() )
});

function getStepCount(){
    var count = 0
    $(".bot_step").each(function(){
        count++
    });
    return count;
};

function updateStepNumber(){
    var step = 1
    $(".bot_step").each(function(){
        //bot_step > form > .form-row > form-group > input 
        $(this).children().eq(0).children().eq(0).children().eq(0).children().eq(1).val(step);
        //update the id of the step
        var $id = $(this).attr("id", "step_"+ step);
        step++;
    });
};

function saveBot(){
    var json = {};
    var bot_name = $("#bot_name").val();
    var bot_desc = $("#bot_desc").val();

    json.bot_id = "NEXT";
    json.bot_name = bot_name;
    json.bot_desc = bot_desc;
    json.step = [];

    $(".bot_step").each(function(){
        var step_num = $(this).children().eq(0).children().eq(0).children().eq(0).children().eq(1).val();
        var action = $(this).children().eq(0).children().eq(0).children().eq(1).children().eq(1).val();
        var path1 = $(this).children().eq(0).children().eq(1).children().eq(1).val();
        var path2 = $(this).children().eq(0).children().eq(1).children().eq(3).val();
        step_obj = {};
        step_obj.action = action;
        step_obj.input = [path1,path2];
        json.step[step_num -1] =step_obj;
    });
    return JSON.stringify(json);
};

$(document).on( "click", "#lock_header", function(ev) {
    $("#bot_name").attr("readonly", true);
    $("#bot_desc").attr("readonly", true);
    $(this).attr("id", "edit_header");
    $(this).html("edit");
});

$(document).on( "click", "#edit_header", function(ev) {
    $("#bot_name").removeAttr("readonly");
    $("#bot_desc").removeAttr("readonly");
    $(this).attr("id", "lock_header");
    $(this).html("lock");
});

$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#sidebarCollapse').toggleClass('fa-flip-horizontal')
    });

});

$(document).ready(function() {
    namespace = '/test';
    // Connect to the Socket.IO server.
    // The connection URL has the following format:
    //     http[s]://<domain>:<port>[/<namespace>]
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    // Event handler for new connections.
    // The callback function is invoked when a connection with the
    // server is established.
    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected'});
    });

    socket.on('roger', function(msg) {
        //$('#log').append('<br>' + $('<div>').text('Received #' + msg.count + ': ' + msg.data).html());
        console.log('from ws')
        console.log( msg );
    });

    $( "#save_bot" ).click(function() {
        console.log('save_bot clicked')
        //json = saveBot();
        //console.log(json);
        socket.emit('save_bot', saveBot());
    });

});     