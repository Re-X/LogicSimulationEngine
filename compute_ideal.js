
let state, activeValues;
let Module;
let userInput;
let execQueue, activeQueue;
let begin, end;

function push(queue, obj){
    queue[end] = obj;
    if(begin==-1) begin=0;
    end = (end+1)%queue.length;
}
function pop(queue){
    //queue[begin] = null;
    begin = (begin+1)%queue.length;
}

onmessage = (obj) => {
    state = new Uint8Array(obj.data[0]);
    userInput = new Int8Array(obj.data[1]);
    Module = obj.data[2];
    Module.activeValues = new Int8Array(obj.data[3]);
    Module.activeComponents = new Array(Module.activeValues.length);
    execQueue = new Array(1000000);
    activeQueue = [];
    //for(let i=0;i<execQueue.length;i++) execQueue[i] = -1;
    begin = -1; end = 0;
    
    InitializeModule(Module);

    for(let i=0;i<Module.componentHeaders.length;i++){
        if(Module.componentHeaders[i].moduleInPin!=undefined){
            setActiveValue(Module.componentHeaders[i].outputs[0], 0, Module, undefined, 0);
        }
    }
    for(let i=0;i<activeQueue.length;i++){
        //console.log(activeQueue[i][1], activeQueue[i][2]);
        activeQueue[i][0].activeValues[activeQueue[i][1]] = activeQueue[i][2];
        activeQueue[i][0].activeComponents[activeQueue[i][1]] = activeQueue[i][3];
    }
    activeQueue = [];
    lastOrder = -1;
    while(state[0]==1){
        if(begin==end || execQueue[begin][1]!=lastOrder){
            for(let i=0;i<activeQueue.length;i++){
                //console.log(activeQueue[i][1], activeQueue[i][2]);
                activeQueue[i][0].activeValues[activeQueue[i][1]] = activeQueue[i][2];
                activeQueue[i][0].activeComponents[activeQueue[i][1]] = activeQueue[i][3];
            }
            activeQueue = [];
            if(begin!=end && begin!=1) lastOrder = execQueue[begin][1];
            else lastOrder = -1;
        }
        if(begin!=end){
            //console.log(execQueue[begin][1], execQueue[begin][0].name);
            executeComponent(execQueue[begin][0], execQueue[begin][1]);
            pop(execQueue);
        }
        if(userInput[0]!=-1){
            setActiveValue(userInput[0], userInput[1], Module, undefined, 0);
            userInput[0] = -1;
            userInput[1] = -1;
        }
    }
};

function InitializeModule(Module){
    for(let i=0;i<Module.componentHeaders.length;++i){
        Module.componentHeaders[i].parent = Module;
        Module.componentHeaders[i].state = 1;
        if(Module.componentHeaders[i].componentHeaders){
            Module.componentHeaders[i].activeValues = new Int8Array(Module.componentHeaders[i].componentGroups.length);
            for(let j=0;j<Module.componentHeaders[i].componentGroups.length;++j){
                Module.componentHeaders[i].activeValues[j] = -1;
            }
            Module.componentHeaders[i].activeComponents = new Array(Module.componentHeaders[i].componentGroups.length);
            for(let j=0;j<Module.componentHeaders[i].activeComponents.length;++j){
                Module.componentHeaders[i].activeComponents[i] = -1;
            }
            InitializeModule(Module.componentHeaders[i]);
        }
        //push(execQueue, Module.componentHeaders[i]);
    }
}

function setActiveValue(id, value, Module, component, order){
    let activeValues = Module.activeValues;
    let componentHeaders = Module.componentHeaders;
    let componentGroups = Module.componentGroups;
    let activeComponents = Module.activeComponents;
    
    //For finite capacitance lines
    /*if(value==-1 && (activeComponents[id] != component || component==undefined)){
        return;
    }*/
    //For infinite capacitance lines
    if(value==-1) return;

    if(activeValues[id]==value) {
        return;
    }
    
    activeQueue.push([Module, id, value, component]);
    //activeComponents[id] = component;
    //activeValues[id] = value;

    for(let i=0;i<componentGroups[id].length;i++){
        if(execQueue[begin] && componentHeaders[componentGroups[id][i]] == execQueue[begin][0]) continue;
        push(execQueue, [componentHeaders[componentGroups[id][i]], order+1]);
    }
}

function executeComponent(component, order){
    let v = [];
    for(let i=0;i<component.inputs.length;i++){
        v.push(component.parent.activeValues[component.inputs[i]]);
    }

    if(component.name=="NOT"){
        setActiveValue(component.outputs[0], 
            !(v[0]), component.parent, component, order);
    }
    else if(component.name=="OR"){
        setActiveValue(component.outputs[0], 
                       v[0] || v[1], component.parent, component, order);
    }
    else if(component.name=="NOR"){
        setActiveValue(component.outputs[0], 
                       !(v[0] || v[1]), component.parent, component, order);
    }
    else if(component.name=="XOR"){
        setActiveValue(component.outputs[0], 
                       v[0] ^ v[1], component.parent, component, order);
    }
    else if(component.name=="AND"){
        setActiveValue(component.outputs[0], 
                       v[0] && v[1], component.parent, component, order);
    }
    else if(component.name=="NAND"){
        setActiveValue(component.outputs[0], 
                       !(v[0] && v[1]), component.parent, component, order);
    }
    else if(component.name=="BUFFER"){
        if(v[1]==1) {
            setActiveValue(component.outputs[0], v[0], component.parent, component, order);
            component.state = 1;
        }
        else {
            setActiveValue(component.outputs[0], -1, component.parent, component, order);
            component.state = -1;
        }
    }
    else if(component.parent.parent && component.name=="Output Node"){
        if(component.parent.activeComponents[component.inputs[0]]==undefined ||
            (component.parent.activeComponents[component.inputs[0]]!=
            component.parent.parent.activeComponents[component.parent.outputs[component.moduleOutPin]])){
                if(!component.parent.activeComponents[component.inputs[0]] ||
                    component.parent.activeComponents[component.inputs[0]].state!=-1){
                    component.state = 1;
                    setActiveValue(component.parent.outputs[component.moduleOutPin], v[0], component.parent.parent, component, order);
                }
                else component.state = -1;
            }
        }
    else if(component.parent.parent && component.name=="Input Node"){
        if(component.parent.activeComponents[component.outputs[0]]==undefined ||
            (component.parent.activeComponents[component.outputs[0]]!=
            component.parent.parent.activeComponents[component.parent.inputs[component.moduleInPin]]))
            if(!component.parent.activeComponents[component.outputs[0]] || 
                component.parent.activeComponents[component.outputs[0]].state!=-1){
                component.state = 1;
                setActiveValue(component.parent.inputs[component.moduleInPin], component.parent.activeValues[component.outputs[0]], 
                component.parent.parent, component, order);
            }
            else component.state = -1;
    }
    else if(component.componentHeaders){
        for(let i=0;i<component.innerInputs.length;i++){
            if(component.parent.activeComponents[component.inputs[i]] && 
                component.parent.activeComponents[component.inputs[i]].moduleInPin==i &&
                component.parent.activeComponents[component.inputs[i]].parent==component){
                continue;
            }
            if(component.parent.activeComponents[component.inputs[i]] && component.parent.activeComponents[component.inputs[i]].state==-1) continue;
            setActiveValue(component.innerInputs[i], v[i], component,
                           component.parent.activeComponents[component.inputs[i]], order);
        }
        for(let i=0;i<component.innerOutputs.length;i++){
            if(component.parent.activeComponents[component.outputs[i]] && 
                component.parent.activeComponents[component.outputs[i]].moduleOutPin==i &&
                component.parent.activeComponents[component.outputs[i]].parent==component){
                continue;
            }
            if(component.parent.activeComponents[component.outputs[i]] && component.parent.activeComponents[component.outputs[i]].state==-1) continue;
            setActiveValue(component.innerOutputs[i], 
                           component.parent.activeValues[component.outputs[i]], 
                           component, component.parent.activeComponents[component.outputs[i]], order);
        }
    }
}