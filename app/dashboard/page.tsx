import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { auth } from "@/lib/auth";
import { AuthenticatedUser } from "@/lib/types/user";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const user = session.user as AuthenticatedUser;

  if (user.role.name === "Admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard user={user} />;
};

export default Dashboard;
