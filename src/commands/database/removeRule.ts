import { databases } from '../../client';
import { RuleTreeItem } from '../../tree/database/settings/RuleTreeItem';
import { refreshTree } from '../../utils/refreshTree';

export async function removeRule(ruleItem: RuleTreeItem): Promise<void> {
    if (!databases) {
        return;
    }
    const rule = ruleItem.rule;
    const collection = ruleItem.parent.parent.collection;
    await databases.removeRule(collection, rule);
    refreshTree('database');
}
