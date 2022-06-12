<html>
    <head>
        <script src="../remove.js"></script>
        <style>
            img{
                width: 100px;
            }
            .ww{
                display :none;
            }
        </style>
    </head>
    <body>
        <form action="a.php" method="post">
            <input type="text" name="ba" id="xa">
            <input type="file" name="fl" id="ed" accept="image/*" onchange="loadFile(event)" multiple>
            <input type="submit" id="pw" value="-" style="display:none;">
        </form>
        <form action="b.php" method="post" class="ww">
            <input type="text" name="de" id="zs" class="ww">
            <input type="submit" id="pw" value="delete" class="ww">
        </form>
        <div id="qwe" style="width: 50vw;left: 50vw;position: absolute;">
            所有圖片:<br>
            <?php
                $dir="./1/";
                $file=scandir($dir);
                array_splice($file,0,2);
                echo "<script>var a=".count($file)."</script>";
                //print_r($file);
                for($k=0;$k<count($file);$k++){ 
                    $file_path = $dir.$file[$k];
                    if(file_exists($file_path)){
                        $file_arr = file($file_path);
                        echo '<img src="'.$file_arr[0].'"> ';
                    }
                }
                $a=count($file);
            ?>
        </div>
        
        <button onclick="wq()">upload</button>
        <br>
        <div id="qwa" style="width: 50vw;"></div>
        <script>
            var xa=document.querySelector("#xa");
            var qwa=document.querySelector("#qwa");
            var pw=document.querySelector("#pw");
            var ww=document.querySelectorAll(".ww");
            function wq(){
                if(qwa.childElementCount>0){
                    pw.click();
                }
            }
            function loadFile(e) {
                xa.value="";
                var w=document.querySelectorAll("#qwa img");
                for(var k=0;k<w.length;k++){
                    w[k].remove();
                }
                console.log(e.target.files);
                var t=e.target.files;
                for(var i=0;i<t.length;i++){
                    ae(t[i]);
                }
            }
            function ae(file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    console.log('RESULT', reader.result);
                    xa.value+=reader.result.split(',')[1]+",";
                    var w=document.createElement("img");
                    w.src=reader.result;
                    qwa.append(w);
                }
                reader.readAsDataURL(file);
            }
            document.body.onkeydown=(k)=>{
                if(k.key=='b'){
                    for(var i=0;i<ww.length;i++){
                        ww[i].style.display="unset";
                    }
                }
            }
        </script>
    </body>
</html>