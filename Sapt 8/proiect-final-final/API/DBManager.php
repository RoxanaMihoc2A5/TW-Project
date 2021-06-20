<?php
    $CONFIG = [
        'servername' => "localhost",
        'username' => "root",
        'password' => '',
        'db' => 'ChatDB'
    ];
    $conn = new mysqli($CONFIG["servername"], $CONFIG["username"], $CONFIG["password"], $CONFIG["db"]);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    function userExists($user) {
        global $conn;
        $queryStmt =  $conn -> prepare('
            SELECT * FROM users
            WHERE value = ?;
        ');
        $queryStmt -> bind_param('s', $user);

        $queryStmt -> execute();
        $result = $queryStmt -> get_result();
        $queryStmt -> close();

        if($result->num_rows == 1) return true;
        return false;
     }

     function userIsAdmin($user) {
        global $conn;
        $queryStmt =  $conn -> prepare('
            SELECT * FROM users
            WHERE value = ? and isAdmin = TRUE;
        ');
        $queryStmt -> bind_param('s', $user);

        $queryStmt -> execute();
        $result = $queryStmt -> get_result();
        $queryStmt -> close();

        if($result->num_rows == 1) return true;
        return false;
     }

     function saveUser($username, $password, $profilePicture) {
        global $conn;
        $queryStmt =  $conn -> prepare('
            INSERT INTO users (username, password, isAdmin, profilePicture)
            VALUES(?, ?, FALSE, ?);
        ');
        //TODO... criptarea parolei
        $queryStmt -> bind_param('sss', $username, $password, $profilePicture);

        $queryStmt -> execute();
        $queryStmt -> close();
     }

     function saveKey($key) {
        global $conn;
        $queryStmt =  $conn -> prepare('
            INSERT INTO api_keys
            VALUES(?, 5);
        ');
        $queryStmt -> bind_param('s', $key);

        $queryStmt -> execute();
        $queryStmt -> close();
     }

     function keyExists($key) {
        global $conn;
        $queryStmt =  $conn -> prepare('
            SELECT * FROM api_keys
            WHERE value = ?;
        ');
        $queryStmt -> bind_param('s', $key);

        $queryStmt -> execute();
        $result = $queryStmt -> get_result();
        $queryStmt -> close();

        if($result->num_rows == 1) return true;
        return false;
     }



?>