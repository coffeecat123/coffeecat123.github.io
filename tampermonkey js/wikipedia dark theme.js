// ==UserScript==
// @name         wikipedia dark theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.wikipedia.org/*
// @match        https://*.m.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
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
body{
    background: #242424 !important;
}
#mw-page-base,.mw-body,.parsoid-body,.vector-menu-tabs-legacy .selected{
    background: #242424;
    color:#eee;
}
h1, h2, h3, h4, h5, h6,.vector-menu-tabs-legacy .selected a, .vector-menu-tabs-legacy .selected a:visited{
    color:#eee;
}
#mw-head li{
    background-image: linear-gradient(to top,#77c1f6 0,#28292a 1px,#000000 100%);
}
.mwe-math-element {
    filter: invert(1);
}
.toc {
    background: #303030;
}
span.tocnumber {
    color: #ccc;
}
a{
    color:#4be1fe;
}
.vector-menu-tabs-legacy li a{
    color:#346fff;
}
#p-logo,#sliderCollapseLogo{
    filter: invert(1);
}
#mw-panel .vector-menu-content-list>li>a{
    color:#67c0ff;
}
button.mw-interlanguage-selector.mw-ui-button {
    filter: invert(1);
}
table,#catlinks{
    background:#303030 !important;
}
table.vertical-navbox.nowraplinks.plainlist img{
    filter:invert(1);
}
.tipsy-inner{
    background:#505050;
    color:#eee;
}
.mwe-popups-container{
    background:#505050 !important;
}
.mwe-popups-extract>p{
    color:#ddd;
}
.mwe-popups .mwe-popups-extract[dir='ltr']:after{
    background-image: linear-gradient(to right,rgba(255,255,255,0),#505050 50%) !important;
}
.toctogglelabel{
    color:#008fff;
}
.ilh-page a.new{
    color:#00d300;
}
a.new{
    color:#f00;
}
.rt-tooltip,.rt-tooltipTail,.rt-tooltipTail:after{
    background:#505050;
    color:#ddd;
}
.mw-parser-output a.extiw, .mw-parser-output a.external{
    color:#ffdb07
}
td {
    color: #ff4d4d;
}
.vector-user-menu-legacy #pt-anonuserpage, .vector-user-menu-legacy #pt-tmpuserpage{
    color:#eee;
}
input:not(.overlay-title.search-header-view input):not(.search.mw-ui-background-icon-search.skin-minerva-search-trigger) {
    color: #eee;
    background: #303030;
}
.cdx-button:enabled, .cdx-button.cdx-button--fake-button--enabled {
    background: #666;
}
.vector-icon.mw-ui-icon-wikimedia-menu,.vector-icon.mw-ui-icon-wikimedia-search,.vector-icon.mw-ui-icon-wikimedia-listBullet{
    filter: invert(0.9);
}
.navbox th, .navbox-title{
    background: #9191b4;
    color: #71edc0;
}
.mw-footer li{
    color:#eee;
}
div#content {
    background: #181818;
}
img.mwe-popups-thumbnail{
    outline: 1px solid rgba(255,255,255,0.1) !important;
}
.vector-menu-portal .vector-menu-heading{
    background-image: linear-gradient(to right,rgba(100,100,100,0) 0,rgb(100,100,100) 33%,rgb(100,100,100) 66%,rgba(100,100,100,0) 100%);
    color: #ddd;
}
.vector-menu-dropdown .vector-menu-heading{
    color:#ccc;
}
#p-personal .vector-menu-content li:not([id=pt-anonuserpage]){
    background-image: none;
}
.vertical-navbox.nowraplinks th{
    background: #8484bc;
    color:#4c4c4c;
}
.thumbinner {
    background-color: #303030 !important;
}
.mw-mmv-post-image,.mw-mmv-image-metadata {
    background: #181818;
    border-top: 1px solid #757575;
    color: #eee;
}
.mw-mmv-image-desc,.mw-mmv-credit{
    color:#ccc;
}
div#content p:not(table p), div#content li:not(table li){
    color: #eee !important;
}
.navbox-even {
    background:#404040 !important;
    border: 0.01px #525252 solid;
}
header.header-container.header-chrome {
    background-color: #181818;
}
.branding-box img {
    filter: invert(1);
}
.overlay-header-container.header-container.header-chrome.position-fixed {
    background: #303030;
}
input.search.mw-ui-background-icon-search {
    background-color: #181818;
    color:#eee;
}
.overlay-content {
    background: #181818;
}
ul#page-actions * {
    color: #eee !important;
}
.thumbcaption {
    color: #eee !important;
}
footer.mw-footer.minerva-footer {
    background: #181818;
}
.last-modified-text-accent{
    color:#eee !important;
}
.minerva-footer-logo img{
    filter:invert(1);
}
li.ext-related-articles-card {
    background: #303030 !important;
}
.ext-related-articles-card-detail * {
    color: #ddd !important;
}
.ext-related-articles-card-list h3:after{
    background-image: linear-gradient(to right,rgba(255,255,255,0),#303030 50%) !important;
}
.hatnote, .dablink, .rellink {
    color: #aaa;
    background-color: #181818;
}
div#mw-mf-page-left {
    background-color: #242424;
}
#mw-mf-page-left ul li a:not(.hlist a) {
    color: #eee;
    background: #181818;
}
#mw-mf-page-left ul li {
    border-top: 1px solid #767676;
}
.mw-ui-icon:before{
    filter: invert(1);
}
a:visited {
    color: #6f00ff;
}
img:not(.mwe-math-element img,.mbox-image img):not(.noprint){
    background: #fff;
}
div#mp-2012-column-right-block-a,div#mp-2012-column-right-block-b{
    background: #303030 !important;
}
.mw-parser-output #mp-2012-column-right h2, .mw-parser-output #mp-2012-column-right h2 a{
    color:#aaa;
}
.mw-parser-output #column-feature-more .column-feature-more-header a{
    color:#999;
}
div#mp-2012-banner {
    background: #303030 !important;
}
.mw-parser-output #mp-2012-banner-intro .number-of-articles a {
    color: #468aff !important;
}
.wikitable th {
    background: #a3a3a3 !important;
}
.wikitable{
    color:#eee;
}
.mw-collapsible.mw-collapsed.mw-made-collapsible th {
    background: #303030 !important;
}
.mw-parser-output .navbox, .mw-parser-output .navbox-subgroup {
    background-color: #505050;
}
.filehistory a img, #file img:hover {
    background: #fff;
}
.cbnnr-main {
    background-color: #303030 !important;
}
.cbnnr-main span{
    color: #eee;
}
.cbnnr-icon,.cbnnr-icon img{
    background:transparent !important;
}
#filetoc {
    background-color: #8d8d8d;
}
.licensetpl_wrapper {
    background-color: #202020 !important;
}
.mw-parser-output .responsive-license-cc {
    background-color: #303030 !important;
}
.mw-ui-button{
    background-color: #303030;
    color:#eee;
}
.mw-ui-button:hover{
    background-color: #ccc !important;
}
.mw-indicators img {
    background: transparent;
}
.unsolved {
    background: #303030 !important;
}
.mw-parser-output #mp-bottom .mp-h2 {
    background-color: #303030 !important;
}
th {
    color: #686868;
}
.navbox-odd {
    background: transparent !important;
    border: 0.01px #525252 solid;
}
.navbox-abovebelow, th.navbox-group, .navbox-subgroup .navbox-title {
    background-color:#7c7ca6;
}
.mw-highlight.mw-content-ltr {
    /*filter: invert(1);*/
    border: 1px solid #888;
    color: #222;
}
pre, code, .mw-code {
    background-color: #aaa !important;
    color: #eee !important;
}
.vector-feature-zebra-design-disabled .vector-header-container {
    background-color: #242424;
}
.vector-feature-zebra-design-disabled .mw-page-container {
    background-color: #242424;
}
img.mw-logo-icon,img.mw-logo-wordmark,img.mw-logo-tagline{
    filter: invert(1);
    background: #dbdbdb !important;
}
div#vector-toc {
    background: #505050;
    color: #eee;
}
div#vector-toc .vector-toc-text {
    color: #81bbff;
}
button.vector-pinnable-header-toggle-button.vector-pinnable-header-unpin-button {
    color: #7889ff;
}
.vector-feature-zebra-design-disabled #vector-toc-pinned-container .vector-toc::after {
    background: linear-gradient(rgba(255,255,255,0),#242424);
}
.vector-feature-zebra-design-disabled .vector-dropdown .vector-dropdown-content {
    background: #505050;
}
.vector-feature-zebra-design-disabled .vector-dropdown .mw-list-item a:not(.mw-selflink) {
    color: #72adf5;
}
.vector-feature-zebra-design-disabled .vector-pinnable-header-label {
    color: #eee;
}
.vector-feature-zebra-design-disabled .vector-pinnable-element .vector-menu-heading, .vector-feature-zebra-design-disabled .vector-dropdown-content .vector-menu-heading {
    color: #eee;
}
.mw-parser-output>div {
    background: #242424 !important;
}
figure[typeof~='mw:File/Thumb'] > figcaption, figure[typeof~='mw:File/Frame'] > figcaption {
    background-color: #585858;
}
.vector-feature-zebra-design-enabled .vector-sticky-pinned-container::after,.vector-feature-zebra-design-disabled .vector-sticky-pinned-container::after {
    background: #242424;
}
.vector-feature-zebra-design-enabled .vector-header-container .mw-header, .vector-feature-zebra-design-enabled .vector-header-container .vector-sticky-header,.vector-feature-zebra-design-enabled .mw-page-container {
    background: #242424;
}
.mw-page-container {
    background: #242424;
}
.vector-header-container .mw-header, .vector-header-container .vector-sticky-header {
    background: #242424;
}
.vector-sticky-pinned-container::after {
    background: linear-gradient(rgba(255,255,255,0),#242424);
}
.vector-menu-tabs .mw-list-item.selected a, .vector-menu-tabs .mw-list-item.selected a:visited {
    color: #eee;
}
.cdx-button:enabled, .cdx-button.cdx-button--fake-button--enabled {
    color: #aaa;
}

</style>
`;
	let q = trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});
    document.querySelector("head").insertAdjacentHTML('beforeend',q.createHTML(a));
    document.querySelector(":root").style=`
    background: #242424;
    --color-emphasized: #eee;
`;
})();