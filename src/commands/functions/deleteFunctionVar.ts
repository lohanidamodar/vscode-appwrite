import { functions } from '../../client';
import { VarTreeItem } from '../../tree/functions/settings/VarTreeItem';

export async function deleteFunctionVar(treeItem: VarTreeItem): Promise<void> {
    if (treeItem === undefined) {
        return;
    }

    const func = treeItem.func;
    const newVars = {...func.vars};
    delete newVars[treeItem.key];
    await functions?.update(func.$id, func.name, [], newVars, func.events, func.schedule, func.timeout);
}
