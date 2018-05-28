export interface El {
  id: number;
  title: string;
  lft: number;
  lvl: number;
  is_child: boolean;
  children: El[];
  isLoading: boolean;
  active: boolean;
}
