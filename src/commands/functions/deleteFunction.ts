import { functions } from '../../client';
import { FunctionTreeItem } from '../../tree/functions/FunctionTreeItem';

export async function deleteFunction(treeItem: FunctionTreeItem): Promise<void> {
    if (!treeItem) {
        return;
    }
    await functions?.delete(treeItem.func.$id);
}
