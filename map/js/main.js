var inff=document.querySelector("#inff");
var cvs=$("#cvs");
var ctx=cvs.getContext("2d");
var ti=cvs.width/cvs.offsetWidth,
    fps=120,t=1/fps,developer=1,infhd=1,
    keys=[],now_fps,stmp,maxwidth,maxheight,
    playing=0,bal,balls=[],
    bgclr=[37,37,37],lsclr=bgclr.slice(0),
    toclr=bgclr.slice(0),tm=0,tms=0,
    gw=800,gh=800,
key={
    'w':0,
    'a':0,
    's':0,
    'd':0,
    'Shift':0,
    'Ctrl':0
};
function inf(){
    if(infhd){
        inff.style.display="block";
    }
    else{
        inff.style.display="none";
    }
    infhd^=1;
}
document.onkeydown=(e)=>{
    if(e.key==" "){
        e.preventDefault();
    }
    if(e.key=='Shift'){
        key['Shift']=1;
    }
    if(e.key=='w'||e.key=='W'||e.key=="ArrowUp"){
        key['w']=1;
        if(keys.indexOf('w')>=0)keys.splice(keys.indexOf('w'),1);
        keys.push('w');
    }
    if(e.key=="a"||e.key=="A"||e.key=="ArrowLeft"){
        key['a']=1;
        if(keys.indexOf('a')>=0)keys.splice(keys.indexOf('a'),1);
        keys.push('a');
    }
    if(e.key=="s"||e.key=="S"||e.key=="ArrowDown"){
        key['s']=1;
        if(keys.indexOf('s')>=0)keys.splice(keys.indexOf('s'),1);
        keys.push('s');
    }
    if(e.key=="d"||e.key=="D"||e.key=="ArrowRight"){
        key['d']=1;
        if(keys.indexOf('d')>=0)keys.splice(keys.indexOf('d'),1);
        keys.push('d');
    }
    if(e.key=="p"){//pause
    }
    if(developer){
    }
};
document.onkeyup=(e)=>{
    if(e.key=='Shift'){
        key['Shift']=0;
    }
    if(e.key=="w"||e.key=="W"||e.key=="ArrowUp"){
        key['w']=0;
        if(keys.indexOf('w')>=0)keys.splice(keys.indexOf('w'),1);
    }
    if(e.key=="a"||e.key=="A"||e.key=="ArrowLeft"){
        key['a']=0;
        if(keys.indexOf('a')>=0)keys.splice(keys.indexOf('a'),1);
    }
    if(e.key=="s"||e.key=="S"||e.key=="ArrowDown"){
        key['s']=0;
        if(keys.indexOf('s')>=0)keys.splice(keys.indexOf('s'),1);
    }
    if(e.key=="d"||e.key=="D"||e.key=="ArrowRight"){
        key['d']=0;
        if(keys.indexOf('d')>=0)keys.splice(keys.indexOf('d'),1);
    }
};
document.addEventListener('contextmenu',(e)=>{
});
cvs.onmousedown=(e)=>{
};
cvs.onwheel=(e)=>{
};
cvs.onmousemove=(e)=>{
}
function bl(x,y,r,clr,l){
    ctx.fillStyle=clr;
    if((bgclr[0]+bgclr[1]+bgclr[2])/3<128){
        ctx.strokeStyle="#fff";
    }
    else{
        ctx.strokeStyle="#000";
    }
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    if(l==undefined)return;
    ctx.lineWidth=l;
    ctx.stroke();
};
function draw(){
    let gdt=ctx.createLinearGradient(0,0,cvs.width,cvs.height);
    gdt.addColorStop(1,"#f00");
    gdt.addColorStop(0,"#f0f");
    ctx.strokeStyle=gdt;
    ctx.lineWidth=10;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,cvs.height);
    ctx.lineTo(cvs.width,cvs.height);
    ctx.lineTo(cvs.width,0);
    ctx.lineTo(0,0);
    ctx.stroke();

    for(let i in balls){
        let b=balls[i];
        if(b==undefined)continue;
        b.drawbl();
    }
    bal.drawbl(1);
}
function bk(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.save();
    ctx.fillStyle=`rgb(${bgclr.join()})`;
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.restore();
}
function chbk(clr,ms){
    lsclr=bgclr.slice(0);
    tm=Math.floor(ms/(1000/fps));
    tms=tm;
    toclr=clr.slice(0);
}
function focus_out(){
    var  isShine = false;
    setInterval(function() {
        window.onfocus = function() {
            isShine = false;
        };
        window.onblur = function() {
            isShine = true;
        };
        // for IE
        document.onfocusin = function() {
            isShine = false;
        };
        document.onfocusout = function() {
            isShine = true;
        };
        if (isShine == true) {
            key['w']=0;
            key['a']=0;
            key['s']=0;
            key['d']=0;
            key['Shift']=0;
            keys=[];
            bal.vx=0;
            bal.vy=0;
        }
    }, 800);
}
function start(){
    maxwidth=1000;
    maxheight=500;
    keys=[];
    stmp=0;
    playing=1;
    bal=new ball(cvs.width/2,cvs.height/2,0,0,30,[223.6,0,0]);
    balls=[];
    for(let i=0;i<10;i++){
        let b=new ball(random(0,cvs.width),random(0,cvs.height),0,0,10,[random(0,255),random(0,255),random(0,255)]);
        balls.push(b);
    }
    let last_time={
        time:Date.now(),
        stmp:0
    };
    setInterval(()=>{
        if(tm){
            bgclr=[(lsclr[0]*tm+toclr[0]*(tms-tm))/tms,
                (lsclr[1]*tm+toclr[1]*(tms-tm))/tms,
                (lsclr[2]*tm+toclr[2]*(tms-tm))/tms];
            tm--;
        }
        bk();
        draw();
        let new_time={
            time:Date.now(),
            stmp:stmp
        };
        if(playing){
            bal.vx=0;
            bal.vy=0;
            //press 'w'
            if(key['w']&&keys.indexOf('w')>keys.indexOf('s'))bal.vy=-250*(key['Shift']+1);
            //press 'a'
            if(key['a']&&keys.indexOf('a')>keys.indexOf('d'))bal.vx=-250*(key['Shift']+1);
            //press 's'
            if(key['s']&&keys.indexOf('s')>keys.indexOf('w'))bal.vy=250*(key['Shift']+1);
            //press 'd'
            if(key['d']&&keys.indexOf('d')>keys.indexOf('a'))bal.vx=250*(key['Shift']+1);
            if(bal.vx!=0&&bal.vy!=0){
                bal.vx/=2**0.5;
                bal.vy/=2**0.5;
            }
            bal.move();
        }
        if(new_time.time-last_time.time>=500){
            now_fps=(new_time.stmp-last_time.stmp)/(new_time.time-last_time.time)*1000;
            last_time.time=new_time.time;
            last_time.stmp=new_time.stmp;
        }
        stmp++;
    },1000/fps);
}
focus_out();
start();
