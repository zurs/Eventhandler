<!DOCTYPE html>
<?php
require("variables.php");
session_start();
?>
<html>
<head>
    <meta charset="utf-8">
    <title>Eventhandler Adminpage</title>
    <?php
        // Kolla om inloggningen stämmer, isåfall sätt $_SESSION till att man är inloggad
        if(isset($_POST["username"])){
            if(($_POST["password"] == $adminPasswd) && ($_POST["username"] == $adminUsername)){
                $_SESSION["loggedIn"] = true;
            }
        }
    ?>
</head>
<body>
    <?php
    // Autentierar användaren genom $_SESSION och bestämmer vilken sida som ska visas
    if(isset($_SESSION["loggedIn"])){
        if($_SESSION["loggedIn"] == true){
            include("adminpage.php");
        }
    }
    else{
        include("loginform.html");
    }

    ?>
</body>
</html>
