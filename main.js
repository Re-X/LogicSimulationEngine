
let componentList = [];
let jumperList = [];
let state, stateSab;

function setup() {
    UI.setup(windowWidth-50, windowHeight-100);

    let canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    toolbar.x = 60; 
    toolbar.y = UI.canvasHeight/2 - 200;
    
    stateSab = new SharedArrayBuffer(1);
    state = new Uint8Array(stateSab);
    state[0] = 0;
}

function draw() {
    background(250);

    pointer = UI.screenToWorld(mouseX, mouseY);
    
    gridPointer.x = int(pointer.x/10)*10;
    gridPointer.y = int(pointer.y/10)*10;

    push();
    UI.update();
    stroke(40);
    
    drawComponents();
    drawJumpers();
    
    if(focusNode){
        noFill();
        circle(focusNode.x, focusNode.y, 10);
        if(focusNode.label){
            push();
            rectMode(CORNERS);
            fill(250);
            rect(pointer.x, pointer.y, pointer.x+textWidth(focusNode.label)+8, pointer.y-17);
            noFill();
            text(focusNode.label, pointer.x+4, pointer.y-4);
            pop();
        }
    }

    if(focusComponents.length) {
        for(let i=0;i<focusComponents.length;i++){
            push();
            translate(focusComponents[i].x, focusComponents[i].y);
            rectMode(CORNERS);
            noFill();
            rect(focusComponents[i].bounds.x1, focusComponents[i].bounds.y1, 
                focusComponents[i].bounds.x2, focusComponents[i].bounds.y2);
            pop();
        }
        if(focusComponents[focusComponents.length-1].label){
            push();
            rectMode(CORNERS);
            fill(250);
            rect(pointer.x, pointer.y, pointer.x+textWidth(focusComponents[focusComponents.length-1].label)+10, pointer.y-20);
            noFill();
            text(focusComponents[focusComponents.length-1].label, pointer.x+5, pointer.y-5);
            pop();
        }
    }

    stroke(40);
    if(selectedTool!=null) {
        if(selectedTool==del) selectedTool.draw(pointer.x, pointer.y);
        else selectedTool.draw(gridPointer.x, gridPointer.y);
    }

    if(mouseIsPressed && mouseButton==LEFT){
        noFill();
        rectMode(CORNERS);
        rect(selectionRect.x1, selectionRect.y1, pointer.x, pointer.y);
        for(let i=0;i<selectionRect.selectedNodes.length;i++){
            circle(selectionRect.selectedNodes[i].x, selectionRect.selectedNodes[i].y, 10);
        }
    }

    pop();
    stroke(50, 200, 100);
    //fill(50, 200, 100);
    toolbar.draw();
}

