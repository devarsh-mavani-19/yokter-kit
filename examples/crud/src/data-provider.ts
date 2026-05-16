import {
  BaseRecord,
  CreateParams,
  DataProvider,
  DeleteOneParams,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from "../../../src/types/data-provider.type";
import { apiClient } from "./api-client";

const API_URL = "https://api.fake-rest.refine.dev";

export type ResourceMeta = {
  params?: Record<string, unknown>;
  paths?: {
    getList?: string;
    getOne?: string;
    create?: string;
    update?: string;
    deleteOne?: string;
  };
};

export const dataProvider = {
  async getList<T extends BaseRecord>({
    resource,
    pagination,
    sorters,
    meta,
  }: GetListParams & { meta?: ResourceMeta }) {
    let skip: number | undefined;
    let take: number | undefined;

    if (pagination?.mode === "server" && pagination.pageSize) {
      skip = ((pagination.current ?? 1) - 1) * pagination.pageSize;
      take = pagination.pageSize;
    }

    const path = (meta as ResourceMeta | undefined)?.paths?.getList ?? resource;
    const { data, headers } = await apiClient.get<T[]>(path, {
      params: {
        ...(meta as ResourceMeta | undefined)?.params,
        ...(skip !== undefined && { _start: skip }),
        ...(take !== undefined && { _end: skip! + take }),
        ...(sorters?.length && {
          _sort: sorters[0].field,
          _order: sorters[0].order,
        }),
      },
    });

    const total = Number(headers["x-total-count"]);
    return {
      data,
      total: isNaN(total) ? undefined : total,
    };
  },

  async getOne<T extends BaseRecord>({
    resource,
    id,
    meta,
  }: GetOneParams & { meta?: ResourceMeta }) {
    const path = (meta as ResourceMeta | undefined)?.paths?.getOne ?? `${resource}/${id}`;
    const { data } = await apiClient.get<T>(path, {
      params: { ...(meta as ResourceMeta | undefined)?.params },
    });
    return { data };
  },

  async create<T extends BaseRecord, U>({
    resource,
    variables,
    meta,
  }: CreateParams<U> & { meta?: ResourceMeta }) {
    const path = (meta as ResourceMeta | undefined)?.paths?.create ?? resource;
    const { data } = await apiClient.post<T>(path, variables, {
      params: { ...(meta as ResourceMeta | undefined)?.params },
    });
    return { data };
  },

  async update<T extends BaseRecord, U>({
    resource,
    id,
    variables,
    meta,
  }: UpdateParams<U> & { meta?: ResourceMeta }) {
    const path = (meta as ResourceMeta | undefined)?.paths?.update ?? `${resource}/${id}`;
    const { data } = await apiClient.patch<T>(path, variables, {
      params: { ...(meta as ResourceMeta | undefined)?.params },
    });
    return { data };
  },

  async deleteOne<T extends BaseRecord, U>({
    resource,
    id,
    meta,
  }: DeleteOneParams<U> & { meta?: ResourceMeta }) {
    const path = (meta as ResourceMeta | undefined)?.paths?.deleteOne ?? `${resource}/${id}`;
    const { data } = await apiClient.delete<T>(path, {
      params: { ...(meta as ResourceMeta | undefined)?.params },
    });
    return { data };
  },

  getApiUrl() {
    return API_URL;
  },
} satisfies DataProvider;
