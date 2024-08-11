// ==UserScript==
// @name         geogebra
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.geogebra.org/calculator*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geogebra.org
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    let a=`
<style>

body,img:not(.gwt-Image,.dropDownImg,.menuImg),.userMenuItemView img[role="presentation"]{
    filter: invert(1);
}
*{
    font-weight: bold !important;
}

</style>
`;
	let q = trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});
    document.querySelector("head").insertAdjacentHTML('beforeend',q.createHTML(a));
})();