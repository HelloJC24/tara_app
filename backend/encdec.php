<?php

class Config {
    public static function initialize() {
        $all_credentials = file_get_contents('../source.json');
        $access = json_decode($all_credentials, true);

        define('EIV', $access['encryption_iv']);
        define('EKEY', $access['encryption_key']);
    }
}

Config::initialize();
$ciphering = "AES-128-CTR";
$cryption_iv = EIV; 
$EDkey = EKEY;
$options = 0;



?>