import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Post, PostFormValues } from "../types";
import {
  AutoComplete,
  AutoCompleteOption,
  Button,
  Checkbox,
  Dropdown,
  Form,
  FormInputFieldProps,
  FormItem,
  Input,
  InputNumber,
  OtpInput,
  RadioGroup,
  SegmentedControl,
  Slider,
  Switch,
  TextArea,
  Typography,
  useForm,
  useGetLocale,
} from "yokter-kit";
import { useMemo, useState } from "react";

type Props = {
  action: "create" | "edit";
  id?: string;
  onBack: () => void;
};

function FormTextInput({
  value,
  onChange,
  onBlur,
  placeholder,
  multiline,
  numberOfLines,
  errorMessage,
}: FormInputFieldProps<string> & {
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}) {
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          errorMessage && styles.inputError,
        ]}
        value={value ?? ""}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

function StatusPicker({ value, onChange }: FormInputFieldProps<string>) {
  return (
    <View style={styles.statusRow}>
      {(["draft", "published", "rejected"] as const).map((s) => (
        <TouchableOpacity
          key={s}
          style={[styles.statusBtn, value === s && styles.statusBtnActive]}
          onPress={() => onChange?.(s)}
        >
          <Text
            style={[
              styles.statusBtnText,
              value === s && styles.statusBtnTextActive,
            ]}
          >
            {s}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function PostFormScreen({ action, id, onBack }: Props) {
  const getLocale = useGetLocale();
  const [fruit, setFruit] = useState<string>();
  const [otp, setOtp] = useState<string>();
  const [sliderVal, setSliderVal] = useState<number>();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [radio2, setRadio2] = useState<"apple" | "banana" | undefined>();
  const [radio, setRadio] =
    useState<
      (
        | "apple"
        | "banana"
        | "cherry"
        | "mango"
        | "grape"
        | "orange"
        | "papaya"
        | "pineapple"
        | "watermelon"
        | "kiwi"
        | "strawberry"
        | "blueberry"
      )[]
    >();

  const fruitOptions: AutoCompleteOption[] = useMemo(() => {
    if (!fruit) return [];
    return [
      {
        label: `${fruit}a`,
        value: `${fruit}a`,
      },
      {
        label: `${fruit}ab`,
        value: `${fruit}ab`,
      },
      {
        label: `${fruit}abc`,
        value: `${fruit}abc`,
      },
    ];
  }, [fruit]);

  const { form, saveButtonProps } = useForm<Post, PostFormValues>({
    action,
    resource: "posts",
    id,
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
    onMutationSuccess: () => {
      onBack();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Typography variant="h5">← Back</Typography>
        </TouchableOpacity>
        <Text style={styles.title}>
          {action === "create" ? "Create Post" : "Edit Post"}
        </Text>
      </View>
      <Dropdown<
        | "apple"
        | "banana"
        | "cherry"
        | "mango"
        | "grape"
        | "orange"
        | "papaya"
        | "pineapple"
        | "watermelon"
        | "kiwi"
        | "strawberry"
        | "blueberry"
      >
        clearable
        mode="multi"
        options={[
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
          { label: "Mango", value: "mango" },
          { label: "Grape", value: "grape" },
          { label: "Orange", value: "orange" },
          { label: "Papaya", value: "papaya" },
          { label: "Pineapple", value: "pineapple" },
          { label: "Watermelon", value: "watermelon" },
          { label: "Kiwi", value: "kiwi" },
          { label: "Strawberry", value: "strawberry" },
          { label: "Blueberry", value: "blueberry" },
        ]}
        value={radio}
        onChange={(value) => setRadio(value)}
      />
      <Form form={form}>
        <View style={styles.field}>
          <Typography style={styles.label}>Title</Typography>
          <FormItem<PostFormValues>
            name="title"
            label="Title"
            rules={{ required: true }}
          >
            <InputNumber placeholder="Enter Number" locale={getLocale()} />
            {/* <Input placeholder="Enter title" /> */}
          </FormItem>
        </View>
        <Checkbox value={isFocus} onChange={() => setIsFocus(!isFocus)} />
        <View style={{ margin: 8 }}>
          <OtpInput value={otp} onChange={(value) => setOtp(value)} />
        </View>
        <View style={{ margin: 8 }}>
          <Slider
            haptic
            step={5}
            value={sliderVal}
            onChange={(val) => setSliderVal(val)}
          />
        </View>
        <RadioGroup
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ]}
          value={radio2}
          onChange={(value) => setRadio2(value)}
        />
        <View style={styles.field}>
          <Typography style={styles.label}>Content</Typography>
          <FormItem<PostFormValues>
            name="content"
            label="Content"
            rules={{ required: true }}
          >
            <TextArea placeholder="Enter content" />
          </FormItem>
        </View>

        <AutoComplete
          options={fruitOptions}
          onChange={(value) => setFruit(value)}
          value={fruit}
        />

        <View style={styles.field}>
          <Typography style={styles.label}>Status</Typography>
          <FormItem<PostFormValues> name="status" label="Status">
            <SegmentedControl<"draft" | "published" | "rejected">
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "Rejected", value: "rejected" },
              ]}
            />
          </FormItem>
        </View>
      </Form>

      <Button {...saveButtonProps}>
        {action === "create" ? "Create" : "Save"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  backBtn: { fontSize: 16, color: "#007AFF" },
  title: { fontSize: 20, fontWeight: "700" },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderColor: "#ff3b30" },
  textArea: { height: 100, textAlignVertical: "top" },
  error: { color: "#ff3b30", fontSize: 12, marginTop: 4 },
  statusRow: { flexDirection: "row", gap: 8 },
  statusBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  statusBtnText: { color: "#333" },
  statusBtnTextActive: { color: "#fff" },
  submitBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
