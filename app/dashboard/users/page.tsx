import { UserList } from "@/components/user-list";
import { UserRegistrationForm } from "@/components/user-registration-form";

const UsersPage = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <UserRegistrationForm className="lg:col-span-4"/>
      <UserList className="lg:col-span-8"/>
    </section>
  );
};

export default UsersPage;
