import { LightningElement, api, wire } from 'lwc';
import MERMAID_RSC from "@salesforce/resourceUrl/mermaid";
import { loadScript } from "lightning/platformResourceLoader";
import { NavigationMixin } from 'lightning/navigation';
import { IsConsoleNavigation, openTab } from 'lightning/platformWorkspaceApi';

export default class MermaidDiagram extends NavigationMixin(LightningElement) {

    @wire(IsConsoleNavigation) isConsoleNavigation;
    recordPageUrl;
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
            window.callback = (this.diagramCallback).bind(this);
            this.drawDiagram();
        })
        .catch(error => {
            console.log(error);
        });
    }

    async diagramCallback(event) {
        console.log('diagram clicked: ', event);
        if (typeof event === 'string' && event.length === 18) {
            // Open Record URL Page
            if (this.isConsoleNavigation) {
                await openTab({ recordId: event })
            } else {
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: event,
                        actionName: 'view'
                    }
                });
            }
        }
    }

    async drawDiagram() {
        // Define a unique ID for the diagram to support custom styling
        let diagramId = `diagram_${new Date().getTime().toString()}`;
        let {svg, bindFunctions} = await mermaid.render(diagramId, this._graphDefinition);
        console.log(svg);
        
        // Sanitize SVG with unique ID to ensure markers don't disappear when multiple diagrams are present on multiple console tabs
        const ERMarkers = [
            "ONLY_ONE_START",
            "ONLY_ONE_END",
            "ZERO_OR_ONE_START",
            "ZERO_OR_ONE_END",
            "ONE_OR_MORE_START",
            "ONE_OR_MORE_END",
            "ZERO_OR_MORE_START",
            "ZERO_OR_MORE_END"
        ];
        for (const marker of ERMarkers) {
            svg = svg.replaceAll(marker, `${marker}${diagramId}`);
        }
        console.log(svg);

        let graphDiv = this.template.querySelector(".graphDiv");
        graphDiv.innerHTML = svg;
        bindFunctions?.(graphDiv);
    }

}