class ball{
    constructor(x,y,vx,vy,r,clr){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.r=r;
        this.clr=clr;
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
            if(bgclr.join()==b.clr.join())continue;
            if(distance(this.x,this.y,b.x,b.y)<this.r+b.r){
                chbk(b.clr.slice(),random(500,1000));
            }
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