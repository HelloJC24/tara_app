<?php

// Authorization
// Use POST method only, try to use Postman
//Usage: <https://api.example.com/visible/?mode=offline&lat=0.000&lng=1.00000&rid=000000>


header('Content-Type: application/json');


include '../master.php';
const PATH_MOTOR = '/TARAMOTOR/online';
const PATH_CAR = '/TARACAR/online';
const PATH_VAN = '/TARAVAN/online';
require '../../../lib/vendor/autoload.php';
use Firebase\FirebaseLib;



$firebase = new FirebaseLib(URL, TOKEN);


if(isset($_POST['rid'])){

//validate if one of them are empty
$vehicle;
$action =  $_POST['mode'];
$riderId =  $_POST['rid'];
$latitude = $_POST['lat'];
$longitude = $_POST['lng'];


$rcordata = [
    'lat' => $latitude,
    'lng' => $longitude,
    'id' => $riderId,
    'time'=> time()
];



//Fetch the rider info using API
//Get the load if allowed
//And use the vehicle value to <$vehicle>




//checking what type of vehicle
//Online rider
if($vehicle == 4){
    if($action == 'online'){
        $firebase->set(PATH_CAR . '/'.$riderId, $rcordata);
    }else{
        $firebase->delete(PATH_CAR . '/'.$riderId);
    }
   
}else if($vehicle == 5){
    if($action == 'online'){
    $firebase->set(PATH_VAN . '/'.$riderId, $rcordata);
    }else{
    $firebase->delete(PATH_VAN . '/'.$riderId);   
    }
}else{
    if($action == 'online'){
    $firebase->set(PATH_MOTOR . '/'.$riderId, $rcordata);
    }else{
    $firebase->delete(PATH_MOTOR . '/'.$riderId);    
    }
}


$response = array (
    "status" => "Processed",
    "rider" => $riderId,
    "msg" => "Rider status is now ".$action
);

}



echo json_encode($response);

?>