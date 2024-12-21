<?php

require __DIR__ . '../../lib/vendor/autoload.php';

use Kreait\Firebase\Factory;

$firebase = (new Factory)
    ->withServiceAccount(__DIR__ . '/serviceAccount.json');

// Initialize Firebase Authentication
$auth = $firebase->createAuth();

// Extract the Bearer token (UID) from the Authorization header
$headers = getallheaders();
$bearerToken = str_replace('Bearer ', '', $headers['Authorization'] ?? '');

try {
    // Verify if the UID exists in Firebase
    $userRecord = $auth->getUser($bearerToken);
    //access granted
    //echo "UID is valid. User email: " . $userRecord->email;
    //Records Logs
} catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
    http_response_code(401); // Unauthorized
    echo "Access Denied ";
    die();
}
