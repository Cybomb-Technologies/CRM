import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Users,
  Building2,
  UserCircle,
  TrendingUp,
  Sun,
  Moon,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "@/components/layout/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateLeadDialog from "@/components/leads/CreateLeadDialog";
import CreateAccountDialog from "@/components/accounts/CreateAccountDialog";
import CreateContactDialog from "@/components/contacts/CreateContactDialog";
import CreateDealDialog from "@/components/deals/CreateDealDialog";
import { CreateActivityDialog } from "@/components/activities/shared/CreateActivityDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";
import NotificationCenter from "./NotificationCenter";

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { addDataItem } = useData();
  const { toast } = useToast();

  const [dialogs, setDialogs] = useState({
    lead: false,
    account: false,
    contact: false,
    deal: false,
    activity: false,
  });

  const openDialog = (type) =>
    setDialogs((prev) => ({ ...prev, [type]: true }));
  const closeDialog = (type) =>
    setDialogs((prev) => ({ ...prev, [type]: false }));

  const onCreated = (type, item) => {
    const pluralType = type.endsWith("s") ? type : `${type}s`;
    if (type === "deal") {
      addDataItem("deals", item);
    } else {
      addDataItem(pluralType, item);
    }
    closeDialog(type);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      toast({
        title: "Global Search",
        description:
          "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
    }
  };

  return (
    <>
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-accent"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search everything..."
                className="pl-10 bg-secondary border-secondary"
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => openDialog("lead")}>
                  <Users className="w-4 h-4 mr-2" /> New Lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("account")}>
                  <Building2 className="w-4 h-4 mr-2" /> New Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("contact")}>
                  <UserCircle className="w-4 h-4 mr-2" /> New Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("deal")}>
                  <TrendingUp className="w-4 h-4 mr-2" /> New Deal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("activity")}>
                  <CheckSquare className="w-4 h-4 mr-2" /> New Activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            <NotificationCenter />

            <UserMenu />
          </div>
        </div>
      </header>

      <CreateLeadDialog
        open={dialogs.lead}
        onOpenChange={() => closeDialog("lead")}
        onLeadCreated={(item) => onCreated("lead", item)}
      />
      <CreateAccountDialog
        open={dialogs.account}
        onOpenChange={() => closeDialog("account")}
        onAccountCreated={(item) => onCreated("account", item)}
      />
      <CreateContactDialog
        open={dialogs.contact}
        onOpenChange={() => closeDialog("contact")}
        onContactCreated={(item) => onCreated("contact", item)}
      />
      <CreateDealDialog
        open={dialogs.deal}
        onOpenChange={() => closeDialog("deal")}
        onDealCreated={(item) => onCreated("deal", item)}
      />
      <CreateActivityDialog
        open={dialogs.activity}
        onOpenChange={() => closeDialog("activity")}
        onActivityCreated={(item) => onCreated("activity", "activities", item)}
      />
    </>
  );
};

export default Header;
