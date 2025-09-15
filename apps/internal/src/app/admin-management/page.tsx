'use client';

import { useEffect, useState } from 'react';

import { AdminTable, Button, PageHeader, getAdminFormFields } from '@shared/components';
import { FormDialog } from '@shared/components/ui/form/form-dialog';
import {
  AdminResponseDto,
  AdminsService,
  CreateAdminDto,
  UpdateAdminDto,
  UserRole,
  WeddingResponseDto,
  WeddingsService,
} from '@wedding/api-types';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function AdminManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Core data
  const [admins, setAdmins] = useState<AdminResponseDto[]>([]);
  const [weddings, setWeddings] = useState<WeddingResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState<AdminResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [newAdmin, setNewAdmin] = useState<Partial<CreateAdminDto>>({});
  const [editAdmin, setEditAdmin] = useState<Partial<UpdateAdminDto & { id?: number }>>({});

  // Fetch admins and weddings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [adminsData, weddingsData] = await Promise.all([
          AdminsService.adminControllerGetAllAdmins(),
          WeddingsService.weddingControllerFindAll(),
        ]);
        setAdmins(adminsData);
        setWeddings(weddingsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user, router]);

  // Generate random password
  const generateRandomPassword = () => {
    const length = 24;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Modal controls
  const openAddAdminModal = () => {
    setNewAdmin({
      role: UserRole.ADMIN,
      password: '',
      isCouple: false,
      weddingId: 0,
    });
    setIsAddingAdmin(true);
  };

  const closeAddAdminModal = () => {
    setIsAddingAdmin(false);
    setNewAdmin({});
  };

  const openEditAdminModal = (admin: AdminResponseDto) => {
    setEditAdmin({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: UserRole.ADMIN,
    });
    setIsEditingAdmin(true);
  };

  const closeEditAdminModal = () => {
    setIsEditingAdmin(false);
    setEditAdmin({});
  };

  const openDeleteConfirmModal = (admin: AdminResponseDto) => {
    setDeleteConfirmAdmin(admin);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmAdmin(null);
  };

  // Handlers
  const handleAddAdmin = async () => {
    setIsSubmitting(true);
    try {
      // Basic required fields
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password || !newAdmin.weddingId) {
        toast.error('Please fill in all required fields');
        return;
      }

      const adminData: CreateAdminDto = {
        name: newAdmin.name!,
        email: newAdmin.email!,
        password: newAdmin.password!,
        role: UserRole.ADMIN,
        isCouple: newAdmin.isCouple || false,
        weddingId: newAdmin.weddingId!,
      };

      await AdminsService.adminControllerCreate(adminData);
      toast.success('Admin added successfully!');
      closeAddAdminModal();
      // Refresh admins list
      const adminsData = await AdminsService.adminControllerGetAllAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Failed to add admin:', error);
      toast.error('Failed to add admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!editAdmin.id) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateAdminDto = {
        name: editAdmin.name,
        email: editAdmin.email,
        password: editAdmin.password,
        role: editAdmin.role || UserRole.ADMIN,
      };

      await AdminsService.adminControllerUpdate(editAdmin.id, updateData);
      toast.success('Admin updated successfully!');
      closeEditAdminModal();
      // Refresh admins list
      const adminsData = await AdminsService.adminControllerGetAllAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Failed to update admin:', error);
      toast.error('Failed to update admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteAdmin = async () => {
    if (!deleteConfirmAdmin?.id) return;

    setIsSubmitting(true);
    try {
      await AdminsService.adminControllerDelete(deleteConfirmAdmin.id);
      toast.success('Admin deleted successfully!');
      closeDeleteConfirmModal();
      // Refresh admins list
      const adminsData = await AdminsService.adminControllerGetAllAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Failed to delete admin:', error);
      toast.error('Failed to delete admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePassword = (isEdit = false) => {
    const newPassword = generateRandomPassword();
    if (isEdit) {
      setEditAdmin({ ...editAdmin, password: newPassword });
    } else {
      setNewAdmin({ ...newAdmin, password: newPassword });
    }
    toast.success('Password generated successfully!');
  };

  // Helper functions for form fields
  const handleCreatePasswordGenerate = () => handleGeneratePassword(false);
  const handleEditPasswordGenerate = () => handleGeneratePassword(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Admin Management"
          description="Manage admins and their wedding preferences "
        />
        <Button onClick={openAddAdminModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Add Admin Modal */}
      <FormDialog
        open={isAddingAdmin}
        onOpenChange={closeAddAdminModal}
        title="Add Admin"
        isSubmitting={isSubmitting}
        onSubmit={handleAddAdmin}
        onCancel={closeAddAdminModal}
        submitButtonText="Add Admin"
        formFields={getAdminFormFields({
          admin: newAdmin,
          setAdmin: setNewAdmin,
          handleGeneratePassword: handleCreatePasswordGenerate,
          weddings,
        })}
        noOfColumns={2}
      />

      {/* Admin Table with Edit/Delete Modals */}
      <div className="w-full">
        <AdminTable
          admins={admins}
          weddings={weddings}
          isLoading={isLoading}
          isEditingAdmin={isEditingAdmin}
          editAdmin={editAdmin}
          setEditAdmin={setEditAdmin}
          isSubmitting={isSubmitting}
          deleteConfirmAdmin={deleteConfirmAdmin}
          onEditAdmin={openEditAdminModal}
          onDeleteAdmin={openDeleteConfirmModal}
          handleEditAdmin={handleEditAdmin}
          handleEditPasswordGenerate={handleEditPasswordGenerate}
          closeEditAdminModal={closeEditAdminModal}
          confirmDeleteAdmin={confirmDeleteAdmin}
          closeDeleteConfirmModal={closeDeleteConfirmModal}
        />
      </div>
    </div>
  );
}
