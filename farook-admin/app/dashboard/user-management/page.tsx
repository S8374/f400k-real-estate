'use client';

import { useUserManagement } from './hooks/useUserManagement';
import { UserManagementHeader } from './components/UserManagementHeader';
import { UserManagementStats } from './components/UserManagementStats';
import { UserManagementTable } from './components/UserManagementTable';
import { UserDetailsModal } from './components/modals/UserDetailsModal';

export default function UserManagementPage() {
  const {
    page,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
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
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <UserManagementHeader />

      <UserManagementStats stats={stats} />

      <UserManagementTable
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isLoading={isLoading}
        users={users}
        meta={meta}
        processingActionId={processingActionId}
        handleStatusChange={handleStatusChange}
        handleBlockToggle={handleBlockToggle}
        handleDelete={handleDelete}
        viewDetails={viewDetails}
      />

      <UserDetailsModal
        detailOpen={detailOpen}
        setDetailOpen={setDetailOpen}
        detailLoading={detailLoading}
        userDetail={userDetail}
        handleDelete={handleDelete}
      />
    </div>
  );
}
