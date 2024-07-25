var inff=document.querySelector("#inff");
var cvs=$("#cvs");
var ctx=cvs.getContext("2d");
var abs=Math.abs;
var ti=cvs.width/cvs.offsetWidth,
    fps=120,t=1/fps,developer=1,infhd=1,
    keys=[],now_fps,stmp,maxwidth,maxheight,
    playing=0,bal,balls=[],walls=[],
    bgclr=[37,37,37],lsclr=bgclr.slice(0),
    toclr=bgclr.slice(0),tm=0,tms=0,
    gw=800,gh=800,mw,mh,mz=[],
    dx=[0,1,0,-1],dy=[-1,0,1,0],
    st={},sd,clrs=[],
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
function mkmz() {
	mz=Array(mh).fill().map(()=>Array(mw).fill(0));
	let stack = [];
	let startX = Math.floor(Math.random() * Math.floor((mw - 1) / 2)) * 2 + 1;
	let startY = Math.floor(Math.random() * Math.floor((mh - 1) / 2)) * 2 + 1;
	stack.push([startX, startY]);
	mz[startY][startX] = 1;
    let c=0;
	while (stack.length > 0) {
		let [x, y] = stack[stack.length - 1];
		let directions = [0, 1, 2, 3];
		for (let i = directions.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[directions[i], directions[j]] = [directions[j], directions[i]];
		}
		let moved = false;
		for (let dir of directions) {
			let nx = x + dx[dir] * 2;
			let ny = y + dy[dir] * 2;
			if (nx >= 0 && nx < mw && ny >= 0 && ny < mh && mz[ny][nx] == 0) {
				mz[y + dy[dir]][x + dx[dir]] = 1;
				mz[ny][nx] = 1;
                c++;
				stack.push([nx, ny]);
				moved = true;
				break;
			}
		}
		if (!moved) {
			stack.pop();
		}
	}
    let wl=[],el=[];
    for(let i=1;i<mh-1;i++){
        for(let j=1;j<mw-1;j++){
            if(mz[i][j]==0){
                wl.push([i, j]);
            }
            if(mz[i][j]==1){
                el.push([i, j]);
            }
        }
    }
    for(let i=wl.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [wl[i], wl[j]] = [wl[j], wl[i]];
    }
    for(let i=el.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [el[i], el[j]] = [el[j], el[i]];
    }
    for(let i=0;i<(mh*mw)/20;i++){
        mz[wl[i][0]][wl[i][1]]=2;
    }
    for(let i=0;i<(mh+mw)/4;i++){
        mz[el[i][0]][el[i][1]]=3;
    }
    return [startX, startY];
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

    
    for(let i in walls){
        let w=walls[i];
        ctx.fillStyle=`rgb(${w.clr.join()})`;
        ctx.fill(w.path2d());
    }
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
function ComputeCollision(w, h, r, rx, ry) {
	var dx = Math.min(rx, w * 0.5);
	var dx1 = Math.max(dx, -w * 0.5);
	var dy = Math.min(ry, h * 0.5);
	var dy1 = Math.max(dy, -h * 0.5);
	return (dx1 - rx) * (dx1 - rx) + (dy1 - ry) * (dy1 - ry) <= r * r;
}
function start(){
    maxwidth=1000;
    maxheight=500;
    keys=[];
    clrs=[];
    stmp=0;
    playing=1;
    bal=new ball(0,0,0,0,10,[255,255,255]);
    balls=[];
    sd=bal.r*2*2;
    mh=Math.floor(cvs.height/sd-1);
    mw=Math.floor(cvs.width/sd-1);
    mh=mh-((mh^1)&1);
    mw=mw-((mw^1)&1);
    [st.x,st.y]=mkmz();
    bal.x=cvs.width/2-sd*mw/2+(st.x+0.5)*sd;
    bal.y=cvs.height/2-sd*mh/2+(st.y+0.5)*sd;
    let clrl=3;
    for(let i=0;i<clrl;i++){
        let a=HSLToRGB(360/clrl*i,50,50)
        clrs.push(a.substring(4,a.length-1).split(','));

    }
    for(let i=0;i<mh;i++){
        for(let j=0;j<mw;j++){
            if(mz[i][j]==1)continue;
            let c;
            if(mz[i][j]==0){
                c=[128,128,128];
            }
            if(mz[i][j]==2){
                c=clrs[random(0,clrl-1)];
            }
            if(mz[i][j]==3){
                balls.push(new ball(cvs.width/2-sd*mw/2+(j+0.5)*sd,cvs.height/2-sd*mh/2+(i+0.5)*sd,0,0,bal.r/2,clrs[random(0,clrl-1)]));
                continue;
            }
            walls.push(new wall([
[cvs.width/2-sd*mw/2+j*sd,cvs.height/2-sd*mh/2+i*sd],
[cvs.width/2-sd*mw/2+(j+1)*sd,cvs.height/2-sd*mh/2+i*sd],
[cvs.width/2-sd*mw/2+(j+1)*sd,cvs.height/2-sd*mh/2+(i+1)*sd],
[cvs.width/2-sd*mw/2+j*sd,cvs.height/2-sd*mh/2+(i+1)*sd]],c));
        }
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
            if(tm==0){
                bgclr=toclr.slice(0);
            }
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
