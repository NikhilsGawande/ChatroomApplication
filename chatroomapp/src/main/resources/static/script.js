var stompClient = null;

function connect(chatRoomId) {
    var socket = new SockJS('/chatroom');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/chat/' + chatRoomId, function (response) {
            showMessage(JSON.parse(response.body))
        });
    });
}



function sendMessage() {
    let jsonOb={
        data:$("#message").val(),
        author:localStorage.getItem("name")
    }
    var urlParams = new URLSearchParams(window.location.search);
    var chatRoomId = urlParams.get('chatRoomId');
    stompClient.send("/app/chat/" + chatRoomId, {}, JSON.stringify(jsonOb));
    $("#message").val("");
}

 function showMessage(message)
 {

    $("#message-container-table").append(`<tr><td><b>${message.author} :</b> ${message.data}</td></tr>`)

 }

$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var chatRoomId = urlParams.get('chatRoomId');
    localStorage.setItem("chatRoomId",chatRoomId)
    $("#login").click(()=>{
        let name=$("#name-value").val()
        localStorage.setItem("name",name)
        $("#name-title").html(`Welcome , <b>${name} </b>`)
        connect();
    })
    if (chatRoomId) {
        connect(chatRoomId);
    }
});
