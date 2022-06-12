<?php
    echo $_GET['a'];
    $file=fopen("1.txt","w");
    fwrite($file,$_GET['a']);
    fclose($file);
    echo  "<script type='text/javascript'>";
    echo "window.close();";
    echo "</script>";
?>