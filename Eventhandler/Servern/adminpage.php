<?php

$dbh = new PDO("mysql:host={$dbhost}; charset=utf8; dbname={$dbname};", $dbusername, $dbpasswd);

//Köra alla POST-skripts först
if(isset($_POST["action"])){
    if($_POST["action"] == "acceptRequest"){
        $requestID = $_POST["requestID"];
        $sql = "SELECT * FROM requests WHERE requestID='{$requestID}'"; // Hämta all data om förfrågningen
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetch();
        // Sätt in all data från förfrågningen till users, den acceptera helt enkelt
        $sql = "INSERT INTO users VALUES ('{$data['username']}', '{$data['name']}', '{$data['password']}')";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        //Ta bort den gamla förfrågan
        $sql = "DELETE FROM requests WHERE requestID='{$requestID}'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
    }
    else if($_POST["action"] == "denyRequest"){
        $requestID = $_POST["requestID"];
        $sql = "DELETE FROM requests WHERE requestID='{$requestID}'"; // Hämta all data om förfrågningen
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
    }
    else if($_POST["action"] == "removeEvent"){
        $eventID = $_POST["eventID"];
        $sql = "DELETE FROM events WHERE eventID='{$eventID}'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
    }
    else if($_POST["action"] == "logout"){
        session_destroy();
        // Då man redan autentierats så laddas sidan om för att komma till inloggningen igen
        echo("<script>location.reload()</script>");
    }
}





// Börja skriva ut sidan
// Börjar med en utloggningsknapp, i html
?>
<form action="eventadmin.php" method="POST">
    <input type="text" value="logout" name="action" style="display: none;">
    <input type="submit" value="Logga ut">
</form>
<?php
// Fortsätter med kontoförfrågningar
echo("<h3>Förfrågningar om konto</h3>");
$sql = "SELECT * FROM requests";
$stmt = $dbh->prepare($sql);
$stmt->execute();

echo("<ul>");
while($data = $stmt->fetch()){
    //Skapa en rad som ska visa namn och användarnamn, även en knapp för att acceptera förfrågan
    echo("<li><p><form action='eventadmin.php' method='POST'>");
    echo("<input type='text' name='action' value='acceptRequest' style='display: none;'>");
    echo("{$data['name']} som {$data['username']} <input value='Acceptera' type='submit'>");
    echo("<input type='text' name='requestID' value='{$data['requestID']}' style='display: none;'>");
    // Och en knapp för att neka
    echo("<form action='eventadmin.php' method='POST'>");
    echo("<input type='text' name='action' value='denyRequest' style='display: none;'>");
    echo("<input type='text' name='requestID' value='{$data['requestID']}' style='display: none;'>");
    echo("<input value='Neka' type='submit'></form></p></li>");
}
echo("</ul>");


// Sedan evenemang för att kunna radera dem
echo("<h3>Evenemang</h3>");
$sql = "SELECT * FROM events";
$stmt = $dbh->prepare($sql);
$stmt->execute();

echo("<ul>");
while($data = $stmt->fetch()){
    //Visa evenemangsnamn och datum, och en knapp för att radera det
    echo("<li><p><form action='eventadmin.php' method='POST'>");
    echo("<input type='text' name='action' value='removeEvent' style='display: none;'>");
    echo("<input type='text' name='eventID' value='{$data['eventID']}' style='display: none;'>");
    echo("{$data['eventname']} - {$data['date']}");
    echo("<input value='Radera evenemang' type='submit'></form><p></li>");
}
echo("</ul>");
?>
