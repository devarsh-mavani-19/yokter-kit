import { ReactNode, useCallback, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { FormInputFieldProps, FileInputSize } from "../../types";
import { useGetFileInputStyles } from "./use-get-file-input-styles";
import { Typography } from "../typography";
import { Button } from "../button";
import {
  FileAsset,
  UploadFn,
  UploadProgressEvent,
  useUpload,
} from "../../hooks/use-upload";

export type FileInputPickerType = "document" | "image";

export type FileInputValue = {
  id: string;
  url: string;
  name: string;
  status: "idle" | "uploading" | "error" | "done";
  file?: FileAsset;
  upload?: {
    id?: string;
    progress: number;
    abortController?: AbortController;
    error?: Error;
  };
};

export type PickFileFn = (options: {
  accept?: string[];
  multiple?: boolean;
  maxCount?: number;
}) => Promise<FileAsset[] | undefined>;

export type FileInputProps = FormInputFieldProps<FileInputValue | undefined> & {
  uploadFn: UploadFn;
  pickFileFn: PickFileFn;
  accept?: string[];
  size?: FileInputSize;
  disabled?: boolean;
  error?: boolean;
  icon?: ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  maxFileSizeBytes?: number;
  onFileSizeExceeded?: (file: FileAsset) => void;
  onInvalidFormat?: (file: FileAsset) => void;
  containerStyle?: ViewStyle;
  renderItem?: (props: {
    file: FileInputValue;
    onRemove: () => void;
    styles: ReturnType<typeof useGetFileInputStyles>;
  }) => ReactNode;
  renderDropzone?: (props: {
    onPress: () => void;
    disabled: boolean;
    styles: ReturnType<typeof useGetFileInputStyles>;
  }) => ReactNode;
};

export type FileListInputProps = FormInputFieldProps<
  FileInputValue[] | undefined
> & {
  uploadFn: UploadFn;
  pickFileFn: PickFileFn;
  accept?: string[];
  max?: number;
  size?: FileInputSize;
  disabled?: boolean;
  error?: boolean;
  icon?: ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  maxFileSizeBytes?: number;
  onFileSizeExceeded?: (file: FileAsset) => void;
  onInvalidFormat?: (file: FileAsset) => void;
  onMaxCountExceeded?: (max: number) => void;
  containerStyle?: ViewStyle;
  renderItem?: (props: {
    file: FileInputValue;
    onRemove: () => void;
    styles: ReturnType<typeof useGetFileInputStyles>;
  }) => ReactNode;
  renderDropzone?: (props: {
    onPress: () => void;
    disabled: boolean;
    styles: ReturnType<typeof useGetFileInputStyles>;
  }) => ReactNode;
};

function FileItem({
  file,
  onRemove,
  renderItem,
  styles,
}: {
  file: FileInputValue;
  onRemove: () => void;
  renderItem?: FileInputProps["renderItem"];
  styles: ReturnType<typeof useGetFileInputStyles>;
}) {
  if (renderItem) {
    return renderItem({ file, onRemove, styles });
  }

  return (
    <View>
      <View style={styles.item}>
        <Typography style={styles.itemText} numberOfLines={1}>
          {file.name}
        </Typography>
        {file.status === "error" && (
          <Typography style={styles.errorText}>Error</Typography>
        )}
        <Pressable onPress={onRemove} hitSlop={8}>
          <Typography style={styles.removeButton}>✕</Typography>
        </Pressable>
      </View>
      {file.status === "uploading" && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(file.upload?.progress ?? 0) * 100}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
}

function validateFile(
  asset: FileAsset,
  accept?: string[],
  maxFileSizeBytes?: number,
  onFileSizeExceeded?: (file: FileAsset) => void,
  onInvalidFormat?: (file: FileAsset) => void,
): boolean {
  if (
    maxFileSizeBytes &&
    asset.size !== undefined &&
    asset.size > maxFileSizeBytes
  ) {
    onFileSizeExceeded?.(asset);
    return false;
  }
  if (accept && accept.length > 0 && asset.mimeType) {
    if (!accept.includes(asset.mimeType)) {
      onInvalidFormat?.(asset);
      return false;
    }
  }
  return true;
}

export const FileInput = ({
  uploadFn,
  pickFileFn,
  accept,
  size = "md",
  disabled = false,
  error = false,
  icon,
  title,
  description,
  buttonText = "Choose file",
  maxFileSizeBytes,
  onFileSizeExceeded,
  onInvalidFormat,
  value,
  onChange,
  containerStyle,
  renderItem,
  renderDropzone,
}: FileInputProps) => {
  const [internalFile, setInternalFile] = useState<
    FileInputValue | undefined
  >();
  const file = value ?? internalFile;
  const styles = useGetFileInputStyles({ size, disabled, error });
  const { upload } = useUpload({ uploadFn });

  const setFile = useCallback(
    (
      updater:
        | FileInputValue
        | undefined
        | ((prev: FileInputValue | undefined) => FileInputValue | undefined),
    ) => {
      if (typeof updater === "function") {
        setInternalFile((prev) => {
          const current = value ?? prev;
          const next = updater(current);
          onChange?.(next);
          return next;
        });
      } else {
        setInternalFile(updater);
        onChange?.(updater);
      }
    },
    [onChange, value],
  );

  const handleUpload = useCallback(async () => {
    if (disabled) return;

    const picked = await pickFileFn({ accept, multiple: false });
    if (!picked || picked.length === 0) return;

    const asset = picked[0];
    if (!asset) return;

    if (
      !validateFile(
        asset,
        accept,
        maxFileSizeBytes,
        onFileSizeExceeded,
        onInvalidFormat,
      )
    ) {
      return;
    }

    const newFile: FileInputValue = {
      id: asset.id,
      name: asset.name,
      url: asset.uri,
      status: "uploading",
      file: asset,
      upload: { progress: 0 },
    };

    setFile(newFile);

    const { abortController } = await upload(asset, {
      onProgress: (e: UploadProgressEvent) => {
        setFile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: "uploading",
            upload: { ...prev.upload, progress: e.progress },
          };
        });
      },
      onSuccess: () => {
        setFile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: "done",
          };
        });
      },
      onError: (err: Error) => {
        setFile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: "error",
            upload: {
              progress: prev.upload?.progress ?? 0,
              ...prev.upload,
              error: err,
            },
          };
        });
      },
    });

    setFile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        upload: { ...prev.upload, progress: 0, abortController },
      };
    });
  }, [
    accept,
    disabled,
    maxFileSizeBytes,
    onFileSizeExceeded,
    onInvalidFormat,
    pickFileFn,
    setFile,
    upload,
  ]);

  const handleRemove = useCallback(() => {
    file?.upload?.abortController?.abort();
    setFile(undefined);
  }, [file, setFile]);

  const handlePress = useCallback(() => {
    void handleUpload();
  }, [handleUpload]);

  return (
    <View style={StyleSheet.flatten([{ width: "100%" }, containerStyle])}>
      {renderDropzone ? (
        renderDropzone({ onPress: handlePress, disabled, styles })
      ) : (
        <Pressable
          style={styles.dropzone}
          onPress={handlePress}
          disabled={disabled}
        >
          {icon}
          {title && <Typography style={styles.title}>{title}</Typography>}
          {description && (
            <Typography style={styles.description}>{description}</Typography>
          )}
          <Button size="sm" onPress={handlePress} disabled={disabled}>
            {buttonText}
          </Button>
        </Pressable>
      )}
      {file && (
        <FileItem
          file={file}
          onRemove={handleRemove}
          renderItem={renderItem}
          styles={styles}
        />
      )}
    </View>
  );
};

export const FileListInput = ({
  uploadFn,
  pickFileFn,
  accept,
  max = Infinity,
  size = "md",
  disabled = false,
  error = false,
  icon,
  title,
  description,
  buttonText = "Choose files",
  maxFileSizeBytes,
  onFileSizeExceeded,
  onInvalidFormat,
  onMaxCountExceeded,
  value,
  onChange,
  containerStyle,
  renderItem,
  renderDropzone,
}: FileListInputProps) => {
  const [internalFiles, setInternalFiles] = useState<FileInputValue[]>([]);
  const files = value ?? internalFiles;
  const styles = useGetFileInputStyles({ size, disabled, error });
  const { upload } = useUpload({ uploadFn });

  const setFiles = useCallback(
    (
      updater:
        | FileInputValue[]
        | ((prev: FileInputValue[]) => FileInputValue[]),
    ) => {
      if (typeof updater === "function") {
        setInternalFiles((prev) => {
          const current = value ?? prev;
          const next = updater(current);
          onChange?.(next);
          return next;
        });
      } else {
        setInternalFiles(updater);
        onChange?.(updater);
      }
    },
    [onChange, value],
  );

  const handleUpload = useCallback(async () => {
    if (disabled) return;

    const remaining = max - files.length;
    if (remaining <= 0) {
      onMaxCountExceeded?.(max);
      return;
    }

    const picked = await pickFileFn({
      accept,
      multiple: remaining > 1,
      maxCount: remaining,
    });
    if (!picked || picked.length === 0) return;

    const assets = picked.slice(0, remaining);
    if (picked.length > remaining) {
      onMaxCountExceeded?.(max);
    }

    const validAssets = assets.filter((asset) =>
      validateFile(
        asset,
        accept,
        maxFileSizeBytes,
        onFileSizeExceeded,
        onInvalidFormat,
      ),
    );

    if (validAssets.length === 0) return;

    const newFiles: FileInputValue[] = validAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      url: asset.uri,
      status: "uploading" as const,
      file: asset,
      upload: { progress: 0 },
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    await Promise.all(
      validAssets.map(async (asset) => {
        const { abortController } = await upload(asset, {
          onProgress: (e: UploadProgressEvent) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === asset.id
                  ? {
                      ...f,
                      status: "uploading" as const,
                      upload: { ...f.upload, progress: e.progress },
                    }
                  : f,
              ),
            );
          },
          onSuccess: () => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === asset.id ? { ...f, status: "done" as const } : f,
              ),
            );
          },
          onError: (err: Error) => {
            setFiles((prev) =>
              prev.map(
                (f): FileInputValue =>
                  f.id === asset.id
                    ? {
                        ...f,
                        status: "error" as const,
                        upload: {
                          progress: f.upload?.progress ?? 0,
                          ...f.upload,
                          error: err,
                        },
                      }
                    : f,
              ),
            );
          },
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === asset.id
              ? {
                  ...f,
                  upload: { ...f.upload, progress: 0, abortController },
                }
              : f,
          ),
        );
      }),
    );
  }, [
    accept,
    disabled,
    files.length,
    max,
    maxFileSizeBytes,
    onFileSizeExceeded,
    onInvalidFormat,
    onMaxCountExceeded,
    pickFileFn,
    setFiles,
    upload,
  ]);

  const handleRemove = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === id);
        target?.upload?.abortController?.abort();
        return prev.filter((f) => f.id !== id);
      });
    },
    [setFiles],
  );

  const handlePress = useCallback(() => {
    void handleUpload();
  }, [handleUpload]);

  return (
    <View style={StyleSheet.flatten([{ width: "100%" }, containerStyle])}>
      {renderDropzone ? (
        renderDropzone({ onPress: handlePress, disabled, styles })
      ) : (
        <Pressable
          style={styles.dropzone}
          onPress={handlePress}
          disabled={disabled}
        >
          {icon}
          {title && <Typography style={styles.title}>{title}</Typography>}
          {description && (
            <Typography style={styles.description}>{description}</Typography>
          )}
          <Button size="sm" onPress={handlePress} disabled={disabled}>
            {buttonText}
          </Button>
        </Pressable>
      )}
      {files.map((f) => (
        <FileItem
          key={f.id}
          file={f}
          onRemove={() => handleRemove(f.id)}
          renderItem={renderItem}
          styles={styles}
        />
      ))}
    </View>
  );
};
