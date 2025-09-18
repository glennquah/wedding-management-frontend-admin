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
}

export default function ImageUploadWidget({
  onUpload,
  buttonText = 'Upload Image',
  maxImageHeight = 300,
  minImageHeight = 300,
  maxImageWidth = 300,
  minImageWidth = 300,
}: ImageUploadWidgetProps) {
  const configOptions = {
    sources: allowedSources,
    // multiple: true,
    // maxFiles: 5,

    // cropping: true,
    // croppingAspectRatio: 1,

    maxImageHeight,
    minImageHeight,
    maxImageWidth,
    minImageWidth,
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
      onSuccess={(result: CloudinaryUploadWidgetResults, { widget }) => {
        const info = result.info as CloudinaryUploadWidgetInfo;
        console.log('Image URL:', info.secure_url);

        onUpload(info.secure_url);

        toast('Image upload success!');
      }}
      onError={(error, options) => {
        console.log('Error uploading image:', error);

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
