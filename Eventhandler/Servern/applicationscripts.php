<?php

function authorize($dbh, $username, $password){
    $sql = "SELECT password FROM users WHERE username='{$username}'";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $dbdata = $stmt->fetch();
    if($password == $dbdata["password"]){
        return true;
    }
    else{
        return false;
    }
}
function addMember($dbh, $name, $personnr, $rqmember){
    $sql = "INSERT INTO members (memberID, name, personnr, rqmember) VALUES (NULL, '{$name}', '{$personnr}', '{$rqmember}');";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
}
function addEvent($dbh, $eventName, $date){
    $sql = "INSERT INTO events (eventID, eventname, date, participants) VALUES (NULL, '{$eventName}', '{$date}', '');";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
}
function getMembers($dbh){
    $sql = "SELECT * FROM members";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    echo(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
}
function getParticipants($dbh, $eventID){
    $sql = "SELECT participants FROM events WHERE eventID='{$eventID}'";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    echo(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
}
function updateParticipants($dbh, $eventID, $participants){
    $sql = "UPDATE events SET participants='{$participants}'  WHERE eventID='{$eventID}'";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
}
function getName($dbh, $memberID){
    $sql = "SELECT name FROM members WHERE memberID='{$memberID}'";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    echo(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
}
function getEvents($dbh){
    $sql = "SELECT * FROM events";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    echo(json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)));
}
function newRequest($dbh, $username, $password, $name){
    $sql = "INSERT INTO requests VALUES (NULL, '{$username}', '{$name}', '{$password}')";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
}
?>