<?php 

class Config {
    public static function initialize() {
        $all_credentials = file_get_contents('../source.json');
        $access = json_decode($all_credentials, true);

        define('SERVER', $access['server']);
        define('NAME', $access['name']);
        define('PASSWORD', $access['password']);
        define('DATABASE', $access['default_database']);
    }
}

Config::initialize();


$servername = SERVER;
$username = NAME;
$password = PASSWORD;
$dbname = DATABASE;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

?>