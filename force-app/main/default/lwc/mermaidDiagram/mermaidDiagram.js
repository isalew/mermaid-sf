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
        let {svg, bindFunctions} = await mermaid.render('diagram', this._graphDefinition);
        console.log(svg);
        let graphDiv = this.template.querySelector(".graphDiv");
        graphDiv.innerHTML = svg;
        bindFunctions?.(graphDiv);
    }

}