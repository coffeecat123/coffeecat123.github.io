// ==UserScript==
// @name         iQIYI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ^_^
// @author       coffeecat
// @match        https://www.iq.com/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iq.com
// @grant        none
// ==/UserScript==


javascript:(function() {
    'use strict';

    const $=x=>document.querySelector(x);
    const $$=x=>[...document.querySelectorAll(x)];
    function q(){
		let a=$$(`iqpdiv[data-player-hook="adcontainer"] video`);
        for(let i in a){
            a[i].currentTime=1000;
        }
        setTimeout(q,100);
    }
    q();
})();