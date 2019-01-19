var saveposX = [];
var saveposY = [];
var imgData = [];
var eraser_flag = 0;
var paint = 0;
var imgPtr = -1;
var brushType = 0;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var att = document.createAttribute("class");    //Create attribute for cursor changing
var prevColor = myColor;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//Default settings for brush
ctx.lineWidth = 5;
ctx.lineJoin = "round";
ctx.strokeStyle = "grey";
ctx.fillStyle = ctx.strokeStyle;

//Mouse button down event when cursor is inside the canvas
function mousedown(event) {
    paint = 1;

    //Save the cursor position when clicking
    var findposX = event.pageX - canvas.offsetLeft;
    var findposY = event.pageY - canvas.offsetTop;
    addpos(findposX, findposY);

    //Save current canvas content (for Un/Re-do)
    if (imgData.length == 0) {
        imgPtr++;
        imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    }

    //Start drawing
    PaintStart();
}

//Mouse hovering event
function mousemove(event) {
    if (paint == 1) {
        var findposX = event.pageX - canvas.offsetLeft;
        var findposY = event.pageY - canvas.offsetTop;
        addpos(findposX, findposY);
        PaintStart();
    }
}

//Mouse button release event
function mouseup(event) {
    paint = 0;
    saveposX.pop();
    saveposY.pop();

    //Save current canvas content (for Un/Re-do)
    imgPtr++;
    imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    imgData.splice(imgPtr + 1, imgData.length - imgPtr + 1);
}

//Mouse button release event when cursor is outside the canvas
function mouseout() {
    paint = 0;
    saveposX.pop();
    saveposY.pop();
}

//Save the cursor position
function addpos(findposX, findposY) {
    saveposX.push(findposX);
    saveposY.push(findposY);
}

//Drawing
function PaintStart() {
    if (eraser_flag != 1)
        changeColor();

    ctx.beginPath();

    //Draw dot
    if (saveposX.length == 1) {
        ctx.moveTo(saveposX[0] + 1, saveposY[0]);
        ctx.lineTo(saveposX[0], saveposY[0]);
        ctx.closePath();
        ctx.stroke();
    }
    else {
        switch (brushType) {

            //Draw line
            case 0:
                ctx.moveTo(saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[1], saveposY[1]);
                ctx.closePath();
                ctx.stroke();
                saveposX[0] = saveposX[1];
                saveposY[0] = saveposY[1];
                break;

            //Draw circle
            case 1:
                ctx.arc(saveposX[0], saveposY[0], circle_radius() * 7, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                break;

            //Draw rectangle
            case 2:
                ctx.moveTo(saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[0] + saveposX[1] - saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[0] + saveposX[1] - saveposX[0], saveposY[0] + saveposX[1] - saveposX[0]);
                ctx.lineTo(saveposX[0], saveposY[0] + saveposX[1] - saveposX[0]);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                break;

            //Draw triangle
            case 3:
                ctx.moveTo(saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[0] + (saveposX[1] - saveposX[0]) * 1.3, saveposY[0] + (saveposX[1] - saveposX[0]) * 1.6);
                ctx.lineTo(saveposX[0] - (saveposX[1] - saveposX[0]) * 1.3, saveposY[0] + (saveposX[1] - saveposX[0]) * 1.6);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                break;
        }
        saveposX.pop();
        saveposY.pop();
    }
}

function circle_radius() {
    var x = saveposX[1] - saveposX[0];
    var y = saveposY[1] - saveposY[0];
    var abs_value = x ^ 2 + y ^ 2;
    return Math.sqrt(abs_value);
}

//Eraser tool
function eraserTool() {
    brushType = 0;
    eraser_flag = 1;
    att.value = "iconStyle2";
    canvas.setAttributeNode(att);
    prevColor = ctx.strokeStyle;
    ctx.strokeStyle = "white";
}

//Change brush color
function changeColor() {
    var myColor = document.getElementById("myColor").value;
    ctx.strokeStyle = myColor;
    ctx.fillStyle = myColor;
 //   att.value = "iconStyle1";
 //   canvas.setAttributeNode(att);
}

//Change brush size
function brushSize() {
    var myBrushSize = prompt("Brush Size: ", "5");
    ctx.lineWidth = myBrushSize;
}

//Add txt to canvas
function addTxt() {
    var myTxt = prompt("Add Text Content: ", "write in here...");
    var myFontSize = prompt("Font Size (pixel): ", "30");
    var myFontStyle = prompt("Font type code: (0 = Arial,  1 = sans-serif,  2 = serif,  3 = Verdana)", "0");
    var myFontIta = prompt("italic (y / n)", "n");
    var myposX = prompt("X position in canvas", "0");
    var myposY = prompt("Y position in canvas", "0");

    if (myFontStyle == "0")
        myFontStyle = " Arial";
    else if (myFontStyle == "1")
        myFontStyle = " sans-serif";
    else if (myFontStyle == "2")
        myFontStyle = " serif";
    else if (myFontStyle == "3")
        myFontStyle = " Verdana";
    else
        myFontStyle = "Arial";

    if (myFontIta == "y")
        myFontIta = "italic ";
    else if (myFontIta == "n")
        myFontIta = "normal ";
    else
        myFontIta = "normal ";

    ctx.font = myFontIta + myFontSize + "px" + myFontStyle;

    //Save current canvas content before drawing (for Un/Re-do)
    if (imgData.length == 0) {
        imgPtr++;
        imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    }

    if (myTxt == "" || myTxt == null) {
        //If nothing input
    }
    else
        ctx.fillText(myTxt, myposX, Number(myposY) + 30);

    //Save current canvas content (for Un/Re-do)
    imgPtr++;
    imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    imgData.splice(imgPtr + 1, imgData.length - imgPtr + 1);
}

//Reset entire canvas
function clearMyCanvas() {
    var prevcolor2 = ctx.fillStyle;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = prevcolor2;
    imgData = [];
}

//Change the cursor according to the tools selected
function paintShape(type) {
    brushType = type;
    eraser_flag = 0;

    if (brushType == 0) {
        att.value = "iconStyle1";
        canvas.setAttributeNode(att);
    }
    else if (brushType == 1) {
        att.value = "iconStyle3";
        canvas.setAttributeNode(att);
    }
    else if (brushType == 2) {
        att.value = "iconStyle4";
        canvas.setAttributeNode(att);
    }
    else if (brushType == 3) {
        att.value = "iconStyle5";
        canvas.setAttributeNode(att);
    }
}

//Un-do to the previous canvas content
function Undo() {
    if (imgPtr > 0) {
        imgPtr--;
        ctx.putImageData(imgData[imgPtr], 0, 0);

    }
}

//Re-do to the latter canvas content
function Redo() {
    if (imgPtr < imgData.length - 1) {
        imgPtr++;
        ctx.putImageData(imgData[imgPtr], 0, 0);
    }
}

//Image tool
function myImage() {
    //Blank
}

//Download canvas as JPG file
function imgSave() {
    var link = document.createElement('a');
    link.download = "picture.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}
