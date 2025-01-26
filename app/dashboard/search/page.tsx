import { DocumentSearch } from "@/components/DocumentSearch";
import { auth } from "@/lib/auth";
import { hasAccess, Permission } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";

const SuperSearchPage = async () => {
  const session = await auth();

  const user = session?.user as AuthenticatedUser;

  if (!hasAccess(user, Permission.SEARCH_DOCUMENTS)) return;

  return (
    <div>
      <DocumentSearch />
    </div>
  );
};

export default SuperSearchPage;
