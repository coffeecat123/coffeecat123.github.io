window.addEventListener("load",()=>{
    let _wixk=document.querySelectorAll("style")[document.querySelectorAll("style").length-1];
    if(_wixk.innerHTML.substr(0,25)==".footer,.generic-footer{m")
    _wixk.remove();
    let _zshrxdt=document.querySelectorAll("div.disclaimer");
    if(_zshrxdt.length>0)_zshrxdt[0].remove();
});