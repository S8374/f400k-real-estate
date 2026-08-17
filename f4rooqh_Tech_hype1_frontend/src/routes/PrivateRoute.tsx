"use client";

import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/shared/Loading";
import { toast } from "sonner";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user?.data) {
        router.replace("/login");
      } else if (user?.data?.status === "BANNED") {
        toast.error("Your account has been banned.");
        logout({});
        router.replace("/login");
      }
    }
  }, [isLoading, isError, user, router, logout]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !user?.data || user?.data?.status === "BANNED") {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;