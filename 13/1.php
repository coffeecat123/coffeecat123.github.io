<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html>
    <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
        <title>ck</title>
        <script src="../remove.js"></script>
        <style>
            body{
                -webkit-user-select:none;
                -moz-user-select:none;
                -o-user-select:none;
                user-select:none;
            }
        </style>
    </head>
    <body>
        <canvas id="a1" width="200" height="100" style="background-color: black;"></canvas><br>
        <span id="a2"></span><br>
        <span id="a3"></span><br>
        cps:<span id="a6"></span><br>
        <button id="a4">reset</button><br>
        <select id="a5">
            <option selected>1</option>
            <option>3</option>
        </select><br>
        <?php
            $file = fopen("1.txt", "r");
            echo "best cps:<span id=a7>".fgets($file)."</span>";
            fclose($file)
        ?>
        <script>
            var a1 = document.getElementById("a1");
            var a2 = document.getElementById("a2");
            var a3 = document.getElementById("a3");
            var a4 = document.getElementById("a4");
            var a5 = document.getElementById("a5");
            var a6 = document.getElementById("a6");
            var a7 = document.getElementById("a7");
            var ctx = a1.getContext("2d");
            var s=0;
            var q;
            var t;
            var g;
            a2.textContent=0;
            a3.textContent=0;
            a1.onmousedown=(e)=>{
                if(s==0){
                    g=[];
                    a2.textContent=0;
                    a3.textContent=0;
                    s=1;
                    t=Number(a5.value);
                    q=Date.now();
                    setTimeout(()=>{//結束
                        s=2;
                        a6.textContent=(a2.textContent/t).toFixed(2);
                        if(Number(a6.textContent)>Number(a7.textContent)){
                            window.open("https://c0ffeecat123.000webhostapp.com/13/2.php?a="+a6.textContent);
                            a7.textContent=a6.textContent;
                        }
                    },t*1000)
                }
                else if(s==1){
                    g.push((Date.now()-q));
                    ctx.beginPath();
                    for(let i=1;i<=10;i++){
                        ctx.arc(e.layerX,e.layerY, i, 0, 2 * Math.PI);
                        ctx.fillStyle ="rgba(255,255,0,0.1)";
                        ctx.fill();
                    }
                    a2.textContent++;
                }
            }
            a4.onclick=()=>{
                s=0;
                ctx.clearRect(0,0,200,100);
                a2.textContent=0;
                a3.textContent=0;
            }
            setInterval(()=>{
                if(s==1){
                    a3.textContent=(Date.now()-q)/1000;
                }
            },1);
        </script>
    </body>
</html>