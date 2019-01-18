var saveposX = [];
var saveposY = [];
var imgData = [];
var eraser_flag = 0;
var paint = 0;
var imgPtr = -1;
var brushType = 0;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var att = document.createAttribute("class");    // 更換鼠標用
var prevColor = myColor;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 預設畫筆規格
ctx.lineWidth = 5;
ctx.lineJoin = "round";
ctx.strokeStyle = "grey";
ctx.fillStyle = ctx.strokeStyle;

// 滑鼠在Canvas中點住時反應
function mousedown(event) {
    paint = 1;

    // 紀錄按鍵當下的座標 (開始畫畫瞬間的那一點)
    var findposX = event.pageX - canvas.offsetLeft;
    var findposY = event.pageY - canvas.offsetTop;
    addpos(findposX, findposY);

    // 拍照(未畫前)(Un/ReDo用)
    if (imgData.length == 0) {
        imgPtr++;
        imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    }

    // 畫初始點
    PaintStart();
}

// 滑鼠在Canvas中移動時反應
function mousemove(event) {
    if (paint == 1) {
        var findposX = event.pageX - canvas.offsetLeft;
        var findposY = event.pageY - canvas.offsetTop;
        addpos(findposX, findposY);
        PaintStart();
    }
}

// 滑鼠在Canvas中鬆開的反應
function mouseup(event) {
    paint = 0;
    saveposX.pop();
    saveposY.pop();

    // 拍照(Un/ReDo用)
    imgPtr++;
    imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    imgData.splice(imgPtr + 1, imgData.length - imgPtr + 1);
}

// 滑鼠在Canvas中點住時移出Canvas的反應
function mouseout() {
    paint = 0;
    saveposX.pop();
    saveposY.pop();
}

// 鼠標座標儲存功能
function addpos(findposX, findposY) {
    saveposX.push(findposX);
    saveposY.push(findposY);
}

// 畫畫功能
function PaintStart() {
    if (eraser_flag != 1)
        changeColor();

    ctx.beginPath();

    // 畫點
    if (saveposX.length == 1) {
        ctx.moveTo(saveposX[0] + 1, saveposY[0]);
        ctx.lineTo(saveposX[0], saveposY[0]);
        ctx.closePath();
        ctx.stroke();
    }
    else {
        switch (brushType) {

            // 畫線
            case 0:
                ctx.moveTo(saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[1], saveposY[1]);
                ctx.closePath();
                ctx.stroke();
                saveposX[0] = saveposX[1];
                saveposY[0] = saveposY[1];
                break;

            // 畫圓形
            case 1:
                ctx.arc(saveposX[0], saveposY[0], circle_radius() * 7, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                break;

            // 畫正方形
            case 2:
                ctx.moveTo(saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[0] + saveposX[1] - saveposX[0], saveposY[0]);
                ctx.lineTo(saveposX[0] + saveposX[1] - saveposX[0], saveposY[0] + saveposX[1] - saveposX[0]);
                ctx.lineTo(saveposX[0], saveposY[0] + saveposX[1] - saveposX[0]);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                break;

            // 畫三角形
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

// 橡皮擦功能
function eraserTool() {
    brushType = 0;
    eraser_flag = 1;
    att.value = "iconStyle2";
    canvas.setAttributeNode(att);
    prevColor = ctx.strokeStyle;
    ctx.strokeStyle = "white";
}

// 筆刷顏色設定 (點擊介面顏色選擇按鈕後執行)
function changeColor() {
    var myColor = document.getElementById("myColor").value;
    ctx.strokeStyle = myColor;
    ctx.fillStyle = myColor;
 //   att.value = "iconStyle1";
 //   canvas.setAttributeNode(att);
}

// 筆刷大小設定
function brushSize() {
    var myBrushSize = prompt("Brush Size: ", "5");
    ctx.lineWidth = myBrushSize;
}

// 新增文字功能
function addTxt() {
    var myTxt = prompt("Add Text Content: ", "write in here...");
    var myFontSize = prompt("請輸入字體大小(pixel): ", "30");
    var myFontStyle = prompt("請輸入字型代號: (0: Arial  1: sans-serif  2: serif  3: Verdana)", "0");
    var myFontIta = prompt("是否使用斜體？ (y / n)", "n");
    var myposX = prompt("X Coord.", "0");
    var myposY = prompt("Y Coord.", "0");

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

    // 拍照(未畫前)(Un/ReDo用)
    if (imgData.length == 0) {
        imgPtr++;
        imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    }

    if (myTxt == "" || myTxt == null) {
        // 沒輸入時的狀態
    }
    else
        ctx.fillText(myTxt, myposX, Number(myposY) + 30);

    // 拍照(Un/ReDo用)
    imgPtr++;
    imgData[imgPtr] = ctx.getImageData(0, 0, 800, 600);
    imgData.splice(imgPtr + 1, imgData.length - imgPtr + 1);
}


// Cursor icon (10%)


// Canvas重置
function clearMyCanvas() {
    var prevcolor2 = ctx.fillStyle;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = prevcolor2;
    imgData = [];
}

// Circle, rectangle and triangle
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

// Un/Re-do button
function Undo() {
    if (imgPtr > 0) {
        imgPtr--;
        ctx.putImageData(imgData[imgPtr], 0, 0);

    }
}
function Redo() {
    if (imgPtr < imgData.length - 1) {
        imgPtr++;
        ctx.putImageData(imgData[imgPtr], 0, 0);
    }
}

// Image tool (5%)
function myImage() {

}

// Canvas下載
function imgSave() {
    var link = document.createElement('a');
    link.download = "picture.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}