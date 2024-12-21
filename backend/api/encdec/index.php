<?php


header('Content-Type: application/json');


include "../../encdec.php";

//USAGE: <https:api.example.com/encdec/?encrypt=Hello World


$response = array (
    "status" => "error",
    "msg" => "Not supported usage"
);

if(isset($_GET['decrypt'])){
    $encryption = base64_decode($_GET['decrypt']);
    $base = openssl_decrypt($encryption, $ciphering, $EDkey, $options, $cryption_iv);
    $response = array (
        "status" => "ok",
        "type" => "Decryption",
        "value" => $base
    ); 
}


if(isset($_GET['encrypt'])){
$simple_string = rawurldecode($_GET['encrypt']);
$finalToken = openssl_encrypt($simple_string, $ciphering, $EDkey, $options, $cryption_iv); 
$finalToken =  base64_encode($finalToken); 
$response = array (
    "status" => "ok",
    "type" => "Encryption",
    "value" => str_replace("=","",$finalToken)
); 
}

echo json_encode($response);