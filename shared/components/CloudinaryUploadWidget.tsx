import { Button } from './ui/button';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { toast } from 'sonner';

const allowedSources: Array<
  | 'local'
  | 'camera'
  | 'dropbox'
  | 'facebook'
  | 'gettyimages'
  | 'google_drive'
  | 'image_search'
  | 'instagram'
  | 'istock'
  | 'shutterstock'
  | 'unsplash'
  | 'url'
> = ['local'];

interface ImageUploadWidgetProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  maxImageWidth?: number;
  minImageWidth?: number;
  maxImageHeight?: number;
  minImageHeight?: number;
  folder?: string;
}

export default function ImageUploadWidget({
  onUpload,
  buttonText = 'Upload Image',
  maxImageHeight = 8192,
  maxImageWidth = 8192,
  minImageHeight = 100,
  minImageWidth = 100,
  folder,
}: ImageUploadWidgetProps) {
  const configOptions = {
    sources: allowedSources,
    multiple: false, // Keep this false for single file selection
    showAdvancedOptions: false,
    showSkipCropButton: true,
    showRemoveButton: false,
    showUploadMoreButton: false,
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxImageHeight,
    minImageHeight,
    maxImageWidth,
    minImageWidth,
    folder,
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
      onSuccess={(result: CloudinaryUploadWidgetResults, { widget }) => {
        const info = result.info as CloudinaryUploadWidgetInfo;
        onUpload(info.secure_url);

        toast('Image upload success!');

        // Close the widget after successful upload
        widget.close();
      }}
      onError={(error, options) => {
        toast('Image upload error!');
      }}
      options={configOptions}
    >
      {({ open }) => {
        function handleOnClick() {
          open();
        }

        return (
          <Button type="button" onClick={handleOnClick}>
            {buttonText}
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
