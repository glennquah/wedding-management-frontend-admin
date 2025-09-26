import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { VendorOnboardingStatus, VendorResponseDto } from '@shared/api';
import { ColumnDef } from '@tanstack/react-table';

// Helper functions for confirmation status
const getVendorOnboardingStatusVariant = (
  status: VendorOnboardingStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case VendorOnboardingStatus.ONBOARDED:
      return 'default';
    case VendorOnboardingStatus.REJECTED:
      return 'destructive';
    default:
      return 'outline';
  }
};

const getOnboardingStatusLabel = (status: VendorOnboardingStatus) => {
  switch (status) {
    case VendorOnboardingStatus.ONBOARDED:
      return 'Onboarded';
    case VendorOnboardingStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Pending';
  }
};

const getOnboardingStatusIcon = (status: VendorOnboardingStatus) => {
  switch (status) {
    case VendorOnboardingStatus.ONBOARDED:
      return '✓';
    case VendorOnboardingStatus.REJECTED:
      return '✗';
    default:
      return '?';
  }
};

interface VendorColumnsProps {
  onSelectVendor: (vendor: VendorResponseDto) => void;
  includeOnboardingStatus?: boolean;
}

export const getVendorColumns = ({
  onSelectVendor,
  includeOnboardingStatus = false,
}: VendorColumnsProps): ColumnDef<VendorResponseDto>[] => {
  const columns: ColumnDef<VendorResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        const truncatedEmail = email && email.length > 12 ? email.substring(0, 12) + '...' : email;
        return (
          <div className="text-sm text-foreground" title={email}>
            {truncatedEmail || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'uenNumber',
      header: 'UEN Number',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('uenNumber') || '-'}</div>
      ),
    },
    {
      accessorKey: 'vendorWebsite',
      header: 'Website',
      cell: ({ row }) => {
        const website = row.getValue('vendorWebsite') as string | null;

        return website ? (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {website}
          </a>
        ) : (
          <span className="text-sm text-foreground">-</span>
        );
      },
    },
  ];

  // Add onboarding status column if requested
  if (includeOnboardingStatus) {
    columns.push({
      accessorKey: 'onboardingStatus',
      header: 'Onboarding Status',
      cell: ({ row }) => {
        const status = row.getValue('onboardingStatus') as VendorOnboardingStatus;
        return (
          <Badge variant={getVendorOnboardingStatusVariant(status)} className="gap-1">
            {getOnboardingStatusLabel(status)}
            <span className="ml-1">{getOnboardingStatusIcon(status)}</span>
          </Badge>
        );
      },
    });
  }

  // Add actions column
  columns.push({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <Button
          className="flex items-center whitespace-nowrap text-xs px-1 py-1 min-w-0"
          size="sm"
          onClick={() => onSelectVendor(vendor)}
        >
          View
        </Button>
      );
    },
  });

  return columns;
};
