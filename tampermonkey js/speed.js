// ==UserScript==
// @name         speed
// @namespace    ???
// @version      1.0
// @description  video
// @author       coffeecat
// @match        http*://*/*
// @icon         https://avatars.githubusercontent.com/u/89003006?v=4
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("sppeeed");
    setInterval(()=>{
        start();
    },100);
    function start(){
        let s=document.querySelectorAll("video");
        for(let i=0;i<s.length;i++){
            qew(s[i]);
        };
        function qew(d){
            if(d.nextElementSibling!=null){
                if(d.nextElementSibling.className=="cft_speed"){
                    return;
                }
            }
            var a=document.createElement("cft");
            a.className="cft_speed";
            a.style=`
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            opacity: 50%;
            font-size: 10px;
            color: red;
            display: inline-block;
            top: 0;
            left: 0;
            position: absolute;
            z-index: 1000000;
            `;
            wsa(d.playbackRate);
            //d.parentElement.append(a);
            insertAfter(a,d);
            wrta();
            var x=1,last_playback,last_plrt;
            a.onclick=(e)=>{
                e.stopPropagation();
                if(e.detail==1)last_playback=d.playbackRate;
                wsa(1);
            }
            a.ondblclick=(e)=>{
                e.stopPropagation();
                wsa(last_playback);
                setTimeout(()=>{
                    let q=prompt("video speed(1) or time(2)");
                    if(q!=null){
                        if(q=="1"){
                            let y=prompt("video speed (0.0625<=x<=16)");
                            if(y!=null){
                                if(!isNaN(Number(y))){
                                    wsa(Number(y));
                                }
                            }
                        }
                        else if(q=="2"){
                            let y=prompt(`video time (now:${d.currentTime} ,0~${d.duration})`);
                            if(y!=null){
                                if(!isNaN(Number(y))){
                                    d.currentTime=Number(y);
                                }
                            }
                        }
                    }
                },100);
            }
            a.onmouseover=()=>{
                a.style.opacity="100%";
                a.style.background="rgb(0 255 255)";
            }
            a.onmouseleave=()=>{
                a.style.opacity="50%";
                a.style.background="";
            }
            window.addEventListener("keydown",(k)=>{
                if(k.target.matches("input")) return;
                if(k.key=='q'){
                    wsa(d.playbackRate-1);
                }
                if(k.key=='w'){
                    wsa(d.playbackRate-0.1);
                }
                if(k.key=='e'){
                    wsa(d.playbackRate+0.1);
                }
                if(k.key=='r'){
                    wsa(d.playbackRate+1);
                }
                if(k.key=='h'){
                    if(x)a.style.display="none";
                    else a.style.display="inline-block";
                    x^=1;
                }
            });
            d.onratechange=()=>{
                console.log("change");
                wrta();
            };
            var cUrl=d.src;
            d.onloadedmetadata=()=>{
                if(d.src!=cUrl){
                    cUrl=d.src;
                    d.playbackRate=last_plrt;
                    wrta();
                }
            };
            function wrta(){//write a
                a.textContent="speed: "+d.playbackRate;
            }
            function wsa(sp){
                var qp=sp.toFixed(4);
                if(qp>=0.0625&&qp<=16){
                    d.playbackRate=qp;
                    last_plrt=d.playbackRate;
                }
                wrta();
            }
        }
    }
    function insertAfter(newElement,targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }
})();