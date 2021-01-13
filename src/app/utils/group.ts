import { GroupDesc, GroupChildDesc } from '../client';

export class FindByIdResult {
    group: GroupDesc;
    child: GroupChildDesc;
    constructor(group: GroupDesc, child: GroupChildDesc) {
        this.group = group;
        this.child = child;
    }
}

export class GroupHelper {
    static findById(desc: GroupDesc[], groupId: string): FindByIdResult {
        for (let i = 0; i < desc.length; i++) {
            const currDesc = desc[i];
            if (currDesc.id === groupId) {
                return new FindByIdResult(currDesc, null);
            } else {
                for (let k = 0; k < currDesc.child.length; k++) {
                    const child = currDesc.child[k];
                    if (child.id === groupId) {
                        return new FindByIdResult(currDesc, child);
                    }
                }
            }
        }
        return null;
    }
}
