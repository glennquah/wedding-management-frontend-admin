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

export interface PersonFolder {
  clusterId: number;
  label: string;
  photoIds: number[];
}

export async function downloadImagesOrganizedByPerson(
  allPhotos: ImageProps[],
  personFolders: PersonFolder[],
  blurryPhotoIds?: Set<number>,
) {
  const zip = new JSZip();

  // Track which photos have been added (for duplicates across person folders)
  const photosInPersonFolders = new Set<number>();

  // Create folders for each person and add their photos
  for (const person of personFolders) {
    const folderName = person.label || `Person ${person.clusterId}`;
    const personFolder = zip.folder(folderName);

    if (!personFolder) continue;

    // Filter out blurry photos if needed
    const photoIdsToDownload = blurryPhotoIds
      ? person.photoIds.filter((id) => !blurryPhotoIds.has(id))
      : person.photoIds;

    // Add photos for this person
    await Promise.all(
      photoIdsToDownload.map(async (photoId) => {
        photosInPersonFolders.add(photoId);

        const photo = allPhotos[photoId];
        if (!photo) return;

        try {
          const response = await fetch(photo.image_url, {
            headers: { Origin: location.origin },
            mode: 'cors',
          });
          const blob = await response.blob();
          const extension = photo.format || 'jpg';
          personFolder.file(`${photoId}.${extension}`, blob);
        } catch (e) {
          console.error(`Failed to fetch image ${photo.image_url}`, e);
        }
      }),
    );
  }

  // Create "Other Photos" folder for photos not in any person cluster
  const otherPhotos = allPhotos.filter((_, idx) => {
    // Skip if already in a person folder
    if (photosInPersonFolders.has(idx)) return false;
    // Skip if blurry (when filtering is enabled)
    if (blurryPhotoIds && blurryPhotoIds.has(idx)) return false;
    return true;
  });

  if (otherPhotos.length > 0) {
    const otherFolder = zip.folder('Other Photos');

    if (otherFolder) {
      await Promise.all(
        otherPhotos.map(async (photo) => {
          try {
            const response = await fetch(photo.image_url, {
              headers: { Origin: location.origin },
              mode: 'cors',
            });
            const blob = await response.blob();
            const extension = photo.format || 'jpg';
            otherFolder.file(`${photo.id}.${extension}`, blob);
          } catch (e) {
            console.error(`Failed to fetch image ${photo.image_url}`, e);
          }
        }),
      );
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });

  const blobUrl = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'curated-album.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}
