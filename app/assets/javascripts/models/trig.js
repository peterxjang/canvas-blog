function radians (degrees) {return degrees * (Math.PI/180)}
function degrees (radians) {return radians * (180/Math.PI)}
// Calculate the angle between two points.
// cf. http://stackoverflow.com/a/12221474/257568
function angle (cx, cy, px, py) {var x = cx - px; var y = cy - py; return Math.atan2 (-y, -x)}
function distance (p1x, p1y, p2x, p2y) {return Math.sqrt (Math.pow ((p2x - p1x), 2) + Math.pow ((p2y - p1y), 2))}
