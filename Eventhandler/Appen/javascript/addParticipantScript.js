$(document).ready(function(){
    printUsers();
});

function printUsers(){
    json = '{"function":"getMembers"}';
    var customFunction = function(data){
        data = JSON.parse(data);
        var html = "";
        for(var i = 0; i < data.length; i++){
            if(data[i].rqmember == "1"){ // Om det är en som är medlem i ragequit
                html += "<li data-icon='heart'>" + data[i].name + " - " + data[i].personnr + "</li>";
            }
            else{
                html += "<li>" + data[i].name + " - " + data[i].personnr + "</li>";
            }
        }
        document.getElementById("memberList").innerHTML = html;
    };

    sendToServer(json, customFunction);

}