"use client";

import { CreateGuestDto } from "@shared/api";
import { Button, DataTable, DeleteConfirmationModal, FormDialog, PageHeader } from "@shared/components";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
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
          guest={{
            name: newGuest.name || "",
            group: newGuest.group || "",
            allergies: newGuest.allergies || "",
            confirmationStatus: newGuest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING,
            accompanyingGuestNames: newGuest.accompanyingGuestNames || [""]
          }}
          onGuestChange={(updates) => setNewGuest({...newGuest, ...updates})}
          onAddAccompanyingGuest={() => addAccompanyingGuestField(newGuest, setNewGuest)}
          onRemoveAccompanyingGuest={(index) => removeAccompanyingGuestField(index, newGuest, setNewGuest)}
          onUpdateAccompanyingGuestName={(index, name) => updateAccompanyingGuestName(index, name, newGuest, setNewGuest)}
          confirmationStatusOptions={confirmationStatusOptions}
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
            guest={{
              name: editingGuest.name,
              group: editingGuest.group || "",
              allergies: editingGuest.allergies || "",
              confirmationStatus: editingGuest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING,
              accompanyingGuestNames: editingGuest.accompanyingGuestNames || [""]
            }}
            onGuestChange={(updates) => setEditingGuest({...editingGuest, ...updates})}
            onAddAccompanyingGuest={() => addAccompanyingGuestField(editingGuest, (guest) => setEditingGuest(guest as typeof editingGuest))}
            onRemoveAccompanyingGuest={(index) => removeAccompanyingGuestField(index, editingGuest, (guest) => setEditingGuest(guest as typeof editingGuest))}
            onUpdateAccompanyingGuestName={(index, name) => updateAccompanyingGuestName(index, name, editingGuest, (guest) => setEditingGuest(guest as typeof editingGuest))}
            confirmationStatusOptions={confirmationStatusOptions}
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