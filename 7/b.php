<?php
    $dir="./1/";
    $file=scandir($dir);
    array_splice($file,0,2);
    $de=$_POST['de'];
    $dl = explode(",", $de);
    foreach ($dl as $a){
        unlink($dir.$file[$a]);
    }
    header('Location: https://c0ffeecat123.000webhostapp.com/7/1.php');
    exit();
?>