var canvas ;
var context ;
var circles = new Array() ;
var triplets = new Array() ;
var stop = 100000 ;
var n = 0 ;
var d = 10 ;
var color_counter = 0 ;
colors = new Array() ;
colors.push('red'  ) ;
colors.push('blue' ) ;
colors.push('green') ;

var x0 = -350 ;
var y0 =  -50 ;
var r  =  750 ;

function circle(r,x,y){
  this.r = r ;
  this.x = x ;
  this.y = y ;
  this.k = 0 ;
  this.p1 = new Array(x,y) ;
  this.p2 = new Array(x,y) ;
  this.p3 = new Array(x,y) ;
  if(this.r!=0) this.k = 1.0/this.r ;
  this.triplets = new Array() ;
  this.draw_on_canvas = function(){
    var gradient = context.createRadialGradient(this.x,this.y,this.r,this.x-this.r,this.y-this.r,this.r*0.5) ;
    var color = colors[color_counter] ;
    color_counter = ++color_counter%colors.length ;
    gradient.addColorStop(0,color) ;
    gradient.addColorStop(1,'white') ;
    
    // Fill with gradient
    context.fillStyle = gradient ;  
    context.strokeStyle = color ;
    context.strokeStyle = 'black' ;
    context.beginPath() ;
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI) ;
    context.fill() ;
    context.stroke() ;
  }
}
function circle_from_triplet(c1, c2, c3, depth){
  var r4 = c1.r*c2.r*c3.r/( c1.r*c2.r + c1.r*c3.r + c2.r*c3.r + 2*Math.sqrt( c1.r*c2.r*c3.r*(c1.r+c2.r+c3.r) ) ) ;
  var u = 0 ;
  var v = 0 ;
  
  if(c1.x*(c2.y-c3.y) + c2.x*(c3.y-c1.y) + c3.x*(c1.y-c2.y)==0){
    // Colinear case - do nothing
  }
  else{
    var A12 = c1.x*c1.x - c2.x*c2.x + c1.y*c1.y - c2.y*c2.y + (c2.r+r4)*(c2.r+r4) - (c1.r+r4)*(c1.r+r4) ;
    var A13 = c1.x*c1.x - c3.x*c3.x + c1.y*c1.y - c3.y*c3.y + (c3.r+r4)*(c3.r+r4) - (c1.r+r4)*(c1.r+r4) ;
    var B12 = 2*(c2.x-c1.x) ;
    var B13 = 2*(c3.x-c1.x) ;
    var C12 = 2*(c2.y-c1.y) ;
    var C13 = 2*(c3.y-c1.y) ;
    u =  (A12*C13-A13*C12)/(B13*C12-B12*C13) ;
    v = -(A12*B13-A13*B12)/(B13*C12-B12*C13) ;
  }
  var c4 = new circle(r4,u,v) ;
  c4.p1 = new Array(c1.x,c1.y) ;
  c4.p2 = new Array(c2.x,c2.y) ;
  c4.p3 = new Array(c3.x,c3.y) ;
  circles.push(c4) ;
  n++ ;
  if(n>stop) return ;
  if(depth>0){
    circle_from_triplet(c1, c2, c4, depth-1) ;
    circle_from_triplet(c1, c3, c4, depth-1) ;
    circle_from_triplet(c2, c3, c4, depth-1) ;
  }
}
function start(){
  canvas = document.getElementById('apollo_canvas') ;
  context = canvas.getContext('2d') ;
  context.strokeStyle = 'rgb(255,0,0)' ;
  circles.push( new circle(r,x0,y0) ) ;
  circles.push( new circle(r,x0+2*r,y0) ) ;
  circles.push( new circle(r,x0+r,y0+r*Math.sqrt(3)) ) ;
  circle_from_triplet(circles[0], circles[1], circles[2], d) ;
  for(var i=0 ; i<circles.length ; i++){
    circles[i].draw_on_canvas() ;
  }
}