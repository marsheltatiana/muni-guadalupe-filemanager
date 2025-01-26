import { Maintainers, Search, Transactions } from "@/app/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { hasAccess } from "@/lib/policy";
import { AuthenticatedUser } from "@/lib/types/user";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOut } from "./sign-out";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = session?.user as AuthenticatedUser;

  const filterMaintainers = Maintainers.filter((maintainer) =>
    hasAccess(user, maintainer.viewPolicy)
  );

  const filterSearch = Search.filter((search) =>
    hasAccess(user, search.viewPolicy)
  );

  const filterTransactions = Transactions.filter((transaction) =>
    hasAccess(user, transaction.viewPolicy)
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link className="text-xl font-bold text-primary" href="/dashboard">
          Archivo General
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mantenedores</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterMaintainers.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Busqueda</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterSearch.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Prestamos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterTransactions.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          {/*           <SidebarGroupLabel>Reportes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportesItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="hover:bg-gray-100 hover:scale-105 transition-transform duration-150 ease-in-out transform-gpu"
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent> */}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {user.image ? (
                    <Image
                      src={user.image}
                      width={24}
                      height={24}
                      alt="avatar"
                      className="rounded-full hover:scale-90 transition-transform duration-150 ease-in-out transform-gpu"
                    />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full hover:scale-90 transition-transform duration-150 ease-in-out transform-gpu">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <section className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Archivo General
        </section>
      </SidebarFooter>
    </Sidebar>
  );
}
