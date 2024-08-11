// ==UserScript==
// @name         YT
// @namespace    ???
// @version      1.0
// @description  yt...
// @author       coffeecat
// @match        https://www.youtube.com/*
// @match        https://i.ytimg.com/*
// @match        https://yt3.ggpht.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==


/*---------記錄欄-------------
document.querySelector("video").currentTime
document.querySelector("video").duration
document.querySelector("video").volume
document.querySelector("video").muted=true;
document.querySelector("video").preload="auto";
----------------------------*/
(function() {
    'use strict';
    (async()=>{
        if((location.href.indexOf("https://i.ytimg.com/")>-1)||(location.href.indexOf("https://yt3.ggpht.com/")>-1)){
            var t=document.getElementsByTagName("img");
            if(await GM.getValue('a')>0){
                await GM.setValue('a',await GM.getValue('a')-1);
                var qa;
                qa=document.createElement("a");
                qa.href=t[0].src;
                qa.download="download";
                qa.target="_blank";
                qa.style="display:none;";
                document.body.append(qa);
                qa.click();
                qa.remove();
                close();
            }
        }
    })();
    let a=location.href;
    start();
    setInterval(()=>{
        try{
            document.querySelector(".style-scope ytd-searchbox>form>div").style["background-color"]="transparent";
            document.querySelector("ytd-masthead").style.background="linear-gradient(rgb(220 0 227), rgb(136 0 0))";
        }catch(e){
            console.log(e);
        }
        if(a!=location.href){
            a=location.href;
            setTimeout(start(),1000);
        }
    },1000);
    const policy = trustedTypes.createPolicy('default', {
        createHTML: (input) => {
            return input;
        },
        createScript: (input) => {
            return input;
        },
    });
    function start(){
        console.log('YT');
        let www=document.querySelectorAll("#sadad");
        for(let i=0;i<www.length;i++){
            www[i].remove();
        }
        www=document.querySelectorAll("#cre");
        for(let i=0;i<www.length;i++){
            www[i].remove();
        }
        if(location.href.indexOf("https://www.youtube.com/watch")==-1){
            setTimeout(()=>{
                if(document.documentElement.attributes.hasOwnProperty("dark")==false){
                    document.getElementById("avatar-btn").click();
                    setTimeout(() => {
                        document.querySelector(".ytd-toggle-theme-compact-link-renderer").click();
                        setTimeout(() => {
                            [...document.querySelectorAll("yt-multi-page-menu-section-renderer #items")].filter((m) => {
                                return m.childElementCount == 4;
                            })[0].children[2].click();
                        }, 500);
                    }, 500);
                }
            },3000);
            return;
        }
        var wqw=setInterval(()=>{
            let a=document.querySelector("ytd-watch-metadata");
            if(a!=null){
                clearInterval(wqw);
                setTimeout(wwq(),3000);
            }
        },100);
        async function wwq(){
            var wpe=[...document.querySelectorAll("video")].filter((v)=>{
                return (v.videoWidth>0&v.videoHeight>0)==1;
            })[0];
            if(await GM.getValue('top', -1)==-1){
                await GM.setValue('top',"#a13a3a");
            }
            if(await GM.getValue('bottom', -1)==-1){
                await GM.setValue('bottom',"#a13a3a");
            }
            if(await GM.getValue('swatch', -1)==-1){
                await GM.setValue('swatch',"#f00");
            }
            if(await GM.getValue('a', -1)==-1){
                await GM.setValue('a',0);
            }
            document.querySelector("#columns").style.background=`linear-gradient(${await GM.getValue('top')},${await GM.getValue('bottom')})`;
            //-----------------------------------------
            var a1=location.href;
            var q1=a1.split("watch?v=");
            var b1=q1[0]+`embed/`+q1[1];
let ipt=`<a id="cre" style="user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;font-family: Segoe Script,fantasy;font-size: var(--ytd-video-primary-info-renderer-title-font-size, var(--yt-navbar-title-font-size, inherit));
 background:-webkit-linear-gradient(bottom,red,yellow);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;">show</a>
 <div id="sadad" style="font-family:標楷體;background: transparent;font-size: var(--ytd-video-primary-info-renderer-title-font-size, var(--yt-navbar-title-font-size, inherit));
 color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-spec-text-primary));">`+
                                 `<a
 id="asr"
 style="color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-spec-text-primary));"
 target="_blank"
 href=`+b1+`
 >`+b1+`</a><br>`+
                                 `<span
 id="aiw"
 ></span>`+
                                 `<span
 id="awi"
 ></span>`+
                                 `<span
 id="aww" style="color:#8888;margin-left: 1em;"
 ></span><br>`+
                                 `<span
 id="asz"
 ></span><br>`+
                                 `<span
 id="asw"
 >`+location.search.split("=")[1]+`</span><br>`+
                                 `<button
 id="qwskd"
 style="background:red;color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-spec-text-primary));"
 >截圖</button><br>`+
                                 `<a
 href=https://y2mate.is/${location.search.split("&")[0]}
 target="_blank"
 style="color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-spec-text-primary));"
 >下載影片</a><br>`+
                                 `<a
 id="sdfsd"
 target="_blank"
 style="color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-spec-text-primary));"
 >影片縮圖</a><br>`+
                                 `<span id="q2"></span><br>`+
                                 `<span id="q3"></span><br>`+
                                 `背景顏色:<input id="awsd" type="color">(頂端)--<input id="awsa" type="color">(底部)<br>`+
                                 `滑條顏色:<input id="awsz" type="color"><br>`+
                                 `速度(>0):<input type="number" style="width: calc(var(--ytd-video-primary-info-renderer-title-font-size, var(--yt-navbar-title-font-size, inherit))*3);" id="aqw" value="1"><br>`+
                                 `音量(0~1):<input type="number" style="width: calc(var(--ytd-video-primary-info-renderer-title-font-size, var(--yt-navbar-title-font-size, inherit))*3);" id="wis"></div>`;

    document.querySelector("ytd-watch-metadata").insertAdjacentHTML('afterend',policy.createHTML(ipt));

const scriptContent = `
document.getElementById("qwskd").onclick = () => {
	console.log("catch");
	let cv = document.createElement('canvas');
	let c = cv.getContext('2d');
	let vid = document.querySelector('video');
	cv.width = vid.videoWidth;
	cv.height = vid.videoHeight;
	c.drawImage(vid, 0, 0);
	let a = document.body.appendChild(document.createElement('a'));
	a.href = cv.toDataURL();
	a.download = 'Youtube 截圖';
	a.click();
	a.remove();
	cv.remove();
}
document.getElementById("sdfsd").href = "https://i.ytimg.com/vi/" + location.search.split("=")[1].split("&")[0] + "/hqdefault.jpg?";
var zsd = ["af", "南非荷蘭語", "sq", "阿爾巴尼亞語", "ar-sa", "阿拉伯語(沙特阿拉伯)", "ar-iq", "阿拉伯語(伊拉克)", "ar-eg", "阿拉伯語(埃及)", "ar-ly", "阿拉伯語(利比亞)", "ar-dz", "阿拉伯語(阿爾及利亞)", "ar-ma", "阿拉伯語(摩洛哥)", "ar-tn", "阿拉伯語(突尼斯)", "ar-om", "阿拉伯語(阿曼)", "ar-ye", "阿拉伯語(也門)", "ar-sy", "阿拉伯語(敘利亞)", "ar-jo", "阿拉伯語(約旦)", "ar-lb", "阿拉伯語(黎巴嫩)", "ar-kw", "阿拉伯語(科威特)", "ar-ae", "阿拉伯語(阿拉伯聯合酋長國)", "ar-bh", "阿拉伯語(巴林)", "ar-qa", "阿拉伯語(卡塔爾)", "eu", "巴斯克語", "bg", "保加利亞語", "be", "貝勞語", "ca", "加泰羅尼亞語", "zh-tw", "中文(中國台灣)", "zh-cn", "中文(中華人民共和國)", "zh-hk", "中文(中國香港特別行政區)", "zh-sg", "中文(新加坡)", "hr", "克羅地亞語", "cs", "捷克語", "da", "丹麥語", "nl", "荷蘭語(標準)", "nl-be", "荷蘭語(比利時)", "en", "英語", "en-us", "英語(美國)", "en-gb", "英語(英國)", "en-au", "英語(澳大利亞)", "en-ca", "英語(加拿大)", "en-nz", "英語(新西蘭)", "en-ie", "英語(愛爾蘭)", "en-za", "英語(南非)", "en-jm", "英語(牙買加)", "en", "英語(加勒比)", "en-bz", "英語(伯利茲)", "en-tt", "英語(特立尼達)", "et", "愛沙尼亞語", "fo", "法羅語", "fa", "波斯語", "fi", "芬蘭語", "fr", "法語(標準)", "fr-be", "法語(比利時)", "fr-ca", "法語(加拿大)", "fr-ch", "法語(瑞士)", "fr-lu", "法語(盧森堡)", "gd", "蓋爾語(蘇格蘭)", "gd-ie", "蓋爾語(愛爾蘭)", "de", "德語(標準)", "de-ch", "德語(瑞士)", "de-at", "德語(奧地利)", "de-lu", "德語(盧森堡)", "de-li", "德語(列支敦士登)", "el", "希臘語", "he", "希伯來語", "hi", "北印度語", "hu", "匈牙利語", "is", "冰島語", "in", "印度尼西亞語", "it", "意大利語(標準)", "it-ch", "意大利語(瑞士)", "ja", "日語", "ko", "朝鮮語", "ko", "朝鮮語(韓國)", "lv", "拉脫維亞語", "lt", "立陶宛語", "mk", "FYRO", "馬其頓語", "ms", "馬來西亞語", "mt", "馬耳他語", "no", "挪威語(博克馬爾)", "no", "挪威語(尼諾斯克)", "pl", "波蘭語", "pt-br", "葡萄牙語(巴西)", "pt", "葡萄牙語(葡萄牙)", "rm", "拉丁語系", "ro", "羅馬尼亞語", "ro-mo", "羅馬尼亞語(摩爾達維亞)", "ru", "俄語", "ru-mo", "俄語(摩爾達維亞)", "sz", "薩摩斯語(拉普蘭)", "sr", "塞爾維亞語(西里爾)", "sr", "塞爾維亞語(拉丁)", "sk", "斯洛伐克語", "sl", "斯洛文尼亞語", "sb", "索布語", "es", "西班牙語(西班牙傳統)", "es-mx", "西班牙語(墨西哥)", "es", "西班牙語(西班牙現代)", "es-gt", "西班牙語(危地馬拉)", "es-cr", "西班牙語(哥斯達黎加)", "es-pa", "西班牙語(巴拿馬)", "es-do", "西班牙語(多米尼加共和國)", "es-ve", "西班牙語(委內瑞拉)", "es-co", "西班牙語(哥倫比亞)", "es-pe", "西班牙語(秘魯)", "es-ar", "西班牙語(阿根廷)", "es-ec", "西班牙語(厄瓜多爾)", "es-cl", "西班牙語(智利)", "es-uy", "西班牙語(烏拉圭)", "es-py", "西班牙語(巴拉圭)", "es-bo", "西班牙語(玻利維亞)", "es-sv", "西班牙語(薩爾瓦多)", "es-hn", "西班牙語(洪都拉斯)", "es-ni", "西班牙語(尼加拉瓜)", "es-pr", "西班牙語(波多黎各)", "sx", "蘇圖語", "sv", "瑞典語", "sv-fi", "瑞典語(芬蘭)", "th", "泰語", "ts", "湯加語", "tn", "瓦納語", "tr", "土耳其語", "uk", "烏克蘭語", "ur", "烏爾都語", "ve", "文達語", "vi", "越南語", "xh", "科薩語", "ji", "依地語", "zu", "祖魯語"];
var aswe = (navigator.language || navigator.browserLanguage).toLowerCase();
for (var i = 0; i < zsd.length; i += 2) {
	if (aswe == zsd[i]) {
		console.log(zsd[i + 1]);
		break;
	}
}
`;
const script = document.createElement('script');
script.textContent = policy.createScript(scriptContent);
document.body.appendChild(script);
            var afs=[],als=0,w=false,w1=1,isl=0;
            document.body.onmousemove=async function q(event){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    document.body.onmousemove='';
                    return;
                }
                if(event.target.tagName=="IMG" && w){
                    if(event.target==isl)return;
                    isl=event.target;
                    w=false;
                    if(event.target.src.indexOf("blob:")==-1 && !afs.includes(event.target.src)){
                        await GM.setValue('a',await GM.getValue('a')+1);
                        afs[als]=event.target.src;
                        var a=document.body.appendChild(document.createElement('a'));
                        a.href=event.target.src;
                        a.download='Youtube 截圖';
                        a.target="_blank";
                        a.click();
                        a.remove();
                        als++;
                    }
                    w=true;
                }
            };
            function aw(){
                document.querySelector("#cre").text=aqs>0?"hide":"show";
                sad.style.display=aqs>0?"":"none";
                for(var i=0;i<sad.children.length;i++){
                    sad.children[i].style.display=aqs>0?"":"none";
                }
            }
            var aqs=-1,sad=document.querySelector("#sadad");
            aw();
            document.querySelector("#cre").onclick=()=>{
                aqs*=-1;
                aw();
            }
            function clk(){
                (async () => {
                    await GM.setValue('top',document.querySelector("#awsd").value);
                    await GM.setValue('bottom',document.querySelector("#awsa").value);
                    document.querySelector("#columns").style.background=`linear-gradient(${await GM.getValue('top')},${await GM.getValue('bottom')})`;
                })();
            }
            document.querySelector("#awsd").oninput=clk;
            document.querySelector("#awsa").oninput=clk;
            setInterval(async function q(){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    clearInterval(q);
                    return;
                }
                await GM.setValue('swatch',document.querySelector("#awsz").value);
                document.querySelectorAll(".ytp-swatch-background-color").forEach(e=>{
                    e.style.background=document.querySelector("#awsz").value;
                });
            },10);
            var ar=document.querySelector(".ytp-volume-panel").ariaValueNow;
            document.querySelector("#wis").value=document.querySelector(".ytp-volume-panel").ariaValueNow/100;
            document.querySelector("#wis").step=0.01;
            document.querySelector("#wis").min=0;
            document.querySelector("#wis").max=1;
            document.querySelector("#wis").onchange=()=>{
                var tei=document.querySelector("#wis").value;
                if(tei>1){
                    document.querySelector("#wis").value=1;
                }
                else if(tei<0){
                    document.querySelector("#wis").value=0;
                }
                wpe.volume=tei;
            };
            setInterval(function q(){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    clearInterval(q);
                    return;
                }
                if(ar!=document.querySelector(".ytp-volume-panel").ariaValueNow){
                    ar=document.querySelector(".ytp-volume-panel").ariaValueNow;
                    document.querySelector("#wis").value=ar/100;
                }
            },10);
            var yre=0.1;
            var mc=1;
            document.querySelector("#aqw").step=yre;
            document.querySelector("#aqw").min=yre;
            document.querySelector("#aqw").max=16;
            document.querySelector("#aqw").onchange=()=>{
                var tei=document.querySelector("#aqw").value;
                if(tei>16){
                    wpe.playbackRate=16;
                    document.querySelector("#aqw").value=16;
                }
                else if(tei>0){
                    wpe.playbackRate=tei;
                    document.querySelector("#aqw").value=wpe.playbackRate;
                }
                else{
                    wpe.playbackRate=yre;
                    document.querySelector("#aqw").value=yre;
                }
            };
            setInterval(function q(){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    clearInterval(q);
                    return;
                }
                if(document.querySelector(".ytp-menuitem-content")!=null){
                    if(Number(document.querySelector(".ytp-menuitem-content").innerText)==0)return;
                    if(mc!=Number(document.querySelector(".ytp-menuitem-content").innerText)){
                        if(isNaN(Number(document.querySelector(".ytp-menuitem-content").innerText))){
                            mc=1;
                        }
                        else{
                            mc=Number(document.querySelector(".ytp-menuitem-content").innerText);
                        }
                        document.querySelector("#aqw").value=mc;
                        wpe.playbackRate=mc;
                    }
                }
            },10);
            document.getElementById("q2").textContent="下載press(a):"+w;
            document.getElementById("q3").textContent="遮住影片的東西press(s):"+(w1?"顯示":"隱藏");
            document.addEventListener("keydown",function q(e){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    this.removeEventListener("keydown", q);
                    return;
                }
                if(e.target.matches("input")) return;
                //      "".charCodeAt(0)
                /*
                    ytp-player-content ytp-iv-player-content
                    ytp-endscreen-content
                    html5-endscreen
                    */
                if(e.keyCode==65){
                    w=!w;
                    document.getElementById("q2").textContent="下載press(a):"+w;
                }
                if(e.keyCode==83){
                    let sta;
                    if(w1)sta="none";
                    else sta="";
                    for(let i=0;i<document.querySelectorAll(".ytp-chrome-bottom").length;i++){
                        document.querySelectorAll(".ytp-chrome-bottom")[i].style.display=sta;
                    }
                    for(let i=0;i<document.querySelectorAll(".ytp-gradient-bottom").length;i++){
                        document.querySelectorAll(".ytp-gradient-bottom")[i].style.display=sta;
                    }
                    for(let i=0;i<document.querySelectorAll(".html5-video-container").length;i++){
                        document.querySelectorAll(".html5-video-container")[i].style.zIndex=w1?100000:10;
                    }
                    w1^=1;
                    document.getElementById("q3").textContent="遮住影片的東西press(s):"+(w1?"顯示":"隱藏");
                }
            });
function padZero(num) {
    return num < 10 ? '0' + num : num;
}
            setInterval(function q(){
                if(location.href.indexOf("https://www.youtube.com/watch")==-1){
                    clearInterval(q);
                    return;
                }
                try{
                    let pi=location.href.split("watch?v=");
                    document.querySelector("#asr").href=pi[0]+`embed/`+pi[1].split("&")[0];
                    document.querySelector("#asr").text=pi[0]+`embed/`+pi[1].split("&")[0];
                    document.querySelector("#asw").textContent=pi[1].split("&")[0];
                    document.querySelector("#asz").textContent=document.querySelectorAll("yt-formatted-string.style-scope.ytd-video-primary-info-renderer")[2].textContent+" "+document.querySelectorAll(".view-count.style-scope.ytd-video-view-count-renderer")[0].textContent;
                    document.getElementById("aww").textContent=wpe.currentTime;
                    document.getElementById("aiw").textContent =
                        (Math.floor(wpe.currentTime / 3600) > 0 ? Math.floor(wpe.currentTime / 3600) + ":" : "") +
                        (Math.floor(wpe.currentTime / 3600) > 0 ? padZero(Math.floor(wpe.currentTime / 60) % 60) : Math.floor(wpe.currentTime / 60)) + ":" +
                        padZero(Math.floor(wpe.currentTime % 60)) + "/";
                    if(!isNaN(Math.floor(wpe.duration/3600))){
                        document.getElementById("awi").textContent =
                            (Math.floor(wpe.duration / 3600) > 0 ? Math.floor(wpe.duration / 3600) + ":" : "") +
                            (Math.floor(wpe.duration / 3600) > 0 ? padZero(Math.floor(wpe.duration / 60) % 60) : Math.floor(wpe.duration / 60)) + ":" +
                            padZero(Math.floor(wpe.duration % 60));
                    }
                }catch(e){
                    void(0);
                }
            },10);
            document.querySelector("#awsd").value=await GM.getValue('top');
            document.querySelector("#awsa").value=await GM.getValue('bottom');
            document.querySelector("#awsz").value=await GM.getValue('swatch');
            var w2=document.querySelectorAll(".ytp-swatch-background-color");
            for(var i=0;i<w2.length;i++){
                w2[i].style.background=await GM.getValue('bottom');
            }
            setTimeout(()=>{
                if(document.documentElement.attributes.hasOwnProperty("dark")==false){
                    document.getElementById("avatar-btn").click();
                    setTimeout(() => {
                        document.querySelector(".ytd-toggle-theme-compact-link-renderer").click();
                        setTimeout(() => {
                            [...document.querySelectorAll("yt-multi-page-menu-section-renderer #items")].filter((m) => {
                                return m.childElementCount == 4;
                            })[0].children[2].click();
                        }, 500);
                    }, 500);
                }
            },1000);
        };
    }
    (()=>{
    let a=`

<style>

div#cinematics canvas {
    display: none;
}
::-webkit-scrollbar-corner {
    background:#181818;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    background-color: #303030;
}
::-webkit-scrollbar-thumb:hover {
    background: #6c6c6c;
}
::-webkit-scrollbar-thumb {
    background-color: #a1a1a1;
    border-radius: 15px;
}
::-webkit-scrollbar {
    width: 15px;
    height: 15px;
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
})();