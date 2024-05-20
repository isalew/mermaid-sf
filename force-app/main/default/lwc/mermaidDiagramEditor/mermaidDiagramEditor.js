import { LightningElement } from 'lwc';

export default class MermaidDiagramEditor extends LightningElement {
    textArea = 'graph TB\na-->b';

    handleChange(event) {
        this.textArea = event.target.value;
    }

}