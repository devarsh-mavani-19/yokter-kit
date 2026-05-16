export type SortOrder = "desc" | "asc";

export type CrudSort = {
  field: string;
  order: SortOrder;
};
