var canvas  ;
var context ;
var verbosity = 0 ;

var circles = new Array() ;
var maxDepth  =   -50 ;
var stop      =   -1 ;
var rLimit    =  0.5 ;
var recursiveRLimit = 10 ;
var delay     =    5 ;
var n         =    0 ;
var nTotal    =    0 ;
var lineWidth =    0 ;
var gx        = 0.25 ; // gradient center x
var gy        = 0.25 ; // gradient center y
var gr        = 0.01 ; // inner gradient radius
var gColor    = '#000000' ; // gradient color
var f         = 0.85  ; // fraction for splitting circles
var r0        =  400 ;
var x0        =  100 ;
var y0        =  100 ;
var i         =    0 ;
var iColor    =    0 ;

var signs = [  
                [ 1, 1, 1, 1] ,
                [ 1, 1, 1,-1] ,
                [ 1, 1,-1, 1] ,
                [ 1, 1,-1,-1] ,
                [ 1,-1, 1, 1] ,
                [ 1,-1, 1,-1] ,
                [ 1,-1,-1, 1] ,
                [ 1,-1,-1,-1] ,
                [-1, 1, 1, 1] ,
                [-1, 1, 1,-1] ,
                [-1, 1,-1, 1] ,
                [-1, 1,-1,-1] ,
                [-1,-1, 1, 1] ,
                [-1,-1, 1,-1] ,
                [-1,-1,-1, 1] ,
                [-1,-1,-1,-1] ,
              ] ;

var angleCounter =  0 ;
var angleN       = 11 ;
var pi = Math.PI ;

var color_counter = 0 ;
colors = new Array() ;
//for(var i=0 ; i<50 ; i++){ colors.push( 'rgb(' + (255) + ',' + (2*i) + ',' + (2*i) + ')' ) ; }
//for(var i=0 ; i<5 ; i++){ colors.push( 'rgb(' + (255) + ',' + (20*i) + ',' + (20*i) + ')' ) ; }
//colors.push('black'  ) ;
colors.push('red'    ) ;
colors.push('orange' ) ;
colors.push('yellow' ) ;
colors.push('green'  ) ;
colors.push('blue'   ) ;
colors.push('purple' ) ;
colors.push('white'  ) ;
//colors.push('gold'   ) ;
//colors.push('teal'   ) ;
//colors.push('cyan'   ) ;
//colors.push('magenta') ;

var circleCounter = 0 ;
var  depthCounter = 0 ;

function line(x1, y1, x2, y2){
  this.type     = 'line' ;
  this.isLine   = true   ;
  this.isCircle = false  ;
  this.x1 = x1 ;
  this.y1 = y1 ;
  this.x2 = x2 ;
  this.y2 = y2 ;
  this.m  = (x1==x2) ? 0 : (y2-y1)/(x2-x1) ;
  this.theta = atan2(y2-y1,x2-x1) ;
  if(this.theta<0) this.theta += 2*pi ;
  this.draw_on_canvas = function(){
    context.beginPath() ;
    context.moveTo(this.x1,this.y1) ;
    context.lineTo(this.x2,this.y2) ;
    context.stroke() ;
  }
  this.angle = function(l2){
    var diff = this.theta-l2.theta ;
    if(diff>pi || diff<-pi){
      diff = -(pi-this.theta-l2.theta) ;
      return diff ;
    }
    else{
      return diff ;
    }
  }
  this.intersection = function(l2){
    var p = new Array() ;
    // Not a foolproof function, need to add some protections!
    if(this.x1==l2.x1 && this.y1==l2.y1){
      p.push(this.x1) ;
      p.push(this.y1) ;
    }
    else if(this.x1==l2.x2 && this.y1==l2.y2){
      p.push(this.x1) ;
      p.push(this.y1) ;
    }
    else if(this.x2==l2.x1 && this.y2==l2.y1){
      p.push(this.x2) ;
      p.push(this.y2) ;
    }
    else if(this.x2==l2.x2 && this.y2==l2.y2){
      p.push(this.x2) ;
      p.push(this.y2) ;
    }
    else{
      var x = (l2.y1-this.y1)/(this.m-l2.m) ;
      var y = this.y1 + this.m*x ;
      p.push(x) ;
      p.push(y) ;
    }
    return p ;
  }
}
function circle(r,x,y){
  this.type     = 'circle' ;
  this.isLine   = false    ;
  this.isCircle = true     ;
  this.r = r ;
  this.x = x ;
  this.y = y ;
  this.k = 1/r ;
  this.p1 = new Array(x,y) ;
  this.p2 = new Array(x,y) ;
  this.p3 = new Array(x,y) ;
  if(this.r!=0) this.k = 1.0/this.r ;
  this.triplets = new Array() ;
  this.draw_on_canvas = function(){
    var gradient = context.createRadialGradient(this.x,this.y,this.r,this.x+gx*this.r,this.y+gy*this.r,gr*this.r) ;
    var color = colors[iColor] ;
    gradient.addColorStop(0,color) ;
    gradient.addColorStop(1,gColor) ;
    
    // Fill with gradient
    context.fillStyle = gradient ;
    //context.fillStyle   = color ;
    context.strokeStyle = color ;
    context.strokeStyle = 'black' ;
    context.beginPath() ;
    context.arc(this.x, this.y, this.r, 0, 2*pi) ;
    context.fill() ;
    context.stroke() ;
  }
}
function append_circle(c1, c2, c3, c4, depth){
  if(!circles[depth]) circles[depth] = new Array() ;
  circles[depth].push(c4) ;
  c4.draw_on_canvas() ;
  if(c4.r>recursiveRLimit){
    recursively_split_circle(c4) ;
    iColor = ++iColor%colors.length ;
  }
  nTotal++ ;
  if(++n>stop && stop>0) return ;
  if(depth<maxDepth || maxDepth<0){
    circle_from_triplet(c1, c2, c4, depth+1) ;
    circle_from_triplet(c1, c3, c4, depth+1) ;
    circle_from_triplet(c2, c3, c4, depth+1) ;
  }
}
function circle_from_triplet(sA, sB, sC, depth){
  var nLines = 0 ;
  if(sA.isLine==true) nLines++ ;
  if(sB.isLine==true) nLines++ ;
  if(sC.isLine==true) nLines++ ;
  
  if     (nLines==3) circle_from_LLL(sA, sB, sC, depth) ;
  else if(nLines==2) circle_from_LLC(sA, sB, sC, depth) ;
  else if(nLines==1) circle_from_LCC(sA, sB, sC, depth) ;
  else               circle_from_CCC(sA, sB, sC, depth) ;
}
function circle_from_LLL(lA, lB, lC, depth){
  var p1 = lA.intersection(lB) ;
  var p2 = lA.intersection(lC) ;
  var p3 = lB.intersection(lC) ;
  var x1 = p1[0] ;
  var y1 = p1[1] ;
  var x2 = p2[0] ;
  var y2 = p2[1] ;
  var x3 = p3[0] ;
  var y3 = p3[1] ;
  
  var m12 = (y2-y1)/(x2-x1) ;
  var m13 = (y3-y1)/(x3-x1) ;
  var m23 = (y3-y2)/(x3-x2) ;
  
  var d12 = sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) ;
  var d13 = sqrt((x1-x3)*(x1-x3)+(y1-y3)*(y1-y3)) ;
  var d23 = sqrt((x2-x3)*(x2-x3)+(y2-y3)*(y2-y3)) ;
  var r1 = 0.5*(d12+d13-d23) ;
  var r2 = 0.5*(d12+d23-d13) ;
  var r3 = 0.5*(d13+d23-d12) ;
  
  var x = (d23*x1+d13*x2+d12*x3)/(d12+d13+d23) ;
  var y = (d23*y1+d13*y2+d12*y3)/(d12+d13+d23) ;
  var r = sqrt(r1*r2*r3/(r1+r2+r3)) ;
  var c4 = new circle(r,x,y) ;
  append_circle(lA, lB, lC, c4, depth) ;
}
function circle_from_LLC(s1, s2, s3, depth){
  var lA = 0 ;
  var lB = 0 ;
  var cC = 0 ;
  if(s1.isCircle==true){
    lA = s2 ;
    lB = s3 ;
    cC = s1 ;
  }
  else if(s2.isCircle==true){
    lA = s1 ;
    lB = s3 ;
    cC = s2 ;
  }
  else{
    lA = s1 ;
    lB = s2 ;
    cC = s3 ;
  }
  var p   = lA.intersection(lB) ;
  
  var l1  = new line(cC.x,cC.y,p[0],p[1]) ;
  var phi = 0.5*deltaPhi(lA.theta, lB.theta) ;
  var S = cos(phi) ;
  var r = cC.r*((1-S)/(1+S)) ;
  if(r<rLimit) return ;
  var x = cC.x + (cC.r+r)*cos(l1.theta) ;
  var y = cC.y + (cC.r+r)*sin(l1.theta) ;
  
  var c4 = new circle(r,x,y) ;
  append_circle(lA, lB, cC, c4, depth) ;
}
function circle_from_LCC(s1, s2, s3, depth){
  var lA = 0 ;
  var cB = 0 ;
  var cC = 0 ;
  if(s1.isLine==true){
    lA = s1 ;
    if(s2.r>s3.r){
      cB = s2 ;
      cC = s3 ;
    }
    else{
      cB = s3 ;
      cC = s2 ;
    }
  }
  else if(s2.isLine==true){
    lA = s2 ;
    if(s1.r>s3.r){
      cB = s1 ;
      cC = s3 ;
    }
    else{
      cB = s3 ;
      cC = s1 ;
    }
  }
  else{
    lA = s3 ;
    if(s1.r>s2.r){
      cB = s1 ;
      cC = s2 ;
    }
    else{
      cB = s2 ;
      cC = s1 ;
    }
  }
  var r1 = cB.r ;
  var r2 = cC.r ;
  var x1 = cB.x ;
  var x2 = cC.x ;
  var y1 = cB.y ;
  var y2 = cC.y ;
  
  var r = r1*r2/(r1+r2+2*sqrt(r1*r2) ) ;
  if(r<rLimit) return ;
  var R = r+cC.r ;
  
  var t = lA.theta ;
  var v = (r1-r) ;
  var w = 2*sqrt(r1*r) ;
  
  var x = 0 ;
  var y = 0 ;
  for(var i=0 ; i<16 ; i++){
    x = cB.x + signs[i][0]*w*cos(t) + signs[i][1]*v*sin(t) ;
    y = cB.y - signs[i][2]*w*sin(t) + signs[i][3]*v*cos(t) ;
    if(abs((x-cC.x)*(x-cC.x)+(y-cC.y)*(y-cC.y)-R*R)<1e-3) break ;
  }
  
  var c4 = new circle(r,x,y) ;
  append_circle(lA, cB, cC, c4, depth) ;
}
function circle_from_CCC(cA, cB, cC, depth){
  // Order the circles by radii
  var c1 = 0 ;
  var c2 = 0 ;
  var c3 = 0 ;
  if(cA.r>=cB.r && cA.r>=cC.r){
    c1 = cA ;
    if(cB.r>=cC.r){
      c2 = cB ;
      c3 = cC ;
    }
    else{
      c2 = cC ;
      c3 = cB ;
    }
  }
  else if(cB.r>=cA.r && cB.r>=cC.r){
    c1 = cB ;
    if(cA.r>=cC.r){
      c2 = cA ;
      c3 = cC ;
    }
    else{
      c2 = cC ;
      c3 = cA ;
    }
  }
  else{
    c1 = cC ;
    if(cA.r>=cB.r){
      c2 = cA ;
      c3 = cB ;
    }
    else{
      c2 = cB ;
      c3 = cA ;
    }
  }
  
  var r1 = c1.r ;
  var r2 = c2.r ;
  var r3 = c3.r ;
  var x1 = c1.x ;
  var x2 = c2.x ;
  var x3 = c3.x ;
  var y1 = c1.y ;
  var y2 = c2.y ;
  var y3 = c3.y ;
  
  var colinear = ( abs(x1*(y1-y3) + x2*(y3-y1) + x3*(y1-y2)) < 1e-3 ) ;
  if     (abs(x1-x2)<1e-3 && abs(x1-x3)<1e-3) colinear = true ;
  else if(abs(y1-y2)<1e-3 && abs(y1-y3)<1e-3) colinear = true ;
  else if( abs( (x1-x2)/(y1-y2) - (x3-x2)/(y3-y2) ) <1e-3 ) colinear = true ;
  
  var d12 = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ;
  var d31 = (x3-x1)*(x3-x1) + (y3-y1)*(y3-y1) ;
  var interior = (d12<r1*r1 && d31<r1*r1) ;
  
  if(colinear){
    // Get r4 and the height/distance of the centres of the two new circles
    var r4 = -r1*r2*r3/(-r1*r2-r1*r3+r2*r3+2*sqrt( abs(r1*r2*r3*(-r1+r2+r3)) ) ) ;
    if(r4<rLimit) return ;
    var w1 = ( r1*r1 + (r2+r4)*(r2+r4) - (r3+r4)*(r3+r4) )/(2*r1) ;
    var h2 = (r2+r4)*(r2+r4) - w1*w1 ;
    
    var hp =  sqrt(h2) ;
    var hm = -sqrt(h2) ;
    
    // Get the angle
    var t = atan2(y3-y1,x3-x1) ;
    
    var x4p = x2 + w1*cos(t) - hp*sin(t) ;
    var y4p = y2 + w1*sin(t) + hp*cos(t) ;
    var x4m = x2 + w1*cos(t) - hm*sin(t) ;
    var y4m = y2 + w1*sin(t) + hm*cos(t) ;
    
    var c4p = new circle(r4,x4p,y4p) ;
    var c4m = new circle(r4,x4m,y4m) ;
    c4p.draw_on_canvas() ;
    c4m.draw_on_canvas() ;
    append_circle(c1, c2, c3, c4p, depth) ;
    append_circle(c1, c2, c3, c4m, depth) ;
  }
  else if(interior){
    var r4 = -r1*r2*r3/(-r1*r2-r1*r3+r2*r3-2*sqrt( abs(r1*r2*r3*(-r1+r2+r3) ) ) ) ;
    if(r4<rLimit) return ;
    var A12 = x1*x1 - x2*x2 + y1*y1 - y2*y2 + (r2+r4)*(r2+r4) - (-r1+r4)*(-r1+r4) ;
    var A13 = x1*x1 - x3*x3 + y1*y1 - y3*y3 + (r3+r4)*(r3+r4) - (-r1+r4)*(-r1+r4) ;
    var B12 = 2*(x2-x1) ;
    var B13 = 2*(x3-x1) ;
    var C12 = 2*(y2-y1) ;
    var C13 = 2*(y3-y1) ;
    var x4 =  (A12*C13-A13*C12)/(B13*C12-B12*C13) ;
    var y4 = -(A12*B13-A13*B12)/(B13*C12-B12*C13) ;
    var c4 = new circle(r4,x4,y4) ;
    c4.draw_on_canvas() ;
    append_circle(c1, c2, c3, c4, depth) ;
  }
  else{
    var r4 = r1*r2*r3/(r1*r2+r1*r3+r2*r3+2*sqrt( r1*r2*r3*(r1+r2+r3) ) ) ;
    if(r4<rLimit) return ;
    var A12 = x1*x1 - x2*x2 + y1*y1 - y2*y2 + (r2+r4)*(r2+r4) - (r1+r4)*(r1+r4) ;
    var A13 = x1*x1 - x3*x3 + y1*y1 - y3*y3 + (r3+r4)*(r3+r4) - (r1+r4)*(r1+r4) ;
    var B12 = 2*(c2.x-c1.x) ;
    var B13 = 2*(c3.x-c1.x) ;
    var C12 = 2*(c2.y-c1.y) ;
    var C13 = 2*(c3.y-c1.y) ;
    var x4 =  (A12*C13-A13*C12)/(B13*C12-B12*C13) ;
    var y4 = -(A12*B13-A13*B12)/(B13*C12-B12*C13) ;
    var c4 = new circle(r4,x4,y4) ;
    c4.draw_on_canvas() ;
    append_circle(c1, c2, c3, c4, depth) ;
  }
  return ;
}
function split_circle(c1, f, t){
  var g = 1-f ;
  var r1 = c1.r ;
  var r2 = f*r1 ;
  var r3 = (1-f)*r1 ;
  var x1 = c1.x ;
  var y1 = c1.y ;
  var x2 = x1 - r1*(1-f)*cos(t) ;
  var y2 = y1 + r1*(1-f)*sin(t) ;
  var x3 = x1 + r1*(1-g)*cos(t) ;
  var y3 = y1 - r1*(1-g)*sin(t) ;
  
  circles.push(new Array()) ;
  circles[0].push(c1) ;
  circles[0].push(new circle(r2, x2, y2)) ;
  circles[0].push(new circle(r3, x3, y3)) ;
  draw_circles() ;
  circle_from_triplet(circles[0][0], circles[0][1], circles[0][2], 0) ;
}
function start(){
  canvas = document.getElementById('apollo_canvas') ;
  context = canvas.getContext('2d') ;
  context.strokeStyle = 'black' ;
  context.lineWidth = lineWidth ;
  
  circles[0] = new Array() ;
  
  var xA =   50 ;
  var yA =  800.01 ;
  var xB =  800 ;
  var yB =   50 ;
  var xC = 1550 ;
  var yC =  800 ;
  var xD =  800 ;
  var yD = 1550 ;
  
  //var xA = Math.random()*800 ;
  //var yA = Math.random()*800 ;
  //var xB = Math.random()*800 ;
  //var yB = Math.random()*800 ;
  //var xC = Math.random()*800 ;
  //var yC = Math.random()*800 ;
  circles[0].push( new line(xA,yA,xB,yB) ) ;
  circles[0].push( new line(xB,yB,xC,yC) ) ;
  circles[0].push( new line(xC,yC,xA,yA) ) ;
  
  draw_circles() ;
  for(var j=0 ; j<circles[0].length ; j++){ if(circles[0][j].r>recursiveRLimit) recursively_split_circle(circles[0][j]) ; }
  circle_from_triplet(circles[0][2],circles[0][0],circles[0][1],1) ;
  
  var dataURL = canvas.toDataURL() ;
  document.getElementById('canvasImg').src = dataURL ;
}

function recursively_split_circle(c){
  circles = new Array() ;
  circles.push(new Array()) ;
  circles[0].push(c) ;
  i = 0 ;
  while(true){
    i++ ;
    var c1 = 0 ;
    var c2 = 0 ;
    if(circles[0].length>2){
      var c1 = circles[0][1] ;
      var c2 = circles[0][2] ;
    }
    else{
      c1 = circles[0][0] ;
    }
    
    if(c1.r*5<rLimit) break ;
    circles = new Array() ;
    angleCounter++ ;
    var angle = Math.pow(-1,i)*2*pi*angleCounter/angleN ;
    verbosity = i ;
    split_circle(c1, f, angle) ;
    if(abs(f-0.5)<1e-3 && c2!=0) split_circle(c2, f, angle) ;
  }
}

function draw_circles(){
  n = 0 ;
  depthCounter = 0 ;
  circleCounter = 0 ;
  draw_next_circle(0) ;
}
function draw_next_circle(d){
  if(d!=0 && d<circles.length) depthCounter = d ;
  if(depthCounter>=circles.length) return ;
  circles[depthCounter][circleCounter].draw_on_canvas() ;
  circleCounter++ ;
  if(circleCounter>=circles[depthCounter].length){
    depthCounter++ ;
    circleCounter = 0 ;
  }
  if(depthCounter>=circles.length) return ;
  if(circleCounter<circles[depthCounter].length) draw_next_circle(0) ;
}
function deg(x)    { return x*180/pi   ; }
function abs(x)    { return Math.abs(x)     ; }
function sin(x)    { return Math.sin(x)     ; }
function cos(x)    { return Math.cos(x)     ; }
function sqrt(x)   { return Math.sqrt(x)    ; }
function atan2(y,x){ return Math.atan2(y,x) ; }
function complex_multiply(z1,z2){ return [z1[0]*z2[0]-z1[1]*z2[1],z1[0]*z2[1]+z1[1]*z2[0]] ; }
function complex_sqrt(z){
  var r = sqrt(z[0]*z[0]+z[1]*z[1]) ;
  var t = atan2(z[1],z[0]) ;
  return [sqrt(r)*cos(0.5*t),sqrt(r)*sin(0.5*t)] ;
}
function deltaPhi(phi1, phi2){
  if(abs(phi1-phi2)<pi) return phi1-phi2 ;
  return 2*pi-abs(phi1-phi2) ;
}