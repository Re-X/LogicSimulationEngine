
let componentList = [];
let jumperList = [];
let state, stateSab;

function setup() {
    UI.setup(windowWidth-50, windowHeight-100);

    document.addEventListener('keydown', (event)=>{
        if(event.ctrlKey && event.key=='z'){
            undo();
        }
    });

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

function undo(){
    if(scheme_log.length==0) return;
    let last = scheme_log.pop();
    if(last[0]==0){
        for(let j=last[1].length-1;j>=0;j--){
            jumperList[last[1][j]].origin.connectedJumpers.splice(jumperList[last[1][j]].origin.connectedJumpers.indexOf(last[1][j]), 1);
            jumperList[last[1][j]].end.connectedJumpers.splice(jumperList[last[1][j]].end.connectedJumpers.indexOf(last[1][j]), 1);
            jumperList.splice(last[1][j], 1);
        }
    }
    else if(last[0]==1){
        for(let j=0;j<last[1].length;j++){
            jumperList.push(last[1][j]);
            last[1][j].origin.connectedJumpers.push(last[1][j]);
            last[1][j].end.connectedJumpers.push(last[1][j]);
        }
    }
    else if(last[0]==2){
        componentList.splice(componentList.indexOf(last[1]), 1);
        for(let i=0;i<jumperList.length;i++){
            jumperList[i].isTravelled = false;
        }
        if(last[1].inputs) for(let i=0;i<last[1].inputs.length;i++){
            for(let j=0;j<last[1].inputs[i].connectedJumpers.length;j++){
                last[1].inputs[i].connectedJumpers[j].del([]);
            }
        }
        if(last[1].outputs) for(let i=0;i<last[1].outputs.length;i++){
            for(let j=0;j<last[1].outputs[i].connectedJumpers.length;j++){
                last[1].outputs[i].connectedJumpers[j].del([]);
            }
        }
    }
    else if(last[0]==3){
        for(let i=0;i<last[1].length;i++){
            componentList.push(last[1][i]);
        }
    }
}
