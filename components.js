const not = {
    name: "NOT",
    bounds: { x1: -18, y1: -20, x2: 32, y2: 20 },
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y)];
      this.outputs = [new Node(x + 38, y)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    }, 
    draw(_x = this.x, _y = this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 10), new Node(x - 24, y + 10)];
      this.outputs = [new Node(x + 36, y, 3)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    draw(_x=this.x, _y=this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
      line(-24, -10, -13, -10);
      line(-24, 10, -13, 10);
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
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 10), new Node(x - 24, y + 10)];
      this.outputs = [new Node(x + 42, y, 3)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    draw(_x=this.x, _y=this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
      line(-24, -10, -13, -10);
      line(-24, 10, -13, 10);
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
    bounds: { x1: -21, y1: -20, x2: 30, y2: 20 },
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 27, y - 10), new Node(x - 27, y + 10)];
      this.outputs = [new Node(x + 36, y, 3)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    draw(_x = this.x, _y = this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
      strokeWeight(1.5);
      noFill();
      beginShape();
      curveVertex(-6*3, -12);
      curveVertex(-6*3, -15);
      curveVertex(-4.5*3, -9);
      curveVertex(-3.9*3, 0);
      curveVertex(-4.5*3, 9);
      curveVertex(-6*3, 15);
      curveVertex(-6*3, 12);
      endShape();
      fill(250);
      beginShape();
      curveVertex(27, 0);
      curveVertex(27, 0);
      curveVertex(15, -9);
      curveVertex(0, -15);
      curveVertex(-12, -15);
      curveVertex(-9, -9);
      curveVertex(-2.55*3, 0);
      curveVertex(-9, 9);
      curveVertex(-12, 15);
      curveVertex(0, 15);
      curveVertex(15, 9);
      curveVertex(27, 0);
      curveVertex(27, 0);
      endShape();
      line(-27, -10, -15, -10);
      line(-27, 10, -15, 10);
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
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 10), new Node(x - 24, y + 10)];
      this.outputs = [new Node(x + 30, y, 3)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    draw(_x = this.x, _y = this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
      line(-24, -10, -15, -10);
      line(-24, 10, -15, 10);
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
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 24, y - 10), new Node(x - 24, y + 10)];
      this.outputs = [new Node(x + 38, y, 3)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    draw(_x = this.x, _y = this.y, angle = this.angle) {
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
      line(-24, -10, -15, -10);
      line(-24, 10, -15, 10);
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
    bounds: { x1: -28, y1: -13, x2: 15, y2: 13 },
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [];
      this.outputs = [new Node(x + 21, y)];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },
    
    draw(_x = this.x, _y = this.y, angle=this.angle) {
      let v = 0;
      if(activeValues && this.outputs) v = activeValues[this.outputs[0].groupId];
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
      if (v==1) fill(70);
      else fill(250);
      strokeWeight(1.5);
      circle(-15, 0, 21);
      line(-4.5, 0, 21, 0);
      pop();
    },

    act(activeValues) {
      if(!activeValues) return;
      userInput[2] = this.id;
      userInput[1] = !activeValues[this.outputs[0].groupId];
      userInput[0] = this.outputs[0].groupId;
    }
}

const outNode = {
    name: "Output Node",
    bounds: { x1: -15, y1: -13, x2: 28, y2: 13 },
    construct(x, y, angle) {
      this.x = x;
      this.y = y;
      this.inputs = [new Node(x - 21, y, 0)];
      this.outputs = [];
      this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
      if(angle){
        this.angle = angle;
        let r;
        for(let i=0;i<this.inputs.length;i++){
          r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
          this.inputs[i].x = r[0] + this.x;
          this.inputs[i].y = r[1] + this.y;
        }
        for(let i=0;i<this.outputs.length;i++){
          r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
          this.outputs[i].x = r[0] + this.x;
          this.outputs[i].y = r[1] + this.y;
        }
        r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
        let x1 = r[0], y1 = r[1];
        r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
        let x2 = r[0], y2 = r[1];
        this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
        this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
      }
    },

    draw(_x = this.x, _y = this.y, angle=this.angle) {
      v = 0;
      if(activeValues && this.inputs) v = activeValues[this.inputs[0].groupId];
      push();
      translate(_x, _y);
      if(angle) rotate(angle);
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
  construct(x, y, angle) {
    this.x = x;
    this.y = y;
    this.inputs = [new Node(x - 24, y), new Node(x, y + 23)];
    this.outputs = [new Node(x + 36, y)];
    this.bounds = structuredClone(Object.getPrototypeOf(this).bounds);
    if(angle){
      this.angle = angle;
      let r;
      for(let i=0;i<this.inputs.length;i++){
        r = UI.rotateVec(this.inputs[i].x - this.x, this.inputs[i].y - this.y, angle);
        this.inputs[i].x = r[0] + this.x;
        this.inputs[i].y = r[1] + this.y;
      }
      for(let i=0;i<this.outputs.length;i++){
        r = UI.rotateVec(this.outputs[i].x - this.x, this.outputs[i].y - this.y, angle);
        this.outputs[i].x = r[0] + this.x;
        this.outputs[i].y = r[1] + this.y;
      }
      r = UI.rotateVec(this.bounds.x1, this.bounds.y1, angle);
      let x1 = r[0], y1 = r[1];
      r = UI.rotateVec(this.bounds.x2, this.bounds.y2, angle);
      let x2 = r[0], y2 = r[1];
      this.bounds.x1 = Math.min(x1, x2); this.bounds.x2 = Math.max(x1, x2);
      this.bounds.y1 = Math.min(y1, y2); this.bounds.y2 = Math.max(y1, y2);
    }
  }, 
  draw(_x = this.x, _y = this.y, angle = this.angle) {
    push();
    translate(_x, _y);
    if(angle) rotate(angle);
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

const disp8 = {
  name: "8-bit display",
  bounds: { x1: -32, y1: -30, x2: 32, y2: 30 },
  construct(x, y) {
    this.x = x;
    this.y = y;
    this.inputs = []; this.outputs = [];
    for(let i=0;i<8;i++) this.inputs.push( new Node(x + 2.5 + 5*(i-4), y-33));
  }, 
  draw(_x = this.x, _y = this.y) {
    let value = "FF";
    if(state[0] && this.inputs){
      value = 0;
      for(let i=7;i>=0;i--) {
        value = 2*value + Math.abs(activeValues[this.inputs[i].groupId]);
      }
      value = value.toString(16).toUpperCase();
      if(value.length==1) value = "0"+value;
    }
    push();
    translate(_x, _y);
    strokeWeight(1.5);
    for(let i=0;i<8;i++) line(2.5 + 5*(i-4), -33, 2.5 + 5*(i-4), 0);
    fill(250);
    rect(-30, -25, 30, 25);
    strokeWeight(3);
    textSize(40);
    textFont("Roboto Mono");
    text(value, -24.25, 12);
    pop();
  }
}