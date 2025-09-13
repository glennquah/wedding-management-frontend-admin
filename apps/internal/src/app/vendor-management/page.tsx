'use client';

import { useVendorManager } from '../../hooks/useCRUDVendor';
import { VendorDetailsModal } from './components/VendorDetailsModal';
import {
  UpdateVendorDto,
  VendorOnboardingStatus,
  VendorResponseDto,
  WeddingService,
  WeddingStyle,
  WeddingType,
} from '@shared/api';
import {
  Button,
  DataTable,
  DeleteConfirmationModal,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shared/components';
import { EmailModal } from '@shared/components/EmailModal';
import FormField from '@shared/components/FormField';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import { MultiSelectDropdown } from '@shared/components/ui/form/multiSelectDropdown';
import { SingleSelectDropdown } from '@shared/components/ui/form/singleSelectDropdown';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { ColumnDef } from '@tanstack/react-table';

export default function VendorListPage() {
  const isMobile = useIsMobileScreen();
  const {
    // Core data
    vendors,
    selectedVendor,
    isLoading,

    // Modal states
    editingVendor,
    deleteConfirmVendor,
    isSubmitting,
    emailModalVendor,

    // Form data
    setSelectedVendor,
    setEditingVendor,

    // Handlers
    handleUpdateVendor,
    confirmDeleteVendor,
    handleEditVendor,
    handleRejectOnboarding,
    handleApproveOnboarding,

    // Modal controls
    closeEditVendorModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    closeEmailModal,
    handleSendEmail,
  } = useVendorManager();

  // Column definitions for Live Vendor DataTable
  const columns: ColumnDef<VendorResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('email') || '-'}</div>
      ),
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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <Button className="flex items-center" onClick={() => setSelectedVendor(vendor)}>
            More Details
          </Button>
        );
      },
    },
  ];

  // Column definitions for Live Vendor DataTable
  const onboardingColumns: ColumnDef<VendorResponseDto>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('email') || '-'}</div>
      ),
    },
    {
      accessorKey: 'uenNumber',
      header: 'UEN Number',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('uenNumber') || '-'}</div>
      ),
    },
    {
      accessorKey: 'onboardingStatus',
      header: 'Onboarding Status',
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue('onboardingStatus') || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <Button className="flex items-center" onClick={() => setSelectedVendor(vendor)}>
            More Details
          </Button>
        );
      },
    },
  ];

  // Edit Vendor Form Fields
  const vendorFormFields = (
    vendor: Partial<UpdateVendorDto & { id?: number }>,
    setVendor: React.Dispatch<React.SetStateAction<Partial<UpdateVendorDto & { id?: number }>>>,
  ) => [
    <div key="name" className="md:col-span-2">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={vendor.name || ''}
        onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
        required
        placeholder="Vendor Name"
      />
    </div>,

    <div key="email" className="md:col-span-2">
      <FormField
        label="Email *"
        id="email"
        type="email"
        value={vendor.email || ''}
        onChange={(e) => setVendor({ ...vendor, email: e.target.value })}
        required
        placeholder="Vendor email address"
      />
    </div>,

    <div key="uenNumber" className="md:col-span-2">
      <FormField
        label="UEN Number *"
        id="uenNumber"
        type="text"
        value={vendor.uenNumber || ''}
        onChange={(e) => setVendor({ ...vendor, uenNumber: e.target.value })}
        required
        placeholder="Vendor UEN Number"
      />
    </div>,

    <div key="vendorWebsite" className="md:col-span-2">
      <FormField
        label="Website *"
        id="vendorWebsite"
        type="text"
        value={vendor.vendorWebsite || ''}
        onChange={(e) => setVendor({ ...vendor, vendorWebsite: e.target.value })}
        required
        placeholder="Vendor Website"
      />
    </div>,

    <div key="serviceOffered" className="md:col-span-2">
      <SingleSelectDropdown
        label="Service Offered"
        options={Object.values(WeddingService)}
        selected={vendor.serviceOffered}
        setSelected={(selected) =>
          setVendor({
            ...vendor,
            serviceOffered: selected as WeddingService,
          })
        }
        placeholder="Select Wedding Service"
      />
    </div>,

    <div key="styleOffered" className="md:col-span-2">
      <SingleSelectDropdown
        label="Style Offered"
        options={Object.values(WeddingStyle)}
        selected={vendor.styleOffered}
        setSelected={(selected) =>
          setVendor({
            ...vendor,
            styleOffered: selected as WeddingStyle,
          })
        }
        placeholder="Select Wedding Style"
      />
    </div>,

    <div key="weddingTypes" className="md:col-span-2">
      <MultiSelectDropdown
        label="Wedding Type"
        options={Object.values(WeddingType)}
        selected={vendor.weddingTypes ?? []}
        setSelected={(selected) =>
          setVendor({
            ...vendor,
            weddingTypes: selected as WeddingType[],
          })
        }
        placeholder="Select Wedding Types"
      />
    </div>,

    vendor.serviceOffered === WeddingService.VENUE ? (
      <div key="capacity" className="md:col-span-2">
        <FormField
          label="Capacity *"
          id="capacity"
          type="number"
          value={vendor.capacity.toString()}
          onChange={(e) => setVendor({ ...vendor, capacity: Number(e.target.value) })}
          required
          placeholder="Capacity"
        />
      </div>
    ) : null,
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-[72px] w-full"></div>}

      <div className="container mx-auto px-4">
        <PageHeader title="Vendor List" description="Manage vendors" />

        {/* View Selected Vendor Modal */}
        {selectedVendor && (
          <VendorDetailsModal
            open={!!selectedVendor}
            onOpenChange={(open) => !open && setSelectedVendor(null)}
            onEditVendor={handleEditVendor}
            onDeleteVendor={openDeleteConfirmModal}
            onRejectOnboarding={handleRejectOnboarding}
            onApproveOnboarding={handleApproveOnboarding}
            vendor={selectedVendor}
          />
        )}

        {/* Edit Vendor Modal */}
        {editingVendor && (
          <FormDialog
            open={!!editingVendor}
            onOpenChange={closeEditVendorModal}
            title="Edit Vendor"
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateVendor}
            onCancel={closeEditVendorModal}
            submitButtonText="Update Vendor"
            formFields={vendorFormFields(
              editingVendor!,
              setEditingVendor as React.Dispatch<
                React.SetStateAction<Partial<UpdateVendorDto & { id?: number }>>
              >,
            )}
            noOfColumns={2}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!deleteConfirmVendor}
          onOpenChange={closeDeleteConfirmModal}
          itemName={deleteConfirmVendor?.name || 'this guest'}
          description={
            deleteConfirmVendor && (
              <>
                Are you sure you want to delete {deleteConfirmVendor.name}? This action cannot be
                undone.
              </>
            )
          }
          onConfirm={confirmDeleteVendor}
          onCancel={closeDeleteConfirmModal}
        />

        {/* Email Guest Vendor */}
        {emailModalVendor && (
          <EmailModal
            open={!!emailModalVendor}
            onOpenChange={closeEmailModal}
            name={emailModalVendor.name}
            email={emailModalVendor.email}
            onSendEmail={handleSendEmail}
          />
        )}

        <Tabs defaultValue="live">
          <TabsList className="bg-muted/50 rounded-lg p-1 flex space-x-2">
            <TabsTrigger
              value="live"
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
            >
              Live vendors
            </TabsTrigger>
            <TabsTrigger
              value="onboarding"
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/20 hover:text-foreground transition-colors"
            >
              Onboarding
            </TabsTrigger>
          </TabsList>

          {/* Live Vendors */}
          <TabsContent value="live">
            <DataTable
              data={vendors
                .filter((vendor) => vendor.onboardingStatus == VendorOnboardingStatus.ONBOARDED)
                .map((vendor) => ({
                  ...vendor,
                }))}
              columns={columns}
              searchableColumns={[{ id: 'name', placeholder: 'Seacrch by name...' }]}
              enableSelection={false}
              enableColumnVisibility={true}
              enablePagination={true}
              defaultPageSize={10}
              title={`Vendors (${vendors.filter((vendor) => vendor.onboardingStatus == VendorOnboardingStatus.ONBOARDED).length})`}
              isLoading={isLoading}
              loadingMessage="Loading vendors..."
              emptyMessage="No vendors onboarded yet."
            />
          </TabsContent>

          {/* Vendor Applicaitons */}
          <TabsContent value="onboarding">
            <DataTable
              data={vendors
                .filter(
                  (vendor) =>
                    vendor.onboardingStatus == VendorOnboardingStatus.PENDING ||
                    vendor.onboardingStatus == VendorOnboardingStatus.REJECTED,
                )
                .map((vendor) => ({
                  ...vendor,
                }))}
              columns={onboardingColumns}
              searchableColumns={[{ id: 'name', placeholder: 'Seacrch by name...' }]}
              enableSelection={false}
              enableColumnVisibility={true}
              enablePagination={true}
              defaultPageSize={10}
              title={`Vendor Application (${vendors.filter((vendor) => vendor.onboardingStatus == VendorOnboardingStatus.PENDING || vendor.onboardingStatus == VendorOnboardingStatus.REJECTED).length})`}
              isLoading={isLoading}
              loadingMessage="Loading application..."
              emptyMessage="No vendors applications."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
