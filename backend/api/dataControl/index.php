<?php

include '../../api_header.php';
include '../../service-checker.php';




    $data = array (
        "status" => "ok",
        "data" => [
            "service_name1" => "Motor",
            "service_name2" => "Car",
            "service_name3" => "Van X",
            "basic_succeeding" => 9,
            "basic_rate" => 30,
            "extra_succeeding"=>13,
            "extra_rate"=> 60,
            "version_app_android"=> "1.0.0",
            "version_app_ios"=> "1.0.0",
            "gate" => true,
            "map_box_api" => "pk.eyJ1IjoibWFyaWExMDIwMjQiLCJhIjoiY20yd29uN3gxMDljNTJqcHdreHBuaXJrbyJ9.t2UfftJcFzJNjyhBZL3bnw",
            "map_url" => "",
            "ads"=> false,
            "cache_version" => "1.0.0",
        ]
        );   
   

echo json_encode($data,JSON_PRETTY_PRINT);
die();










?>