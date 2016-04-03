var currentEvent;

//För att enkelt kunna ändra adressen/ip
window.localStorage.setItem("url", "http://event.ragequit.nu/application.php");


function require(script) { // Funktion för att ladda in nya skript
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}

function loggedIn(){
    //Kolla localstorage efter användarnamn och lösenord(SHA-1)
    //Om det finns: Logga in med uppgifterna
    //Annars skicka till login
    if(window.localStorage.getItem("username")){ // Kolla om localstorage finns
        authorize();
    }
}
function sendToServer(json, customFunction){ // Ska ha in fullständig json och lägger in authorization
    var username = window.localStorage.getItem("username");
    var password = window.localStorage.getItem("password");

    var addjson = '{"username":"' + username + '", "password":"' + password + '",'; // Det som ska läggas till i json
    var fulljson = addjson.concat(json.slice(1)); // Lägger ihop strängarna
    //Skicka kommandot till servern
    $.post(window.localStorage.getItem("url"), fulljson, customFunction, "text");
}
function authorize(){ // Kolla om man är inloggad
    var json = '{"function":"authorize"}'; // Bara för att skicka något så servern vet vad den ska skicka tillbaka
    var customFunction = function(data){ // Funktion som ska hända när .post är klar
        if(data == "true"){
            sendToSite("menu.html");
        }
        else{
            alert("Fel användarnamn eller lösenord");
            removeLocalStorage();
        }
    }
    sendToServer(json, customFunction);
}
function login(){
    require("javascript/sha1.js");
    var username = document.getElementById("fullname").value;
    var password = document.getElementById("password").value;
    password = CryptoJS.SHA1(password); // Kryptera lösenordet, UTAN SALTNING
    window.localStorage.setItem("username", username); // Sätt in uppgifterna så att man fortsätter att vara inloggad
    window.localStorage.setItem("password", password);
    authorize();
}
function sendToSite(site){
    window.location.href = site;
}

function logout(){
    removeLocalStorage();
    sendToSite("login.html");
}
function removeLocalStorage(){
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
}

function addMember(){
    var name = document.getElementById("name").value;
    var personnr = document.getElementById("personnr").value;
    var rqmember = document.getElementById("rqmember").checked;
    if(rqmember){
        rqmember = 1;
    }
    else{
        rqmember = 0;
    }
    var customFunction = function(){
        alert(name + " är nu tillagd");
        sendToSite("menu.html");
    }

    var json = '{"function":"addMember", "name":"' + name + '", "personnr":"' + personnr + '","rqmember":"' + rqmember + '"}';
    sendToServer(json, customFunction);
}
function addEvent(){
    var eventName = document.getElementById("eventname").value;
    var date = document.getElementById("eventdate").value;

    var customFunction = function(){
        alert("Eventet har skapats, gå in under föregående event och lägg till deltagare redan nu!");
        sendToSite("previousEvents.html");
    };
    var json = '{"function":"addEvent","eventName":"' + eventName + '","date":"' + date + '"}';
    sendToServer(json, customFunction);
}

function requestAccount(){
    // Skaffa alla elements värden till förfrågningen
    var username = document.getElementById("username").value;
    var name = document.getElementById("fullname").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(password == confirmPassword){
        require("javascript/sha1.js");
        password = CryptoJS.SHA1(password); // Lösenordet ska krypteras så fort som möjligt, alltså även innan förfrågan
    }
    else{
        alert("Lösenorden matchar inte");
        return;
    }
    // Då detta går utanför autentieringen så måste man göra en egen ajax-request istället för den vanliga funktionen jag programmerat innan
    var fulljson = '{"username":"' + username + '", "password":"' + password + '", "function":"requestAccount", "name":"' + name + '"}';
    var customFunction = function(){
        alert("Förfrågam har lagts till, nu är det bara att vänta tills en ansvarig godkänner ditt konto. Kontakta en ansvarig snarast om du behöver det snart");
        sendToSite("index.html"); // Förfrågan har skickats, skicka tillbaka personen till startsidan
    };
    $.post(window.localStorage.getItem("url"), fulljson, customFunction, "text") // Som sagt, måste göra en helt ny förfrågan
}