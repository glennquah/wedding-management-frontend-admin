"use client";

import { useState, useEffect } from "react";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@shared/components/ui/dialog";
import { Plus, Edit2, Trash2, UserCheck, UserX, Clock, Loader2 } from "lucide-react";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import useIsMobileScreen from "@shared/hooks/useIsMobileScreen";
import { GuestApiService, ExtendedGuestResponseDto, ExtendedCreateGuestDto, ExtendedUpdateGuestDto } from "@shared/services/guest-api";

// Use the API types directly
type Guest = ExtendedGuestResponseDto & {
  accompanyingGuestNames?: string[]; // For form handling
};

export default function GuestListPage() {
  const isMobile = useIsMobileScreen();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmGuest, setDeleteConfirmGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<ExtendedCreateGuestDto & { accompanyingGuestNames: string[] }>>({
    name: "",
    allergies: "",
    group: "",
    confirmationStatus: 'pending',
    weddingId: 1, // Default wedding ID - should be dynamic in real app
    primaryGuestId: undefined,
    accompanyingGuestNames: [""],
  });

  // Fetch guests on component mount
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedGuests = await GuestApiService.getGuestsByWedding(1); // Default wedding ID
      setGuests(fetchedGuests);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.group) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Create primary guest
      const primaryGuestData: ExtendedCreateGuestDto = {
        name: newGuest.name,
        allergies: newGuest.allergies || undefined,
        group: newGuest.group,
        confirmationStatus: newGuest.confirmationStatus || 'pending',
        weddingId: newGuest.weddingId || 1,
        primaryGuestId: undefined,
      };

      const createdPrimaryGuest = await GuestApiService.createGuest(primaryGuestData);

      // Create accompanying guests if any
      const accompanyingGuestsData: ExtendedCreateGuestDto[] = [];
      if (newGuest.accompanyingGuestNames) {
        const validAccompanyingNames = newGuest.accompanyingGuestNames.filter(name => name.trim());
        
        for (const name of validAccompanyingNames) {
          accompanyingGuestsData.push({
            name: name.trim(),
            allergies: newGuest.allergies || undefined,
            group: newGuest.group,
            confirmationStatus: newGuest.confirmationStatus || 'pending',
            weddingId: newGuest.weddingId || 1,
            primaryGuestId: createdPrimaryGuest.id,
          });
        }
      }

      let createdAccompanyingGuests: ExtendedGuestResponseDto[] = [];
      if (accompanyingGuestsData.length > 0) {
        createdAccompanyingGuests = await GuestApiService.createMultipleGuests(accompanyingGuestsData);
      }

      // Refresh the guest list
      await fetchGuests();

      // Reset form
      setNewGuest({
        name: "",
        allergies: "",
        group: "",
        confirmationStatus: 'pending',
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

      // Update the primary guest
      const updateData: ExtendedUpdateGuestDto = {
        name: editingGuest.name,
        allergies: editingGuest.allergies || undefined,
        group: editingGuest.group,
        confirmationStatus: editingGuest.confirmationStatus,
      };

      await GuestApiService.updateGuest(editingGuest.id, updateData);

      // Handle accompanying guests - for simplicity, we'll delete old ones and create new ones
      // In a more sophisticated app, you might want to update them individually
      
      // First, delete existing accompanying guests
      const existingAccompanyingGuests = guests.filter(g => g.primaryGuestId === editingGuest.id);
      for (const guest of existingAccompanyingGuests) {
        await GuestApiService.deleteGuest(guest.id);
      }

      // Create new accompanying guests if any
      if (editingGuest.accompanyingGuestNames) {
        const validAccompanyingNames = editingGuest.accompanyingGuestNames.filter(name => name.trim());
        
        const accompanyingGuestsData: ExtendedCreateGuestDto[] = validAccompanyingNames.map(name => ({
          name: name.trim(),
          allergies: editingGuest.allergies || undefined,
          group: editingGuest.group,
          confirmationStatus: editingGuest.confirmationStatus,
          weddingId: editingGuest.weddingId,
          primaryGuestId: editingGuest.id,
        }));

        if (accompanyingGuestsData.length > 0) {
          await GuestApiService.createMultipleGuests(accompanyingGuestsData);
        }
      }

      // Refresh the guest list
      await fetchGuests();
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
      await GuestApiService.deleteGuest(id);
      // Also delete any accompanying guests
      const accompanyingGuests = guests.filter(g => g.primaryGuestId === id);
      for (const guest of accompanyingGuests) {
        await GuestApiService.deleteGuest(guest.id);
      }
      await fetchGuests();
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

  const getConfirmationStatusColor = (status: 'pending' | 'confirmed' | 'rejected') => {
    switch (status) {
      case 'confirmed':
        return "text-green-600 bg-green-100";
      case 'rejected':
        return "text-red-600 bg-red-100";
      case 'pending':
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getConfirmationIcon = (status: 'pending' | 'confirmed' | 'rejected') => {
    switch (status) {
      case 'confirmed':
        return <UserCheck className="w-4 h-4" />;
      case 'rejected':
        return <UserX className="w-4 h-4" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getConfirmationLabel = (status: 'pending' | 'confirmed' | 'rejected') => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const addAccompanyingGuestField = () => {
    const currentNames = newGuest.accompanyingGuestNames || [];
    setNewGuest({
      ...newGuest,
      accompanyingGuestNames: [...currentNames, ""]
    });
  };

  const removeAccompanyingGuestField = (index: number) => {
    const currentNames = newGuest.accompanyingGuestNames || [];
    if (currentNames.length > 1) {
      const newNames = currentNames.filter((_, i) => i !== index);
      setNewGuest({
        ...newGuest,
        accompanyingGuestNames: newNames
      });
    }
  };

  const updateAccompanyingGuestName = (index: number, value: string) => {
    const currentNames = newGuest.accompanyingGuestNames || [];
    const newNames = [...currentNames];
    newNames[index] = value;
    setNewGuest({
      ...newGuest,
      accompanyingGuestNames: newNames
    });
  };

  // Edit form helpers
  const addEditAccompanyingGuestField = () => {
    if (!editingGuest) return;
    const currentNames = editingGuest.accompanyingGuestNames || [];
    setEditingGuest({
      ...editingGuest,
      accompanyingGuestNames: [...currentNames, ""]
    });
  };

  const removeEditAccompanyingGuestField = (index: number) => {
    if (!editingGuest) return;
    const currentNames = editingGuest.accompanyingGuestNames || [];
    if (currentNames.length > 1) {
      const newNames = currentNames.filter((_, i) => i !== index);
      setEditingGuest({
        ...editingGuest,
        accompanyingGuestNames: newNames
      });
    }
  };

  const updateEditAccompanyingGuestName = (index: number, value: string) => {
    if (!editingGuest) return;
    const currentNames = editingGuest.accompanyingGuestNames || [];
    const newNames = [...currentNames];
    newNames[index] = value;
    setEditingGuest({
      ...editingGuest,
      accompanyingGuestNames: newNames
    });
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
    <div className="w-full min-h-screen bg-gradient-to-b from-brand-100 to-white text-foreground">
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
                  value={newGuest.confirmationStatus || 'pending'}
                  onChange={(e) => setNewGuest({...newGuest, confirmationStatus: e.target.value as 'pending' | 'confirmed' | 'rejected'})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addAccompanyingGuestField}
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
                        onChange={(e) => updateAccompanyingGuestName(index, e.target.value)}
                        placeholder={`Accompanying guest ${index + 1}`}
                        className="flex-1"
                      />
                      {(newGuest.accompanyingGuestNames?.length || 0) > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAccompanyingGuestField(index)}
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
                      value={editingGuest.confirmationStatus || 'pending'}
                      onChange={(e) => setEditingGuest({...editingGuest, confirmationStatus: e.target.value as 'pending' | 'confirmed' | 'rejected'})}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-foreground">Accompanying Guests</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addEditAccompanyingGuestField}
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
                            onChange={(e) => updateEditAccompanyingGuestName(index, e.target.value)}
                            placeholder={`Accompanying guest ${index + 1}`}
                            className="flex-1"
                          />
                          {(editingGuest.accompanyingGuestNames?.length || 0) > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEditAccompanyingGuestField(index)}
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
        {guests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-transparent border-brand-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-brand-600">
                  {guests.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Guests</div>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-brand-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {guests.filter(g => g.confirmationStatus === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-brand-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {guests.filter(g => g.confirmationStatus === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Confirmation</div>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-brand-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {guests.filter(g => g.confirmationStatus === 'rejected').length}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>
        )}

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
                <p>No guests added yet. Click "Add Guest" to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-200">
                      <th className="text-left py-2 font-medium text-foreground">Name</th>
                      <th className="text-left py-2 font-medium text-foreground">Group</th>
                      <th className="text-left py-2 font-medium text-foreground">Confirmed</th>
                      <th className="text-left py-2 font-medium text-foreground">Accompanying Guests</th>
                      <th className="text-left py-2 font-medium text-foreground">Dietary Requirements</th>
                      <th className="text-left py-2 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests
                      .filter(guest => !guest.primaryGuestId) // Only show primary guests
                      .map((guest) => {
                        const accompanyingGuests = guests.filter(g => g.primaryGuestId === guest.id);
                        return (
                          <tr key={guest.id} className="border-b border-brand-100 hover:bg-brand-50/50">
                            <td className="py-3">
                              <div>
                                <div className="font-medium text-foreground">{guest.name}</div>
                              </div>
                            </td>
                            <td className="py-3 text-sm text-foreground">{guest.group || '-'}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfirmationStatusColor(guest.confirmationStatus)}`}>
                                {getConfirmationIcon(guest.confirmationStatus)}
                                {getConfirmationLabel(guest.confirmationStatus)}
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              <div>
                                <span className="text-foreground">
                                  {accompanyingGuests.length === 0 
                                    ? '0 guests' 
                                    : `+${accompanyingGuests.length} guest${accompanyingGuests.length === 1 ? '' : 's'}`
                                  }
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-sm text-foreground">
                              {guest.allergies || '-'}
                            </td>
                            <td className="py-3">
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
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
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