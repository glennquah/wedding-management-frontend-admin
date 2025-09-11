"use client";
import { UpdateVendorDto, VendorResponseDto } from "@shared/api";
import { Button, DataTable, DeleteConfirmationModal, PageHeader } from "@shared/components";
import FormField from "@shared/components/FormField";
import { FormDialog } from "@shared/components/ui/form/form-dialog";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useVendorManager } from "../../hooks/useCRUDVendor";
import { VendorDetailsModal } from "./components/vendorDetailsModal";
// import { EmailGuestModal } from "./components/EmailGuestModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components";

export default function VendorListPage() {
  const isMobile = useIsMobileScreen();
  const {
    // Core data
    vendors,
    isLoading,
    error,
    setError,
    
    // Modal states
    isAddingVendor,
    editingVendor,
    deleteConfirmVendor,
    isSubmitting,
    emailModalVendor,
    
    // Validation
    validationErrors,
    clearValidationErrors,
    
    
    // Form data
    // newGuest,
    // setNewGuest,
    setEditingVendor,
    
    // Constants
    // confirmationStatusOptions,
    
    // CRUD operations
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    
    // Handlers
    // handleAddVendor,
    handleUpdateVendor,
    handleDeleteVendor,
    confirmDeleteVendor,
    handleEditVendor,
    
    
    // Modal controls
    // openAddGuestModal,
    // closeAddGuestModal,
    closeEditVendorModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    openEmailModal,
    closeEmailModal,
    handleSendEmail,
  } = useVendorManager();
  const [selectedVendor, setSelectedVendor] = useState<VendorResponseDto | null>(null);

  // Column definitions for DataTable
  const columns: ColumnDef<VendorResponseDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.getValue("name")}</div>
      ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="text-sm text-foreground">{row.getValue("email") || '-'}</div>
            ),
    },
    {
        accessorKey: "uenNumber", 
        header: "UEN Number",
        cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue("uenNumber") || '-'}</div>
        ),
    },
    {
        accessorKey: "vendorWebsite", 
        header: "Website",
        cell: ({ row }) => {
            const website = row.getValue("vendorWebsite") as string | null;
        
            return website ? (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const vendor = row.original;
          return (
            <Button
                className="flex items-center"
                onClick={() => setSelectedVendor(vendor)}
            >
              More Details
            </Button>
          );
        },
      }
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const guest = row.original;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Button
    //           size="sm"
    //           variant="ghost"
    //           onClick={() => handleEditVendor(guest)}
    //         >
    //           <Edit2 className="w-4 h-4" />
    //         </Button>
    //         <Button
    //           size="sm"
    //           variant="ghost"
    //           onClick={() => openDeleteConfirmModal(guest)}
    //           className="text-red-600 hover:text-red-700 hover:bg-red-50"
    //         >
    //           <Trash2 className="w-4 h-4" />
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  // Edit Vendor Form Fields
  const vendorFormFields = (
    vendor: Partial<UpdateVendorDto & { id?: number; }>,
    setVendor: React.Dispatch<React.SetStateAction<Partial<UpdateVendorDto & { id?: number; }>>>
  ) => [
    <div key="name" className="md:col-span-2">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={vendor.name || ""}
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
        value={vendor.email || ""}
        onChange={(e) => setVendor({ ...vendor, email: e.target.value })}
        required
        placeholder="Vendor email address"
      />
    </div>,
  ];


  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Vendor List"
          description="Manage vendors"
        //   buttonText="Add Guest"
        //   onButtonClick={openAddGuestModal}
        //   buttonIcon={<Plus className="w-4 h-4" />}
        //   isButtonDisabled={isLoading}
        />

        {/* Add Vendor Modal */}
        {/* <FormDialog
          open={isAddingGuest}
          onOpenChange={closeAddGuestModal}
          title="Add New Guest"
          isSubmitting={isSubmitting}
          onSubmit={handleAddGuest}
          onCancel={closeAddGuestModal}
          submitButtonText="Add Guest"
          formFields={guestFormFields(newGuest, setNewGuest)}
          noOfColumns={2}
        /> */}

        {/* Edit Vendor Modal */}
        {selectedVendor && (
        <VendorDetailsModal
            open={!!selectedVendor}
            onOpenChange={(open) => !open && setSelectedVendor(null)}
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
            formFields={vendorFormFields(editingVendor!, setEditingVendor as React.Dispatch<React.SetStateAction<Partial<UpdateVendorDto & { id?: number }>>>)}
            noOfColumns={2}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!deleteConfirmVendor}
          onOpenChange={closeDeleteConfirmModal}
          itemName={deleteConfirmVendor?.name || "this guest"}
          description={
            deleteConfirmVendor && (
              <>
                Are you sure you want to delete {deleteConfirmVendor.name}? 
                This action cannot be undone.
              </>
            )
          }
          onConfirm={confirmDeleteVendor}
          onCancel={closeDeleteConfirmModal}
        />

        {/* Email Guest Modal */}
        {/* {emailModalVendor && (
          <EmailGuestModal
            open={!!emailModalVendor}
            onOpenChange={closeEmailModal}
            guestName={emailModalVendor.name}
            guestEmail={emailModalVendor.email}
            onSendEmail={handleSendEmail}
          />
        )} */}

            <Tabs defaultValue="vendor">
                <TabsList>
                    <TabsTrigger value="live">Live vendors</TabsTrigger>
                    <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                </TabsList>
                <TabsContent value="live">
                    {/* Guest List Table */}
                    <DataTable
                    data={vendors.map(vendor => ({
                        ...vendor,
                        email: vendor.email || '' //revisit
                    }))}
                    columns={columns}
                    searchableColumns={[
                        { id: "name", placeholder: "Seacrch by name..." }
                    ]}
                    enableSelection={false}
                    enableColumnVisibility={true}
                    enablePagination={true}
                    defaultPageSize={10}
                    title={`Vendors (${vendors.length})`}
                    isLoading={isLoading}
                    loadingMessage="Loading vendors..."
                    emptyMessage="No vendors onboarded yet."
                    />
                </TabsContent>
                <TabsContent value="onboarding">
                    <p>onboarding placeholder</p>
                </TabsContent>
            </Tabs>
        </div>
      </div>
  );
}