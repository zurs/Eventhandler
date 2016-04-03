var participantsID;
var thisEvent;

function showOldEvents(){ // Visa en lista med föregående evenemang
    require("javascript/Event.js"); // En klass för att enkelt hantera evenemangen
    require("javascript/scripts.js");

    var json = '{"function":"getEvents"}';

    var customFunction = function(data){
        data = JSON.parse(data);
        var html = "";
        for(var i = 0; i < data.length; i++){
            html += "<li data-icon='gear' ><a href=\"javascript:selectEvent('" + data[i].eventID + "');\" data-rel='popup' data-transition='pop'>" + data[i].eventname + " - " + data[i].date + " </a></li>";
        }
        document.getElementById("eventlist").innerHTML = html;
    };
    sendToServer(json, customFunction);
}
function selectEvent(eventID){ // Anropas när man klickar på ett event, så appen vet vilket event man hanterar
    window.localStorage.setItem("currentEvent", eventID);
    document.getElementById("popupLink").click(); // Visa evenemangs-menyn med olika alternativ(änsålänge bara ett)
}
function handleParticipants(){
    sendToSite("handleEventParticipants.html");
}
function showParticipants(){ // Visar deltagarna utav ett evenemang
    var currentEvent = window.localStorage.getItem("currentEvent");
    var json = '{"function":"getParticipants", "eventID":"' + currentEvent + '"}';
    var customFunction = function(data){
        data = JSON.parse(data);
        participantsID = data[0].participants.split("|");
        var html = "";
        for(var i = 0; i < participantsID.length - 1; i++){ // Minus 1 för att arrayen alltid blir en 1 för stor
            // Skriv ut deltagaren, skriv "Laddar..." tills ajax-anropet med namnet har fått svar
            html += "<li><a id='" + participantsID[i] + "' href=\"javascript:removeParticipant('" + participantsID[i] + "');\">Laddar...</a></li>";
            getName(participantsID[i]); // Fråga servern efter namnet på deltagren och skriv ut det i listan
        }
        // Alla anrop är skickade och man kan skriva ut listan sålänge i väntan på svaren med deltagarnas namn
        document.getElementById("participantlist").innerHTML = html;
    };
    sendToServer(json, customFunction);
}
function makeToArray(array){ // Används för att få en array i javascript till en string som ser ut som en "array" som kan sparas i databasen
    var string = "";
    for(var i = 0; i < array.length; i++){
        string += array[i] + "|"; // Lägger till ett | mellan varje element och sätter det till en sträng
    }
    return string;
}
function removeParticipant(memberID){
    if(confirm("Säker på att du vill radera denna deltagare?")){
        var currentEvent = window.localStorage.getItem("currentEvent");
        participantsID.splice(participantsID.indexOf(memberID), 1);
        participantsID.pop(); // Tar bort det sista tomma elementet så det inte förstör loopar osv i tex makeToArray()
        json = '{"function":"updateParticipants", "eventID":"' + currentEvent + '", "participants":"' + makeToArray(participantsID) + '"}';
        var customFunction = function(){
            alert("Personen är borttagen");
            showParticipants(); // Ladda om deltagarna i evenemanget
        };
        sendToServer(json, customFunction);
    }
}
function getName(participantID){ // Används för att ladda in namnen på ett evenemangs deltagare, körs på varje deltagare
    json = '{"function":"getName", "memberID":"' + participantID + '"}';
    var customFunction = function(data){
        data = JSON.parse(data);
        document.getElementById(participantID).innerHTML = data[0].name; // Ändra "Laddar..." till namnet
    };
    sendToServer(json, customFunction);
}
function addParticipant(memberID){
    var currentEvent = window.localStorage.getItem("currentEvent");
    var json = '{"function":"getParticipants", "eventID":"' + currentEvent + '"}';
    var customFunction = function(data){
        data = JSON.parse(data);
        participantsID = data[0].participants.split("|"); // Skapat arrayen som jag kan arbeta med
        // Kolla om deltagaren redan finns
        if(!checkIfExist(memberID, participantsID)){
            participantsID[participantsID.length - 1] = memberID; // Då det alltid blir ett element för mycket så sätter jag det tomma elementet till ID:t helt enkelt
            // Deltagare tillagd, dags att skicka den nya arrayen utav deltagare
            var currentEvent = window.localStorage.getItem("currentEvent");
            var json = '{"function":"updateParticipants", "eventID":"' + currentEvent + '", "participants":"' + makeToArray(participantsID) + '"}';
            var cFunc = function(){
                alert("Deltagare tillagd");
            };
            sendToServer(json, cFunc);
        }
        else{
            alert("Deltagaren är redan anmäld i detta evenemanget");
        }
    };
    sendToServer(json, customFunction);
}

function memberList(){ // Laddar in listan utav medlemmar då man ska lägga till deltagare
    var json = '{"function":"getMembers"}';
    var customFunction = function(data){
        data = JSON.parse(data);
        var html = "";
        for(var i = 0; i < data.length; i++){
            html += "<li><a href=\"javascript:addParticipant('" + data[i].memberID + "');\">" + data[i].name + " - " + data[i].personnr + "</a></li>";
        }
        document.getElementById("memberList").innerHTML = html;
    };
    sendToServer(json, customFunction);
}
function checkIfExist(value, array){ // Kollar om en person redan är deltagare i evenemanget
    for(var i = 0; i < array.length; i++){
        if(array[i] == value) {
            return true;
        }
    }
    return false;
}