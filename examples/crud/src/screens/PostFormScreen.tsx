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
  RateInput,
  Badge,
  DateTimePicker,
  WheelInput,
  DateTimeRangePicker,
  FileInput,
  FileListInput,
  FileInputValue,
  PickFileFn,
  UploadFn,
} from "yokter-kit";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useMemo, useState } from "react";

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

  const [rate, setRate] = useState(0);
  const [singleFile, setSingleFile] = useState<FileInputValue | undefined>();
  const [multiFiles, setMultiFiles] = useState<FileInputValue[] | undefined>();

  // Pick files using expo-document-picker for documents, expo-image-picker for images
  const pickDocumentsFn: PickFileFn = useCallback(async ({ multiple }) => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: multiple ?? false,
    });
    if (result.canceled) return undefined;
    return result.assets.map((asset) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType ?? undefined,
      size: asset.size ?? undefined,
    }));
  }, []);

  const pickImagesFn: PickFileFn = useCallback(async ({ multiple }) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: multiple ?? false,
    });
    if (result.canceled) return undefined;
    return result.assets.map((asset) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name:
        asset.fileName ??
        asset.uri.split("/").pop() ??
        `image-${Date.now()}.jpg`,
      uri: asset.uri,
      mimeType: asset.mimeType ?? undefined,
      size: asset.fileSize ?? undefined,
    }));
  }, []);

  // Simulated upload — ticks progress over 2s (no real endpoint needed for demo)
  const simulatedUploadFn: UploadFn = useCallback(
    async (asset, { onProgress }) => {
      const abortController = new AbortController();
      await new Promise<void>((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
          if (abortController.signal.aborted) {
            clearInterval(interval);
            reject(new Error("Upload aborted"));
            return;
          }
          progress += 0.1;
          onProgress({ progress: Math.min(progress, 1) });
          if (progress >= 1) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
      return {
        data: { url: `https://example.com/uploads/${asset.name}` },
        abortController,
      };
    },
    [],
  );

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
          <FormItem name="datepicker">
            <DateTimePicker mode="datetime" />
          </FormItem>
        </View>
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
        {/* <View style={styles.field}>
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
        /> */}
        {/* 
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
        <View style={styles.field}>
          <FormItem name="rate">
            <RateInput />
          </FormItem>
        </View> */}
        <View style={styles.field}>
          <FormItem name="status" label="Status">
            <WheelInput
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "rejected", label: "Rejected" },
              ]}
            />
          </FormItem>
        </View>
        <View style={styles.field}>
          <FormItem name="dateRangePickerLuxon">
            <DateTimeRangePicker mode="time" locale="de" />
          </FormItem>
        </View>
      </Form>
      <View style={styles.field}>
        <Typography style={styles.label}>Single File Upload</Typography>
        <FileInput
          uploadFn={simulatedUploadFn}
          pickFileFn={pickImagesFn}
          title="Upload an image"
          description="Pick from your photo library"
          buttonText="Choose image"
          accept={["image/jpeg", "image/png"]}
          maxFileSizeBytes={5 * 1024 * 1024}
          value={singleFile}
          onChange={setSingleFile}
          onFileSizeExceeded={() => console.log("File too large")}
          onInvalidFormat={() => console.log("Invalid format")}
        />
      </View>

      <View style={styles.field}>
        <Typography style={styles.label}>Multi File Upload (max 3)</Typography>
        <FileListInput
          uploadFn={simulatedUploadFn}
          pickFileFn={pickDocumentsFn}
          title="Upload documents"
          description="Select up to 3 files"
          buttonText="Choose files"
          max={3}
          maxFileSizeBytes={10 * 1024 * 1024}
          value={multiFiles}
          onChange={setMultiFiles}
          onMaxCountExceeded={(max) =>
            console.log(`Maximum ${max} files allowed`)
          }
        />
      </View>

      <View
        style={[
          styles.field,
          {
            flexDirection: "row",
            gap: 8,
            flexWrap: "wrap",
          },
        ]}
      >
        <Badge variant="default">Default</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="secondary">Secondary</Badge>
      </View>

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
