scheme_log = [];

class Node {
    constructor(_x, _y){
        this.x = _x; this.y = _y;
        this.groupId = -1;
        this.nodeId = -1;
        this.connectedJumpers = [];
    }
};

class Jumper {
    constructor(_origin){
        if(_origin instanceof Node) this.origin = _origin;
        else if(_origin) this.origin = _origin.jumper;
        else this.origin = null;
        if(this.origin!=null) this.anchorPoints = [[_origin.x, _origin.y]];
        else this.anchorPoints = [];
        this.end = null;
        this.isTravelled = false; //Reset this before performing DFS
        this.connectedJumpers = [];
        this.jumperId = -1;
    }

    addAnchorPoint(_point){
        this.anchorPoints.push(_point);
    }

    travel(groupId, nodeGroups){
        if(this.isTravelled) return;

        this.isTravelled = true;

        if(this.origin instanceof Node) {
            this.origin.groupId = groupId;
            if(!nodeGroups[groupId].includes(this.origin.nodeId)) nodeGroups[groupId].push(this.origin.nodeId);
            for(let i=0;i<this.origin.connectedJumpers.length;i++) this.origin.connectedJumpers[i].travel(groupId, nodeGroups);
        }
        else if(this.origin instanceof Jumper) {
            this.origin.travel(groupId, nodeGroups);
        }

        if(this.end instanceof Node) {
            this.end.groupId = groupId;
            if(!nodeGroups[groupId].includes(this.end.nodeId)) nodeGroups[groupId].push(this.end.nodeId);
            for(let i=0;i<this.end.connectedJumpers.length;i++) this.end.connectedJumpers[i].travel(groupId, nodeGroups);
        }
        else if(this.end instanceof Jumper) {
            this.end.travel(groupId, nodeGroups);
        }

        for(let i=0;i<this.connectedJumpers.length;i++){
            this.connectedJumpers[i].travel(groupId, nodeGroups);
        }
    }

    del(deleted=null){
        if(this.isTravelled) return;
        this.isTravelled = true;

        this.origin.connectedJumpers.splice(this.origin.connectedJumpers.indexOf(this), 1);
        this.end.connectedJumpers.splice(this.end.connectedJumpers.indexOf(this), 1);

        let deleted_jumpers = [];
        if(deleted) deleted_jumpers = deleted;
        for(let i=0;i<this.connectedJumpers.length;i++){
            this.connectedJumpers[i].del(deleted_jumpers);
        }
        deleted_jumpers.push(this);
        jumperList.splice(jumperList.indexOf(this), 1);
        if(deleted==null) scheme_log.push([1, deleted_jumpers]);
        else return deleted_jumpers;
    }
};

class SubModule {
    construct(x, y){
        this.x = x; this.y = y;
        this.inputs = [];
        this.outputs = [];
        

        for(let i=0;i<this.innerInputs.length;i++){
            this.inputs.push(new Node(x+this.bounds.x1-10, y+this.bounds.y1+20+10*i));
            if(this.inputLabels && this.inputLabels[i]) this.inputs[this.inputs.length-1].label = this.inputLabels[i];
        }
        for(let i=0;i<this.innerOutputs.length;i++){
            this.outputs.push(new Node(x+this.bounds.x2+10, y+this.bounds.y1+20+10*i));
            if(this.outputLabels && this.outputLabels[i]) this.outputs[this.outputs.length-1].label = this.outputLabels[i];
        }
    }

    draw(_x=this.x, _y=this.y){
        push();
        translate(_x, _y);
        rectMode(CORNERS);
        fill(250);
        strokeWeight(1.5);
        rect(this.bounds.x1+10, this.bounds.y1+10, this.bounds.x2-10, this.bounds.y2-10);
        for(let i=0;i<this.innerInputs.length;i++){
            line(this.bounds.x1+10, this.bounds.y1+20+10*i, this.bounds.x1-10, this.bounds.y1+20+10*i);
        }
        for(let i=0;i<this.innerOutputs.length;i++){
            line(this.bounds.x2-10, this.bounds.y1+20+10*i, this.bounds.x2+10, this.bounds.y1+20+10*i);
        }
        fill(40);
        noStroke();
        text(this.name, -textWidth(this.name)/2, (this.bounds.y1+this.bounds.y2)/2+3);
        pop();
    }
}

function ParseNetwork(componentList, jumperList){
    let Module = {};

    let k = 0;
    for(let i=0;i<componentList.length;i++){
        for(let j=0;j<componentList[i].inputs.length;j++){
            componentList[i].inputs[j].groupId = -1;
            componentList[i].inputs[j].nodeId = k;
            k++;
        }
        for(let j=0;j<componentList[i].outputs.length;j++){
            componentList[i].outputs[j].groupId = -1;
            componentList[i].outputs[j].nodeId = k;
            k++;
        }
    }

    for(let i=0;i<jumperList.length;i++){
        jumperList[i].isTravelled = false;    
    }
    Module.nodeGroups = [];
    for(let i=0;i<jumperList.length;i++){
        if(!jumperList[i].isTravelled) {
            Module.nodeGroups.push([]);
            jumperList[i].travel(Module.nodeGroups.length-1, Module.nodeGroups);
        } 
    }

    //setting undefined groupIds
    for(let i=0;i<componentList.length;i++){
        for(let j=0;j<componentList[i].inputs.length;j++){
            if(componentList[i].inputs[j].groupId==-1) {
                componentList[i].inputs[j].groupId = Module.nodeGroups.length;
                Module.nodeGroups.push([componentList[i].inputs[j].nodeId]);
            }
        }
        for(let j=0;j<componentList[i].outputs.length;j++){
            if(componentList[i].outputs[j].groupId==-1) {
                componentList[i].outputs[j].groupId = Module.nodeGroups.length;
                Module.nodeGroups.push([componentList[i].outputs[j].nodeId]);
            }
        }
    }

    Module.componentGroups = [];
    for(let i=0;i<Module.nodeGroups.length;i++) Module.componentGroups.push([]);
    Module.componentHeaders = [];
    Module.innerInputs = [];
    Module.innerOutputs = [];
    Module.inputLabels = [];
    Module.outputLabels = [];
    for(let i=0;i<componentList.length;i++){
        for(let j=0;j<componentList[i].inputs.length;j++){
            Module.componentGroups[componentList[i].inputs[j].groupId].push(i);
        }
        for(let j=0;j<componentList[i].outputs.length;j++){
            Module.componentGroups[componentList[i].outputs[j].groupId].push(i);
        }

        let header = {};
        header.name = componentList[i].name;
        
        if(header.name=="Input Node"){
            header.moduleInPin = Module.innerInputs.length;
            Module.innerInputs.push(componentList[i].outputs[0].groupId);
            if(componentList[i].label) Module.inputLabels.push(componentList[i].label);
            else Module.inputLabels.push(null);
        }
        else if(header.name=="Output Node"){
            header.moduleOutPin = Module.innerOutputs.length;
            Module.innerOutputs.push(componentList[i].inputs[0].groupId);
            if(componentList[i].label) Module.outputLabels.push(componentList[i].label);
            else Module.outputLabels.push(null);
        }

        header.inputs = [];
        for(let j=0;j<componentList[i].inputs.length;j++){
            header.inputs.push(componentList[i].inputs[j].groupId);
        }
        header.outputs = [];
        for(let j=0;j<componentList[i].outputs.length;j++){
            header.outputs.push(componentList[i].outputs[j].groupId);
        }
        if(componentList[i].componentHeaders){
            header.nodeGroups = componentList[i].nodeGroups;
            header.componentGroups = componentList[i].componentGroups;
            header.componentHeaders = structuredClone(componentList[i].componentHeaders);
            header.innerInputs = componentList[i].innerInputs;
            header.innerOutputs = componentList[i].innerOutputs;
        }
        Module.componentHeaders.push(header);
    }
    delete Module.nodeGroups;
    return Module;
}