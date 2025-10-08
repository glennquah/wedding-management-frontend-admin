import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Mail, Star, Globe } from 'lucide-react';
import { VendorCardProps } from '../../types';

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vendor Information</CardTitle>
        <CardDescription>
          Contact details and business information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {vendor.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{vendor.email}</span>
          </div>
        )}

        {vendor.rating && (
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Rating: {vendor.rating.toFixed(1)}/5</span>
          </div>
        )}

        {vendor.vendorWebsite && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={vendor.vendorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}