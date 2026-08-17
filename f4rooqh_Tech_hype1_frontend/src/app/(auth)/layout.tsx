import { ReactNode } from "react";
import PublicRoute from "@/routes/PublicRoute";
import { AuthLayout as CustomAuthLayout } from "@/components/auth/AuthLayout";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PublicRoute>
      <CustomAuthLayout>
        {children}
      </CustomAuthLayout>
    </PublicRoute>
  );
};

export default AuthLayout;