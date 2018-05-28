export interface El {
  id: number;
  title: string;
  lft: number;
  is_child: boolean;
  children: El[];
  loader: boolean;
  active: boolean;
}
