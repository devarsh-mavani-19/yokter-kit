# Yokter Kit

A lightweight React Native library for form management and CRUD operations, built on top of [React Hook Form](https://react-hook-form.com/) and [TanStack Query](https://tanstack.com/query).

## Features

- Form components with automatic validation and error messages
- CRUD hooks (`useCreate`, `useUpdate`, `useDelete`, `useList`, `useOne`)
- Unified `useForm` hook that handles both create and edit flows
- Pluggable data provider interface for any backend
- Pluggable i18n provider for localization
- Notification provider abstraction
- Automatic query invalidation after mutations

## Motivation

This project is a spinoff inspired by [Refine](https://github.com/refinedev/refine). Refine is a great framework, but when using it in React Native we ran into performance issues — excessive re-renders, unoptimized code, and general lag that made the experience feel heavy. Yokter Kit aims to provide the same developer-friendly patterns (data providers, form hooks, i18n) in a lightweight package built specifically with React Native performance in mind.

Special thanks to the Refine team for the architectural inspiration.

## Installation

```bash
yarn add yokter-kit react-hook-form @tanstack/react-query
```

## Quick Start

### 1. Define your data provider

```ts
import { DataProvider } from "yokter-kit";

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters }) => {
    /* ... */
  },
  getOne: async ({ resource, id }) => {
    /* ... */
  },
  create: async ({ resource, variables }) => {
    /* ... */
  },
  update: async ({ resource, id, variables }) => {
    /* ... */
  },
  deleteOne: async ({ resource, id }) => {
    /* ... */
  },
  getApiUrl: () => "https://api.example.com",
};
```

### 2. Wrap your app with YokterProvider

```tsx
import { YokterProvider } from "yokter-kit";

export default function App() {
  return (
    <YokterProvider
      dataProvider={dataProvider}
      notificationProvider={{
        open: (params) => Alert.alert(params.message, params.description),
        close: () => {},
      }}
    >
      {/* your app */}
    </YokterProvider>
  );
}
```

### 3. Build forms with Form and FormItem

```tsx
import { useForm, Form, FormItem } from "yokter-kit";

type Post = { id: number; title: string; content: string };
type PostFormValues = { title: string; content: string };

function CreatePostScreen() {
  const { form, saveButtonProps } = useForm<Post, PostFormValues>({
    action: "create",
    resource: "posts",
    defaultValues: { title: "", content: "" },
  });

  return (
    <Form form={form}>
      <FormItem<PostFormValues>
        name="title"
        label="Title"
        rules={{ required: true }}
      >
        <MyTextInput placeholder="Enter title" />
      </FormItem>

      <FormItem<PostFormValues>
        name="content"
        label="Content"
        rules={{ required: true }}
      >
        <MyTextInput placeholder="Enter content" multiline />
      </FormItem>

      <Button
        title="Create"
        onPress={saveButtonProps.onPress}
        disabled={saveButtonProps.disabled}
      />
    </Form>
  );
}
```

`FormItem` automatically:

- Binds `value`, `onChange`, `onBlur`, and `errorMessage` to its child via `cloneElement`
- Generates validation messages (required, min, max, minLength, maxLength, pattern) via the i18n provider
- Allows overriding messages by passing `{ value, message }` objects in rules

### 4. Fetch and display lists

```tsx
import { useList } from "yokter-kit";

function PostListScreen() {
  const { data, isLoading } = useList<Post>({
    resource: "posts",
    pagination: { mode: "server", current: 1, pageSize: 10 },
    sorters: [{ field: "id", order: "desc" }],
  });

  return (
    <FlatList
      data={data?.data}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}
```

### 5. Delete records

```tsx
import { useDelete } from "yokter-kit";

const deleteMutation = useDelete({ resource: "posts" });

deleteMutation.mutate(
  { resource: "posts", id: "1" },
  { onSuccess: () => refetch() },
);
```

## API Reference

### Provider

| Prop                   | Type                   | Required | Description           |
| ---------------------- | ---------------------- | -------- | --------------------- |
| `dataProvider`         | `DataProvider`         | Yes      | Backend adapter       |
| `notificationProvider` | `NotificationProvider` | No       | Alert/toast handler   |
| `i18nProvider`         | `I18nProvider`         | No       | Localization provider |

### Hooks

| Hook              | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `useForm`         | Full form lifecycle (fetch, validate, submit) for create/edit |
| `useList`         | Fetch paginated, sorted, filtered lists                       |
| `useInfiniteList` | Infinite scroll pagination                                    |
| `useOne`          | Fetch a single record                                         |
| `useCreate`       | Create mutation with notifications                            |
| `useUpdate`       | Update mutation with notifications                            |
| `useDelete`       | Delete mutation with notifications                            |
| `useInvalidate`   | Manually invalidate queries                                   |
| `useNotification` | Access notification provider                                  |
| `useLocalize`     | Access the `localize` function from the i18n provider         |

### Components

| Component  | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- |
| `Form`     | Wraps children with React Hook Form's `FormProvider`             |
| `FormItem` | Controller that binds form state to child and handles validation |

### useForm Options

```ts
useForm<TData, TVariables, TInitialValues>({
  action: "create" | "edit",
  resource: string,
  id?: string,                          // required for edit
  defaultValues?: DefaultValues<TVariables>,
  initialValuesTransform?: (data: TInitialValues) => TVariables,
  onFinishTransform?: (values: TVariables) => TVariables,
  resetFormOnSubmit?: boolean,
  onMutationSuccess?: (data, variables, onMutateResult, context) => void,
  onMutationError?: (error, variables, onMutateResult, context) => void,
  successNotification?: OpenNotificationParams | false,
  errorNotification?: OpenNotificationParams | false,
})
```

**Returns:** `{ form, saveButtonProps, onFinish, reloadForm, mutation }`

### DataProvider Interface

```ts
interface DataProvider {
  getList<TData>(params: GetListParams): Promise<ListResponse<TData>>;
  getOne<TData>(params: GetOneParams): Promise<SingleResponse<TData>>;
  create<TData, TVariables>(
    params: CreateParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  update<TData, TVariables>(
    params: UpdateParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  deleteOne<TData, TVariables>(
    params: DeleteOneParams<TVariables>,
  ): Promise<SingleResponse<TData>>;
  getApiUrl(): string;
}
```

### I18nProvider Interface

```ts
type I18nProvider<
  TLocale extends string = string,
  TKey extends string = string,
> = {
  localize: (
    key: TKey,
    options?: Record<string, unknown>,
    defaultMessage?: string,
  ) => string;
  changeLocale: (locale: TLocale) => void;
  getLocale: () => TLocale;
};
```

Pass a custom `i18nProvider` to `YokterProvider` for full control over translations. The `useLocalize` hook returns the `localize` function for use in your own components.

## Examples

See the [`examples/crud`](./examples/crud) directory for a full Expo Go app demonstrating:

- Listing posts with pagination
- Creating new posts with form validation
- Editing existing posts (auto-fetches current values)
- Deleting posts with confirmation

```bash
cd examples/crud
yarn install
yarn start
```

## License

MIT
