globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("react-native", () => ({
  View: ({ children }) => children,
  Text: ({ children }) => children,
  TextInput: () => null,
  TouchableOpacity: ({ children }) => children,
  StyleSheet: {
    create: (styles) => styles,
  },
  Alert: {
    alert: jest.fn(),
  },
  ActivityIndicator: () => null,
  FlatList: () => null,
}));
