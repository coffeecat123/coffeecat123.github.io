// ==UserScript==
// @name         bilibili dark theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ^_^
// @author       coffeecat
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bilibili.com
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
div#app {
    background: #181818;
}
.n .n-inner,#page-index .col-1{
    background: #303030 !important;
    color: #eee;
}
.n .n-data .n-data-v{
    color: #ddd;
}
h3.section-title,.user-info .user-info-title .info-title[data-v-31d5659a],#page-index .col-2 .section .user-auth.no-auth .no-auth-title .goto-auth{
    color: #eee;
}
#page-index .col-2 .section{
    background: #303030;
}
#page-index .col-1 .section.empty:after,#page-index .channel .empty-state p,.sec-empty-hint{
    color: #aaa;
}
.section .more,.i-m-btn{
    color: #ccc !important;
}
textarea.be-textarea_inner,.list-create{
    background: #505050 !important;
    color: #eee !important;
}
.header-channel{
    box-shadow: 0 2px 4px rgb(255 255 255 / 8%);
}
div[style="background-color: rgb(244, 244, 244); color: rgb(117, 117, 117);"]{
    background: transparent !important;
    color: #0bb !important;
}
body,.main-container{
    background: var(--bg1);
}
.eplist_ep_list_wrapper__Sy5N8 {
    background: var(--bg3);
}
.RecommendItem_wrap__5sPoo .RecommendItem_right_wrap__DJpVw .RecommendItem_title__jBsvL,.numberListItem_title__LNXrS,.imageListItem_titleWrap__YTlLH{
    color: var(--text1);
}
.SectionSelector_SectionSelector__TZ_QZ .SectionSelector_expand__VjjPD {
    background: linear-gradient(270deg,var(--bg3) 46.21%,hsla(210,8%,95%,0));
}
body,.tag_2uAvO,.Bookswiper_3q1oK .gallery-thumbs_2oCbc .swiper-thumb-slide .gallery-thumbs-item_3mq8s .game-info_2X55m .game-info-name_1X85G,#page-article .row .breadcrumb .item,#page-video .page-head__left .video-title,.article-title,#page-index .col-2 .section .user-auth .auth-description,#page-series-index .channel-item .channel-name[data-v-493154f0],.breadcrumb .item.cur,.contribution-sidenav,#page-index .channel.guest .channel-item .channel-title .channel-name {
    color: #eee !important;
}
#page-dynamic .col-2 .section,.col-full,#page-video #submit-video-type-filter {
    background: #303030 !important;
}
.g-search input,.be-pager-options-elevator input{
    background: #303030;
    color: #eee;
}
div#list *,div#home *,.list-create .text{
    color: #eee;
}
.security-nav-name[data-v-1bd05db3],.security-list-link-jump[data-v-1bd05db3],.security-list .first-level{
    color: #eee !important;
}
.category-item_3tacB,.security-list[data-v-1bd05db3]:hover,.security-list .child-list li a:hover,.f-list-hover:hover{
    background: #888 !important;
}
.international-footer,.security_content,.bili-footer .footer-wrp{
    background-color: #303030;
}
.bili-footer a,.tab-btn-link,.international-footer a,.international-footer .link-box .link-item.link-c p {
    color: #ccc;
}
.security-right {
    background: #303030;
}
.face-g-list .mp-block .left .mp-info .mp-title,.face-g-list .mp-block .left .mp-info .mp-descr,.security-list .child-list li a,.face-nav>div a[data-v-1511d835],.pendant-list li .pendant-name[data-v-0eaf2be0],.points-exchange-title,.points-info p,.points-pendant-title p,.pendant-name,.points-how-title,.points-faq-info-list,.tabs-nav-item[data-v-370c78df],.h-safe-title[data-v-d5fa7afc],.h-reward-info[data-v-d5fa7afc],.h-reward-info[data-v-af447702],.re-exp-info[data-v-db995076],.home-dialy-task-title[data-v-db995076],.now-num[data-v-852cd7a8],.curren-b-num[data-v-389e9a45],.home-top-msg-name[data-v-389e9a45] {
    color: #eee !important;
}
.home-top-level-mask-warp[data-v-852cd7a8] {
    background: #888;
    color: #ddd;
}
.home-top-level-mask-warp a[data-v-852cd7a8] {
    color: #00f4ff;
}
.el-input__inner,.el-textarea__inner,.tool-uninstall-pendant[data-v-527be47a]{
    background: #888 !important;
    color: #eee !important;
}
.international-header .mini-type, .van-popover .mini-type {
    background: #181818;
}
.history-wrap .b-head .b-head-t,.mini-type .nav-user-center .user-con .item .name,.international-header .mini-type .nav-link .nav-link-ul .nav-link-item .link, .van-popover .mini-type .nav-link .nav-link-ul .nav-link-item .link {
    color: #eee;
}
.history-wrap {
    background: #303030;
    border: #eee 1px solid;
    border-radius: 4px;
}
.history-list .r-info{
    background: #555;
}
.history-list .r-info .title {
    color: #eee;
}
.b-head-search input {
    background: none;
    color: #eee;
}

</style>
`;
	let q = trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});
    document.querySelector("head").insertAdjacentHTML('beforeend',q.createHTML(a));
    document.querySelector(":root").style=`
    --text1: #eee;
    --text2: #eee;
    --text3: #a8a8a8;
    --v_text2: #bbb;
    --bg1: #181818;
    --bg2: #333;
    --bg3: #333;
    --line_regular: #888;
    --bg1_rgb: 24,24,24;
    --bg1_float: #181818;
    --bg2_float: #666;
    --v_graph_bg_regular: #555;
    --graph_bg_regular: #282828;
    --graph_bg_thin: #333;
    --graph_bg_thick: #888;
    --v_brand_blue_thin: #cce1e7;
`;
})();