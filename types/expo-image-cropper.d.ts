declare module "expo-image-cropper" {
  export interface ImageCropperOptions {
    width?: number;
    height?: number;
    borderWidth?: number;
    borderColor?: string;
    cancelText?: string;
    cancelTextColor?: string;
    cancelTextFontSize?: number;
    doneText?: string;
    doneTextColor?: string;
    doneTextFontSize?: number;
    title?: string;
    titleColor?: string;
    titleFontSize?: number;
    toolbarColor?: string;
    toolbarBorderColor?: string;
    toolbarCancelIconColor?: string;
    toolbarDoneIconColor?: string;
    imageWidth?: number;
    imageHeight?: number;
  }

  export function crop(
    imagePath: string,
    options?: ImageCropperOptions,
  ): Promise<{ path: string; width: number; height: number } | null>;
}
