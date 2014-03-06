from project_module import project_object, image_object, link_object, challenge_object

p = project_object('apollo', 'Apollonian gasket generator')
p.domain = 'http://www.aidansean.com/'
p.path = 'apollo'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.github_repo_name = 'apollonian'
p.mathjax = True
p.links.append(link_object(p.domain, 'apollo/', 'Live page 1'))
p.links.append(link_object(p.domain, 'apollo/index2.php', 'Live page 2'))
p.introduction = 'One of my hobbies is creating fractals and one of the most interesting is the Apollonian gasket.  An area defined by some arcs and straight lines is recursively filled with circles and in all cases (except the trivial case of a single circle) this process recurses infinitely, making counting circles challenging.'
p.overview = '''Circles and lines are defined in much the same way (with lines having an infinite radius, and vanishing inverse radius) and from this point lines will be referred to as circles.  There is then a relatively straightforward relationship between the position of a circle and the three circles/lines which enclose it.  For three circles \\([c_1,c_2,c_3]\\) that enclose a circle \\(c_4\\), the radii are related by:

\\[
  r_4 = \\frac{r_1r_2r_3}{r_1r_2+r_2r_3+r_3r_1+2\\sqrt{r_1r_2r_3(r_1+r_2+r_3)}}
\\]

where \(r_i\) is the radius of the \(i\)th circle.  The centres of the circles, \((x_i,y_i)\) for the \(i\)th circle, are related by:

\\begin{eqnarray*}
  A_{12} & = & x_1^2 - x_2^2 + y_1^2 - y_2^2 + (r_2+r_4)(r_2+r_4) - (r_1+r_4)(r_1+r_4) \\\\
  A_{13} & = & x_1^2 - x_3^2 + y_1^2 - y_3^2 + (r_3+r_4)(r_3+r_4) - (r_1+r_4)(r_1+r_4) \\\\
  B_{12} & = & 2(x_2-x_1) \\\\
  B_{13} & = & 2(x_3-x_1) \\\\
  C_{12} & = & 2(y_2-y_1) \\\\
  C_{13} & = & 2(y_3-y_1) \\\\
  x_4    & = &  \\frac{A_{12}C_{13}-A_{13}C_{12}}{B_{13}C_{12}-B_{12}C_{13}} \\\\
  y_4    & = & -\\frac{A_{12}B_{13}-A_{13}B_{12}}{B_{13}C_{12}-B_{12}C_{13}}
\\end{eqnarray*}

Three circles used to create a new circle are known as a triplet.  Each time a new circle is created from a triplet this introduces three new "holes" in which additional circles can be added.  The three new triplets associated with these holes are then \\([c_1,c_2,c_4],[c_2,c_3,c_4],[c_3,c_1,c_4]\\).'''

p.challenges.append(challenge_object('The first challenge faced was to correctly reconstruct a new circle from a given triplet.  There is a degenerate case where the centres of the circles in a triplet are collinear and none of the circles contains another circle.  A degenerate collinear triplet can never emerge if the first triplet is not a degenerate collinear triplet.', 'The equations given above always find a new circle for a given triplet.  Degenerate collinear triplets are ignored.', 'Resolved'))

p.challenges.append(challenge_object('As triplets are processed this introduces new triplets.  These can lead to a few problems, including runaway memory and CPU usage, as well as the algorithm never completing one part of the gasket before moving on to another.', 'There is a limit on the number of circles that can be produced.  There is a stack of triplets and new triplets are added to this.  As triplets are processed, they get removed from the stack.  In this way the gasket can be filled uniformly, removing triplets keeps memory usage low, and the limit on the number of circles stops the algorithms before CPU use becomes an issue.  The result is an image where some areas may look sparsely populated.  This algorithm should be revisited to make it more robust.', 'Resolved, to be revisited.'))
