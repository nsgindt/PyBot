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
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    socket.on('my_response', function(msg) {
        //$('#log').append('<br>' + $('<div>').text('Received #' + msg.count + ': ' + msg.data).html());
        $(".progress-bar").css("width", msg.data + "%");
        console.log( msg.data + "%");
    });

    socket.on('process_started', function(msg) {
        $('#processlog').append('<br>' + $('<div>').text(msg.data + " @ " + msg.time).html());
        $( "#startme" ).addClass( "disabled" ).prop('disabled', true);
        $( "#stopme" ).removeClass( "disabled" ).prop('disabled', false);
        if ($(".progress-bar").hasClass("bg-success")){
            $( ".progress-bar" ).removeClass( "bg-success" ).addClass( "bg-info" );
        }
        if ($(".progress-bar").hasClass("bg-danger")){
            $( ".progress-bar" ).removeClass( "bg-danger" ).addClass( "bg-info" );
        }
    });

    socket.on('process_stopped', function(msg) {
        $('#processlog').append('<br>' + $('<div>').text(msg.data).html());
        $( "#stopme" ).addClass( "disabled" ).prop('disabled', true);
        $( "#startme" ).removeClass( "disabled" ).prop('disabled', false);
    });

    socket.on('bot_complete', function(msg) {
        $('#processlog').append('<br>' + $('<div>').text(msg.data + ' @ ' + msg.time).html());
        $( "#stopme" ).addClass( "disabled" ).prop('disabled', true);
        $( "#startme" ).removeClass( "disabled" ).prop('disabled', false);
        $(".progress-bar").removeClass( "bg-info" ).addClass( "bg-success" );
    });

    socket.on('bot_aborted', function(msg) {
        $('#processlog').append('<br>' + $('<div>').text(msg.data + ' @ ' + msg.time).html());
        $( "#stopme" ).addClass( "disabled" ).prop('disabled', true);
        $( "#startme" ).removeClass( "disabled" ).prop('disabled', false);
        $(".progress-bar").removeClass( "bg-info" ).addClass( "bg-danger" );
    });

    socket.on('process_status', function(msg) {
        $('#process_status').html( 'step ' + msg.step + ' of ' + msg.total_steps);
    });

    socket.on('ps_error', function(msg) {
        $('#process_status').html(msg.data);
    });

    $( "#stopme" ).click(function() {
        socket.emit('stopme');
    });
    $( "#startme" ).click(function() {
        socket.emit('startme');
        $('#process_status').html( 'Waking up your robots, and making them gather your data.');
    });

});            

    function closeSocket(){
        namespace = '/test';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
        socket.emit('disconnect');
                return false;
    }