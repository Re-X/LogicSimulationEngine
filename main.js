
let componentList = [];
let jumperList = [];
let state, stateSab;
let topbar;

function setup() {
    topbar = false;
    UI.setup(windowWidth-20, windowHeight-70);
    pixelDensity(1);
    document.addEventListener('keydown', (event)=>{
        if(event.ctrlKey && event.key=='z'){
            undo();
            event.preventDefault();
            return;
        }
    });

    let canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
    canvas.addEventListener("mouseleave", ()=>{ topbar = true; });
    canvas.addEventListener("mouseenter", ()=>{ topbar = false; });
    toolbar.x = 60; 
    toolbar.y = UI.canvasHeight/2 - 200;
    
    stateSab = new SharedArrayBuffer(1);
    state = new Uint8Array(stateSab);
    state[0] = 0;
}

function draw() {
    background(250);

    pointer = UI.screenToWorld(mouseX, mouseY);
    
    gridPointer.x = round(pointer.x/10)*10;
    gridPointer.y = round(pointer.y/10)*10;
    rectMode(CORNERS);

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

    if(focusComponents.length && !topbar) {
        for(let i=0;i<focusComponents.length;i++){
            push();
            translate(focusComponents[i].x, focusComponents[i].y);
            noFill();
            rect(focusComponents[i].bounds.x1, focusComponents[i].bounds.y1, 
                focusComponents[i].bounds.x2, focusComponents[i].bounds.y2);
            pop();
        }
        let lcomp = focusComponents[focusComponents.length-1];
        if(lcomp.label){
            push();
            fill(250);
            rect(pointer.x, pointer.y, pointer.x+textWidth(lcomp.label)+10, pointer.y-20);
            noFill();
            text(lcomp.label, pointer.x+5, pointer.y-5);
            pop();
        }
        if(selectedTool!=null && selectedTool!=del && lcomp.name==selectedTool.name){
            gridPointer.x = lcomp.x;
            gridPointer.y = lcomp.y + (lcomp.bounds.y2-lcomp.bounds.y1);
            for(let i=0;i<componentList.length;i++){
                if((componentList[i].x+componentList[i].bounds.x1<=gridPointer.x && gridPointer.x<=componentList[i].x+componentList[i].bounds.x2 && 
                    componentList[i].y+componentList[i].bounds.y1<=gridPointer.y && gridPointer.y<=componentList[i].y+componentList[i].bounds.y2)) {
                    lcomp = componentList[i];
                    gridPointer.y = lcomp.y + (lcomp.bounds.y2-lcomp.bounds.y1);
                }
            }
        }
    }
    if(focusJumperPointList.length>1 && keyIsDown(16)){
        push();
        fill(250);
        let v = focusJumperPointList.length.toString();
        rect(pointer.x, pointer.y, pointer.x+textWidth(v)+10, pointer.y-20);
        noFill();
        text(v, pointer.x+5, pointer.y-5);
        pop();
    }

    stroke(40);
    if(selectedTool!=null) {
        stroke(50, 120, 100);
        if(selectedTool==del) selectedTool.draw(pointer.x, pointer.y, toolAngle);
        else selectedTool.draw(gridPointer.x, gridPointer.y, toolAngle);
    }

    if(mouseIsPressed && mouseButton==LEFT && !keyIsDown(17) && !state[0] && !topbar){
        noFill();
        rect(selectionRect.x1, selectionRect.y1, pointer.x, pointer.y);
        for(let i=0;i<selectionRect.selectedNodes.length;i++){
            circle(selectionRect.selectedNodes[i].x, selectionRect.selectedNodes[i].y, 10);
        }
    }

    pop();
    stroke(50, 120, 100);
    fill(50, 120, 100);
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
        componentList.splice(last[1][0], 0, last[1][1]);
    }
    else if(last[0]==4){
        for(let i=0;i<last[1].length;i++){
            componentList.push(last[1][i]);
        }
    }
}
