'use client';

import { useCallback, useEffect, useState } from 'react';

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

interface ImageProps {
  id: number;
  height: string;
  width: string;
  image_url: string;
  format: string;
}

interface DownloadCuratedAlbumProps {
  albumId: number;
  allPhotos: ImageProps[];
  disabled?: boolean;
}

export default function DownloadCuratedAlbum({
  albumId,
  allPhotos,
  disabled = false,
}: DownloadCuratedAlbumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusDto | null>(null);
  const [faceClusters, setFaceClusters] = useState<FaceClusterDto[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<Set<number>>(new Set());
  const [expandedClusters, setExpandedClusters] = useState<Set<number>>(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState<Map<number, Set<number>>>(new Map());
  const [includeBlurry, setIncludeBlurry] = useState(true);
  const [blurryPhotoIds, setBlurryPhotoIds] = useState<Set<number>>(new Set());
  const [includeOthers, setIncludeOthers] = useState(true);
  const [othersCount, setOthersCount] = useState(0);
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [selectedOthersPhotos, setSelectedOthersPhotos] = useState<Set<number>>(new Set());
  const [othersPhotoIds, setOthersPhotoIds] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
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

      // Try to load saved selections from localStorage
      const storageKey = `album-${albumId}-selections`;
      const savedSelections = localStorage.getItem(storageKey);

      if (savedSelections) {
        try {
          const parsed = JSON.parse(savedSelections);

          // Restore selected clusters
          setSelectedClusters(new Set(parsed.selectedClusters));

          // Restore selected photos
          const restoredPhotos = new Map<number, Set<number>>();
          Object.entries(parsed.selectedPhotos).forEach(([clusterId, photoIds]) => {
            restoredPhotos.set(Number(clusterId), new Set(photoIds as number[]));
          });
          setSelectedPhotos(restoredPhotos);

          // Restore includeBlurry and includeOthers
          if (parsed.includeBlurry !== undefined) {
            setIncludeBlurry(parsed.includeBlurry);
          }
          if (parsed.includeOthers !== undefined) {
            setIncludeOthers(parsed.includeOthers);
          }

          // Restore selected others photos
          if (parsed.selectedOthersPhotos) {
            setSelectedOthersPhotos(new Set(parsed.selectedOthersPhotos));
          }
        } catch (e) {
          console.error('Failed to parse saved selections:', e);
          // Fall back to default selections
          initializeDefaultSelections(clusters);
        }
      } else {
        // Initialize with default selections (all selected)
        initializeDefaultSelections(clusters);
      }

      // Calculate number of photos not in any cluster
      const photosInClusters = new Set(clusters.flatMap((c) => c.photoIds));
      const othersPhotoIndices = allPhotos
        .map((_, idx) => idx)
        .filter((idx) => !photosInClusters.has(idx));
      setOthersPhotoIds(othersPhotoIndices);
      setOthersCount(othersPhotoIndices.length);
    } catch (error) {
      console.error('Failed to fetch album data:', error);
      toast.error('Failed to load album data');
    } finally {
      setIsLoading(false);
    }
  }, [albumId, allPhotos]);

  const initializeDefaultSelections = (clusters: FaceClusterDto[]) => {
    // Select all clusters by default
    setSelectedClusters(new Set(clusters.map((c) => c.id)));

    // Initialize selectedPhotos with all photos for each cluster
    const initialSelectedPhotos = new Map<number, Set<number>>();
    clusters.forEach((cluster) => {
      initialSelectedPhotos.set(cluster.id, new Set(cluster.photoIds));
    });
    setSelectedPhotos(initialSelectedPhotos);

    // Select all "Others" photos by default
    const photosInClusters = new Set(clusters.flatMap((c) => c.photoIds));
    const othersPhotoIndices = allPhotos
      .map((_, idx) => idx)
      .filter((idx) => !photosInClusters.has(idx));
    setSelectedOthersPhotos(new Set(othersPhotoIndices));
  };

  // Fetch data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  // Save selections to localStorage whenever they change
  useEffect(() => {
    if (faceClusters.length === 0) return; // Don't save until data is loaded

    const storageKey = `album-${albumId}-selections`;

    // Convert Map and Set to plain objects/arrays for JSON serialization
    const selectedPhotosObj: Record<number, number[]> = {};
    selectedPhotos.forEach((photoSet, clusterId) => {
      selectedPhotosObj[clusterId] = Array.from(photoSet);
    });

    const selectionsToSave = {
      selectedClusters: Array.from(selectedClusters),
      selectedPhotos: selectedPhotosObj,
      includeBlurry,
      includeOthers,
      selectedOthersPhotos: Array.from(selectedOthersPhotos),
    };

    localStorage.setItem(storageKey, JSON.stringify(selectionsToSave));
  }, [albumId, selectedClusters, selectedPhotos, includeBlurry, includeOthers, selectedOthersPhotos, faceClusters.length]);

  const toggleCluster = (clusterId: number) => {
    const cluster = faceClusters.find((c) => c.id === clusterId);
    if (!cluster) return;

    const newSelected = new Set(selectedClusters);
    const newSelectedPhotos = new Map(selectedPhotos);

    if (newSelected.has(clusterId)) {
      // Deselect cluster and all its photos
      newSelected.delete(clusterId);
      newSelectedPhotos.set(clusterId, new Set());
    } else {
      // Select cluster and all its photos
      newSelected.add(clusterId);
      newSelectedPhotos.set(clusterId, new Set(cluster.photoIds));
    }

    setSelectedClusters(newSelected);
    setSelectedPhotos(newSelectedPhotos);
  };

  const toggleClusterExpansion = (clusterId: number) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(clusterId)) {
      newExpanded.delete(clusterId);
    } else {
      newExpanded.add(clusterId);
    }
    setExpandedClusters(newExpanded);
  };

  const togglePhoto = (clusterId: number, photoId: number) => {
    const newSelectedPhotos = new Map(selectedPhotos);
    const clusterPhotos = newSelectedPhotos.get(clusterId) || new Set();

    if (clusterPhotos.has(photoId)) {
      clusterPhotos.delete(photoId);
    } else {
      clusterPhotos.add(photoId);
    }

    newSelectedPhotos.set(clusterId, new Set(clusterPhotos));
    setSelectedPhotos(newSelectedPhotos);

    // Uncheck person if no photos are selected
    if (clusterPhotos.size === 0) {
      const newSelectedClusters = new Set(selectedClusters);
      newSelectedClusters.delete(clusterId);
      setSelectedClusters(newSelectedClusters);
    } else {
      // Check person if at least one photo is selected
      const newSelectedClusters = new Set(selectedClusters);
      newSelectedClusters.add(clusterId);
      setSelectedClusters(newSelectedClusters);
    }
  };

  const selectAllPhotosInCluster = (clusterId: number) => {
    const cluster = faceClusters.find((c) => c.id === clusterId);
    if (!cluster) return;

    const newSelectedPhotos = new Map(selectedPhotos);
    newSelectedPhotos.set(clusterId, new Set(cluster.photoIds));
    setSelectedPhotos(newSelectedPhotos);

    // Check the person too
    const newSelectedClusters = new Set(selectedClusters);
    newSelectedClusters.add(clusterId);
    setSelectedClusters(newSelectedClusters);
  };

  const deselectAllPhotosInCluster = (clusterId: number) => {
    const newSelectedPhotos = new Map(selectedPhotos);
    newSelectedPhotos.set(clusterId, new Set());
    setSelectedPhotos(newSelectedPhotos);

    // Uncheck the person too
    const newSelectedClusters = new Set(selectedClusters);
    newSelectedClusters.delete(clusterId);
    setSelectedClusters(newSelectedClusters);
  };

  const selectAllClusters = () => {
    setSelectedClusters(new Set(faceClusters.map((c) => c.id)));
    const newSelectedPhotos = new Map<number, Set<number>>();
    faceClusters.forEach((cluster) => {
      newSelectedPhotos.set(cluster.id, new Set(cluster.photoIds));
    });
    setSelectedPhotos(newSelectedPhotos);

    // Also select all "Others" photos
    setSelectedOthersPhotos(new Set(othersPhotoIds));
    setIncludeOthers(true);
  };

  const deselectAllClusters = () => {
    setSelectedClusters(new Set());
    setSelectedPhotos(new Map());
    setSelectedOthersPhotos(new Set());
    setIncludeOthers(false);
  };

  const toggleOthersPhoto = (photoId: number) => {
    const newSelectedOthers = new Set(selectedOthersPhotos);

    if (newSelectedOthers.has(photoId)) {
      newSelectedOthers.delete(photoId);
    } else {
      newSelectedOthers.add(photoId);
    }

    setSelectedOthersPhotos(newSelectedOthers);

    // Uncheck "Include Others" if no photos are selected
    if (newSelectedOthers.size === 0) {
      setIncludeOthers(false);
    } else {
      // Check "Include Others" if at least one photo is selected
      setIncludeOthers(true);
    }
  };

  const selectAllOthersPhotos = () => {
    setSelectedOthersPhotos(new Set(othersPhotoIds));
    setIncludeOthers(true);
  };

  const deselectAllOthersPhotos = () => {
    setSelectedOthersPhotos(new Set());
    setIncludeOthers(false);
  };

  const toggleIncludeOthers = () => {
    if (includeOthers) {
      // Deselect all others photos
      setSelectedOthersPhotos(new Set());
      setIncludeOthers(false);
    } else {
      // Select all others photos
      setSelectedOthersPhotos(new Set(othersPhotoIds));
      setIncludeOthers(true);
    }
  };

  const handleDownload = async () => {
    try {
      // Calculate total selected photos
      let totalSelectedPhotos = 0;
      selectedPhotos.forEach((photoSet) => {
        totalSelectedPhotos += photoSet.size;
      });

      // Check if anything is selected to download
      if (totalSelectedPhotos === 0 && !includeOthers) {
        toast.error('Please select at least one photo or include "Other Photos"');
        return;
      }

      // Determine which people to include - only selected clusters with their selected photos
      const selectedPersons = faceClusters
        .filter((cluster) => selectedClusters.has(cluster.id))
        .map((cluster) => ({
          ...cluster,
          photoIds: Array.from(selectedPhotos.get(cluster.id) || new Set()) as number[],
        }));

      // Filter photo IDs based on blur settings
      let filteredPersons = selectedPersons;
      if (!includeBlurry && blurryPhotoIds.size > 0) {
        // Remove blurry photos from each person's photoIds
        filteredPersons = selectedPersons
          .map((person) => ({
            ...person,
            photoIds: person.photoIds.filter((id) => !blurryPhotoIds.has(id)),
          }))
          .filter((person) => person.photoIds.length > 0); // Remove persons with no non-blurry photos
      }

      if (filteredPersons.length === 0 && !includeOthers) {
        toast.error('No photos to download');
        return;
      }

      // Calculate total photos that will actually be downloaded
      let totalPhotos = 0;

      // Count photos from selected persons (after blur filtering)
      filteredPersons.forEach((person) => {
        totalPhotos += person.photoIds.length;
      });

      // Add others count if includeOthers is true
      let filteredOthersPhotos: number[] = [];
      if (includeOthers && selectedOthersPhotos.size > 0) {
        // Use only selected others photos
        filteredOthersPhotos = Array.from(selectedOthersPhotos);

        // Filter out blurry photos if needed
        if (!includeBlurry && blurryPhotoIds.size > 0) {
          filteredOthersPhotos = filteredOthersPhotos.filter((id) => !blurryPhotoIds.has(id));
        }

        totalPhotos += filteredOthersPhotos.length;
      }

      toast.success(`Organizing and downloading ${totalPhotos} photos...`);

      // Use organized download function
      const { downloadImagesOrganizedByPerson } = await import('../utils/downloadPhoto');

      // Get ALL photo IDs from ALL clusters (not just selected ones) for "Others" calculation
      const allPhotoIdsInAnyClusters = new Set(faceClusters.flatMap((c) => c.photoIds));
      const clusterIdToIndex = new Map(faceClusters.map((c, idx) => [c.id, idx]));

      await downloadImagesOrganizedByPerson(
        allPhotos,
        filteredPersons.map((cluster) => ({
          clusterId: cluster.id,
          label: cluster.label || `Person ${(clusterIdToIndex.get(cluster.id) ?? -1) + 1}`,
          photoIds: cluster.photoIds,
        })),
        includeBlurry ? undefined : blurryPhotoIds,
        includeOthers,
        allPhotoIdsInAnyClusters,
        filteredOthersPhotos,
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
        <Button disabled={disabled}>Download Curated Album</Button>
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
                    {processingStatus.completed} / {allPhotos.length} photos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${allPhotos.length > 0 ? (processingStatus.completed / allPhotos.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                {!isProcessingComplete && (
                  <p className="text-xs text-gray-500">
                    Photos are still being processed. Filters will be more accurate once complete.
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

                <div className="space-y-3">
                  {faceClusters.map((cluster, index) => {
                    const isExpanded = expandedClusters.has(cluster.id);
                    const selectedPhotoIds = selectedPhotos.get(cluster.id) || new Set();
                    const selectedCount = selectedPhotoIds.size;

                    return (
                      <div
                        key={cluster.id}
                        className={`border-2 rounded-lg transition-all ${
                          selectedClusters.has(cluster.id)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {/* Person Header */}
                        <div className="flex items-center gap-3 p-3">
                          <button
                            onClick={() => toggleCluster(cluster.id)}
                            className="flex-shrink-0"
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selectedClusters.has(cluster.id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedClusters.has(cluster.id) && (
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
                              )}
                            </div>
                          </button>

                          {cluster.thumbnailUrl && (
                            <CldImage
                              src={cluster.thumbnailUrl}
                              width={48}
                              height={48}
                              crop="fill"
                              gravity="face"
                              alt={cluster.label || `Person ${index + 1}`}
                              className="rounded-full object-cover flex-shrink-0"
                            />
                          )}

                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">
                              {cluster.label || `Person ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedCount} of {cluster.photoIds.length} photo
                              {cluster.photoIds.length !== 1 ? 's' : ''} selected
                            </p>
                          </div>

                          <button
                            onClick={() => toggleClusterExpansion(cluster.id)}
                            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                        </div>

                        {/* Expandable Photo Grid */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 p-3 space-y-2">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => selectAllPhotosInCluster(cluster.id)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Select All
                              </button>
                              <button
                                onClick={() => deselectAllPhotosInCluster(cluster.id)}
                                className="text-xs text-gray-600 hover:underline"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {cluster.photoIds.map((photoId) => {
                                const photo = allPhotos[photoId];
                                if (!photo) return null;
                                const isSelected = selectedPhotoIds.has(photoId);

                                return (
                                  <button
                                    key={photoId}
                                    onClick={() => togglePhoto(cluster.id, photoId)}
                                    className={`relative aspect-square rounded border-2 overflow-hidden transition-all ${
                                      isSelected
                                        ? 'border-blue-600 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <CldImage
                                      src={photo.image_url}
                                      width={300}
                                      height={300}
                                      crop="fill"
                                      alt={`Photo ${photoId}`}
                                      className="object-cover w-full h-full"
                                    />
                                    {isSelected && (
                                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
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
                                    {blurryPhotoIds.has(photoId) && (
                                      <div className="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                        Blurry
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Others folder option */}
                {othersCount > 0 && (
                  <div className="mt-4">
                    <div
                      className={`border-2 rounded-lg transition-all ${
                        includeOthers ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {/* Others Header */}
                      <div className="flex items-center gap-3 p-3">
                        <button onClick={toggleIncludeOthers} className="flex-shrink-0">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              includeOthers ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}
                          >
                            {includeOthers && (
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
                            )}
                          </div>
                        </button>

                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">Other Photos</p>
                          <p className="text-xs text-gray-500">
                            {selectedOthersPhotos.size} of {othersCount} photo
                            {othersCount !== 1 ? 's' : ''} selected
                          </p>
                        </div>

                        <button
                          onClick={() => setOthersExpanded(!othersExpanded)}
                          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${othersExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                      </div>

                      {/* Expandable Photo Grid for Others */}
                      {othersExpanded && (
                        <div className="border-t border-gray-200 p-3 space-y-2">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={selectAllOthersPhotos}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Select All
                            </button>
                            <button
                              onClick={deselectAllOthersPhotos}
                              className="text-xs text-gray-600 hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {othersPhotoIds.map((photoId) => {
                              const photo = allPhotos[photoId];
                              if (!photo) return null;
                              const isSelected = selectedOthersPhotos.has(photoId);

                              return (
                                <button
                                  key={photoId}
                                  onClick={() => toggleOthersPhoto(photoId)}
                                  className={`relative aspect-square rounded border-2 overflow-hidden transition-all ${
                                    isSelected
                                      ? 'border-blue-600 ring-2 ring-blue-200'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <CldImage
                                    src={photo.image_url}
                                    width={300}
                                    height={300}
                                    crop="fill"
                                    alt={`Other Photo ${photoId}`}
                                    className="object-cover w-full h-full"
                                  />
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
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
                                  {blurryPhotoIds.has(photoId) && (
                                    <div className="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                      Blurry
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {faceClusters.length === 0 && isProcessingComplete && (
              <p className="text-sm text-gray-500 text-center py-4">
                No faces detected in this album yet.
              </p>
            )}

            {/* Download Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDownload}
                disabled={
                  (() => {
                    // Calculate total selected photos
                    let totalSelected = 0;
                    selectedPhotos.forEach((photoSet) => {
                      totalSelected += photoSet.size;
                    });
                    totalSelected += selectedOthersPhotos.size;
                    return totalSelected === 0;
                  })()
                }
              >
                Download
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
