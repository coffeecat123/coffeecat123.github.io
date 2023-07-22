var ty=$("#ty");
var inff=document.querySelector("#inff");
var cvs=$("#cvs");
var ctx=cvs.getContext("2d");
var ti=cvs.width/cvs.offsetWidth,
    bal,dm=0,fps=120,t=1/fps,interval,
    g=-500,jp,maxjp,stmp,lv=1,infhd=1,
    lines=[],keys=[],f1,f2,now_fps,
    mouse_down,walls=[],rr,ex,ey,
    pins=[],developer=1,mv,hide,select,shi
touch={
    top:0,
    bottom:0
},
live={
    x:100,
    y:1200,
    vx:0,
    vy:700
}
view={
    x:0,
    y:0
},maxwidth=2000,maxheight=1500,
key={
    'a':0,
    'd':0,
    'Shift':0
};
/*
虛座標
(0,maxheight) . .(maxwidth,maxheight)
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
(0,0) . . . . . .(maxwidth,0)

畫面座標
(0,0) . . . . . . .(cvs.width,0)
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
. . . . . . . . . . . . . . .
(0,cvs.height). . .(cvs.width,cvs.height)
*/
if(developer){
    inff.innerText+=`
z: copy all walls
c: move
k: build
l: kill dot
delete: delete wall`;
}
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
    if(e.key==' '||e.key=='w'||e.key=='W'){
        if(dm)jump();
    }
    if(e.key=="d"||e.key=="D"){
        key['d']=1;
        if(keys.indexOf('d')>=0)keys.splice(keys.indexOf('d'),1);
        keys.push('d');
    }
    if(e.key=="a"||e.key=="A"){
        key['a']=1;
        if(keys.indexOf('a')>=0)keys.splice(keys.indexOf('a'),1);
        keys.push('a');
    }
    if(e.key=="p"){
        if(mouse_down==0)dm^=1;
        if(dm){
            hide=0;
            select=-1;
            shi=-1;
            pins=[];
        }
    }
    if(e.key=="h"){
        if(dm==0&&developer)hide^=1;
    }
    if(developer){
        if(dm==0){
            if(e.key=="z"){
                let a="[\n";
                for(let i=4;i<walls.length;i++){
                    a+="[";
                    for(let j=0;j<walls[i].points.length;j++){
                        a+=`[${walls[i].points[j][0]},${walls[i].points[j][1]}],`;
                    }
                    a=a.substring(0,a.length-1);
                    a+="],\n";
                }
                a=a.substring(0,a.length-2);
                a+="\n]";
                console.log(a);
                navigator.clipboard.writeText(a);
            }
            if(e.key=="l"){
                if(pins.length>0){
                    pins.pop();
                }
            }
            if(e.key=="k"){
                if(pins.length>0){
                    let a="";
                    for(let i=4;i<pins.length;i++){
                        a+=`[${pins[i][0]},${pins[i][1]}],`;
                    }
                    a=a.substring(0,a.length-1);
                    let b=new wall(pins,"#555");
                    walls.push(b);
                    pins=[];
                }
            }
            if(e.key=="c"){
                if(mouse_down==0){
                    shi=-1;
                    mv=1;
                    cvs.style.cursor="move";
                }
            }
            if(e.key=="Delete"){
                if(select!=-1&&mouse_down==0){
                    walls.splice(select,1);
                    select=-1;
                }
            }
        }
    }
};
document.onkeyup=(e)=>{
    if(e.key=='Shift'){
        key['Shift']=0;
    }
    if(e.key=="d"||e.key=="D"){
        key['d']=0;
        if(keys.indexOf('d')>=0)keys.splice(keys.indexOf('d'),1);
    }
    if(e.key=="a"||e.key=="A"){
        key['a']=0;
        if(keys.indexOf('a')>=0)keys.splice(keys.indexOf('a'),1);
    }
    if(e.key=="c"&&developer){
        if(mouse_down==0){
            mv=0;
            cvs.style.cursor="";
        }
    }
};
document.addEventListener('contextmenu',(e)=>{
    if(dm)return;
    if(developer==0)return;
    e.preventDefault();
});
cvs.onmousedown=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    let x1=xc_a(e.pageX*ti),y1=yc_a(e.pageY*ti);
    let x=e.offsetX*ti,
        y=e.offsetY*ti;
    if(dm)return;
    if(mouse_down)return;
    if(developer==0)return;
    if(e.button==1){
        rr=1;
        res();
        return;
    }
    if(hide==0&&mv==0&&ctx.isPointInPath(bal.path2d(),x,y)){
        pins=[];
        mouse_down=1;
        document.addEventListener("mousemove",f1=(e1)=>{
            let x2=xc_a(e1.pageX*ti),y2=yc_a(e1.pageY*ti);
            let dx=x2-x1,
                dy=y2-y1;
            x1=x2,y1=y2;
            bal.x+=dx;
            bal.y+=dy;
            if(bal.x<bal.r)bal.x=bal.r;
            if(bal.x>maxwidth-bal.r)bal.x=maxwidth-bal.r;
            if(bal.y<bal.r)bal.y=bal.r;
            if(bal.y>maxheight-bal.r)bal.y=maxheight-bal.r;
        });
        document.addEventListener('mouseup',f2=()=>{
            document.removeEventListener('mouseup',f2);
            document.removeEventListener('mousemove',f1);
            mouse_down=0;
        });
        return;
    }
    if(mv&&ex+ey<2){
        mouse_down=1;
        document.addEventListener("mousemove",f1=(e1)=>{
            let x2=xc_a(e1.pageX*ti),y2=yc_a(e1.pageY*ti);
            let dx=x2-x1,
                dy=y2-y1;
            if(ex)dx=0;
            if(ey)dy=0;
            view_move(-dx,-dy);
        });
        document.addEventListener('mouseup',f2=()=>{
            document.removeEventListener('mouseup',f2);
            document.removeEventListener('mousemove',f1);
            mouse_down=0;
        });
        return;
    }
    if(mv==0){
        select=-1;
        let a=0;
        for(let i=walls.length-1;i>=4;i--){
            if(ctx.isPointInPath(walls[i].path2d(),x,y)){
                select=i;
                shi=-1;
                a=1;
                cvs.style.cursor="grab";
                break;
            }
        }
        if(a){
            mouse_down=1;
            cvs.style.cursor="grabbing";
            if(e.button==2){
                let a="";
                for(let i=4;i<walls[select].points.length;i++){
                    a+=`[${walls[select].points[i][0]},${walls[select].points[i][1]}],`;
                }
                a=a.substring(0,a.length-1);
                console.log(a);
            }
            document.addEventListener("mousemove",f1=(e1)=>{
                let x2=xc_a(e1.pageX*ti),y2=yc_a(e1.pageY*ti);
                let dx=x2-x1,
                    dy=y2-y1;
                x1=x2,y1=y2;
                for(let i=0;i<walls[select].points.length;i++){
                    walls[select].points[i][0]+=dx;
                    walls[select].points[i][1]+=dy;
                }
            });
            document.addEventListener('mouseup',f2=()=>{
                document.removeEventListener('mouseup',f2);
                document.removeEventListener('mousemove',f1);
                mouse_down=0;
                cvs.style.cursor="grab";
            });
            return;
        }
    }
    pins.push([parseInt(xc_a(x)),parseInt(yc_a(y))]);
};
cvs.onwheel=(e)=>{
    //return ;
    if(e.ctrlKey)return;
    if(dm)return;
    if(mv)return;
    if(developer==0)return;
    let a=e.wheelDeltaY,
        x=e.offsetX*ti,
        y=e.offsetY*ti,
        b=rr,
        r_=0.05,
        r__=3;
    rr+=r_*(a>0)*2-r_;
    if(rr>r__)rr=r__;
    if(rr<r_)rr=r_;
    let c=rr/b,d=1-c;
    if(maxwidth*rr<cvs.width){
        ex=1;
        view.x=-(cvs.width-maxwidth*rr)/rr/2;
    }
    else ex=0;
    if(maxheight*rr<cvs.height){
        ey=1;
        view.y=-(cvs.height-maxheight*rr)/rr/2;
    }
    else ey=0;
};
cvs.onmousemove=(e)=>{
    if(mv)return;
    if(dm)return;
    if(mouse_down)return;
    if(developer==0)return;
    let x=e.offsetX*ti,
        y=e.offsetY*ti;
    let a=0;
    for(let i=walls.length-1;i>=4;i--){
        if(ctx.isPointInPath(walls[i].path2d(),x,y)){
            if(i!=select)shi=i;
            else shi=-1;
            a=1;
            cvs.style.cursor="grab";
            return;
        }
    }
    shi=-1;
    cvs.style.cursor="";
}
function bl(x,y,r,clr){
    ctx.fillStyle=clr;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
};
function draw(){
    /*
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
    */
    for(let i=0;i<walls.length;i++){
        ctx.fillStyle=walls[i].clr;
        ctx.fill(walls[i].path2d());
        if(i==select){
            ctx.save();
            ctx.strokeStyle="#08f";
            ctx.lineWidth=7*rr;
            ctx.stroke(walls[i].path2d());
            ctx.restore();
        }
        if(i==shi){
            ctx.save();
            ctx.strokeStyle="#f80";
            ctx.lineWidth=7*rr;
            ctx.stroke(walls[i].path2d());
            ctx.restore();
        }
    }

    for(let i=0;i<pins.length;i++){
        bl(xa_c(pins[i][0]),ya_c(pins[i][1]),bal.r*rr/5,"#f00");
    }

    if(hide==0){
        for(let i=0;i<lines.length;i++){
            ctx.fillStyle=`rgb(255,255,255,${i/lines.length*0.3})`;
            ctx.beginPath();
            ctx.arc(xa_c(lines[i][0]),ya_c(lines[i][1]),bal.r*rr*i/lines.length,0,2*Math.PI);
            ctx.fill();
        }
        bal.drawbl();
    }
    /*
    ctx.strokeStyle=HSLToRGB((Math.abs(bal.y/cvs.height)*360+180)%360,100,50);;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(bal.x,bal.y);
    ctx.lineTo(bal.x+bal.vx*0.1,bal.y+bal.vy*0.1);
    ctx.stroke();*/
    /*
    if(lines.length>2){
        for(let i=2;i<lines.length;i++){
            ctx.strokeStyle=`rgb(255,255,255,${i/lines.length/1.5})`;
            ctx.lineWidth=2*i/lines.length;
            ctx.beginPath();
            ctx.moveTo(lines[i-2][0],lines[i-2][1]);
            ctx.lineTo(lines[i-1][0],lines[i-1][1]);
            ctx.lineTo(lines[i][0],lines[i][1]);
            ctx.stroke();
        }
    }
    */
}
function bk(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.save();
    ctx.fillStyle="#252525";
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.restore();
}
function jump(){
    if(jp>=maxjp)return 0;
    bal.vy=500;
    jp+=1;
}
function rnd(stp,x0,y0){
    let a=[],min=-1,max=361;
    for(let i=0;i<360;i+=stp){
        let x=xa_c(x0+bal.r*Math.cos(DegToRad(i))),
            y=ya_c(y0+bal.r*Math.sin(DegToRad(i)));
        for(let j=0;j<walls.length;j++){
            if(ctx.isPointInPath(walls[j].path2d(),x,y)){
                a.push(i);
                if(min==-1)min=i;
                max=i;
                break;
            }
        }
    }
    return [a.slice(0,a.length),min,max];
}
function hit(q){
    let a,b,min,max,stp=3,wal;
    [a,min,max]=rnd(stp,bal.x,bal.y);
    if(bal.vy>0)touch.bottom=0;
    if(a.length==0){
        touch.bottom=0;
        return [0,0];
    }
    b=0;
    for(let i=0;i<a.length;i++){
        if(max-min>180&&a[i]>180)a[i]-=360;
        b+=a[i];
    }
    let d1=(b/a.length+360)%360,d2=(d1+180)%360;
    let t1=rnd(stp,bal.x+10*Math.cos(DegToRad(d1)),bal.y+10*Math.sin(DegToRad(d1)))[0],
        t2=rnd(stp,bal.x+10*Math.cos(DegToRad(d2)),bal.y+10*Math.sin(DegToRad(d2)))[0];
    if(t1.length>t2.length)wal=d1;
    else wal=d2;
    if(q==1)return [wal,a.length];
    
    let v=(bal.vx**2+bal.vy**2)**0.5;
    let a1=(Math.atan2(-bal.vy,-bal.vx)+Math.PI*2)%(Math.PI*2),
        b1=DegToRad(wal),
        c1=b1*2-a1;
    let vx=v*Math.cos(c1);
    let vy=v*Math.sin(c1);

    let e=0;
    if(a.length/(360/stp)>0.1){
        for(let d=[wal,a.length];;){
            bal.x-=Math.cos(DegToRad(d[0]));
            bal.y-=Math.sin(DegToRad(d[0]));
            bal.x-=Math.cos(DegToRad(d1));
            bal.y-=Math.sin(DegToRad(d1));
            e++;
            d=hit(1);
            if(d[1]==0)break;
            if(e>=100){
                res();
                break;
            }
        }
    }

    if(Math.abs(wal-270)<45&&bal.vy<0){//bottom
        jp=0;
        bal.vy=0;
        touch.bottom=1;
    }
    if(Math.abs(wal-180)>170){//right
        if(bal.vx>0)bal.vx=0;
    }
    if(Math.abs(wal-180)<10){//left
        if(bal.vx<0)bal.vx=0;
    }
    if(Math.abs(wal-90)<80&&bal.vy>0){//top
        bal.vx=vx*0.8;
        bal.vy=vy*0.5;
    }
    return [0,0];
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
            key['a']=0;
            key['d']=0;
            key['Shift']=0;
            keys=[];
        }
    }, 800);
}
function view_move(dx,dy){
    view.x+=dx;
    view.y+=dy;
    if(ex==0){
        if(view.x>(maxwidth)*rr-cvs.width){
            view.x=(maxwidth)*rr-cvs.width;
        }else if(view.x<0){
            view.x=0;
        }
    }
    if(ey==0){
        if(view.y>(maxheight)*rr-cvs.height){
            view.y=(maxheight)*rr-cvs.height;
        }else if(view.y<0){
            view.y=0;
        }
    }
}
function res(){
    rr=1;
    ex=0;
    ey=0;
    view_move(-view.x,-view.y);
    view_move(live.vx,-live.vy);
    bal=new ball(live.x-view.x,live.y-view.y,0,0,30);
}
function start(game){
    clearInterval(interval);
    maxwidth=game.maxwidth;
    maxheight=game.maxheight;
    hide=0;
    mv=0;
    ex=0;
    ey=0;
    rr=1;
    jp=0;
    maxjp=game.maxjp;
    let l=new wall([[0,0],
                    [0,maxheight],
                    [-100,maxheight],
                    [-100,0]],"#888");
    let r=new wall([[maxwidth,0],
                    [maxwidth,maxheight],
                    [maxwidth+100,maxheight],
                    [maxwidth+100,0]],"#888");
    let u=new wall([[0,maxheight+100],
                    [0,maxheight],
                    [maxwidth,maxheight],
                    [maxwidth,maxheight+100]],"#888");
    let d=new wall([[0,0],
                    [0,-100],
                    [maxwidth,-100],
                    [maxwidth,0]],"#888");
                    
    walls=[l,r,u,d];//left right up down
    for(let i=0;i<game.ww.length;i++){
        walls.push(new wall(game.ww[i],"#888"));
    }
    dm=1;
    select=-1;
    shi=-1;
    stmp=0;
    lines=[];
    keys=[];
    mouse_down=0;
    live.x=game.live.x;
    live.y=game.live.y;
    res();
    view.x=game.live.vx;
    view.y=game.live.vy;
    let last_time={
        time:Date.now(),
        stmp:0
    };
    interval=setInterval(()=>{
        bk();
        draw();
        if(dm){
            //press 'd'
            if(key['d']&&keys[keys.length-1]=='d')bal.vx=250*(key['Shift']/3+1);
            //press 'a'
            if(key['a']&&keys[keys.length-1]=='a')bal.vx=-250*(key['Shift']/3+1);
            
            let x1=bal.x,y1=bal.y;
            hit();
            bal.move();
            let x2=bal.x,y2=bal.y;
            let dx=x2-x1,dy=y2-y1;

            //move view.x
            if(xa_c(bal.x)>cvs.width*0.6&&view.x<maxwidth-cvs.width){
                view_move(dx,0);
            }else if(xa_c(bal.x)<cvs.width*0.4&&view.x>0){
                view_move(dx,0);
            }
            //move view.y
            if(ya_c(bal.y)<cvs.height*0.2&&view.y<maxheight-cvs.height){
                view_move(0,dy);
            }else if(ya_c(bal.y)>cvs.height*0.3&&view.y>0){
                view_move(0,dy);
            }

            let new_time={
                time:Date.now(),
                stmp:stmp
            };
            if(new_time.time-last_time.time>=500){
                now_fps=(new_time.stmp-last_time.stmp)/(new_time.time-last_time.time)*1000;
                last_time.time=new_time.time;
                last_time.stmp=new_time.stmp;
            }
            
            if(stmp%3==0){
                if(lines.length==0){
                    lines.push([bal.x,bal.y,stmp]);
                }else{
                    let ln=lines.length-1;
                    if( bal.vx==0&&bal.vy==0){
                        lines.splice(0,1);
                    }
                    if(lines.length>0){
                        let ln=lines.length-1;
                        if( lines[ln][0]!=bal.x||
                            lines[ln][1]!=bal.y)
                            lines.push([bal.x,bal.y,stmp]);
                    }
                }
            }
            stmp++;

            for(let i=lines.length-1;i>=0;i--){
                if(stmp-lines[i][2]>1/t*1.5){
                    lines.splice(0,i);
                    break;
                }
            }
        }
    },1000/fps);
}
function xa_c(x){//虛座標->畫面座標
    return (x-view.x)*rr;
}
function ya_c(y){
    return cvs.height+(view.y-y)*rr;
}
function xc_a(x){//畫面座標->虛座標
    return x/rr+view.x;
}
function yc_a(y){
    return (cvs.height-y)/rr+view.y;
}
focus_out();
start(lvs[lv]);