// ==UserScript==
// @name         ani gamer
// @namespace    ???
// @version      0.1
// @description  auto skip ad
// @author       coffeecat
// @match        https://*.safeframe.googlesyndication.com/safeframe/*/html/container.html
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://ani.gamer.com.tw
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];

    var cli=[".nativeAD-skip-button.enable:not(.vjs-hidden)",
             "#adult",
             '#adSkipButton.vast-skip-button.enable',
             '[data-ck-tag="skip"]'];
    setInterval(()=>{
        for(let j of cli){
            let q=$$(j);
            for(let i of q){
                i.click();
                console.log('click');
            }
        }
        if($$("#reward_close_button_widget").length>0){
            if(getComputedStyle($$("#count_down")[0]).visibility=='hidden'){
                $("#close_button_icon").click();
                console.log('click');
            }
        }
    },100);
})();