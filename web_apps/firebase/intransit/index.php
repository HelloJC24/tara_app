<?php
//UNDER DEV
// Authorization
// Use POST method only, try to use Postman
//Usage: <https://api.example.com/intransit/?mode=offline&lat=0.000&lng=1.00000&rid=000000>
//Use this API to put the rider in a transaction mode, to be available in a drop point booking
// Search a rider which closest to the active drop

header('Content-Type: application/json');


const URL = '<FIREBASE_REALTIME_URL>';
const TOKEN = 'N2ZcPtAwvzjPQ3tvb0E1Z4lfDrwhn1RazL8tGHW3';
const TRANSIT_MOTOR = '/TARAMOTOR/transit';
const TRANSIT_CAR = '/TARACAR/transit';
const TRANSIT_VAN = '/TARAVAN/transit';
require '../../../lib/vendor/autoload.php';
use Firebase\FirebaseLib;



$firebase = new FirebaseLib(URL, TOKEN);


if(isset($_POST['rid'])){




//validate if one of them are empty
$vehicle = $_POST['vehicle'];
$latitude = $_POST['lat'];
$longitude = $_POST['lng'];


$rcordata = [
    'lat' => $latitude,
    'lng' => $longitude,
    'id' => $riderId,
    'time'=> time()
];


$vehicle = $_POST['vehicle'] || 2;

//checking what type of vehicle
if($vehicle == 4){
    $riders= $firebase->get(PATH_CAR . '/');
}else if($vehicle == 5){
    $riders= $firebase->get(PATH_VAN . '/');
}else{
    $riders= $firebase->get(PATH_MOTOR . '/');
}




//Fetch the rider info using API
//Get the load if allowed
//And use the vehicle value to <$vehicle>










}



echo json_encode($response);

?>