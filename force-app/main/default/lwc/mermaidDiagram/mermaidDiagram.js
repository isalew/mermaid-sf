import { LightningElement, api } from 'lwc';
import MERMAID_RSC from "@salesforce/resourceUrl/mermaid";
import { loadScript } from "lightning/platformResourceLoader";

export default class MermaidDiagram extends LightningElement {

    _graphDefinition;

    @api
    get graphDefinition() {
        return this._graphDefinition;
    }

    set graphDefinition(value) {
        console.log('value change: ', value)
        this._graphDefinition = value;
        if (typeof mermaid !== 'undefined') { this.drawDiagram(); }
    }

    connectedCallback() {
        loadScript(this, MERMAID_RSC)
        .then(() => {
            mermaid.initialize({ 
                startOnLoad: false,
                securityLevel: 'loose',
                logLevel: 'debug',
                flowchart: { htmlLabels: false }
            });
            window.callback = this.diagramCallback;
            this.drawDiagram();
        })
        .catch(error => {
            console.log(error);
        });
    }

    async diagramCallback(event) {
        console.log('diagram clicked: ', event);
    }

    async drawDiagram() {
        let {svg, bindFunctions} = await mermaid.render('diagram', this._graphDefinition);
        console.log(svg);
        let graphDiv = this.template.querySelector(".graphDiv");
        graphDiv.innerHTML = svg;
        bindFunctions?.(graphDiv);
    }

}