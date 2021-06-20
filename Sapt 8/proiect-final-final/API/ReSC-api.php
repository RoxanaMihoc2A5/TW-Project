<?php

require_once "./DBManager.php";
// As starting code here are the methods you'll
// need to use to read


// Request URI & Method 👇
$requestUri = $_SERVER["REQUEST_URI"];
$requestMethod = $_SERVER["REQUEST_METHOD"];

// Reading Headers
$allHeaders = getallheaders();

// Reading body payload
$payloadString = file_get_contents("php://input");

$resp = "";


if ($requestUri === "/public_api/key") {
  if ($requestMethod === "GET") {
    $key = uniqid();
    saveKey($key);
    $resp = [
      "status" => 200,
      "key" => $key
    ];
  } else {
    $resp = [
      "status" => 405,
      "message" => "Method not allowed; Only GET is allowed"
    ];
  }
} else {
  // /got_api/season/${season_no}/episode/${episod_no}

  $regex = "/\/public_api\/users/";



  if (preg_match($regex, $requestUri) == 1) {

    if (!isset($allHeaders["Authorization"])) {
      $resp = [
        "status" => 401,
        "message" => "Missing authorization header!"
      ];
    } else {
      
      $regexBearer = "/Bearer ([a-zA-Z0-9]+)/";
      
      if(preg_match($regexBearer, $allHeaders["Authorization"], $matchesBearer) == 1) {  

        $authKey = $matchesBearer[1];

        if(keyExists($authKey)) {
         
    
          switch ($requestMethod) {
            case 'POST': {
                if (!$payloadString) {
                  $resp = [
                    "status" => 400,
                    "message" => "Bad request! Requires a payload!"
                  ];
                } else {
                  $payloadJSON  = json_decode($payloadString);
                  if (!isset($payloadJSON->username) || !isset($payloadJSON->password) || !isset($payloadJSON->profilePicture)) {
                    $resp = [
                      "status" => 400,
                      "message" => "Bad request! Incorect payload syntax !"
                    ];
                  } else {
                      //TODO.. verificarea existentei userului
                    saveUser($payloadJSON->username, $payloadJSON->password, $payloadJSON->profilePicture);
                    $resp = [
                      "status" => 200
                    ];
                  }
                }
              }
              break;
            case 'GET': {

              }
              break;
            default: {
                $resp = [
                  "status" => 405,
                  "message" => "Method not supported!"
                ];
              }
              break;
          }
        } else {
          $resp = [
            "status" => 401,
            "message" => "Key does not exists!"
          ];
        }


        
      }
      else {
        $resp = [
          "status" => 401,
          "message" => "Doesn't respect format!"
        ];
      }

    }
  } else {
    $resp = [
      "status" => 404,
      "message" => "Endpoint not found :("
    ];
  }
}

// Sending Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

header("Content-Type: application/json");

// Responding with a specific status code
http_response_code($resp["status"]);

// Responding with a specific payload
// $resp = [
//     "status" => 401,
//     "reason" => "You're not authenticated!"
// ];
echo json_encode($resp);
