# Changelog

## v0.1.0 — Initial Release

The first release of Yokter Kit, a lightweight React Native library for form management and CRUD operations built on React Hook Form and TanStack Query.

### Provider

- **YokterProvider** — Root provider that wires up the query client, data provider, notification provider, and i18n provider into a single context.

### Hooks

- **useForm** — Full form lifecycle for create and edit flows. Handles fetching initial values (edit mode), validation, submission via create/update mutations, notifications, and cache invalidation.
- **useList** — Fetch paginated, sorted, and filtered lists of records.
- **useInfiniteList** — Infinite scroll pagination using `useInfiniteQuery`.
- **useOne** — Fetch a single record by ID.
- **useCreate** — Create mutation with success/error notifications and automatic cache invalidation.
- **useUpdate** — Update mutation with success/error notifications and automatic cache invalidation.
- **useDelete** — Delete mutation with success/error notifications and automatic cache invalidation.
- **useInvalidate** — Manually invalidate query caches by resource.
- **useNotification** — Access the notification provider's `open` and `close` methods.
- **useLocalize** — Access the `localize` function from the i18n provider.

### Components

- **Form** — Wraps children with React Hook Form's `FormProvider`.
- **FormItem** — Controller that binds `value`, `onChange`, `onBlur`, and `errorMessage` to its child component. Supports automatic validation messages for `required`, `min`, `max`, `minLength`, `maxLength`, and `pattern` rules via the i18n provider.

### Interfaces

- **DataProvider** — Pluggable backend adapter (`getList`, `getOne`, `create`, `update`, `deleteOne`, `getApiUrl`).
- **I18nProvider** — Pluggable localization interface with generic type parameters for locale and key suggestions (`localize`, `changeLocale`, `getLocale`).
- **NotificationProvider** — Pluggable alert/toast handler (`open`, `close`).

### Examples

- **crud** — Expo Go app demonstrating list, create, edit, and delete flows using a fake REST API.
