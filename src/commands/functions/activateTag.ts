import { Models } from 'node-appwrite';
import { functions } from '../../client';
import { TagTreeItem } from '../../tree/functions/tags/TagTreeItem';

export async function activateTag(tagItem: TagTreeItem | Models.Deployment): Promise<void> {
    const tag = tagItem instanceof TagTreeItem ? tagItem.tag : tagItem;
    await functions?.updateDeployment(tag.functionId, tag.$id);
}
