let pointer = { x:0, y:0 };
let gridPointer = { x: 0, y: 0 };

const UI = {
    canvasWidth: 400, canvasHeight: 400,
    origin: { x: 0, y: 0 },
    scale: 1,
    setup(_canvasWidth=400, _canvasHeight=400){
        this.canvasWidth = _canvasWidth;
        this.canvasHeight = _canvasHeight;
        this.origin.x = _canvasWidth/2;
        this.origin.y = _canvasHeight/2;
        createCanvas(_canvasWidth, _canvasHeight);
        textFont("Montserrat");
    },

    update(){
        translate(this.origin.x, this.origin.y);
        scale(this.scale);
    },

    screenToWorld(_x, _y){
        let x, y;
        x = (_x - this.origin.x)/UI.scale;
        y = (_y - this.origin.y)/UI.scale;
        return { x: x, y: y };
    },

    worldToScreen(_x, _y){
        let x, y;
        x = this.origin.x + (_x*UI.scale);
        y = this.origin.y + (_y*UI.scale);
        return { x: x, y: y };
    },

    mouseInScreenRect(x1, y1, x2, y2) {
        return (x1<=mouseX && mouseX<=x2 && y1<=mouseY && mouseY<=y2);
    },

    mouseInWorldRect(x1, y1, x2, y2) {
        return (x1<=pointer.x && pointer.x<=x2 && y1<=pointer.y && pointer.y<=y2);
    }
};


let focusTool = null;
let selectedTool = null;

let focusNode = null;
let selectedNode = null;
let selectedNodeList = []; 

let focusJumperPoint = null;
let focusJumperPointList = [];
let selectedJumperPoint = null;

let selectedComponent = null;

let selectionRect = { x1: 0, y1: 0, x2: 0, y2: 0, selectedNodes: [] };

const toolbar = {
    toolList: [inNode, outNode, not, or, nor, xor, and, nand, buffer, del],
    x: 0, y: 0,
    mouseOver(){
        return mouseX>=this.x-22.5 && mouseX<=this.x+22.5;
        //return (mouseX>=this.x-22.5 && mouseX<=this.x+22.5 && mouseY>=this.y && mouseY<=this.y + 60*0.75*this.toolList.length);
    },
    draw(_x=this.x, _y=this.y){
        push();
        translate(_x, _y);
        scale(0.75);
        focusTool = null;
        let ty = 30;
        for(let i=0;i<this.toolList.length;i++){
            push();
            if(this.toolList[i].componentHeaders){
                if(UI.mouseInScreenRect(_x - 25, _y + (ty - 30)*0.75, _x + textWidth(this.toolList[i].name), _y + (ty + 30)*0.75)){
                    scale(2);
                    text(this.toolList[i].name, -Math.min(20, textWidth(this.toolList[i].name)/2), ty/2);
                    focusTool = this.toolList[i];
                }
                else{
                    scale(1.5);
                    text(this.toolList[i].name, -Math.min(20, textWidth(this.toolList[i].name)/2), ty/1.5);
                }
            }
            else {
                if(UI.mouseInScreenRect(_x - 30*0.75, _y + (ty - 30)*0.75, _x + 30*0.75, _y + (ty + 30)*0.75)) {
                    scale(1.25);
                    this.toolList[i].draw(0, ty/1.25);
                    text(this.toolList[i].name, (mouseX-_x)/(1.25*0.75)+20, (mouseY-_y)/(0.75*1.25)+10);
                    focusTool = this.toolList[i];
                }
                else this.toolList[i].draw(0, ty);
            }
            pop();
            ty += 60;
        }
        pop();
    }
}

function mouseWheel(){
    if(toolbar.mouseOver()){
        let s = (event.deltaY < 0) ? 5 : -5;
        if(toolbar.y + s < UI.canvasHeight-60 && toolbar.y+60*0.75*toolbar.toolList.length + s>60) toolbar.y += s;
        return;
    }

    if(!UI.mouseInScreenRect(0, 0, UI.canvasWidth, UI.canvasHeight)) return;
    let s = (event.deltaY < 0) ? 1.05 : 0.95;
    UI.scale *= s;
    UI.origin.x += (1-s)*(mouseX - UI.origin.x);
    UI.origin.y += (1-s)*(mouseY - UI.origin.y);
}

function mouseDragged(){
    if(!UI.mouseInScreenRect(0, 0, UI.canvasWidth, UI.canvasHeight)) return;
    if(mouseButton==LEFT && keyIsDown(17)) {
        UI.origin.x += mouseX - pmouseX;
        UI.origin.y += mouseY - pmouseY;
    }
}

function mousePressed(){
    //remove component-label
    if(selectedComponent){
        let input = document.getElementById("component-label");
        if(input!=null){
            document.body.removeChild(input);
            selectedComponent.label = input.value;
            selectedComponent = null;
        }
    }

    if(mouseButton==RIGHT) {
        if(selectedTool){
            selectedTool = null;
            document.getElementById('defaultCanvas0').style.cursor = 'unset';
        }
        else {
            if(selectedNode||selectedJumperPoint) jumperList.pop();
            else if(selectedNodeList.length){
                for(let i=0;i<selectedNodeList.length;i++){
                    jumperList.pop();
                }
            }
            selectedNode = null;
            selectedJumperPoint = null;
            selectedNodeList = [];
        }
        return;
    }

    if(focusTool!=null) {
        selectedTool = focusTool;
        if(!keyIsDown(17)){
            if(selectedTool==del) document.getElementById('defaultCanvas0').style.cursor = 'none';
            else document.getElementById('defaultCanvas0').style.cursor = 'unset';
        }
    }
    else if(selectedTool!=null && !keyIsDown(17)) {
        if(selectedTool!=del) {
            let comp = Object.create(selectedTool);
            comp.construct(gridPointer.x, gridPointer.y);
            componentList.push(comp);
            scheme_log.push([2, [componentList.length-1]]);
            //selectedTool = null;
        }
        else {
            if(selectedNode||selectedJumperPoint) jumperList.pop();
            else if(selectedNodeList.length){
                for(let i=0;i<selectedNodeList.length;i++){
                    jumperList.pop();
                }
            }
            selectedNode = null;
            selectedJumperPoint = null;
            selectedNodeList = [];
        }
    }

    if(focusComponents.length){
        selectedComponent = focusComponents[0];
        //add component-label
        if(state[0]==0 && selectedTool==null && document.getElementById("component-label")==null){
            let input = document.createElement("input");
            input.type = "text";
            input.id = "component-label"
            input.style.position = "absolute";
            input.style.left = winMouseX + "px";
            input.style.top  = winMouseY + "px";
            input.style.width = "50px";
            if(selectedComponent.label) input.value = selectedComponent.label;
            document.body.appendChild(input);
            setTimeout(function() {
                input.focus();
            }, 0);
        }
        else if('act' in selectedComponent) selectedComponent.act(activeValues);
    }

    selectionRect.x1 = pointer.x; selectionRect.y1 = pointer.y;
}

function mouseReleased(){
    if(mouseButton==LEFT && selectedTool==del && !keyIsDown(17)){
        if(focusJumperPointList.length){
            for(let i=0;i<jumperList.length;i++){
                jumperList[i].isTravelled = false;
            }
            for(let i=0;i<focusJumperPointList.length;i++) 
                focusJumperPointList[i].jumper.del();
        }
        else if(focusComponents.length){
            x = [];
            focusComponents.forEach(focusComponent => {
                for(let i=0;i<jumperList.length;i++){
                    jumperList[i].isTravelled = false;
                }
                for(let i=0;i<focusComponent.inputs.length;i++){
                    for(let j=0;j<focusComponent.inputs[i].connectedJumpers.length;j++){
                        focusComponent.inputs[i].connectedJumpers[j].del();
                    }
                }
                for(let i=0;i<focusComponent.outputs.length;i++){
                    for(let j=0;j<focusComponent.outputs[i].connectedJumpers.length;j++){
                        focusComponent.outputs[i].connectedJumpers[j].del();
                    }
                }
                x.push(focusComponent);
                componentList.splice(componentList.indexOf(focusComponent), 1);  
            });
            scheme_log.push([3, x]);    
        }
    }
    
    if(keyIsDown(16)){
        for(let i=0;i<selectionRect.selectedNodes.length;i++){
            if(selectedNodeList.includes(selectionRect.selectedNodes[i])) continue;
            selectedNodeList.push(selectionRect.selectedNodes[i]);
            jumperList.push(new Jumper(selectionRect.selectedNodes[i]));
            selectionRect.selectedNodes[i].connectedJumpers.push(jumperList[jumperList.length-1]);
        }
    }
    else if(selectedNodeList.length && selectionRect.selectedNodes.length){
        let x = [];
        for(let i=0;i<selectedNodeList.length;i++){
            if(i==selectionRect.selectedNodes.length) break;
            if(selectionRect.selectedNodes[i]!=selectedNodeList[i]){
                jumperList[jumperList.length-selectedNodeList.length+i].end = selectionRect.selectedNodes[i];
                selectionRect.selectedNodes[i].connectedJumpers.push(jumperList[jumperList.length-selectedNodeList.length+i]);
                jumperList[jumperList.length-selectedNodeList.length+i].anchorPoints.push([selectionRect.selectedNodes[i].x, selectionRect.selectedNodes[i].y]);
                x.push(jumperList.length-selectedNodeList.length+i);
            }
            else jumperList.splice(jumperList.length-selectedNodeList.length+i, 1);
        }
        selectedNodeList.splice(0, selectionRect.selectedNodes.length);
        if(x.length) scheme_log.push([0, x]);
    }
    else if(keyIsDown(17)){
        if(!focusNode && !focusJumperPointList.length) for(let i=0;i<selectedNodeList.length;i++){
            jumperList[jumperList.length-1-i].anchorPoints.push([pointer.x, (pointer.y + 10*(selectedNodeList.length-1-i))]);
        }
    }
    if(!selectionRect.selectedNodes.length && selectedTool==null && mouseButton==LEFT){
        createJumpers();
    }
}

function createJumpers(){
    if(keyIsDown(16)){
        if(focusNode){
            if(!(selectedNodeList.includes(focusNode))){
                selectedNodeList.push(focusNode);
                jumperList.push(new Jumper(focusNode));
                focusNode.connectedJumpers.push(jumperList[jumperList.length-1]);
            }
            else {
                let i=selectedNodeList.indexOf(focusNode);
                jumperList.splice(jumperList.length - selectedNodeList.length + i, 1);
                selectedNodeList.splice(i, 1);
            }
        }
        else if(focusJumperPointList.length){
            for(let i=0;i<focusJumperPointList.length;i++){
                let index = -1;
                for(let j=0;j<selectedNodeList.length;j++){
                    if(selectedNodeList[j].jumper == focusJumperPointList[i].jumper) {index = j; break;}
                }
                if(index==-1){
                    selectedNodeList.push(focusJumperPointList[i]);
                    jumperList.push(new Jumper(focusJumperPointList[i]));
                    focusJumperPointList[i].jumper.connectedJumpers.push(jumperList[jumperList.length-1]);
                }
                else {
                    jumperList.splice(jumperList.length - selectedNodeList.length + index, 1);
                    selectedNodeList.splice(index, 1);
                }
            }
        }
        return;
    }
    if(selectedNode || selectedJumperPoint){
        if(focusNode){
            if(focusNode!=selectedNode){
                jumperList[jumperList.length-1].end = focusNode;
                focusNode.connectedJumpers.push(jumperList[jumperList.length-1]);
                jumperList[jumperList.length-1].anchorPoints.push([focusNode.x, focusNode.y]);
                scheme_log.push([0, [jumperList.length-1]]);
            }
            else jumperList.pop();
            selectedNode = null;
            selectedJumperPoint = null;
        }
        else if(focusJumperPointList.length){
            if(focusJumperPointList[0].jumper!=jumperList[jumperList.length-1]){
                jumperList[jumperList.length-1].end = focusJumperPointList[0].jumper;
                focusJumperPointList[0].jumper.connectedJumpers.push(jumperList[jumperList.length-1]);
                jumperList[jumperList.length-1].anchorPoints.push([focusJumperPointList[0].x, focusJumperPointList[0].y]);
                scheme_log.push([0, [jumperList.length-1]]);
            }
            else jumperList.pop();
            selectedNode = null;
            selectedJumperPoint = null;
        }
        else {
            jumperList[jumperList.length-1].anchorPoints.push([pointer.x, pointer.y]);
        }

    }
    else if(selectedNodeList.length){
        if(focusNode){
            if(focusNode!=selectedNodeList[0] && selectedNodeList.length){
                jumperList[jumperList.length-selectedNodeList.length].end = focusNode;
                focusNode.connectedJumpers.push(jumperList[jumperList.length-selectedNodeList.length]);
                jumperList[jumperList.length-selectedNodeList.length].anchorPoints.push([focusNode.x, focusNode.y]);
                scheme_log.push([0, [jumperList.length-selectedNodeList.length]]);
            }
            else jumperList.splice(jumperList.length-selectedNodeList.length, 1);
            selectedNodeList.splice(0, 1);
        }
        else if(focusJumperPointList.length){
            let x = [];
            for(let i=0;i<focusJumperPointList.length;i++){
                if(i==selectedNodeList.length) break;
                jumperList[jumperList.length-selectedNodeList.length+i].end = focusJumperPointList[i].jumper;
                focusJumperPointList[i].jumper.connectedJumpers.push(jumperList[jumperList.length-selectedNodeList.length+i]);
                jumperList[jumperList.length-selectedNodeList.length+i].anchorPoints.push([focusJumperPointList[i].x, focusJumperPointList[i].y]);
                x.push(jumperList.length-selectedNodeList.length+i);
            }
            selectedNodeList.splice(0, focusJumperPointList.length);
            if(x.length) scheme_log.push([0, x]);
        }
        else if(!keyIsDown(17)){
            for(let i=0;i<selectedNodeList.length;i++){
                jumperList[jumperList.length-1-i].anchorPoints.push([pointer.x, pointer.y]);
            }
        }
    }
    else {
        if(focusNode){
            jumperList.push(new Jumper(focusNode));
            focusNode.connectedJumpers.push(jumperList[jumperList.length-1]);
            selectedNode = focusNode;
        }
        else if(focusJumperPoint){
            jumperList.push(new Jumper(focusJumperPoint));
            focusJumperPoint.jumper.connectedJumpers.push(jumperList[jumperList.length-1]);
            selectedJumperPoint = focusJumperPoint;
        }
        else {

        }
    }
}

function keyPressed(){
    if(keyCode==ENTER) {
        let input = document.getElementById("component-label");
        if(input!=null){
            document.body.removeChild(input);
            selectedComponent.label = input.value;
            selectedComponent = null;
        }
        else {
            simulate();
        }
    }
    else if(keyCode==17){
        document.getElementById('defaultCanvas0').style.cursor = 'move';
    }
}

function keyReleased(){
    if(selectedTool!=del) document.getElementById('defaultCanvas0').style.cursor = 'unset';
    else document.getElementById('defaultCanvas0').style.cursor = 'none';
}

let componentHeaders = [];
let sab;
let activeValues;
let userInput;
let compute;

let Module;

function simulate(){
    if(state[0]==0) {
        state[0] = 1;
        document.getElementsByClassName("sim")[0].innerHTML = "Simulating";
    }
    else {
        //compute.terminate();
        state[0] = 0;
        document.getElementsByClassName("sim")[0].innerHTML = "Simulate";
        return;
    }

    if(compute==undefined) compute = new Worker('compute.js');

    Module = ParseNetwork(componentList, jumperList);
    
    let n = Module.componentGroups.length;
    sab = new SharedArrayBuffer(n);
    activeValues = new Int8Array(sab);
    for(let i=0;i<activeValues.length;i++) activeValues[i] = -1;

    usab = new SharedArrayBuffer(3);
    userInput = new Int8Array(usab);
    userInput[0] = -1;
    userInput[1] = -1;

    compute.postMessage([stateSab, usab, Module, sab]);
}

function createSubmodule(){
    if(document.getElementById("label").value=="") return;

    let subModule = ParseNetwork(componentList, jumperList);

    subModule.name = document.getElementById("label").value;
    let k = Math.max(subModule.innerInputs.length, subModule.innerOutputs.length);
    if(k%2) subModule.bounds = { x1: -textWidth(subModule.name)/2-20, y1: -(k-1)*5-20, x2: textWidth(subModule.name)/2+20, y2: (k-1)*5+20};
    else subModule.bounds = { x1: -textWidth(subModule.name)/2-20, y1: -k*5-10, x2: textWidth(subModule.name)/2+20, y2: k*5+20};
    //console.log(subModule);
    Object.setPrototypeOf(subModule, SubModule.prototype);
    for(let i=0;i<toolbar.toolList.length;i++){
        if(toolbar.toolList[i].name==subModule.name) toolbar.toolList.splice(i, 1);
    }
    toolbar.toolList.push(subModule);
}

function downloadModule(){
    let name = document.getElementById("label").value;
    let subModule = null;
    for(let i=0;i<toolbar.toolList.length;i++){
        if(toolbar.toolList[i].name==name) { subModule = toolbar.toolList[i]; break; }
    }
    if(subModule==null) return;

    const jsonString = JSON.stringify([subModule]);
    const blob = new Blob([jsonString], { type: "application/json" });

    const downloadlink = document.createElement("a");
    downloadlink.href = URL.createObjectURL(blob);
    downloadlink.download = subModule.name+".json";
    document.body.appendChild(downloadlink);
    downloadlink.click();
    document.body.removeChild(downloadlink);
}
function downloadModules(){
    let modules = [];
    for(let i=10;i<toolbar.toolList.length;i++){
        modules.push(toolbar.toolList[i]);
    }
    const jsonString = JSON.stringify(modules);
    const blob = new Blob([jsonString], { type: "application/json" });

    const downloadlink = document.createElement("a");
    downloadlink.href = URL.createObjectURL(blob);
    downloadlink.download = "modules.json";
    document.body.appendChild(downloadlink);
    downloadlink.click();
    document.body.removeChild(downloadlink);
}
function loadModules(){
    let input = document.createElement("input");
    input.type = "file";
    input.addEventListener('change', function() {
        var reader = new FileReader();
        reader.addEventListener('load', function() {
          var jsonData = JSON.parse(reader.result);
          
          for(let i=0;i<jsonData.length;i++){
            Object.setPrototypeOf(jsonData[i], SubModule.prototype);
            toolbar.toolList.push(jsonData[i]);
          }
        });
        reader.readAsText(this.files[0]);
    });
    input.click();
}

function downloadSchematic(){
    let schematic = {};
    schematic.components = [];
    for(let i=0;i<componentList.length;i++){
        schematic.components.push([componentList[i].name, componentList[i].x, componentList[i].y]);
        if(componentList[i].label){
            schematic.components[schematic.components.length-1].push(componentList[i].label);
        }
    }
    schematic.jumpers = [];
    let k = 0;
    for(let i=0;i<componentList.length;i++){
        for(let j=0;j<componentList[i].inputs.length;j++){
            componentList[i].inputs[j].nodeId = k;
            k++;
        }
        for(let j=0;j<componentList[i].outputs.length;j++){
            componentList[i].outputs[j].nodeId = k;
            k++;
        }
    }
    for(let i=0;i<jumperList.length;i++){
        jumperList[i].jumperId = i;
    }
    for(let i=0;i<jumperList.length;i++){
        let x = [];
        x.push(jumperList[i].anchorPoints);

        if(jumperList[i].origin instanceof Node)
            x.push([0, jumperList[i].origin.nodeId]);
        else x.push([1, jumperList[i].origin.jumperId]);

        if(jumperList[i].end instanceof Node)
            x.push([0, jumperList[i].end.nodeId]);
        else x.push([1, jumperList[i].end.jumperId]);
        
        schematic.jumpers.push(x);
    }
    const jsonString = JSON.stringify(schematic); 
    const blob = new Blob([jsonString], { type: "application/json" });

    const downloadlink = document.createElement("a");
    downloadlink.href = URL.createObjectURL(blob);
    downloadlink.download = "schematic.json";
    document.body.appendChild(downloadlink);
    downloadlink.click();
    document.body.removeChild(downloadlink);
}

function loadSchematic(){
    let input = document.createElement("input");
    input.type = "file";
    input.addEventListener('change', function() {
        var reader = new FileReader();
        reader.addEventListener('load', function() {
            var jsonData = JSON.parse(reader.result);
            componentList = [];
            for(let i=0;i<jsonData.components.length;i++){
              for(let j=0;j<toolbar.toolList.length;j++){
                  if(toolbar.toolList[j].name==jsonData.components[i][0]){
                      let comp = Object.create(toolbar.toolList[j]);
                      comp.construct(jsonData.components[i][1], jsonData.components[i][2]);
                      componentList.push(comp);
                      if(jsonData.components[i].length==4){
                        comp.label = jsonData.components[i][3];
                      }
                  }
              }
            }

            let nodes = [];
            for(let i=0;i<componentList.length;i++){
                for(let j=0;j<componentList[i].inputs.length;j++){
                    nodes.push(componentList[i].inputs[j]);
                }
                for(let j=0;j<componentList[i].outputs.length;j++){
                    nodes.push(componentList[i].outputs[j]);
                }
            }

            jumperList = [];
            for(let i=0;i<jsonData.jumpers.length;i++){
                jumperList.push(new Jumper(null));
            }

            for(let i=0;i<jsonData.jumpers.length;i++){
                
                jumperList[i].anchorPoints = jsonData.jumpers[i][0];

                if(jsonData.jumpers[i][1][0]==0){
                    jumperList[i].origin = nodes[jsonData.jumpers[i][1][1]];
                    nodes[jsonData.jumpers[i][1][1]].connectedJumpers.push(jumperList[i]);
                }
                else {
                    jumperList[i].origin = jumperList[jsonData.jumpers[i][1][1]];
                    jumperList[jsonData.jumpers[i][1][1]].connectedJumpers.push(jumperList[i]);
                }

                if(jsonData.jumpers[i][2][0]==0){
                    jumperList[i].end = nodes[jsonData.jumpers[i][2][1]];
                    nodes[jsonData.jumpers[i][2][1]].connectedJumpers.push(jumperList[i]);
                }
                else {
                    jumperList[i].end = jumperList[jsonData.jumpers[i][2][1]];
                    jumperList[jsonData.jumpers[i][2][1]].connectedJumpers.push(jumperList[i]);
                }
            }

        });
        reader.readAsText(this.files[0]);
    });
    input.click();
    scheme_log = [];
}

function drawComponents(){
    if(mouseIsPressed && mouseButton==LEFT && selectedTool==del && !keyIsDown(17)){
        if(focusJumperPoint){
            for(let i=0;i<jumperList.length;i++){
                jumperList[i].isTravelled = false;
            }
            focusJumperPoint.jumper.del();
        }
        else if(focusComponents.length==1){
            for(let i=0;i<jumperList.length;i++){
                jumperList[i].isTravelled = false;
            }
            for(let i=0;i<focusComponents[0].inputs.length;i++){
                for(let j=0;j<focusComponents[0].inputs[i].connectedJumpers.length;j++){
                    focusComponents[0].inputs[i].connectedJumpers[j].del();
                }
            }
            for(let i=0;i<focusComponents[0].outputs.length;i++){
                for(let j=0;j<focusComponents[0].outputs[i].connectedJumpers.length;j++){
                    focusComponents[0].outputs[i].connectedJumpers[j].del();
                }
            }
            scheme_log.push([3, [focusComponents[0]]]);
            componentList.splice(componentList.indexOf(focusComponents[0]), 1);  
        }
    }

    focusNode = null;
    focusComponents = [];
    selectionRect.selectedNodes = [];

    for(let i=0;i<componentList.length;i++){
        if((selectedTool==null || selectedTool==del) &&
            UI.mouseInWorldRect(componentList[i].x+componentList[i].bounds.x1, componentList[i].y+componentList[i].bounds.y1, 
            componentList[i].x+componentList[i].bounds.x2, componentList[i].y+componentList[i].bounds.y2)){
            focusComponents = [componentList[i]];
        }
        
        if(mouseIsPressed && mouseButton==LEFT){
            let x = componentList[i].x;
            let y = componentList[i].y;
            let ax = min(selectionRect.x1, pointer.x);
            let bx = max(selectionRect.x1, pointer.x);
            let ay = min(selectionRect.y1, pointer.y);
            let by = max(selectionRect.y1, pointer.y);

            if(x<bx && x>ax && y<by && y>ay){
                if(!focusComponents.includes(componentList[i]))
                focusComponents.push(componentList[i]);
            }
            else{
                if(focusComponents.includes(componentList[i])){
                    focusComponents.splice(focusComponents.indexOf(componentList[i]), 1);
                }
            }
        }
        
        componentList[i].draw();
        noFill();

        for(let j=0;j<componentList[i].inputs.length;j++){
            let x = componentList[i].inputs[j].x;
            let y = componentList[i].inputs[j].y;
            
            if(mouseIsPressed && mouseButton==LEFT){
                let ax = min(selectionRect.x1, pointer.x);
                let bx = max(selectionRect.x1, pointer.x);
                let ay = min(selectionRect.y1, pointer.y);
                let by = max(selectionRect.y1, pointer.y);

                if(x<bx && x>ax && y<by && y>ay){
                    if(!selectionRect.selectedNodes.includes(componentList[i].inputs[j]))
                        selectionRect.selectedNodes.push(componentList[i].inputs[j]);
                }
                else{
                    if(selectionRect.selectedNodes.includes(componentList[i].inputs[j])){
                        selectionRect.selectedNodes.splice(selectionRect.selectedNodes.indexOf(componentList[i].inputs[j]), 1);
                    }
                }
            }

            if((x-pointer.x)**2+(y-pointer.y)**2<25) {
                focusNode = componentList[i].inputs[j];
            }
        }
        for(let j=0;j<componentList[i].outputs.length;j++){
            let x = componentList[i].outputs[j].x;
            let y = componentList[i].outputs[j].y;
            if(state[0]==1){
                push();
                noFill();
                translate(x, y);
                scale(0.75);
                text(activeValues[componentList[i].outputs[j].groupId], -8, -2.5);
                pop();
            }

            if(mouseIsPressed && mouseButton==LEFT){
                let ax = min(selectionRect.x1, pointer.x);
                let bx = max(selectionRect.x1, pointer.x);
                let ay = min(selectionRect.y1, pointer.y);
                let by = max(selectionRect.y1, pointer.y);

                if(x<bx && x>ax && y<by && y>ay){
                    if(!selectionRect.selectedNodes.includes(componentList[i].outputs[j]))
                        selectionRect.selectedNodes.push(componentList[i].outputs[j]);
                }
                else{
                    if(selectionRect.selectedNodes.includes(componentList[i].outputs[j])){
                        selectionRect.selectedNodes.splice(selectionRect.selectedNodes.indexOf(componentList[i].outputs[j]), 1);
                    }
                }
            }

            if((x-pointer.x)**2+(y-pointer.y)**2<25) {
                focusNode = componentList[i].outputs[j];
            }
            if(activeValues){
                componentList[i].outputs[j].value = activeValues[componentList[i].outputs[j].index];
            }
        }
    }
    fill(40);
    if(selectedNode) circle(selectedNode.x, selectedNode.y, 7);
    else if(selectedJumperPoint) circle(selectedJumperPoint.x, selectedJumperPoint.y, 7);
    else if(selectedNodeList) {
        for(let i=0;i<selectedNodeList.length;i++){
            circle(selectedNodeList[i].x, selectedNodeList[i].y, 7);
        }
    }
}

function drawJumpers(){
    focusJumperPoint = null;
    focusJumperPointList = [];
    beginShape(LINES);
    for(let i=0;i<jumperList.length;i++){
        for (let j = 1; j < jumperList[i].anchorPoints.length; j++) {
            vertex(jumperList[i].anchorPoints[j-1][0], jumperList[i].anchorPoints[j-1][1]);
            vertex(jumperList[i].anchorPoints[j][0], jumperList[i].anchorPoints[j][1]);
            let a1 = (jumperList[i].anchorPoints[j][1]-jumperList[i].anchorPoints[j-1][1]);
            let a2 = (jumperList[i].anchorPoints[j][0]-jumperList[i].anchorPoints[j-1][0]);
            if(abs(a2) > abs(a1)){
                a1 = a1/a2;
                let c = jumperList[i].anchorPoints[j-1][1] - a1*jumperList[i].anchorPoints[j-1][0];
                let x2 = max(jumperList[i].anchorPoints[j-1][0], jumperList[i].anchorPoints[j][0]);
                let x1 = min(jumperList[i].anchorPoints[j-1][0], jumperList[i].anchorPoints[j][0]);
                if (
                    pointer.x<x2 && pointer.x>x1 &&
                    ((pointer.y - a1*pointer.x - c)**2)/(1+a1*a1) < 16
                ) {
                    let x = (a1*pointer.y + pointer.x - a1*c)/(1+a1*a1);
                    let y = a1*x+c;
                    focusJumperPoint = {x: x, y: y, jumper: jumperList[i]};
                    focusJumperPointList.push({x: x, y: y, jumper: jumperList[i]});
                }
            }
            else {
                a2 = a2/a1;
                let c = jumperList[i].anchorPoints[j-1][0] - a2*jumperList[i].anchorPoints[j-1][1];
                let y2 = max(jumperList[i].anchorPoints[j-1][1], jumperList[i].anchorPoints[j][1]);
                let y1 = min(jumperList[i].anchorPoints[j-1][1], jumperList[i].anchorPoints[j][1]);
                if (
                    pointer.y<y2 && pointer.y>y1 &&
                    ((pointer.x - a2*pointer.y - c)**2)/(1+a2*a2) < 16
                ) {
                    let y = (a2*pointer.x + pointer.y - a2*c)/(1+a2*a2);
                    let x = a2*y+c;
                    focusJumperPoint = {x: x, y: y, jumper: jumperList[i]};
                    focusJumperPointList.push({x: x, y: y, jumper: jumperList[i]});
                }
            }
        }
    }
    
    if(selectedNode || selectedJumperPoint){
        vertex(jumperList[jumperList.length-1].anchorPoints[jumperList[jumperList.length-1].anchorPoints.length-1][0], 
               jumperList[jumperList.length-1].anchorPoints[jumperList[jumperList.length-1].anchorPoints.length-1][1]);
        vertex(pointer.x, pointer.y);
    }
    endShape();

    if(focusJumperPoint!=null) {
        noFill();
        circle(focusJumperPoint.x, focusJumperPoint.y, 10);
    }
}