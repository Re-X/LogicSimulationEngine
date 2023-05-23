const not = {
    name: "NOT",
    bounds: { x1: -18, y1: -20, x2: 32, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y)];
      this.outputs = [new Node(x + 38, y)];
    }, 
    draw(_x = this.x, _y = this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      line(-24, 0, 38, 0);
      fill(250);
      triangle(-15, 15, -15, -15, 21, 0);
      circle(24, 0, 9);
      pop();
    }
}
const or = {
    name: "OR",
    bounds: { x1: -18, y1: -20, x2: 30, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 9), new Node(x - 24, y + 9)];
      this.outputs = [new Node(x + 36, y, 3)];
    },
    draw(_x=this.x, _y=this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      fill(250);
      beginShape();
      curveVertex(27, 0);
      curveVertex(27, 0);
      curveVertex(15, -9);
      curveVertex(0, -15);
      curveVertex(-15, -15);
      curveVertex(-12, -9);
      curveVertex(-3.55*3, 0);
      curveVertex(-12, 9);
      curveVertex(-15, 15);
      curveVertex(0, 15);
      curveVertex(15, 9);
      curveVertex(27, 0);
      curveVertex(27, 0);
      endShape();
      line(-24, -9, -12, -9);
      line(-24, 9, -12, 9);
      line(27, 0, 36, 0);
      pop();
    },
    compute() {
      this.outputs[0].set(this.inputs[0].value || this.inputs[1].value);
    }
}
const nor = {
    name: "NOR",
    bounds: { x1: -18, y1: -20, x2: 37, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 9), new Node(x - 24, y + 9)];
      this.outputs = [new Node(x + 42, y, 3)];
    },
    draw(_x=this.x, _y=this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      fill(250);
      beginShape();
      curveVertex(27, 0);
      curveVertex(27, 0);
      curveVertex(15, -9);
      curveVertex(0, -15);
      curveVertex(-15, -15);
      curveVertex(-12, -9);
      curveVertex(-3.55*3, 0);
      curveVertex(-12, 9);
      curveVertex(-15, 15);
      curveVertex(0, 15);
      curveVertex(15, 9);
      curveVertex(27, 0);
      curveVertex(27, 0);
      endShape();
      line(-24, -9, -12, -9);
      line(-24, 9, -12, 9);
      line(27, 0, 42, 0);
      circle(30, 0, 9);
      pop();
    },
    compute() {
      this.outputs[0].set(!(this.inputs[0].value || this.inputs[1].value));
    }
}
const xor = {
    name: "XOR",
    bounds: { x1: -25, y1: -20, x2: 30, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 30, y - 9), new Node(x - 30, y + 9)];
      this.outputs = [new Node(x + 36, y, 3)];
    },
    draw(_x = this.x, _y = this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      noFill();
      beginShape();
      curveVertex(-7.5*3, -12);
      curveVertex(-7.5*3, -15);
      curveVertex(-5.5*3, -9);
      curveVertex(-4.9*3, 0);
      curveVertex(-5.5*3, 9);
      curveVertex(-7.5*3, 15);
      curveVertex(-7.5*3, 12);
      endShape();
      fill(250);
      beginShape();
      curveVertex(27, 0);
      curveVertex(27, 0);
      curveVertex(15, -9);
      curveVertex(0, -15);
      curveVertex(-15, -15);
      curveVertex(-12, -9);
      curveVertex(-3.55*3, 0);
      curveVertex(-12, 9);
      curveVertex(-15, 15);
      curveVertex(0, 15);
      curveVertex(15, 9);
      curveVertex(27, 0);
      curveVertex(27, 0);
      endShape();
      line(-30, -9, -5.5*3, -9);
      line(-30, 9, -5.5*3, 9);
      line(27, 0, 36, 0);
      pop();
    },
    compute() {
      this.outputs[0].set(this.inputs[0].value ^ this.inputs[1].value);
    }
}

const and = {
    name: "AND",
    bounds: { x1: -18, y1: -20, x2: 24, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 9), new Node(x - 24, y + 9)];
      this.outputs = [new Node(x + 30, y, 3)];
    },
    draw(_x = this.x, _y = this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      fill(250);
      beginShape();
      curveVertex(-18, -12);
      curveVertex(-15, -15);
      curveVertex(12, -12);
      curveVertex(21, 0);
      curveVertex(12, 12);
      curveVertex(-15, 15);
      curveVertex(-18, 12);
      endShape();
      line(-15, -15, -15, 15);
      line(-24, -9, -15, -9);
      line(-24, 9, -15, 9);
      line(21, 0, 30, 0);
      pop();
    },
    compute() {
      this.outputs[0].set(this.inputs[0].value && this.inputs[1].value);
    }
}

const nand = {
    name: "NAND",
    bounds: { x1: -18, y1: -20, x2: 32, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 9), new Node(x - 24, y + 9)];
      this.outputs = [new Node(x + 38, y, 3)];
    },
    draw(_x = this.x, _y = this.y) {
      push();
      translate(_x, _y);
      strokeWeight(1.5);
      fill(250);
      beginShape();
      curveVertex(-18, -12);
      curveVertex(-15, -15);
      curveVertex(12, -12);
      curveVertex(21, 0);
      curveVertex(12, 12);
      curveVertex(-15, 15);
      curveVertex(-18, 12);
      endShape();
      line(-15, -15, -15, 15);
      line(-24, -9, -15, -9);
      line(-24, 9, -15, 9);
      line(21, 0, 38, 0);
      circle(8.5*3, 0, 9);
      pop();
    },
    compute() {
      this.outputs[0].set(!(this.inputs[0].value && this.inputs[1].value));
    }
}
  
const inNode = {
    name: "Input Node",
    bounds: { x1: -28, y1: -20, x2: 15, y2: 20 },
    outputs: [{ value: 0}],
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [];
      this.outputs = [new Node(x + 21, y)];
    },
    
    draw(_x = this.x, _y = this.y) {
      let v = 0;
      if(activeValues && this.outputs[0]) v = activeValues[this.outputs[0].groupId];
      push();
      translate(_x, _y);
      if (v==1) fill(70);
      else fill(250);
      strokeWeight(1.5);
      circle(-15, 0, 21);
      line(-4.5, 0, 21, 0);
      pop();
    },

    act(activeValues) {
      if(!activeValues) return;
      userInput[2] = Module.componentHeaders.indexOf(this);
      userInput[1] = !activeValues[this.outputs[0].groupId];
      userInput[0] = this.outputs[0].groupId;
    }
}

const outNode = {
    name: "Output Node",
    bounds: { x1: -15, y1: -20, x2: 28, y2: 20 },
    construct(x, y) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 21, y, 0)];
      this.outputs = [];
    },

    draw(_x = this.x, _y = this.y) {
      v = 0;
      if(activeValues && this.inputs) v = activeValues[this.inputs[0].groupId];
      push();
      translate(_x, _y);
      if (v==1) fill(70);
      else fill(250);
      strokeWeight(1.5);
      circle(15, 0, 21);
      line(-21, 0, 4.5, 0);
      pop();
    }
}

const buffer = {
  name: "BUFFER",
  bounds: { x1: -18, y1: -18, x2: 28, y2: 18 },
  construct(x, y) {
    this.x = x;
    this.y = y;
    this.inputs = [new Node(x - 24, y), new Node(x, y + 23)];
    this.outputs = [new Node(x + 36, y)];
  }, 
  draw(_x = this.x, _y = this.y) {
    push();
    translate(_x, _y);
    strokeWeight(1.5);
    line(-24, 0, 36, 0);
    fill(250);
    triangle(-15, 15, -15, -15, 21, 0);
    line(0, 8.75, 0, 23);
    //circle(0, 12, 9);
    pop();
  }
}

const del = {
  name: "Delete",
  draw(_x, _y) {
    push();
    translate(_x, _y);
    strokeWeight(1.5);
    line(-5, -5, 5, 5);
    line(-5, 5, 5, -5);
    pop();
  }
};