// ==UserScript==
// @name         pixiv
// @namespace    ???
// @version      1.0
// @description  ^_^
// @author       coffeecat
// @match        https://www.pixiv.net/artworks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @noframes
// ==/UserScript==

javascript:(function() {
    'use strict';

    const $=x=>document.querySelector(x);
    const $$=x=>[...document.querySelectorAll(x)];
    
	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true })
	}
	function replaceImage() {
		let els = $$('div[role=presentation]>a');
        console.log("rpls");
		for (let a of els) {
			let image = a.querySelector('img');
			image.src = a.href;
			image.srcset = '';
		}
	}
	onDomChange(replaceImage);
})();