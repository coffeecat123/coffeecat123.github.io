<html>
    <head>
        <meta charset="UTF-8">
        <title>時間</title>
        <style>
            body{
                cursor:url(https://cur.cursors-4u.net/cursors/cur-1/cur1.png) 7 3,auto;
            }
        </style>
        <script src="../remove.js"></script>
    </head>
    <body style="margin:0;user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;">
        <div style="width:100vw;height:100vh;z-index:10000000;background:linear-gradient(to right,red 20%,blue 100%);text-align:center;font-size:13vw;"><span id="qwe" style="background: -webkit-linear-gradient(bottom,#0f0  ,#ff0 60%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;"></span></div>
        <script language="JavaScript">
        
    var initTS=<?php echo strtotime(date('Y-m-d H:i:s')); ?>;
    var currentTS=initTS;
    var tmpTime = new Date();
    tmpTime.setTime(currentTS*1000);
    document.querySelector("#qwe").innerText=tmpTime.toString().split('(')[0];
    function displayServerTime(){
    	currentTS++;
    	tmpTime.setTime(currentTS*1000);
    	document.querySelector("#qwe").innerText=tmpTime.toString().split('(')[0];
    }
    setInterval("displayServerTime()",1000);
        </script>
    </body>
</html>