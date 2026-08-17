import { useState } from 'react';
import { toast } from 'sonner';
import { 
  useGetUsersListQuery, 
  useUpdateAdminUserStatusMutation, 
  useDeleteUserByAdminMutation,
  useGetAdminUserDetailsQuery
} from '@/redux/api/adminApi';
import { useGetMeQuery } from '@/redux/api/authApi';

export function useUserManagement() {
  const { data: meData } = useGetMeQuery({});
  const adminId = meData?.data?.id || meData?.data?.data?.id;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processingActionId, setProcessingActionId] = useState<string | null>(null);

  const { data: usersResponse, isLoading } = useGetUsersListQuery(
    {
      adminId: adminId || "",
      page,
      limit: 10,
      search,
      role: roleFilter === "all" ? undefined : roleFilter.toUpperCase(),
      status: statusFilter === "all" ? undefined : statusFilter.toUpperCase()
    },
    { skip: !adminId }
  );

  const { data: userDetailResponse, isLoading: detailLoading } = useGetAdminUserDetailsQuery(
    selectedUserId || "",
    { skip: !selectedUserId || !detailOpen }
  );
  
  const userDetail = userDetailResponse?.data?.data || userDetailResponse?.data || userDetailResponse;

  const [updateStatus] = useUpdateAdminUserStatusMutation();
  const [deleteUser] = useDeleteUserByAdminMutation();

  const usersData = usersResponse?.data || usersResponse;
  const users = usersData?.data || [];
  const statsData = usersData?.stats || { totalUsers: 0, activeUsers: 0, bannedUsers: 0, pendingUsers: 0 };
  const meta = usersData?.meta || { totalPages: 1, total: 0 };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    setProcessingActionId(userId + "-status");
    try {
      await updateStatus({ userId, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus.toLowerCase()}`);
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error(error?.data?.message || "Failed to update user status");
    } finally {
      setProcessingActionId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setProcessingActionId(userId + "-delete");
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        if (detailOpen && selectedUserId === userId) {
          setDetailOpen(false);
        }
      } catch (error: any) {
        console.error("Failed to delete user", error);
        toast.error(error?.data?.message || "Failed to delete user");
      } finally {
        setProcessingActionId(null);
      }
    }
  };

  const handleBlockToggle = async (userId: string, currentStatus: string) => {
    const isBanned = currentStatus === 'BANNED';
    if (confirm(`Are you sure you want to ${isBanned ? 'unblock' : 'block'} this user?`)) {
      setProcessingActionId(userId + "-block");
      try {
        await updateStatus({ userId, status: isBanned ? 'ACTIVE' : 'BANNED' }).unwrap();
        toast.success(`User successfully ${isBanned ? 'unblocked' : 'blocked'}`);
      } catch (error: any) {
        console.error("Failed to toggle block status", error);
        toast.error(error?.data?.message || "Failed to toggle block status");
      } finally {
        setProcessingActionId(null);
      }
    }
  };

  const viewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setDetailOpen(true);
  };

  const stats = {
    totalUsers: statsData.totalUsers,
    activeUsers: statsData.activeUsers,
    bannedUsers: statsData.bannedUsers,
    pendingUsers: statsData.pendingUsers
  };

  return {
    page,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    selectedUserId,
    detailOpen,
    setDetailOpen,
    processingActionId,
    isLoading,
    detailLoading,
    userDetail,
    users,
    meta,
    stats,
    handleStatusChange,
    handleDelete,
    handleBlockToggle,
    viewDetails
  };
}
