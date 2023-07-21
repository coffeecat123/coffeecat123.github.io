class game{
    constructor(maxjp,maxwidth,maxheight,x,y,vx,vy,ww){
        this.maxjp=maxjp;
        this.maxwidth=maxwidth;
        this.maxheight=maxheight;
        this.live={
            x,y,
            vx,vy
        };
        this.ww=ww;
    }
}
class wall{
    constructor(points,clr){
        this.points=points;//[x,y]
        this.clr=clr;
    }
    path2d(){
        let a=new Path2D();
        a.moveTo(xa_c(this.points[0][0]),ya_c(this.points[0][1]));
        for(let i=1;i<this.points.length;i++){
            a.lineTo(xa_c(this.points[i][0]),ya_c(this.points[i][1]));
        }
        a.lineTo(xa_c(this.points[0][0]),ya_c(this.points[0][1]));
        return a;
    }
}
class ball{
    constructor(x,y,vx,vy,r){//虛座標
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.r=r;
        this.clr="#f00";
    }
    move(){
        if(!touch.bottom)this.vy+=g*t;
        this.x+=this.vx*t;
        this.y+=this.vy*t;
        if(key['a']==0&&key['d']==0)
            this.vx=parseInt(Math.abs(this.vx)*0.999)*Math.sign(this.vx);
        if(this.vy==0&&key['a']==0&&key['d']==0)
            this.vx=parseInt(Math.abs(this.vx)*0.9)*Math.sign(this.vx);
        this.clr=HSLToRGB(Math.abs(this.y/maxheight-this.x/maxwidth)*360,100,50);
    }
    drawbl(){
        this.clr=HSLToRGB(Math.abs(this.y/maxheight-this.x/maxwidth)*360,100,50);
        bl(xa_c(this.x),ya_c(this.y),this.r*rr,this.clr);
    }
    path2d(){
        let a=new Path2D();
        a.arc(xa_c(this.x),ya_c(this.y),this.r*rr,0,2*Math.PI);
        return a;
    }
}