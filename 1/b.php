<?php
echo "<style>body{background-color:rgb(200,200,200);}</style>";
$file_path = "3.txt";
$str=file_get_contents($file_path);
fclose($file_path);
$qa=0;
if(preg_match("/{$_SERVER['REMOTE_ADDR']}/i",$str)){
    $qa=1;
}
//echo "IP: {$_SERVER['REMOTE_ADDR']}<br>";
echo "<h1>Your Name: <i style='color:blue;'>".$_GET['yname']."</i></h1>";
$file=fopen("1.txt","r");
$n=fgets($file);
fclose($file);
$file=fopen("2.txt","a");
fwrite($file,$n." ");
fwrite($file,$_SERVER['REMOTE_ADDR']." ");
fwrite($file,$_GET['yname']." ");
fwrite($file,$_GET['yng']."\n");
fclose($file);
//要建立的兩個檔案
$qwe= "123/".$_SERVER['REMOTE_ADDR'].".txt";
//以讀寫方式打寫指定檔案，如果檔案不存則建立
echo "這次提交的內容:".$_GET['yng']."<br>";
if( ($TxtRes=fopen ($qwe,"a")) === FALSE){
    exit();
}
if($qa==0){
    echo "您是第:<a style=';font-size:30px;color:yellow;'><i><b>";
    echo $n."</b></i></a>位提交者";
    $file=fopen("3.txt","a");
    fwrite($file,$n." ".$_SERVER['REMOTE_ADDR']."\n");
    fclose($file);
    $n++;
    $file=fopen("1.txt","w");
    fwrite($file,$n);
    fclose($file);
}
else{
    echo "<a style='font-size:50px;color:red;font-family:標楷體;'>您已來過</a><br>";
    echo "之前的提交內容:<br>";
    $i=1;
    foreach(file($qwe) as $line) {
       echo $i.":".$line."<br>";
       $i++;
    }
}
$StrConents = $_GET['yng']."\n";//要 寫進檔案的內容
if(!fwrite ($TxtRes,$StrConents)){ //將資訊寫入檔案
    fclose($TxtRes);
    exit();
}
fclose ($TxtRes); //關閉指標
?>