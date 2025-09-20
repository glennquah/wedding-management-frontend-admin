import { Button } from "@shared/components";
import { Calendar, Clock, DollarSign, Edit2, FileText, Trash2 } from "lucide-react";
import Image from "next/image";

interface Listing {
  id: number;
  listingName: string;
  price: number;
  availabilities: string[];
  remarks: string;
  vendorId: number;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
}

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (id: number) => void;
}

export const ListingCard = ({ listing, onEdit, onDelete }: ListingCardProps) => {
  const getImageSource = () => {
    if (listing.imageUrls && listing.imageUrls.length > 0 && listing.imageUrls[0]) {
      return listing.imageUrls[0];
    }
    return "/images/logo-single.png";
  };

  const formatAvailabilities = (availabilities: string[]) => {
    if (!availabilities || availabilities.length === 0) return "No dates specified";
    const formattedDates = availabilities.slice(0, 2).map(date => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    return formattedDates.join(", ") + (availabilities.length > 2 ? ` +${availabilities.length - 2} more` : "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <Image
          src={getImageSource()}
          alt={listing.listingName}
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {listing.listingName}
          </h3>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(listing)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(listing.id)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-xl font-bold text-green-600">${listing.price}</span>
        </div>

          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Available Dates</p>
              <p className="text-sm text-gray-600">{formatAvailabilities(listing.availabilities)}</p>
            </div>
          </div>

          {listing.remarks && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Remarks</p>
                <p className="text-sm text-gray-600 line-clamp-2">{listing.remarks}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Updated {formatDate(listing.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};