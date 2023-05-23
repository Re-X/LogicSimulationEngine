
let state, activeValues;
let Module;
let userInput;
let execQueue;

onmessage = (obj) => {
    state = new Uint8Array(obj.data[0]);
    userInput = new Int8Array(obj.data[1]);
    Module = obj.data[2];
    Module.activeValues = new Int8Array(obj.data[3]);
    Module.activeComponents = new Array(Module.activeValues.length);
    execQueue = [];
    
    InitializeModule(Module);

    for(let i=0;i<Module.componentHeaders.length;i++){
        if(Module.componentHeaders[i].moduleInPin!=undefined){
            setActiveValue(Module.componentHeaders[i].outputs[0], 0, Module);
        }
    }

    while(state[0]==1){
        if(execQueue.length){
            executeComponent(execQueue[0]);
            execQueue.splice(0, 1);
        }
        if(userInput[0]!=-1){
            setActiveValue(userInput[0], userInput[1], Module);
            userInput[0] = -1;
            userInput[1] = -1;
        }
    }
};

function InitializeModule(Module){
    for(let i=0;i<Module.componentHeaders.length;i++){
        Module.componentHeaders[i].parent = Module;
        if(Module.componentHeaders[i].componentHeaders){
            Module.componentHeaders[i].activeValues = new Int8Array(Module.componentHeaders[i].componentGroups.length);
            for(let j=0;j<Module.componentHeaders[i].componentGroups.length;j++){
                Module.componentHeaders[i].activeValues[j] = -1;
            }
            Module.componentHeaders[i].activeComponents = new Array(Module.componentHeaders[i].componentGroups.length);
            InitializeModule(Module.componentHeaders[i]);
        }
        //execQueue.push(Module.componentHeaders[i]);
    }
}

function setActiveValue(id, value, Module, component){
    let activeValues = Module.activeValues;
    let componentHeaders = Module.componentHeaders;
    let componentGroups = Module.componentGroups;
    let activeComponents = Module.activeComponents;
    
    if(value==-1 && (activeComponents[id] != component || component==undefined)){
        return;
    }

    if(activeValues[id]==value) {
        return;
    }
    
    activeComponents[id] = component;
    activeValues[id] = value;

    for(let i=0;i<componentGroups[id].length;i++){
        if(componentHeaders[componentGroups[id][i]] != execQueue[0]) 
            execQueue.push(componentHeaders[componentGroups[id][i]]);
    }
}

function executeComponent(component){
    let v = [];
    for(let i=0;i<component.inputs.length;i++){
        v.push(component.parent.activeValues[component.inputs[i]]);
    }

    if(component.name=="NOT"){
        setActiveValue(component.outputs[0], 
            !v[0], component.parent, component);
    }
    else if(component.name=="OR"){
        setActiveValue(component.outputs[0], 
                       v[0] || v[1], component.parent, component);
    }
    else if(component.name=="NOR"){
        setActiveValue(component.outputs[0], 
                       !(v[0] || v[1]), component.parent, component);
    }
    else if(component.name=="XOR"){
        setActiveValue(component.outputs[0], 
                       v[0] ^ v[1], component.parent, component);
    }
    else if(component.name=="AND"){
        setActiveValue(component.outputs[0], 
                       v[0] && v[1], component.parent, component);
    }
    else if(component.name=="NAND"){
        setActiveValue(component.outputs[0], 
                       !(v[0] && v[1]), component.parent, component);
    }
    else if(component.name=="BUFFER"){
        if(v[1]==1) setActiveValue(component.outputs[0], v[0], component.parent, component);
        else setActiveValue(component.outputs[0], -1, component.parent, component);
    }
    else if(component.parent.parent && component.name=="Output Node"){
        if(component.parent.activeComponents[component.inputs[0]]==undefined ||
            (component.parent.activeComponents[component.inputs[0]]!=
            component.parent.parent.activeComponents[component.parent.outputs[component.moduleOutPin]]))
            setActiveValue(component.parent.outputs[component.moduleOutPin], v[0], component.parent.parent, component);
    }
    else if(component.parent.parent && component.name=="Input Node"){
        if(component.parent.activeComponents[component.outputs[0]]==undefined ||
            (component.parent.activeComponents[component.outputs[0]]!=
            component.parent.parent.activeComponents[component.parent.inputs[component.moduleInPin]]))
            setActiveValue(component.parent.inputs[component.moduleInPin], component.parent.activeValues[component.outputs[0]], 
            component.parent.parent, component);
    }
    else if(component.componentHeaders){
        for(let i=0;i<component.innerInputs.length;i++){
            if(component.parent.activeComponents[component.inputs[i]] && 
                component.parent.activeComponents[component.inputs[i]].moduleInPin==i &&
                component.parent.activeComponents[component.inputs[i]].parent==component){
                continue;
            }
            setActiveValue(component.innerInputs[i], v[i], component,
                           component.parent.activeComponents[component.inputs[i]]);
        }
        for(let i=0;i<component.innerOutputs.length;i++){
            if(component.parent.activeComponents[component.outputs[i]] && 
                component.parent.activeComponents[component.outputs[i]].moduleOutPin==i &&
                component.parent.activeComponents[component.outputs[i]].parent==component){
                continue;
            }
            setActiveValue(component.innerOutputs[i], 
                           component.parent.activeValues[component.outputs[i]], 
                           component, component.parent.activeComponents[component.outputs[i]]);
        }
    }
}