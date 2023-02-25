const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearButton');
const markFalseButton = document.getElementById("markFalseButton");
const deleteButton = document.getElementById("deleteButton");
const downloadBtn = document.getElementById('download-btn');

let isMarkingFalse = false;
let deleteMode = false;




canvas.width = 800;
canvas.height = 600;
ctx.fillStyle = '#f2f2f2';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let startX, startY, endX, endY;

// Array to store drawn lines
let lines = [];

// Function to draw a line
function drawLine(x1, y1, x2, y2, color) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.lineWidth = 8; // set line width to 5
  context.stroke();
}



// Event listener for mouse down
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

// Event listener for mouse move
canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    endX = e.offsetX;
    endY = e.offsetY;
    // Clear canvas and redraw all lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < lines.length; i++) {
      drawLine(lines[i].startX, lines[i].startY, lines[i].endX, lines[i].endY);
    }
    // Draw new line
    drawLine(startX, startY, endX, endY);
  }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', (e) => {
  isDrawing = false;
  endX = e.offsetX;
  endY = e.offsetY;
  // Add new line to array
  lines.push({ startX, startY, endX, endY, type: true });
});

// Event listener for clear button click
clearBtn.addEventListener('click', () => {
  // Clear canvas and reset lines array
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  lines = [];
});

// Event listener for false line button click
markFalseButton.addEventListener("click", () => {
  if (deleteMode) {
    deleteMode = false;
    deleteButton.classList.remove("active-button");
  }
  isMarkingFalse = !isMarkingFalse;
  markFalseButton.classList.toggle("active-button", isMarkingFalse);

  // If delete button is already toggled on, toggle it off
  if (deleteButton.classList.contains("active-button")) {
    deleteMode = false;
    deleteButton.classList.remove("active-button");
  }
});

// Event listener for deleteButton button click
deleteButton.addEventListener("click", () => {
  if (isMarkingFalse) {
    isMarkingFalse = false;
    markFalseButton.classList.remove("active-button");
  }
  deleteMode = !deleteMode;
  deleteButton.classList.toggle("active-button", deleteMode);

  // If mark false button is already toggled on, toggle it off
  if (markFalseButton.classList.contains("active-button")) {
    isMarkingFalse = false;
    markFalseButton.classList.remove("active-button");
  }
});







// Function to delete a line
function deleteLine(lineIndex) {
  // Remove line from array
  lines.splice(lineIndex, 1);
  // Clear canvas and redraw all lines
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < lines.length; i++) {
    drawLine(lines[i].startX, lines[i].startY, lines[i].endX, lines[i].endY);
  }
}

// Event listener for mouse click on pre-drawn lines
canvas.addEventListener("click", (e) => {

  if (isMarkingFalse) {
    let clickedLine = null;
    // Check if mouse click is on a pre-drawn line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const minX = Math.min(line.startX, line.endX);
      const maxX = Math.max(line.startX, line.endX);
      const minY = Math.min(line.startY, line.endY);
      const maxY = Math.max(line.startY, line.endY);
      if (e.offsetX >= minX && e.offsetX <= maxX && e.offsetY >= minY && e.offsetY <= maxY) {
        clickedLine = i;
        break;
      }
    }
    // Mark line as false (red) if clicked, or as true (black) if clicked again
    if (clickedLine !== null) {
      if (lines[clickedLine].type) {
        lines[clickedLine].type = false;
        ctx.strokeStyle = "red";
      } else {
        lines[clickedLine].type = true;
        ctx.strokeStyle = "black";
      }
      drawLine(lines[clickedLine].startX, lines[clickedLine].startY, lines[clickedLine].endX, lines[clickedLine].endY);
      ctx.strokeStyle = "black";
    }
  } else if (deleteMode) {
    // Delete line if clicked
    let clickedLineIndex = -1;
    // Check if mouse click is on a pre-drawn line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const minX = Math.min(line.startX, line.endX);
      const maxX = Math.max(line.startX, line.endX);
      const minY = Math.min(line.startY, line.endY);
      const maxY = Math.max(line.startY, line.endY);
      if (e.offsetX >= minX && e.offsetX <= maxX && e.offsetY >= minY && e.offsetY <= maxY) {
        clickedLineIndex = i;
        break;
      }
    }
    // Delete line if clicked
    if (clickedLineIndex !== -1) {
      // Remove line from array
      lines.splice(clickedLineIndex, 1);
      // Clear canvas and redraw all lines
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.type) {
          ctx.strokeStyle = "black";
        } else {
          ctx.strokeStyle = "red";
        }
        drawLine(line.startX, line.startY, line.endX, line.endY);
      }
      ctx.strokeStyle = "black";
    }
  }
});





function getAllCombinations(lines) {
  const falseLines = lines.filter(line => !line.type);
  const result = [];

  function generateCombinations(currentIndex, currentCombination) {
    if (currentIndex === falseLines.length) {
      result.push([...currentCombination, ...lines.filter(line => line.type)]);
      return;
    }

    // include current false line in combination
    generateCombinations(currentIndex + 1, [...currentCombination, falseLines[currentIndex]]);

    // exclude current false line from combination
    generateCombinations(currentIndex + 1, currentCombination);
  }

  generateCombinations(0, []);

  return result;
}




function calculateDrawings(lines) {

  var data = {
    corners: [],
    walls: [],
    floorTextures: {}
  };
  // Loop through the lines and extract the corners and walls data
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Extract the corner data for the start and end points of the line
    var corner1 = { x: line.startX , y: line.startY };
    var corner2 = { x: line.endX, y: line.endY };

    // Add the corners to the corners array if they don't exist already
      data.corners.push(corner1);
      data.corners.push(corner2);

      corner1Index =getCornerIndex(data.corners,corner1)
      corner2Index =getCornerIndex(data.corners,corner2)
    // Add the wall to the walls array
    var wall = { corner1: corner1Index, corner2: corner2Index };
    data.walls.push(wall);


    
  }


  
  return data;
}

function getCorners() {
  const corners = [];
  for (const line of lines) {
    const { startX, startY, endX, endY } = line;
    corners.push({ x: startX, y: startY });
    corners.push({ x: endX, y: endY });
  }
  // Remove duplicates
  return corners.filter((corner, index) => {
    return corners.findIndex(c => c.x === corner.x && c.y === corner.y) === index;
  });
}

function getWalls() {
  const corners = getCorners();
  const walls = [];
  for (const line of lines) {
    const { startX, startY, endX, endY } = line;
    const corner1 = corners.findIndex(c => c.x === startX && c.y === startY);
    const corner2 = corners.findIndex(c => c.x === endX && c.y === endY);
    walls.push({ corner1, corner2 });
  }
  return walls;
}




document.getElementById('download-btn').addEventListener('click', function () {
  // Get the lines data from the canvas
  // var lines = canvas.getObjects('line');  
  // Create an array to hold the corners and walls data

  var result = [];

  
  all_combination = getAllCombinations(lines)
  console.log(all_combination)

  for (var i = 0; i < all_combination.length; i++) {
    result.push(calculateDrawings(all_combination[i]))
  }
  
console.log(result)
  // Convert the data to JSON format
  var jsonData = JSON.stringify(result);

  // Download the JSON file
  console.log(jsonData);
});

// Helper function to get the index of a corner in the corners array
function getCornerIndex(corners, corner) {
  for (var i = 0; i < corners.length; i++) {
    if (corners[i].x == corner.x && corners[i].y == corner.y) {
      return i;
    }
  }
  return -1;
}




