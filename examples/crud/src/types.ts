import { BaseRecord } from "../../../src/types/data-provider.type";

export type Post = BaseRecord & {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
};

export type PostFormValues = {
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
};
