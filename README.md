# Logic Simulation Engine

Logic Simulation Engine is a browser-based simulation tool for modular digital logic circuits. It provides users with the ability to create and simulate complex chips by using basic elements and building blocks, allowing for the efficient design and analysis of digital logic systems.
![image](https://github.com/Re-X/LogicSimulationEngine/assets/36952343/e83c5793-684f-4562-9653-b1ab51b25b02)

Modular Circuit Design: Users can create digital logic circuits by combining basic elements (gates) into complex modules or chips. This modular approach allows for the easy design of complex circuits.

## Basic Instructions:

Right mouse click to deselect current tool (and to remove unfinished connections).

Scroll over toolbar to ...scroll it.

CTRL + mouse drag to move around.

CTRL+Z to undo

Q/E to rotate a tool.

Input Node:  Used to define left side pins of the submodule (if created). Can be stimulated by mouse clicks.

Output Node: used to define right side pins of the submodule (if created). Cannot be stimulated manually.

It is to be noted that either of input or output nodes can be used as input pins or output pins of the submodule.

A component or submodule can be given a label by clicking on it. Label on input/output node component will also be visible on respective submodule pins.

Placing connections: To select multiple nodes, hold shift and selected multiple points(nodes or points on jumpers or buses). You can also selected multiple nodes using selection rect, nodes will be selected when left mouse button is released and shift button is down. Connections from multiple nodes will be converged to a single bus, unless ctrl key is pressed, clicking on empty area will create anchor point for jumpers.

Submodule: To create a submodule from current schematic, just click the 'Create' button. Submodule name will be the same as the title. Title (by default 'Testbench') can be changed by clicking on it.

Schematics: You can download(save)/load schematics and submodules from local space or from project repository from the 'File' menu.
