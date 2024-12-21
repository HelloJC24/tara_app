<?php


class Config {
    public static function initialize() {
        $all_credentials = file_get_contents('../../source.json');
        $access = json_decode($all_credentials, true);

        define('FIREURL', $access['firebase_url']);
        define('FIRETOKEN', $access['firebase_token']);
    }
}

Config::initialize();

const URL = FIREURL;
const TOKEN = FIRETOKEN;












