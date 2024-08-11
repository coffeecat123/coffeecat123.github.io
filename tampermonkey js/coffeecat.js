// ==UserScript==
// @name         coffeecat
// @namespace    ???
// @version      1.0
// @description  ^_^
// @author       coffeecat
// @match        http*://*/*
// @icon         https://avatars.githubusercontent.com/u/89003006?v=4
// @grant        none
// @noframes
// ==/UserScript==

javascript:(function() {
    'use strict';

    if(document.querySelectorAll(".coffeecat").length>0)return;
    console.log("coffeecat");
    var _dv=[
        ["vol all >100%", (function() {let _clr = ["#fff", "#000c", "#00a2ff", "#f00"];if (document.querySelectorAll(".vlm_cft").length > 0) return;let _a = document.createElement("input"),_b = document.createElement("div"),_c = document.createElement("b"),_d = document.createElement("buttn");let _ab = 1;let _mda = 0;let _qa = [`<svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"><svg viewBox="-15 -15 330 330"><path fill="${_clr[0]}"d="m78.90065,233.69882l83.51689,-83.51643l-83.51689,-83.51703l47.73413,-47.72898l131.26115,131.24601l-131.26115,131.28673"></path></svg></svg>`, `<svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"><svg viewBox="-15 -15 330 330"><path fill="${_clr[0]}"d="m225.55086,67.20994l-84.74785,84.74276l84.74785,84.74268l-48.43251,48.45847l-133.18028,-133.20114l133.18028,-133.21132"></path></svg></svg>`];_a.type = "range";_a.min = 0;_a.max = 1000;_a.step = 1;_a.width = 100;_b.className = "vlm_cft";_b.style = `background:${_clr[1]};flex-direction: row;align-items:center;user-select:none;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;display:flex;top:0;left:0;position:fixed;z-index:1000000;`;if (document.querySelectorAll("video,audio").length == 0) {alert("no video or audio");return;}_a.onmousedown = () => {_mda = 1;};_a.onmouseleave = () => {_mda = 0;};_a.value = 100;_c.innerText = _a.value + "%";setInterval(() => {let au = document.querySelectorAll("video,audio");for (let i = 0; i < au.length; i++) {slw(au[i]);}}, 100);function slw(audio) {if (audio.getAttribute("cft") == '1') return;audio.crossOrigin = "anonymous";audio.setAttribute("cft", "1");var audioCtx = new AudioContext();var source = audioCtx.createMediaElementSource(audio);var gainNode = audioCtx.createGain();gainNode.gain.value = _a.value / 100;source.connect(gainNode);gainNode.connect(audioCtx.destination);_a.addEventListener("mousemove", () => {if (_mda == 0) return;_wle();});_a.addEventListener("change", _wle);function _wle() {gainNode.gain.value = _a.value / 100;};}_a.addEventListener("mousemove", () => {if (_mda == 0) return;_wla();});_a.addEventListener("change", _wla);function _wla() {_c.innerText = _a.value + "%";};_a.style = `width:200px;`;_d.style = `background:${_clr[2]};cursor:pointer;height:20px;width:20px;text-align:center;`;_d.innerHTML = _qa[_ab];_d.onclick = () => {if (_ab) {_a.style.display = "none";_c.style.display = "none";} else {_a.style.display = "block";_c.style.display = "block";}_ab ^= 1;_d.innerHTML = _qa[_ab];};_c.style = `color:${_clr[3]};font-size: 13px !important;width:45px;text-align:center;`;_b.append(_a, _c, _d);document.body.append(_b);})
        ],
        ["vlm 0%~1000%", (function() {let _clr = ["#fff", "#000c", "#00a2ff", "#f00"];if (document.querySelectorAll(".vlm_cft").length > 0) return;let _a = document.createElement("input"),_b = document.createElement("div"),_c = document.createElement("b"),_d = document.createElement("buttn");let _ab = 1;let _mda=0;let _qa = [`<svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"><svg viewBox="-15 -15 330 330"><path fill="${_clr[0]}"d="m78.90065,233.69882l83.51689,-83.51643l-83.51689,-83.51703l47.73413,-47.72898l131.26115,131.24601l-131.26115,131.28673"></path></svg></svg>`, `<svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"><svg viewBox="-15 -15 330 330"><path fill="${_clr[0]}"d="m225.55086,67.20994l-84.74785,84.74276l84.74785,84.74268l-48.43251,48.45847l-133.18028,-133.20114l133.18028,-133.21132"></path></svg></svg>`];_a.type = "range";_a.min = 0;_a.max = 1000;_a.step = 1;_a.width = 100;_b.className = "vlm_cft";_b.style = `background:${_clr[1]};flex-direction: row;align-items:center;user-select:none;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;display:flex;top:0;left:0;position:fixed;z-index:1000000;`;let au = document.querySelectorAll("video");let audio = -1;if (au.length == 0) {alert("no video");return;}for (let i = 0; i < au.length; i++) {if (au[i].paused) continue;audio = au[i];break;}if (audio == -1) {alert("play video and try again");return;}audio.crossOrigin = "anonymous";var audioCtx = new AudioContext();var source = audioCtx.createMediaElementSource(audio);var gainNode = audioCtx.createGain();_a.value = 100;_c.innerText = _a.value + "%";gainNode.gain.value = 1;source.connect(gainNode);gainNode.connect(audioCtx.destination);_a.onmousedown =()=>{_mda=1;};_a.onmouseleave =()=>{_mda=0;};_a.onmousemove =()=>{if(_mda==0)return;_wle();};_a.onchange =_wle;function _wle(){gainNode.gain.value = _a.value / 100;_c.innerText = _a.value + "%";};_a.style = `width:200px;`;_d.style = `background:${_clr[2]};cursor:pointer;height:20px;width:20px;text-align:center;`;_d.innerHTML = _qa[_ab];_d.onclick = () => {if (_ab) {_a.style.display = "none";_c.style.display = "none";} else {_a.style.display = "block";_c.style.display = "block";}_ab ^= 1;_d.innerHTML = _qa[_ab];};_c.style = `color:${_clr[3]};font-size: 13px !important;width:45px;text-align:center;`;_b.append(_a, _c, _d);document.body.append(_b);})
        ],
        ["音量All",(function() {var eq = 100,wr = 5;if (document.querySelectorAll("#sxdctfygvbhi").length > 0) return;var a = document.createElement("div");a.id = "sxdctfygvbhi";a.style = `user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;color: red;display: inline-block;top: 0;left: 0;position: fixed;z-index: 1000000; `;document.body.append(a);setInterval(() => {let s = document.querySelectorAll("audio,video");a.textContent = "volume : " + eq + "%";for (let i = 0; i < s.length; i++) {s[i].volume = eq / 100;};}, 0);window.addEventListener("keydown", (k) => {if (k.key == "ArrowUp" || k.key == "ArrowRight") {wsa(eq + wr);}if (k.key == "ArrowDown" || k.key == "ArrowLeft") {wsa(eq - wr);}});function wsa(sp) {if (sp >= 0 && sp <= 100) {eq = sp;}}})
        ],
        ["alert",(function() {function aet(data) {let a = document.createElement("div"),b = document.createElement("div"),c = document.createElement("pre"),d = document.createElement("button"),e = document.createElement("div");a.style = `z-index: 10000000;justify-content: center;align-items: center;background: rgb(0 0 0 / 50%);position:fixed;top:0;left:0;display:flex;width:100vw;height:100vh;`;e.style = `justify-content: center;align-items: center;display:flex;`;b.style = `background: rgb(255 255 255);width:500px;height:300px;`;c.style = `border: 0.5px rgb(0 0 0 /5%) solid;overflow: auto;font-size: 20px;height: 180px;margin: 30px;`;d.style = `cursor: default;height: 35px;line-height: 10px;border: 1px #00000045 solid;font-size: 30px;`;c.innerText = data;d.innerText = 'OK!';d.onclick = () => {a.remove();};e.append(d);b.append(c, e);a.append(b);document.body.insertBefore(a, document.body.firstChild);}window.alert = aet;alert("example\n       by cft");})
        ],
        ["clr",(function() {var c = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge","color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity","initial", "inherit", "unset"];var b = "";for (let i = 0; i < c.length; i++) {b += `${i}:${c[i]}`;if (i < c.length - 1) b += "\n";}b = prompt(b);if (b == null) return;if (b == '') return;if (isNaN(Number(b))) return;if (b % 1 != 0) return;if (b < 0 || b >= c) return;document.querySelector("html").style.mixBlendMode=c[b];})
        ],
        ["font-family",(function(){var c=["標楷體","新細明體","微軟正黑體","Arial","Arial Black","Verdana","Tahoma","Trebuchet MS","Impact","Times New Roman","Didot","Georgia","American Typewriter","Andalé Mono","Courier","Lucida Console","Monaco","Bradley Hand","Brush Script MT","Luminari","Comic Sans MS"];var b="";for(let i=0;i<c.length;i++){b+=`${i}:${c[i]}`;if(i<c.length-1)b+="\n";}b=prompt(b);if(b==null)return;if(b=='')return;if(isNaN(Number(b)))return;if(b%1!=0)return;if(b<0||b>=c)return;var a=document.querySelectorAll("*");for(let i=0;i<a.length;i++){a[i].style["font-family"]=c[b];}})
        ],
        ["font-size",(function() { if (document.querySelectorAll(".eifcbdckfesrsve").length > 0) return; let dv = document.createElement("div"); let dq = 0; let q = setInterval(qw0, 1); let le = 1; dv.className = "eifcbdckfesrsve"; dv.style = "z-index: 1000000;pointer-events: none;position: fixed;display: none;background: rgb(111 167 220/80%);"; document.body.append(dv); document.addEventListener("mousedown", function qwe(e) { var b = prompt("font-size: ?px"); zas(dq, b); clearInterval(q); document.removeEventListener("mousedown", qwe); document.removeEventListener("mousemove", qw1); document.removeEventListener("mouseleave", qw2); window.removeEventListener("scroll", qw0); dv.remove(); }); document.addEventListener("mouseleave", qw2); document.addEventListener("mousemove", qw1); function qw0() { if (le) return; dv.style.display = "block"; dv.style.left = dq.getBoundingClientRect().left + document.body.scrollLeft + "px"; dv.style.top = dq.getBoundingClientRect().top + document.body.scrollTop + "px"; dv.style.width = dq.offsetWidth + "px"; dv.style.height = dq.offsetHeight + "px"; } function qw1(e) { let ev = e.target; le = 0; if (dq == ev) return; dq = ev; qw0(); } function qw2(e) { dv.style.display = "none"; dq = 0; le = 1; } function zas(a, b) { if (a.innerText == "") return; a.style.fontSize = b + "px"; if (a.childElementCount == 0) return; let c = a.children; for (let i = 0; i < c.length; i++) { zas(c[i], b); } } })
        ],
        ["180度旋轉",(function(){var e=document.querySelectorAll("video");for(let i=0;i<e.length;i++){if(!e[i].paused){if(e[i].style.transform=="rotate(180deg)"){e[i].style.transform+="rotate(0deg)";}else{e[i].style.transform+="rotate(180deg)";}}}})
        ],
        ["上下翻轉",(function(){var e=document.querySelectorAll("video");for(let i=0;i<e.length;i++){if(!e[i].paused){e[i].style.transform=="scaleY(-1)"?e[i].style.transform+="scaleY(1)":e[i].style.transform+="scaleY(-1)";}}})
        ],
        ["左右翻轉",(function(){var e=document.querySelectorAll("video");for(let i=0;i<e.length;i++){if(!e[i].paused){e[i].style.transform=="scaleX(-1)"?e[i].style.transform+="scaleX(1)":e[i].style.transform+="scaleX(-1)";}}})
        ],
        ["video截圖",(function() {let cv = document.createElement('canvas');let c = cv.getContext('2d');let w = document.querySelectorAll("video");var z = 0,x = 0;for (var i = 0; i < w.length; i++) {if (w[i].offsetWidth > z && w[i].style.display != "none") {z = w[i].offsetWidth;x = i;}}let vid = w[x];cv.width = vid.videoWidth;cv.height = vid.videoHeight;c.drawImage(vid, 0, 0);let a = document.body.appendChild(document.createElement('a'));a.href = cv.toDataURL();a.download = 'video截圖';a.click();a.remove();cv.remove();})
        ],
        ["full sc",(function() {let w = document.querySelectorAll("video");var z = 0,x = 0;for (var i = 0; i < w.length; i++) {if (w[i].offsetWidth > z && w[i].style.display != "none") {z = w[i].offsetWidth;x = i;}}var elem = w[x];if (elem.requestFullscreen) {elem.requestFullscreen();} else if (elem.msRequestFullscreen) {elem.msRequestFullscreen();} else if (elem.mozRequestFullScreen) {elem.mozRequestFullScreen();} else if (elem.webkitRequestFullscreen) {elem.webkitRequestFullscreen();}})
        ]];
    /*--------------------------------------------*/
    /*--------------------------------------------*/
    var _aa=document.createElement("div");
    var _ab=0;
    var _clr=document.createElement("input");
    var _clr2=document.createElement("input");
    _aa.append("background:",_clr,_clr2,document.createElement("br"));
    var _fm=document.createElement("iframe");
    _fm.width=500;
    _fm.height=100;
    _fm.setAttribute("allowfullscreen","");
    _fm.frameBorder='0';
    _fm.src='';
    var _yt=document.createElement("input");
    _yt.type="text";
    _yt.placeholder='YT video link';
    _yt.style='font-size: 15px !important;border: 1px black solid;';
    _yt.onchange=()=>{
        let _a=_yt.value;
        if(_a.includes("https://www.youtube.com/watch?")){
            let _q=_a.split("watch?v=");
            _a=_q[0]+`embed/`+_q[1].split("&")[0];
        }
        _fm.src=_a;
    };
    let _bta=document.createElement("div");
    for(let i=0;i<_dv.length;i++){
        let _bt=document.createElement("button");
        _bt.style='font-size: 15px !important;border: 1px black solid;height: 25px';
        _bt.textContent=_dv[i][0];
        _bt.onclick=()=>{
            _dv[i][1]();
        };
        _bta.append(_bt);
    }
    _bta.style='display: flex;flex-wrap: wrap;';
    _aa.append(_bta);

    _aa.className="coffeecat";
    _aa.style=`
    font-size: 30px;
    position: fixed;
    top: 0;
    left: 0;
    width: 500px;
    height: 300px;
    z-index: 123456789;
    display: none;
    color: var(--txt-color);
    background: rgb(0 0 0 / 80%);
	transition: all .3s linear;`;

    _aa.append(_yt,_fm);
    _clr.type="color";
    _clr.style="width: 40px;";
    _clr2.type="range";
    _clr2.style="display: inline-block;width: 200px;";
    _clr2.min=0;
    _clr2.max=255;
    _clr2.step=1;
    _clr2.value=255;
    let __aq="#fff";
    /*----cookie-------*/
    try{
        function getCookie(name) {
            var value = `; ${document.cookie}`;
            var parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return -1;
        }
        let _getbk=getCookie("coffeecat_bk");
        if(_getbk!=-1){
            _clr.value=_getbk.substr(0,7);
            _clr2.value=parseInt(_getbk.substr(7,2),16);
            _aa.style.background=_getbk;
            if((parseInt(_clr.value.substring(1,3),16)+parseInt(_clr.value.substring(3,5),16)+parseInt(_clr.value.substring(5,7),16))/3>128){
                __aq="#000";
            }
        }
    }catch(e){
        void(0);
    }
    /*--------------------*/
    document.body.addEventListener("keydown",(k)=>{
        if(k.ctrlKey&&k.altKey&&k.key=='Backspace'){
            if(_ab){
                _aa.style.display="none";
            }
            else{
                _aa.style.display="block";
            }
            _ab^=1;
        }
    });
    let a=`
<style>

:root{
	--txt-color:${__aq};
}
.coffeecat button {
	margin: 2px;
	border: none !important;
	text-align: center;
	cursor: pointer;
    color: var(--txt-color);
	background: #8bc34a8a !important;
	position: relative;
	transition: all .3s linear;
}
.coffeecat button::before {
	content: "";
	width: 20%;
	height: 20%;
	box-sizing: border-box;
	border-top: 1px solid var(--txt-color);
	border-left: 1px solid var(--txt-color);
	position: absolute;
	top: 0;
	left: 0;
	transition: all .3s linear;
}
.coffeecat button::after {
	content: "";
	width: 20%;
	height: 20%;
	box-sizing: border-box;
	border-bottom: 1px solid var(--txt-color);
	border-right: 1px solid var(--txt-color);
	position: absolute;
	bottom: 0;
	right: 0;
	transition: all .3s linear;
}
.coffeecat button:hover::before, .coffeecat button:hover::after {
	width: 100%;
	height: 100%;
}

</style>
`;
	let q = trustedTypes.createPolicy("forceInner", {
		createHTML: (to_escape) => to_escape
	});
    document.querySelector("head").insertAdjacentHTML('beforeend',q.createHTML(a));
    var root = document.querySelector(':root');
    _clr.oninput=_clr2.oninput=()=>{
        let __a=_clr.value+Number(_clr2.value).toString(16).padStart("2","0");
        _aa.style.background=__a;
        try{
            document.cookie=`coffeecat_bk=${__a};`;
        }catch(e){
            void(0);
        }
        if((parseInt(_clr.value.substring(1,3),16)+parseInt(_clr.value.substring(3,5),16)+parseInt(_clr.value.substring(5,7),16))/3>128){
            root.style.cssText+='--txt-color: #000;';
        }
        else{
            root.style.cssText+='--txt-color: #fff;';
        }
    };
    document.body.insertBefore(_aa,document.body.firstChild);
})();