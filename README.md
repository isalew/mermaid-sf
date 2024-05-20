# Mermaid.js Diagrams for Salesforce

This repo demonstrates how to embed Mermaid.js diagrams as a Lightning Web Component.

## Use Cases

###### Flow Diagrams
Show dependencies between components, classes, records, etc.
<img src="config/img/Sample: Flow Diagram.png" alt="Flow Diagram" width="300px"/>

###### Entity Relation Diagrams
Dynamically render data models from `sObjectDescribe`, `rest`, or `tooling` APIs.
<img src="config/img/Sample: Entity Relationship Diagram.png" alt="Entity Relationship Diagram" width="300px"/>

###### Class Diagrams
Dynamically render class dependencies and relationships.
<img src="config/img/Sample: Class Diagram.png" alt="Class Diagram" width="300px"/>

###### Sequence Diagrams
Generate integration flow diagrams.
<img src="config/img/Sample: Sequence Diagram.png" alt="Sequence Diagram" width="300px"/>

###### Gitflow Diagrams
Dynamically render branches and commits.
<img src="config/img/Sample: Gitflow Diagram.png" alt="Gitflow Diagram" width="300px"/>

###### Clickable Diagrams
Click diagram nodes to open related pages, records, or custom actions.
<img src="config/img/Sample: Clickable Diagram.png" alt="Clickable Diagram" width="300px"/>

## Getting Started

The following commands will deploy the repo into an org.

```bash
sf org create scratch -a mermaid -f config/project-scratch-def.json -d -y 30
sf project deploy start
sf org assign permset -n UseMermaidDiagramEditor
sf org open -p /lightning/n/MermaidDiagramEditor
```

The app page will present two examples:

1. A wrapper LWC with a `lightning-textarea` to provide input
2. Example 2: A wrapper Screen Flow with a flow text area to provide input

## Considerations

- Supported Diagrams
  - The following diagrams seem to work correctly: `Flowchart`, `Sequence`, `Class`, `State`, `Entity Relationship`, `User Journey`, `Pie Chart`, `Quadrant Chart`, `Requirement Diagram`, `Gitgraph (Git) Diagram`, `C4 Diagram`, `Mindmaps`, `Timeline`, `Sankey`, `XYChart`, `Block Diagram`.
  - `Gantt` and `Zenuml` diagrams do not work at all.
  - `Quadrant` diagram labels do not align correctly.
- The `htmlLabels: false` config setting does not currently work and text will disappear due to an issue with xhtml and svg namespace conflicts.
- The standard `mermaid.min.js` file uses a `structuredClone()` method, which is unsupported in LWC/LWS. A viable workaround is to find and replace all references with a simple JSON object copy:

```bash
# Download the latest version of mermaid.js
npm i mermaid@10.9.0
# Copy the minified file to overwrite the current static resource
cp node_modules/mermaid/dist/mermaid.min.js force-app/main/default/staticresources/mermaid.js
# Replace all `structuredClone()` methods with a simple `JSON.parse(JSON.stringify())` object copy:
sed -i '' 's/structuredClone(/JSON.parse(JSON.stringify(/g' force-app/main/default/staticresources/mermaid.js
```

## Resources

- [Mermaid.js Documentation](https://mermaid.js.org/intro/getting-started.html)
- [Mermaid.js MIT License](https://github.com/mermaid-js/mermaid/blob/develop/LICENSE)
- [Mermaid.js NPM repository](https://www.npmjs.com/package/mermaid)