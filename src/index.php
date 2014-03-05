<?php
$title = 'Apollonian gasket' ;
$js_scripts = array('apollo.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <div class="right">
    <p>This page makes an Apollonian gasket fractal.  Apollonian gaskets are cool.  And pretty.</p>
  </div>
  
  <div class="right">
    <h3>The gasket</h3>
    <div class="blurb">
      <div id="canvas_container" style="text-align:center">
        <canvas id="apollo_canvas" width="500" height="500" style="border:1px solid black;margin-top:10px;margin:auto"></canvas>
      </div>
    </div>
  </div>
  
<?php foot() ; ?>