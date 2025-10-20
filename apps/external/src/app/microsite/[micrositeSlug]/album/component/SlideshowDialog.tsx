'use client';

import { useEffect, useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Button } from '@shared/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';

interface SlideshowCreatorProps {
  photoUrls: string[];
}

const audioOptions = [
  {
    name: 'Ry in the feels',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-1_opllxe.mp3',
  },
  {
    name: 'Make a move',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-3_iwnnif.mp3',
  },
  {
    name: 'Seal the deal',
    url: 'https://res.cloudinary.com/dnyxxyolp/video/upload/v1760936505/slideshow-music-2_y4n2dd.mp3',
  },
];

export default function SlideshowDialog({ photoUrls }: SlideshowCreatorProps) {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string>(audioOptions[0].url);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setIsReady(true);
    };

    loadFFmpeg();
  }, []);

  const createSlideshow = async () => {
    setIsProcessing(true);
    const ffmpeg = ffmpegRef.current;

    for (let i = 0; i < photoUrls.length; i++) {
      try {
        const fileData = await fetchFile(photoUrls[i]);
        await ffmpeg.writeFile(`image-${i}.jpg`, fileData);
        console.log(`Successfully wrote image-${i}.jpg to FFmpeg memory.`);
      } catch (error) {
        console.error(`Failed to fetch or write image: ${photoUrls[i]}`, error);
        setIsProcessing(false);
        return;
      }
    }

    const audioData = await fetchFile(selectedAudioUrl);
    await ffmpeg.writeFile('audio.mp3', audioData);

    console.log('Executing FFmpeg command...');
    await ffmpeg.exec([
      // Video input
      '-framerate',
      '1/3',
      '-i',
      'image-%d.jpg',

      // Audio input
      '-i',
      'audio.mp3',

      // Filters & codecs
      '-vf',
      'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-shortest',
      'output.mp4',
    ]);

    const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array;

    console.log('Output video file size (bytes):', data.byteLength);

    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([new Uint8Array(data)], { type: 'video/mp4' }),
      );
    }
    setIsProcessing(false);
  };

  const toggleAudioPreview = () => {
    if (isPlayingPreview) {
      audioPreviewRef.current?.pause();
    } else {
      audioPreviewRef.current?.play();
    }
    setIsPlayingPreview(!isPlayingPreview);
  };

  const handleAudioChange = (url: string) => {
    audioPreviewRef.current?.pause();
    setIsPlayingPreview(false);
    setSelectedAudioUrl(url);
  };

  return (
    <Dialog
      onOpenChange={() => {
        audioPreviewRef.current?.pause();
        setIsPlayingPreview(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Create Slideshow</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Slideshow</DialogTitle>
          <DialogDescription>
            Create a beautiful video slideshow to save and share.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center">
          <div className="w-full max-w-md flex items-center gap-2 mb-4">
            <Select onValueChange={handleAudioChange} defaultValue={selectedAudioUrl}>
              <SelectTrigger>
                <SelectValue placeholder="Select a song" />
              </SelectTrigger>
              <SelectContent>
                {audioOptions.map((option) => (
                  <SelectItem key={option.name} value={option.url}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={toggleAudioPreview}>
              {isPlayingPreview ? 'Pause' : 'Preview'}
            </Button>
          </div>
          {isReady && <video ref={videoRef} controls className="max-w-md bg-gray-900"></video>}
          <br />
          <Button onClick={createSlideshow} disabled={!isReady || isProcessing} className="mt-2">
            {isProcessing ? 'Creating...' : !isReady ? 'Loading FFmpeg...' : 'Create Slideshow'}
          </Button>
        </div>

        <audio
          ref={audioPreviewRef}
          src={selectedAudioUrl}
          onEnded={() => setIsPlayingPreview(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
