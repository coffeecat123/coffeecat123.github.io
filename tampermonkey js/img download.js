// ==UserScript==
// @name         img download
// @namespace    http://your.homepage/
// @version      1.0
// @description  test.
// @author       coffeecat
// @match        http*://*/*
// @icon         https://avatars.githubusercontent.com/u/89003006?v=4
// @grant        GM_registerMenuCommand
// @run-at       context-menu
// ==/UserScript==
GM_registerMenuCommand ("a", start);
function start(){
    var p=document.createElement("button");
    var t=document.getElementsByTagName("img");
    var qw=0;
    p.textContent="下載";
    p.style="position:fixed;z-index:10000000;top:0%;right:0%;";
    p.onmouseover=()=>{
        p.title=String(qw)+'/'+String(t.length);
    }
    p.onclick=()=>{
        var i=qw;
        qw+=10;
        if(t.length==0){
            alert("none");
            qw-=10;
        }
        else if(qw>=t.length+10){
            alert("Done!");
            qw=t.length;
        }
        else if(qw>=t.length){
            alert("qait!"+String(qw-9)+"~"+t.length+"/"+t.length);
        }
        else{
            alert("qait!"+String(qw-9)+"~"+qw+"/"+t.length);
        }
        for(;i<t.length && i<qw;i++){
            var qa;
            qa=document.createElement("a");
            qa.href=t[i].src;
            qa.download="";
            qa.target="_blank";
            qa.style="display:none;";
            document.body.append(qa);
            qa.click();
            qa.remove();
        }
    }
    document.body.appendChild(p);
}