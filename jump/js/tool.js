function $(el){
    return document.querySelector(el);
}
function DegToRad(a){
    return a*Math.PI/180;
}
function random(a,b){
    return Math.floor(Math.random()*(b-a+1))+a;
}
function HSLToRGB(h,s,l) {
  s/=100;
  l/=100;
  let c=(1-Math.abs(2*l-1))*s,
      x=c*(1-Math.abs((h/60)%2-1)),
      m=l-c/2,
      r=0,
      g=0,
      b=0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;  
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "rgb(" + r + "," + g + "," + b + ")";
}
function distance(x1,y1,x2,y2){
    return ((x1-x2)**2+(y1-y2)**2)**0.5;
}