import { ImageProps } from '../[micrositeSlug]/album/page';
import JSZip from 'jszip';

function forceDownload(blobUrl: string, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadPhoto(url: string, filename: string) {
  const safeFilename = filename || url.split('\\').pop()?.split('/').pop() || 'download.jpg';
  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: 'cors',
  })
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, safeFilename);
    })
    .catch((e) => console.error(e));
}

export async function downloadImagesAsZip(images: ImageProps[]) {
  const zip = new JSZip();

  await Promise.all(
    images.map(async (image, idx) => {
      try {
        const response = await fetch(image.image_url, {
          headers: { Origin: location.origin },
          mode: 'cors',
        });
        const blob = await response.blob();
        zip.file(`${idx}.jpg`, blob);
      } catch (e) {
        console.error(`Failed to fetch image ${image.image_url}`, e);
      }
    }),
  );

  const content = await zip.generateAsync({ type: 'blob' });

  const blobUrl = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'images.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}
