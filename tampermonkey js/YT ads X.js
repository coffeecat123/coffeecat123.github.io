// ==UserScript==
// @name         YT ads X
// @namespace    ???
// @version      1.0
// @description  no ads
// @author       coffeecat
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let a=location.href;
    start();
    setInterval(()=>{
        if(a!=location.href){
            a=location.href;
            setTimeout(start(),1000);
        }
    },1000);
    function start(){
        console.log("YT ads X");
        //---------https://www.youtube.com/watch?v=-----------
        if(location.href.indexOf("watch?v=")!=-1){
            setInterval(function q(){
                if(location.href.indexOf("watch?v=")==-1){
                    clearInterval(q);
                    return;
                }
                var cls=[".ytp-ad-overlay-slot"
                         ,".ytd-ad-slot-renderer"
                         ,".ytp-ad-preview-slot"
                         ,"#secondary.style-scope.ytd-watch-flexy ytd-promoted-sparkles-web-renderer"
                         ,".style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement"
                         ,".style-scope ytd-companion-slot-renderer"
                         ,".ytp-ad-text.ytp-ad-message-text"
                         ,"#panal.style-scope ytd-watch-flexy"
                         ,"div#contents>ytd-promoted-sparkles-web-renderer.style-scope.ytd-item-section-renderer.sparkles-light-cta"];
                for(let j=0;j<cls.length;j++){
                    var q=document.querySelectorAll(cls[j]);
                    for(let i=0;i<q.length;i++){
                        console.log("hide");
                        q[i].remove();
                    }
                }
                if(document.querySelectorAll(".video-ads.ytp-ad-module").length>0){
                    if(document.querySelector(".video-ads.ytp-ad-module").innerHTML!=''){
                        console.log("hide");
                        if(document.querySelectorAll(".ytp-ad-skip-button.ytp-button").length>0){
                            document.querySelectorAll(".ytp-ad-skip-button.ytp-button")[0].click();
                        }
                        if(document.querySelectorAll(".video-ads.ytp-ad-module .ytp-ad-duration-remaining").length>0){
                            let e=document.querySelectorAll("video");
                            for(let i=0;i<e.length;i++){
                                if(e[i].src!=''){
                                    e[i].currentTime=e[i].duration;
                                }
                            }
                        }
                        document.querySelector(".video-ads.ytp-ad-module").style.display='none';
                    }
                }
                //"div#panels"
                let a=document.querySelectorAll("#visibility-button");
                for(let i=0;i<a.length;i++){
                    try{
                        let b=a[i].parentElement.parentElement.parentElement.parentElement.parentElement;
                        if(b.id=="panels"&&a[i].className!="style-scope ytd-engagement-panel-title-header-renderer"){
                            b.remove();
                        }
                    }catch(e){void(0);}
                }
                a=document.querySelectorAll(".style-scope.ytd-ad-hover-text-button-renderer");
                for(let i in a){
                    try{
                        let b=a[i].parentElement.parentElement.parentElement.parentElement.parentElement;
                        if(a[i].offsetHeight>0){
                            b.remove();
                        }
                    }catch(e){void(0);}
                }
            },1);
        }
        //------------https://www.youtube.com/-------------
        else if(location.href=="https://www.youtube.com/"){
            var i,t;
            //廣告
            //document.querySelector("input#search").value="";
            setInterval(function q(){
                if(location.href!="https://www.youtube.com/"){
                    clearInterval(q);
                    return;
                }
                var q=document.querySelectorAll("ytd-display-ad-renderer");
                for(i=0;i<q.length;i++){
                    q[i].offsetParent.remove();
                    console.log("hide1");
                }
                var qa=document.getElementById("masthead-ad");
                if(qa!=null){
                    qa.remove();
                    console.log("hide2");
                }
                var qb=document.querySelectorAll("ytd-rich-item-renderer");
                for(i=0;i<qb.length;i++){
                    if(qb[i].innerHTML.includes('id="call-to-action"')){
                        qb[i].remove();
                        console.log("hide3");
                    }
                }
            },1);
        }
    };
})();