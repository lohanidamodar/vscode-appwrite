import { functions } from "../../client";
import { TagTreeItem } from "../../tree/functions/tags/TagTreeItem";

export async function deleteTag(tagItem: TagTreeItem): Promise<void> {
    if (tagItem === undefined) {
        return;
    }

    const func = tagItem.parent.parent.func;
    await functions?.deleteTag(func.$id, tagItem.tag.$id);
}
