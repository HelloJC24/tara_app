<?php

require __DIR__ . '../../lib/vendor/autoload.php';

use Kreait\Firebase\Factory;

$firebase = (new Factory)
    ->withServiceAccount(__DIR__ . '/serviceAccount.json');

// Initialize Firebase Authentication
$auth = $firebase->createAuth();

// Extract the Bearer token (UID) from the Authorization header
$headers = getallheaders();
$bearerToken = str_replace('Bearer ', '', $headers['Auth'] ?? '');

if($bearerToken == ''){
    http_response_code(401); // Unauthorized
    $response_as_error = array (
    "status" => "error",
    "error" => "Authorization invalid"
    );
    die(json_encode($response_as_error));
    }


try {
    // Verify if the UID exists in Firebase
    $userRecord = $auth->getUser($bearerToken);
    //access granted
    //echo "UID is valid. User email: " . $userRecord->email;
    //Records Log the email and UID access and activity
    //update USER Token
} catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
    http_response_code(401); // Unauthorized
    $response_as_error = array (
        "status" => "error",
        "error" => "Access denied and invalid"
        );
     die(json_encode($response_as_error));
}
