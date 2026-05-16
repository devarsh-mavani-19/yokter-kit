import { CrudFilter } from "./filter.type";
import { Pagination } from "./pagination.type";
import { CrudSort } from "./sorter.type";

export type BaseRecord = {
  id?: string | number;
  [key: string]: unknown;
};

export interface DataProvider {
  getList<TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<ListResponse<TData>>;
  getOne<TData extends BaseRecord = BaseRecord>(
    params: GetOneParams,
  ): Promise<SingleResponse<TData>>;
  create<TData extends BaseRecord = BaseRecord, TVariables = object>(
    params: CreateParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  update<TData extends BaseRecord = BaseRecord, TVariables = object>(
    params: UpdateParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  deleteOne<TData extends BaseRecord = BaseRecord, TVariables = object>(
    params: DeleteOneParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  getApiUrl(): string;
}

export type CreateParams<TVariables> = {
  resource: string;
  variables: TVariables;
  meta?: { [k: string]: unknown };
};

export type GetListParams = {
  resource: string;
  pagination?: Pagination;
  sorters?: CrudSort[];
  filters?: CrudFilter[];
  meta?: { [k: string]: unknown };
};

export type GetOneParams = {
  resource: string;
  id: string;
  meta?: { [k: string]: unknown };
  enabled?: boolean;
};

export type UpdateParams<TVariables = object> = {
  resource: string;
  id: string;
  variables?: TVariables;
  meta?: { [k: string]: unknown };
};

export type DeleteOneParams<TVariables = object> = {
  resource: string;
  id: string;
  variables?: TVariables;
  meta?: { [k: string]: unknown };
};

export type ListResponse<TVariables> = {
  data: TVariables[];
  total: number | undefined;
};

export type SingleResponse<TVariables> = {
  data: TVariables;
};
