// ==UserScript==
// @name         a
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       coffeecat
// @match        http*://*/*
// @icon         https://avatars.githubusercontent.com/u/89003006?v=4
// @grant        none
// ==/UserScript==

var q=setInterval(()=>{
    console.log('a');
    var a=document.getElementsByTagName("img");
    if(a.length>1)clearInterval(q);
    if(a.length==1){
        var qa;
        qa=document.createElement("a");
        qa.href=a[0].src;
        qa.download="";
        qa.style="display:none;";
        document.body.append(qa);
        qa.click();
        qa.remove();
        close();
    }
},1000);