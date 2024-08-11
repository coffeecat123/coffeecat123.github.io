// ==UserScript==
// @name         instagram
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ^_^
// @author       coffeecat
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let a=`
<style>

::-webkit-scrollbar-corner {
    background:#181818;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #303030;
}
::-webkit-scrollbar-thumb:hover {
    background: #6c6c6c;
}
::-webkit-scrollbar-thumb {
    background-color: #a1a1a1;
    border-radius: 10px;
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-resizer {
    background: #828282;
    outline: 2px solid #b6b6b6;
}

</style>
`;
	let q = trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});
    document.querySelector("head").insertAdjacentHTML('beforeend',q.createHTML(a));

})();