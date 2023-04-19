import { Models } from 'node-appwrite';
import { ThemeIcon } from 'vscode';
import { ChildTreeItem } from '../ChildTreeItem';
import { DocumentsTreeItem } from './DocumentsTreeItem';

export class DocumentTreeItem extends ChildTreeItem<DocumentsTreeItem> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: DocumentsTreeItem, public readonly document: Models.Document) {
        super(parent, {
            label: document.$id
        });
        console.log(document);
        this.label = `${document.$id}`;
    }
    iconPath = new ThemeIcon('json');
    contextValue = 'document';
}
