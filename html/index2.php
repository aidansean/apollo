<?php
$title = 'Apollonian gasket' ;
$js_scripts = array('apollo2.js') ;
include_once('project.php') ;
include_once($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <div class="right">
    <p>This page makes an Apollonian gasket fractal.  Apollonian gaskets are cool.  And pretty.</p>
  </div>
  
  <div class="right">
    <h3>The gasket</h3>
    <div class="blurb">
      <div id="canvas_container">
        <canvas id="apollo_canvas" width="1600" height="800" style="border:1px solid black;margin-top:10px;margin:auto"></canvas>
      </div>
      <img id="canvasImg" width="1600px" height="800px"/>
    </div>
  </div>

<?php foot() ; ?>