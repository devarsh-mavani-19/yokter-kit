import { Pagination } from "../types/pagination.type";
import { CrudSort } from "../types/sorter.type";

export type GetQueryKeyProps = {
  resource: string;
  id?: string;
  pagination?: Pagination;
  sorters?: CrudSort[];
  meta?: { [k: string]: unknown };
  action?: "list" | "one" | "create" | "update" | "delete";
};

export const getQueryKey = ({
  id,
  resource,
  pagination,
  sorters,
  meta,
  action,
}: GetQueryKeyProps) => [
  ...(action ? [action] : []),
  ...resource.split("/").filter(Boolean),
  ...(id !== undefined && id !== "-" ? [id] : []),
  ...(pagination !== undefined ? [pagination] : []),
  ...(sorters !== undefined ? [sorters] : []),
  ...(meta !== undefined ? [meta] : []),
];
