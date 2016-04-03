<?php
require("applicationscripts.php");
require("variables.php");

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$dbh = new PDO("mysql:host={$dbhost}; charset=utf8; dbname={$dbname};", $dbusername, $dbpasswd);

$post_data = @file_get_contents("php://input");
$data = json_decode($post_data);
$username = $data->username;
$password = $data->password;
$function = $data->function;


if($function == "requestAccount"){
    $name = $data->name;
    newRequest($dbh, $username, $password, $name);
}

else if(authorize($dbh, $username, $password)){ // Kolla om personen är "inloggad"
    if($function == "authorize"){
        echo("true");
    }
    else if($function == "addMember"){ // Om det är en person som ska läggas till
        $name = $data->name;
        $personnr = $data->personnr;
        $rqmember = $data->rqmember;
        addMember($dbh, $name, $personnr, $rqmember);
    }
    else if($function == "addEvent"){ // Om ett event ska skapas
        $eventName = $data->eventName;
        $date = $data->date;
        addEvent($dbh, $eventName, $date);
    }
    else if($function == "getMembers"){
        getMembers($dbh);
    }
    else if($function == "getParticipants"){
        $eventID = $data->eventID;
        getParticipants($dbh, $eventID);
    }
    else if($function == "updateParticipants"){
        $eventID = $data->eventID;
        $participants = $data->participants;
        updateParticipants($dbh, $eventID, $participants);
    }
    else if($function == "getName"){
        $memberID = $data->memberID;
        getName($dbh, $memberID);
    }
    else if($function == "getEvents"){
        getEvents($dbh);
    }
}
else{
    echo("Ej inloggad");
}

?>
