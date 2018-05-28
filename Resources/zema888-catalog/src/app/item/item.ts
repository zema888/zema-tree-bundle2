export class ItemProperty {
  field: string;
  type: string;
}

export interface Item {
  id: number;
  parent_id: number;
  title: string;
  position: number;
  properties: ItemProperty[];
  loader: boolean;
}
