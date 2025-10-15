'use client';

import { useEffect, useState } from 'react';
import { AlbumService, FaceClusterDto, ProcessingStatusDto } from '@shared/api';
import { Button } from '@shared/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import { CldImage } from 'next-cloudinary';
import { toast } from 'sonner';

interface DownloadCuratedAlbumProps {
  albumId: number;
  allPhotos: Array<{ id: number; image_url: string }>;
}

export default function DownloadCuratedAlbum({
  albumId,
  allPhotos,
}: DownloadCuratedAlbumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusDto | null>(null);
  const [faceClusters, setFaceClusters] = useState<FaceClusterDto[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<Set<number>>(new Set());
  const [includeBlurry, setIncludeBlurry] = useState(true);
  const [onlyWithPeople, setOnlyWithPeople] = useState(false);
  const [blurryPhotoIds, setBlurryPhotoIds] = useState<Set<number>>(new Set());

  // Fetch data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [status, clusters, blurryIndices] = await Promise.all([
        AlbumService.albumControllerGetProcessingStatus(albumId),
        AlbumService.albumControllerGetFaceClusters(albumId),
        AlbumService.albumControllerGetBlurryPhotos(albumId),
      ]);
      setProcessingStatus(status);
      setFaceClusters(clusters);
      setBlurryPhotoIds(new Set(blurryIndices));
    } catch (error) {
      console.error('Failed to fetch album data:', error);
      toast.error('Failed to load album data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCluster = (clusterId: number) => {
    const newSelected = new Set(selectedClusters);
    if (newSelected.has(clusterId)) {
      newSelected.delete(clusterId);
    } else {
      newSelected.add(clusterId);
    }
    setSelectedClusters(newSelected);
  };

  const selectAllClusters = () => {
    setSelectedClusters(new Set(faceClusters.map((c) => c.id)));
  };

  const deselectAllClusters = () => {
    setSelectedClusters(new Set());
  };

  const handleDownload = async () => {
    try {
      // Determine which people to include
      const selectedPersons = selectedClusters.size > 0
        ? faceClusters.filter((cluster) => selectedClusters.has(cluster.id))
        : faceClusters;

      // Filter photo IDs based on blur settings
      let filteredPersons = selectedPersons;
      if (!includeBlurry && blurryPhotoIds.size > 0) {
        // Remove blurry photos from each person's photoIds
        filteredPersons = selectedPersons.map((person) => ({
          ...person,
          photoIds: person.photoIds.filter((id) => !blurryPhotoIds.has(id)),
        })).filter((person) => person.photoIds.length > 0); // Remove persons with no non-blurry photos
      }

      if (filteredPersons.length === 0 && allPhotos.length === 0) {
        toast.error('No photos to download');
        return;
      }

      // Calculate total photos
      const totalPhotos = filteredPersons.length > 0
        ? new Set(filteredPersons.flatMap((p) => p.photoIds)).size
        : allPhotos.filter((_, idx) => includeBlurry || !blurryPhotoIds.has(idx)).length;

      toast.success(`Organizing and downloading ${totalPhotos} photos...`);

      // Use organized download function
      const { downloadImagesOrganizedByPerson } = await import('../utils/downloadPhoto');

      await downloadImagesOrganizedByPerson(
        allPhotos,
        filteredPersons.map((cluster, index) => ({
          clusterId: cluster.id,
          label: cluster.label || `Person ${faceClusters.findIndex(c => c.id === cluster.id) + 1}`,
          photoIds: cluster.photoIds,
        })),
        includeBlurry ? undefined : blurryPhotoIds,
      );

      setIsOpen(false);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download photos');
    }
  };

  const isProcessingComplete = processingStatus && processingStatus.percentage === 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Download Curated Album</Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-[80vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Curated Album</DialogTitle>
          <DialogDescription>
            Filter and download photos by quality and people detected
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading album data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Processing Status */}
            {processingStatus && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Processing Status</span>
                  <span className="text-gray-500">
                    {processingStatus.completed} / {processingStatus.total} photos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingStatus.percentage}%` }}
                  />
                </div>
                {!isProcessingComplete && (
                  <p className="text-xs text-gray-500">
                    Photos are still being processed. Filters will be more accurate once
                    complete.
                  </p>
                )}
              </div>
            )}

            {/* Quality Filter */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Photo Quality</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!includeBlurry}
                  onChange={(e) => setIncludeBlurry(!e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Exclude blurry photos</span>
                {blurryPhotoIds.size > 0 && (
                  <span className="text-xs text-gray-500">({blurryPhotoIds.size} blurry)</span>
                )}
              </label>
            </div>

            {/* People Filter */}
            {faceClusters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Filter by People</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllClusters}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllClusters}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {faceClusters.map((cluster, index) => (
                    <button
                      key={cluster.id}
                      onClick={() => toggleCluster(cluster.id)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        selectedClusters.has(cluster.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cluster.thumbnailUrl && (
                        <CldImage
                          src={cluster.thumbnailUrl}
                          width={80}
                          height={80}
                          crop="fill"
                          gravity="face"
                          alt={cluster.label || `Person ${index + 1}`}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div className="text-center">
                        <p className="text-xs font-medium">
                          {cluster.label || `Person ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cluster.photoIds.length} photo{cluster.photoIds.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {selectedClusters.has(cluster.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {faceClusters.length === 0 && isProcessingComplete && (
              <p className="text-sm text-gray-500 text-center py-4">
                No faces detected in this album yet.
              </p>
            )}

            {/* Download Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDownload}>
                Download
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
