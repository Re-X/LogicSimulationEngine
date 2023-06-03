# Logic Simulation Engine
Basic Elements:

Input Nodes: 
Used to define left side pins of the submodule (if created).
Can be stimulated by mouse clicks.

Output Nodes: used to define left side pins of the submodule (if created).
Cannot be stimulated manually.

It is to be noted that either of input or output nodes can be used as input pins or output pins of the submodule.

Placing connections:
To select multiple nodes, hold shift and selected multiple points(nodes or points on jumpers or buses). You can also selected multiple nodes using selection rect, nodes will be selected when left mouse button is released and shift button is down.
Connections from multiple nodes will be converged to a single bus, unless ctrl key is pressed.

To create a submodule from current schematic, just click the 'Create' button.
Submodule name will be the same as the title.
Title (by default 'Testbench') can be changed by clicking on it.

You can download(save)/load schematics to local space, 
download/load submodules from local space or from project repository from the 'File' menu.
