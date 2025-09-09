"use client";

import { CreateGuestDto, UpdateGuestDto } from "@shared/api";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { DataTable } from "@shared/components/ui/table";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import GuestSummaryStats from "../../components/GuestSummaryStats";
import { useGuestForm } from "../../hooks/useGuestForm";
import { useGuests } from "../../hooks/useGuests";
import { getConfirmationIcon, getConfirmationLabel, getConfirmationStatusColor } from "../../lib/guest-status-utils";

type Guest = {
  id: number;
  name: string;
  allergies?: string;
  group?: string;
  confirmationStatus: CreateGuestDto.confirmationStatus;
  weddingId: number;
  primaryGuestId?: number;
  accompanyingGuestNames?: string[];
};

export default function GuestListPage() {
  const isMobile = useIsMobileScreen();
  const { guests, isLoading, error, setError, addGuest, updateGuest, deleteGuest } = useGuests();
  const { addAccompanyingGuestField, removeAccompanyingGuestField, updateAccompanyingGuestName } = useGuestForm();
  
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<CreateGuestDto & { accompanyingGuestNames: string[] }>>({
    name: "",
    allergies: "",
    group: "",
    confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
    weddingId: 1, // Default wedding ID - should be dynamic in real app
    primaryGuestId: undefined,
    accompanyingGuestNames: [""],
  });

  // Column definitions for DataTable
  const columns: ColumnDef<Guest>[] = [
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
              onClick={() => setDeleteConfirmGuest(guest)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Primary guests (not accompanying guests)
  const primaryGuests = guests.filter(guest => !guest.primaryGuestId);

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.group) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const primaryGuestData: CreateGuestDto = {
        name: newGuest.name,
        allergies: newGuest.allergies || undefined,
        group: newGuest.group,
        confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
        weddingId: newGuest.weddingId || 1,
        primaryGuestId: undefined,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (newGuest.accompanyingGuestNames) {
        const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          allergies: newGuest.allergies || undefined,
          group: newGuest.group,
          confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
          weddingId: newGuest.weddingId || 1,
          primaryGuestId: undefined,
        })));
      }

      await addGuest(primaryGuestData, accompanyingGuestsData);

      setNewGuest({
        name: "",
        allergies: "",
        group: "",
        confirmationStatus: CreateGuestDto.confirmationStatus.PENDING,
        weddingId: 1,
        primaryGuestId: undefined,
        accompanyingGuestNames: [""],
      });
      setIsAddingGuest(false);
    } catch (err) {
      setError('Failed to add guest. Please try again.');
      console.error('Error adding guest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest || !editingGuest.name || !editingGuest.group) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updateData: UpdateGuestDto = {
        name: editingGuest.name,
        allergies: editingGuest.allergies || undefined,
        group: editingGuest.group,
        confirmationStatus: editingGuest.confirmationStatus,
      };

      const accompanyingGuestsData: CreateGuestDto[] = [];
      if (editingGuest.accompanyingGuestNames) {
        const validAccompanyingNames = editingGuest.accompanyingGuestNames.filter(name => name.trim());
        accompanyingGuestsData.push(...validAccompanyingNames.map(name => ({
          name: name.trim(),
          allergies: editingGuest.allergies || undefined,
          group: editingGuest.group,
          confirmationStatus: editingGuest.confirmationStatus,
          weddingId: editingGuest.weddingId,
          primaryGuestId: undefined,
        })));
      }

      await updateGuest(editingGuest.id, updateData, accompanyingGuestsData);
      setEditingGuest(null);
    } catch (err) {
      setError('Failed to update guest. Please try again.');
      console.error('Error updating guest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    try {
      setError(null);
      await deleteGuest(id);
      setDeleteConfirmGuest(null);
    } catch (err) {
      setError('Failed to delete guest. Please try again.');
      console.error('Error deleting guest:', err);
    }
  };

  const confirmDeleteGuest = () => {
    if (deleteConfirmGuest) {
      handleDeleteGuest(deleteConfirmGuest.id);
    }
  };


  const handleEditGuest = (guest: Guest) => {
    // Get accompanying guests for this primary guest
    const accompanyingGuests = guests.filter(g => g.primaryGuestId === guest.id);
    const accompanyingNames = accompanyingGuests.length > 0 
      ? accompanyingGuests.map(g => g.name)
      : [""];
    
    setEditingGuest({
      ...guest,
      accompanyingGuestNames: accompanyingNames
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      <ResponsiveMenubar />
      {!isMobile && <div className="mt-[72px] w-full"></div>}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-brand-600 mb-2">Guest List</h1>
            <p className="text-muted-foreground">Manage your wedding guests and track RSVPs</p>
          </div>
          <Button 
            onClick={() => setIsAddingGuest(true)} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            Add Guest
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Add Guest Modal */}
        <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                <Input
                  value={newGuest.name || ""}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  placeholder="Guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Group *</label>
                <Input
                  value={newGuest.group || ""}
                  onChange={(e) => setNewGuest({...newGuest, group: e.target.value})}
                  placeholder="Family, Extended Family, College Friends, High School Friends, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">Allergies</label>
                <Input
                  value={newGuest.allergies || ""}
                  onChange={(e) => setNewGuest({...newGuest, allergies: e.target.value})}
                  placeholder="Any allergies or dietary restrictions for yourself or accompanying guests"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Confirmation Status</label>
                <select
                  value={newGuest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING}
                  onChange={(e) => setNewGuest({...newGuest, confirmationStatus: e.target.value as CreateGuestDto.confirmationStatus})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value={CreateGuestDto.confirmationStatus.PENDING}>Pending</option>
                  <option value={CreateGuestDto.confirmationStatus.CONFIRMED}>Confirmed</option>
                  <option value={CreateGuestDto.confirmationStatus.REJECTED}>Rejected</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addAccompanyingGuestField(newGuest, setNewGuest)}
                    className="text-brand-600 hover:text-brand-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Guest
                  </Button>
                </div>
                <div className="space-y-2">
                  {(newGuest.accompanyingGuestNames || [""]).map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={name}
                        onChange={(e) => updateAccompanyingGuestName(index, e.target.value, newGuest, setNewGuest)}
                        placeholder={`Accompanying guest ${index + 1}`}
                        className="flex-1"
                      />
                      {(newGuest.accompanyingGuestNames?.length || 0) > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAccompanyingGuestField(index, newGuest, setNewGuest)}
                          className="text-red-600 hover:text-red-700 px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsAddingGuest(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddGuest} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Guest
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Guest Modal */}
        <Dialog open={!!editingGuest} onOpenChange={(open) => !open && setEditingGuest(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
            </DialogHeader>
            {editingGuest && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                    <Input
                      value={editingGuest.name}
                      onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
                      placeholder="Guest name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Group *</label>
                    <Input
                      value={editingGuest.group || ""}
                      onChange={(e) => setEditingGuest({...editingGuest, group: e.target.value})}
                      placeholder="Family, Friends, Work, etc."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">Allergies</label>
                    <Input
                      value={editingGuest.allergies || ""}
                      onChange={(e) => setEditingGuest({...editingGuest, allergies: e.target.value})}
                      placeholder="Any allergies or dietary restrictions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Confirmation Status</label>
                    <select
                      value={editingGuest.confirmationStatus || CreateGuestDto.confirmationStatus.PENDING}
                      onChange={(e) => setEditingGuest({...editingGuest, confirmationStatus: e.target.value as CreateGuestDto.confirmationStatus})}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value={CreateGuestDto.confirmationStatus.PENDING}>Pending</option>
                      <option value={CreateGuestDto.confirmationStatus.CONFIRMED}>Confirmed</option>
                      <option value={CreateGuestDto.confirmationStatus.REJECTED}>Rejected</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addAccompanyingGuestField(editingGuest, setEditingGuest)}
                        className="text-brand-600 hover:text-brand-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Guest
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(editingGuest.accompanyingGuestNames || [""]).map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={name}
                            onChange={(e) => updateAccompanyingGuestName(index, e.target.value, editingGuest, setEditingGuest)}
                            placeholder={`Accompanying guest ${index + 1}`}
                            className="flex-1"
                          />
                          {(editingGuest.accompanyingGuestNames?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAccompanyingGuestField(index, editingGuest, setEditingGuest)}
                              className="text-red-600 hover:text-red-700 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setEditingGuest(null)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateGuest} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Update Guest
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary Stats */}
        <GuestSummaryStats guests={guests} />

        {/* Guest List Table */}
        <Card className="bg-transparent border-brand-200">
          <CardHeader>
            <CardTitle className="text-foreground">
              Guests ({guests.length})
              {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin inline" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading guests...</p>
              </div>
            ) : guests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No guests added yet. Click &quot;Add Guest&quot; to get started!</p>
              </div>
            ) : (
              <DataTable
                data={primaryGuests}
                columns={columns}
                searchableColumns={[
                  { id: "name", placeholder: "Search by name..." }
                ]}
                enableSelection={false}
                enableColumnVisibility={true}
                enablePagination={true}
                defaultPageSize={10}
              />
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deleteConfirmGuest} onOpenChange={(open) => !open && setDeleteConfirmGuest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {deleteConfirmGuest?.name}? 
                {(() => {
                  const accompanyingCount = guests.filter(g => g.primaryGuestId === deleteConfirmGuest?.id).length;
                  return accompanyingCount > 0 
                    ? `This will also delete ${accompanyingCount} accompanying guest${accompanyingCount === 1 ? '' : 's'}.`
                    : '';
                })()} This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeleteConfirmGuest(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteGuest}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}