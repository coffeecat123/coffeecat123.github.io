class ball{
    constructor(x,y,vx,vy,r,clr){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.r=r;
        this.clr=clr;
        this.lc;
    }
    move(){
        let lx=this.x,ly=this.y;
        this.x+=this.vx*t;
        this.y+=this.vy*t;
        this.vx=Math.floor(this.vx*0.5);
        this.vy=Math.floor(this.vy*0.5);
        //碰撞檢測
        if(this.x<this.r||this.x+this.r>cvs.width){
            this.x=lx;
        }
        if(this.y<this.r||this.y+this.r>cvs.height){
            this.y=ly;
        }
        for(let i in balls){
            let b=balls[i];
            if(b===this.lb)continue;
            if(bgclr.join()==b.clr.join())continue;
            if(distance(this.x,this.y,b.x,b.y)<this.r+b.r){
                chbk(b.clr.slice(),random(500,1000));
                this.lb=b;
            }
        }
        let ax=0,ay=0,wx,wy;
        for(let i in walls){
            let w=walls[i];
            if(w.clr.join()==bgclr.join())continue;
            if(distance(this.x,this.y,w.cx,w.cy)>this.r+sd/2**0.5)continue;
            if(ComputeCollision(sd,sd,this.r,this.x-w.cx,this.y-w.cy)){
                if(abs(lx-w.cx)<this.r+sd/2){
                    ay=1;
                    wy=w;
                }
                if(abs(ly-w.cy)<this.r+sd/2){
                    ax=1;
                    wx=w;
                }
                if(ax+ay==2)break;
            }
        }
        if(ax){
            this.x=lx+(wx==wy)*((this.x>wx.cx)-(this.x<wx.cx))*this.r/100;
        }
        if(ay){
            this.y=ly+(wx==wy)*((this.y>wy.cy)-(this.y<wy.cy))*this.r/100;
        }
    }
    drawbl(l){
        bl(this.x,this.y,this.r,`rgb(${this.clr.join()})`,l);
    }
    path2d(){
        let a=new Path2D();
        a.arc(this.x,this.y,this.r,0,2*Math.PI);
        return a;
    }
}
class wall{
    constructor(points,clr){
        this.points=points;//[x,y]
        this.cx=0;
        this.cy=0;
        for(let i in points){
            this.cx+=points[i][0];
            this.cy+=points[i][1];
        }
        this.cx/=points.length;
        this.cy/=points.length;
        this.clr=clr;
    }
    path2d(){
        let a=new Path2D();
        a.moveTo(this.points[0][0],this.points[0][1]);
        for(let i=1;i<this.points.length;i++){
            a.lineTo(this.points[i][0],this.points[i][1]);
        }
        a.lineTo(this.points[0][0],this.points[0][1]);
        a.lineTo(this.points[1][0],this.points[1][1]);
        return a;
    }
}