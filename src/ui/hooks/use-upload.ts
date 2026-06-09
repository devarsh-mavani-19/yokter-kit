import { useCallback, useState } from "react";

export type FileAsset = {
  id: string;
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

export type UploadProgressEvent = {
  progress: number;
};

export type UploadResult<T = unknown> = {
  data: T;
  abortController?: AbortController;
};

export type UploadFn<T = unknown> = (
  asset: FileAsset,
  options: {
    onProgress: (event: UploadProgressEvent) => void;
    signal?: AbortSignal;
  },
) => Promise<UploadResult<T>>;

export type UseUploadProps<T = unknown> = {
  uploadFn: UploadFn<T>;
};

export type UseUploadReturn<T = unknown> = {
  upload: (
    asset: FileAsset,
    callbacks?: {
      onProgress?: (event: UploadProgressEvent, asset: FileAsset) => void;
      onSuccess?: (data: T, asset: FileAsset) => void;
      onError?: (error: Error, asset: FileAsset) => void;
    },
  ) => Promise<{ abortController: AbortController }>;
  isLoading: boolean;
  progress: number;
};

export const useUpload = <T = unknown>({
  uploadFn,
}: UseUploadProps<T>): UseUploadReturn<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (
      asset: FileAsset,
      callbacks?: {
        onProgress?: (event: UploadProgressEvent, asset: FileAsset) => void;
        onSuccess?: (data: T, asset: FileAsset) => void;
        onError?: (error: Error, asset: FileAsset) => void;
      },
    ) => {
      const abortController = new AbortController();

      setIsLoading(true);
      setProgress(0);

      try {
        const result = await uploadFn(asset, {
          onProgress: (event) => {
            setProgress(event.progress);
            callbacks?.onProgress?.(event, asset);
          },
          signal: abortController.signal,
        });

        callbacks?.onSuccess?.(result.data, asset);
        return { abortController: result.abortController ?? abortController };
      } catch (error) {
        callbacks?.onError?.(
          error instanceof Error ? error : new Error(String(error)),
          asset,
        );
        return { abortController };
      } finally {
        setIsLoading(false);
      }
    },
    [uploadFn],
  );

  return { upload, isLoading, progress };
};
