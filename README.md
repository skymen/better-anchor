<img src="./src/icon.svg" width="100" /><br>
# Better Anchor <br>
Description <br>
<br>
Author: skymen <br>
<sub>Made using [c3ide2-framework](https://github.com/ConstructFund/c3ide2-framework) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
node ./build.js
```

To run the dev server, run

```
npm i
node ./dev.js
```

The build uses the pluginConfig file to generate everything else.
The main files you may want to look at would be instance.js and scriptInterface.js

## Examples Files

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Resize Mode | Resize Mode | combo |
| Left Edge | Left Edge | combo |
| Left Constraint | Left Constraint | combo |
| Top Edge | Top Edge | combo |
| Top Constraint | Top Constraint | combo |
| Right Edge | Right Edge | combo |
| Right Constraint | Right Constraint | combo |
| Bottom Edge | Bottom Edge | combo |
| Bottom Constraint | Bottom Constraint | combo |
| Anchor To | Anchor To | combo |
| Enable | Enable | check |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Set Enabled | Set Enabled | Enabled             *(boolean)* <br> |
| Set Left Offset | Set Left Offset | Offset             *(number)* <br>Constraint             *(combo)* <br> |
| Set Top Offset | Set Top Offset | Offset             *(number)* <br>Constraint             *(combo)* <br> |
| Set Right Offset | Set Right Offset | Offset             *(number)* <br>Constraint             *(combo)* <br> |
| Set Bottom Offset | Set Bottom Offset | Offset             *(number)* <br>Constraint             *(combo)* <br> |
| Set Left Edge | Set Left Edge | Edge             *(combo)* <br> |
| Set Top Edge | Set Top Edge | Edge             *(combo)* <br> |
| Set Right Edge | Set Right Edge | Edge             *(combo)* <br> |
| Set Bottom Edge | Set Bottom Edge | Edge             *(combo)* <br> |
| Set Resize Mode | Set Resize Mode | Mode             *(combo)* <br> |
| Set Anchor To | Set Anchor To | Anchor             *(combo)* <br> |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Is Enabled | Is Enabled |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| Left | Left | number |  | 
| Top | Top | number |  | 
| Right | Right | number |  | 
| Bottom | Bottom | number |  | 
