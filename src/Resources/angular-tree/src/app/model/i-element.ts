export interface IElement {
    id: number;
    title: string;
    lft: number;
    lvl: number;
    parentId: number | null;
    hasChildren: boolean;
    active: boolean;
}
