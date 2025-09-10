"use client";

import { CreateGuestDto } from "@shared/api";
import { Button, DataTable, DeleteConfirmationModal, FormDialog, PageHeader } from "@shared/components";
import FormField from "@shared/components/FormField";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Input } from "@shared/components/ui/form/input";
import { SingleSelectDropdown } from "@shared/components/ui/form/singleSelectDropdown";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useGuestManager } from "../../hooks/useCRUDGuests";
import { getConfirmationIcon, getConfirmationLabel, getConfirmationStatusColor } from "../../lib/guest-status-utils";
import GuestSummaryStats from "./components/GuestSummaryStats";

export default function GuestListPage() {
  const isMobile = useIsMobileScreen();
  const {
    // Core data
    guests,
    primaryGuests,
    isLoading,
    
    // Modal states
    isAddingGuest,
    editingGuest,
    deleteConfirmGuest,
    isSubmitting,
    
    // Form data
    newGuest,
    setNewGuest,
    setEditingGuest,
    
    // Constants
    confirmationStatusOptions,
    
    // Form field management
    addAccompanyingGuestField,
    removeAccompanyingGuestField,
    updateAccompanyingGuestName,
    
    // Handlers
    handleAddGuest,
    handleUpdateGuest,
    confirmDeleteGuest,
    handleEditGuest,
    
    // Modal controls
    openAddGuestModal,
    closeAddGuestModal,
    closeEditGuestModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
  } = useGuestManager();

  // Column definitions for DataTable
  const columns: ColumnDef<CreateGuestDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "group", 
      header: "Group",
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue("group") || '-'}</div>
      ),
    },
    {
      accessorKey: "confirmationStatus",
      header: "Confirmed",
      cell: ({ row }) => {
        const status = row.getValue("confirmationStatus") as CreateGuestDto.confirmationStatus;
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfirmationStatusColor(status)}`}>
            {getConfirmationIcon(status)}
            {getConfirmationLabel(status)}
          </span>
        );
      },
    },
    {
      id: "accompanyingGuests",
      header: "Accompanying Guests", 
      cell: ({ row }) => {
        const guest = row.original;
        const accompanyingGuests = guests.filter(g => g.primaryGuestId === guest.id);
        return (
          <div className="text-sm text-foreground">
            {accompanyingGuests.length === 0 
              ? '0 guests' 
              : `+${accompanyingGuests.length} guest${accompanyingGuests.length === 1 ? '' : 's'}`
            }
          </div>
        );
      },
    },
    {
      accessorKey: "allergies",
      header: "Dietary Requirements",
      cell: ({ row }) => (
        <div className="text-sm text-foreground">{row.getValue("allergies") || '-'}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const guest = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditGuest(guest)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openDeleteConfirmModal(guest)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Add/Edit Guest Form Fields
  const guestFormFields = (
    guest: any,
    setGuest: React.Dispatch<React.SetStateAction<any>>
  ) => [
    <div key="name" className="md:col-span-1">
      <FormField
        label="Name *"
        id="name"
        type="text"
        value={guest.name || ""}
        onChange={(e) => setGuest({ ...guest, name: e.target.value })}
        required
        placeholder="Guest Name"
      />
    </div>,

    <div key="group" className="md:col-span-1">
      <FormField
        label="Group"
        id="group"
        type="text"
        value={guest.group || ""}
        onChange={(e) => setGuest({ ...guest, group: e.target.value })}
        placeholder="Family, Friends, etc."
      />
    </div>,

    <div key="allergies" className="md:col-span-2">
      <FormField
        label="Dietary Requirements"
        id="allergies"
        type="text"
        value={guest.allergies || ""}
        onChange={(e) => setGuest({ ...guest, allergies: e.target.value })}
        placeholder="Vegetarian, Gluten-Free, etc."
      />
    </div>,

    <div key="confirmationStatus" className="md:col-span-2">
      <SingleSelectDropdown
        label="Confirmation Status"
        options={Object.values(CreateGuestDto.confirmationStatus)}
        selected={
          guest.confirmationStatus ||
          CreateGuestDto.confirmationStatus.PENDING
        }
        setSelected={(selected) =>
          setGuest({
            ...guest,
            confirmationStatus: selected as CreateGuestDto["confirmationStatus"],
          })
        }
        placeholder="Select confirmation status"
      />
    </div>,

    <div key="accompanyingGuests" className="md:col-span-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-foreground">
          Accompanying Guests
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addAccompanyingGuestField(guest, setGuest)}
          className="text-brand-600 hover:text-brand-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Guest
        </Button>
      </div>
      <div className="space-y-2">
        {(guest.accompanyingGuestNames || [""]).map((name: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateAccompanyingGuestName(index, e.target.value, guest, setGuest)
              }
              placeholder={`Accompanying guest ${index + 1}`}
              className="flex-1"
            />
            {(guest.accompanyingGuestNames?.length || 0) > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  removeAccompanyingGuestField(index, guest, setGuest)
                }
                className="text-red-600 hover:text-red-700 px-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>,
  ];


  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Guest List"
          description="Manage your wedding guests and track RSVPs"
          buttonText="Add Guest"
          onButtonClick={openAddGuestModal}
          buttonIcon={<Plus className="w-4 h-4" />}
          isButtonDisabled={isLoading}
        />

        {/* Add Guest Modal */}
        <FormDialog
          open={isAddingGuest}
          onOpenChange={closeAddGuestModal}
          title="Add New Guest"
          isSubmitting={isSubmitting}
          onSubmit={handleAddGuest}
          onCancel={closeAddGuestModal}
          submitButtonText="Add Guest"
          formFields={guestFormFields(newGuest, setNewGuest)}
        />

        {/* Edit Guest Modal */}
        {editingGuest && (
          <FormDialog
            open={!!editingGuest}
            onOpenChange={closeEditGuestModal}
            title="Edit Guest"
            isSubmitting={isSubmitting}
            onSubmit={handleUpdateGuest}
            onCancel={closeEditGuestModal}
            submitButtonText="Update Guest"
            formFields={guestFormFields(editingGuest, setEditingGuest)}
          />
        )}

        {/* Summary Stats */}
        <GuestSummaryStats guests={guests} />

        {/* Guest List Table */}
        <DataTable
          data={primaryGuests as CreateGuestDto[]}
          columns={columns}
          searchableColumns={[
            { id: "name", placeholder: "Search by name..." }
          ]}
          enableSelection={false}
          enableColumnVisibility={true}
          enablePagination={true}
          defaultPageSize={10}
          title={`Guests (${guests.length})`}
          isLoading={isLoading}
          loadingMessage="Loading guests..."
          emptyMessage="No guests added yet."
          emptyDescription='Click "Add Guest" to get started!'
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!deleteConfirmGuest}
          onOpenChange={closeDeleteConfirmModal}
          itemName={deleteConfirmGuest?.name || "this guest"}
          description={
            deleteConfirmGuest && (
              <>
                Are you sure you want to delete {deleteConfirmGuest.name}? 
                {(() => {
                  const accompanyingCount = guests.filter(g => g.primaryGuestId === deleteConfirmGuest?.id).length;
                  return accompanyingCount > 0 
                    ? ` This will also delete ${accompanyingCount} accompanying guest${accompanyingCount === 1 ? '' : 's'}.`
                    : '';
                })()} This action cannot be undone.
              </>
            )
          }
          onConfirm={confirmDeleteGuest}
          onCancel={closeDeleteConfirmModal}
        />
      </div>
    </div>
  );
}