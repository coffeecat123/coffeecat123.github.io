// ==UserScript==
// @name         google ad skip
// @namespace    ???
// @version      0.1
// @description  skip
// @author       coffeecat
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];

    setInterval(()=>{
        $$('iframe[title="3rd party ad content"]').forEach((f)=>{
            f.style.display='none';
        });
        $$('video[title="Advertisement"]').forEach((v) => {
            if (!v || !v.src || v.src === '')return;
            v.currentTime = v.duration;
        });
        $$('.videoAdUiSkipContainer.html5-stop-propagation button').forEach((b) => {
            b.click();
        });
    },100);
})();