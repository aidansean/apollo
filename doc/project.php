<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/apollo" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=apollo" ;
$project = new project_object("apollo", "Apollonian gasket generator", "https://github.com/aidansean/apollo", "http://aidansean.com/projects/?tag=apollo", "apollo/images/project.jpg", "apollo/images/project_bw.jpg", "One of my hobbies is creating fractals and one of the most interesting is the Apollonian gasket.  An area defined by some arcs and straight lines is recursively filled with circles and in all cases (except the trivial case of a single circle) this process recurses infinitely, making counting circles challenging.", "Art,Images,Maths", "canvas,HTML,JavaScript") ;
$project->set_wiki_link("https://en.wikipedia.org/wiki/Apollonian_gasket") ;
?>