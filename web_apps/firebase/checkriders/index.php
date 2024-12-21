<?php

// Authorization
// Use POST method only, try to use Postman
//One API endpoint
//two ways usage
//1. To get if theres any available riders <https://api.example.com/checkriders/?vehicle=2>
//2. To get and return the nearby <https://api.example.com/checkriders/?nearby=true&lat=0.000&lng=1.00000&limit=8&transit=true>


header('Content-Type: application/json');


include '../../master.php';
const PATH_MOTOR = '/TARAMOTOR/online';
const PATH_CAR = '/TARACAR/online';
const PATH_VAN = '/TARAVAN/online';
require '../../../lib/vendor/autoload.php';
use Firebase\FirebaseLib;



$firebase = new FirebaseLib(URL, TOKEN);

$vehicle = $_POST['vehicle'] || 2;

//checking what type of vehicle
if($vehicle == 4){
    $riders= $firebase->get(PATH_CAR . '/');
}else if($vehicle == 5){
    $riders= $firebase->get(PATH_VAN . '/');
}else{
    $riders= $firebase->get(PATH_MOTOR . '/');
}


//validating request
if(empty($ridersdb)){
    $response = array (
        "status" => "failed",
        "msg" => "No rider available"
    );
}



// Using the second API endpoint
if(isset($_GET['nearby'])){

 //your pickup or starting point
$base_location = array(
    'lat' => $_GET['lng'],
    'lng' => $_GET['lat']
);
  
//get array values
$locations = array_values($ridersdb);
$distances = array();
$radius = 6 || $_GET['limit']; // Radius in kilometers limit to search



//process of getting nearby rider
foreach ($locations as $key => $location){
    $earth_radius = 6371; // Earth's radius in kilometers

    $delta_lat = deg2rad($base_location['lat'] - $location['lat']);
    $delta_lon = deg2rad($base_location['lng'] - $location['lng']);

    $a = sin($delta_lat / 2) * sin($delta_lat / 2) +
        cos(deg2rad($base_location['lat'])) * cos(deg2rad($location['lat'])) *
        sin($delta_lon / 2) * sin($delta_lon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $distance = $earth_radius * $c;

    if ($distance <= $radius) {
        $distances[$key] = $distance;
    }
}
    
asort($distances);
$closest = $locations[key($distances)];

if (empty($distances)) {
    $response = array (
        "status" => "failed",
        "msg" => "No rider available within reach"
    );
}else{
    $response = array (
        "status" => "ok",
        "msg" => "We found the rider within ".$radius."km.",
        "rider" => $closest
    );
}


}



echo json_encode($response);

?>