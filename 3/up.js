z=6;
function qw(){
    x=document.defaultView.getComputedStyle(document.getElementById("a"+z),null).backgroundColor;
    for(i=z;i>1;i--){
        document.getElementById("a"+i).style.backgroundColor=document.defaultView.getComputedStyle(document.getElementById("a"+(i-1)),null).backgroundColor;
    }
    document.getElementById("a1").style.backgroundColor=x;
}
setInterval("qw()",3000);