import { useState } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { YokterProvider } from "../../src/context/yokter.context";
import { dataProvider } from "./src/data-provider";
import { PostListScreen } from "./src/screens/PostListScreen";
import { PostFormScreen } from "./src/screens/PostFormScreen";
import { I18nProvider } from "../../src/types/i18n.type";

type Screen =
  | { name: "list" }
  | { name: "create" }
  | { name: "edit"; id: string };

type Locale = "en" | "hi";

const dummyLocaleStrings = {
  en: {
    create: "Create",
    world: "world",
  },
  hi: {
    create: "बनाएं",
    world: "संसार",
  },
} as const;

export default function App() {
  const [locale, setLocale] = useState<Locale>("hi");
  const [screen, setScreen] = useState<Screen>({ name: "list" });

  const i18nProvider: I18nProvider<Locale, keyof typeof dummyLocaleStrings.en> =
    {
      localize: (key) => dummyLocaleStrings[locale][key],
      getLocale: () => locale,
      changeLocale: (locale) => setLocale(locale),
    };

  return (
    <YokterProvider
      dataProvider={dataProvider}
      notificationProvider={{
        open: (params) => {
          Alert.alert(params.message, params.description);
        },
        close: () => {
          // ignore
        },
      }}
      i18nProvider={i18nProvider}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {screen.name === "list" && (
          <PostListScreen
            onNavigateCreate={() => setScreen({ name: "create" })}
            onNavigateEdit={(id) => setScreen({ name: "edit", id })}
          />
        )}
        {screen.name === "create" && (
          <PostFormScreen
            action="create"
            onBack={() => setScreen({ name: "list" })}
          />
        )}
        {screen.name === "edit" && (
          <PostFormScreen
            action="edit"
            id={screen.id}
            onBack={() => setScreen({ name: "list" })}
          />
        )}
      </SafeAreaView>
    </YokterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
