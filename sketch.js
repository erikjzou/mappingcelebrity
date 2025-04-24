let nodes = [];
let edges = [];
let nodePositions = {};
let nodeDegrees = {};
let hoveredNode = null;
let hoveredEdge = null;
let nodeImages = {};
let myFont;
let maskedImages = {}; // To store masked circular images
//to do the different colors, I could attach the colors 

let minNode = 80;
let maxNode = 120;
function preload() {
  nodeImages["Voltaire"] = loadImage("voltaire.jpg");
  nodeImages["Benjamin Franklin"] = loadImage("franklin.jpg");
  nodeImages["Madame du Barry"] = loadImage("dubarry.jpg");
  nodeImages["Marie Antoinette"] = loadImage("antoinette.jpg");
  nodeImages["David Garrick"] = loadImage("garrick.jpg");
  nodeImages["Elizabeth Farren"] = loadImage("farren.jpg");
  nodeImages["Kitty Fisher"] = loadImage("fisher.jpg");
  nodeImages["Georgiana Cavendish, Duchess of Devonshire"] = loadImage("georgiana.jpg");
  nodeImages["Emma Hamilton"] = loadImage("hamilton.jpg");
  nodeImages["Élisabeth Vigée Le Brun"] = loadImage("lebrun.jpg");
  nodeImages["Mai"] = loadImage("mai.jpg");
  nodeImages["Joshua Reynolds"] = loadImage("reynolds.jpg");
  nodeImages["Jean-Jacques Rousseau"] = loadImage("rousseau.jpg");
  nodeImages["Sarah Siddons"] = loadImage("siddons.jpg");
  myFont = loadFont('Lato-Regular.ttf');
}
let rawData = `
Benjamin Franklin	Voltaire
Benjamin Franklin	Élisabeth Vigée Le Brun
Benjamin Franklin	Joshua Reynolds
Benjamin Franklin	David Garrick
Benjamin Franklin	Marie Antoinette
Benjamin Franklin	Madame du Barry
Voltaire	Élisabeth Vigée Le Brun
Voltaire	Madame du Barry
Élisabeth Vigée Le Brun	Joshua Reynolds
Élisabeth Vigée Le Brun	Marie Antoinette
Élisabeth Vigée Le Brun	Georgiana Cavendish, Duchess of Devonshire
Élisabeth Vigée Le Brun	Madame du Barry
Élisabeth Vigée Le Brun	Emma Hamilton
Joshua Reynolds	David Garrick
Joshua Reynolds	Sarah Siddons
Joshua Reynolds	Mai
Joshua Reynolds	Georgiana Cavendish, Duchess of Devonshire
Joshua Reynolds	Kitty Fisher
Joshua Reynolds	Emma Hamilton
David Garrick	Sarah Siddons
David Garrick	Elizabeth Farren
David Garrick	Mai
David Garrick	Georgiana Cavendish, Duchess of Devonshire
David Garrick	Kitty Fisher
Sarah Siddons	Elizabeth Farren
Elizabeth Farren	Emma Hamilton
Mai	Georgiana Cavendish, Duchess of Devonshire
Marie Antoinette	Georgiana Cavendish, Duchess of Devonshire
Marie Antoinette	Madame du Barry
Marie Antoinette	Emma Hamilton
`;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(12);
  angleMode(DEGREES);
  textFont(myFont);

  // Parse raw data into edges
  let lines = rawData.trim().split('\n');
  for (let line of lines) {
    let [source, target] = line.split('\t');
    if (!nodes.includes(source)) nodes.push(source);
    if (!nodes.includes(target)) nodes.push(target);
    edges.push([source, target]);
		
		//Counting lines
		nodeDegrees[source] = (nodeDegrees[source] || 0) + 1;
		nodeDegrees[target] = (nodeDegrees[target] || 0) + 1;
  }

  // Calculate node positions
	//first command is how large the bigger circle is, based on the canvas size
  let radius = windowHeight/2.6;
  for (let i = 0; i < nodes.length; i++) {
    let angle = map(i, 0, nodes.length, 0, 360);
    let x = windowWidth/5 + width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;
    nodePositions[nodes[i]] = createVector(x, y);
  }
  //creating masks
  for (let node of nodes) {
    let img = nodeImages[node];
    let degree = nodeDegrees[node];
    let size = int(map(degree, 1, Math.max(...Object.values(nodeDegrees)), minNode, maxNode));

    if (img) {
      let mask = createGraphics(size, size);
      mask.noStroke();
      mask.fill(0);
      mask.ellipse(size / 2, size / 2, size, size);

      let masked = createImage(size, size);
      masked.copy(img, 0, 0, img.width, img.height, 0, 0, size, size);
      masked.mask(mask);
      maskedImages[node] = masked;
    }
  }
}

//drawing now
 function draw() {
  background(35, 35, 74);
	//fill(70, 82, 145);
	//rect(0, 0, windowWidth/2.55, windowHeight);
   let lightblu = color(138, 220, 255);
   //trying to make the text on the left
    fill(255);
   textSize(42);
   strokeWeight(0);
   text("Mapping Celebrity", windowWidth/5.1, windowHeight/4);
   fill(lightblu);
   rect(windowWidth/25, windowHeight/3.15, windowWidth/3.2, 5);
   fill(255);
   textSize(18);
   text("In the eighteenth century, celebrities, who captured the public's attention in the social hubs of London and Paris, emerged in multiple spheres ranging from the arts to fashion. This network reveals a crucial dimension of celebrity culture: the ways in which celebrity circles intersected. Hover over celebrities to see who they connected with throughout their lives", windowWidth/20, windowHeight/2, windowWidth/3.5)
   
  hoveredNode = null;
  hoveredEdge = null;
  // Detect edge hover
  for (let [a, b] of edges) {
    let v1 = nodePositions[a];
    let v2 = nodePositions[b];

    // Edge hover detection
		//Calculate the distance from mouth to all edges
    let d = distToSegment(createVector(mouseX, mouseY), v1, v2);
		//if close enough, then call the edge hovered on
    if (d < 5) {
      hoveredEdge = [a, b];
    }
		//if the edge is hovered on, then make that specific edge red and keep the others black
    stroke(hoveredEdge && hoveredEdge[0] === a && hoveredEdge[1] === b ? color(138, 220, 255) : color(255,255,255, 100));
    strokeWeight(5);
		//draw the line
    line(v1.x, v1.y, v2.x, v2.y);
  }

  // Draw and detect nodes
  noStroke();
  for (let node of nodes) {
    let pos = nodePositions[node];
    let degree = nodeDegrees[node];
    let nodesize = map(degree, 1, Math.max(...Object.values(nodeDegrees)), minNode, maxNode);
		//fill(181, 180, 180);
		//ellipse(pos.x, pos.y, nodesize*8/7, nodesize*8/7);
		
    if (dist(mouseX, mouseY, pos.x, pos.y) < nodesize / 2) {
      hoveredNode = node;
    }
    fill(hoveredNode === node ? color(138, 220, 255) : color(200));
	ellipse(pos.x, pos.y, nodesize*8/7, nodesize*8/7);
 
    //testing clip stuff
    let maskedImg = maskedImages[node];
    if (maskedImg) {
      imageMode(CENTER);
      image(maskedImg, pos.x, pos.y);
    }

    //text(node, pos.x, pos.y - nodesize / 2 - 5);
  }

  // Display tooltip
   //HOVERING STUFF
  if (hoveredNode) {
    fill(255, 200);
    textSize(12);
    noStroke();
    rect(mouseX + 10, mouseY - 15, textWidth(hoveredNode) + 10, 20);
    fill(0);
    noStroke();
    text(hoveredNode, mouseX + 10 + (textWidth(hoveredNode) + 10) / 2, mouseY - 5);
    fill(255);
    let boxleft = windowWidth/18;
    let boxup = windowHeight/1.5;
    let boxlength = windowWidth/3.5581;
    let boxheight = windowHeight/4;
    //making the box
    stroke(lightblu);
    strokeWeight(5);
    fill(35, 35, 74);
    rect(boxleft-5, boxup, boxlength+15, boxheight);
    fill(255);
    textSize(20)
    noStroke()
    textAlign(CENTER,CENTER);
    text(hoveredNode, boxleft, boxup + boxheight/4, boxlength - 10);
    
    
    for (let node of nodes) {
    let pos = nodePositions[node];
    let degree = nodeDegrees[node] || 1;
    let size = map(degree, 1, Math.max(...Object.values(nodeDegrees)), minNode, maxNode);
    if (dist(mouseX, mouseY, pos.x, pos.y) < size / 2) {
      // Find connected nodes
      let connected = [];
      for (let [a, b] of edges) {
        if (a === node) connected.push(b);
        else if (b === node) connected.push(a);
      }
      textSize(12)
      text(`Connected to: ${ connected.join(', ')}`, boxleft, boxup + boxheight/1.75, boxlength);
    
    }
    }
    
    
  } else if (hoveredEdge) {
    let [a, b] = hoveredEdge;
    let label = `${a} & ${b}`;
    fill(255);
    textSize(12);
    noStroke();
    rect(mouseX + 10, mouseY - 15, textWidth(label) + 10, 20);
    fill(0);
    noStroke();
    text(label, mouseX + 10 + (textWidth(label) + 10) / 2, mouseY - 5);
  }
}


// Utility to measure distance from point P to segment AB
function distToSegment(p, a, b) {
  let ap = p5.Vector.sub(p, a);
  let ab = p5.Vector.sub(b, a);
  let t = constrain(ap.dot(ab) / ab.magSq(), 0, 1);
  let closest = p5.Vector.add(a, ab.mult(t));
  return p5.Vector.dist(p, closest);
}
 
