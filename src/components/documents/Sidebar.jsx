import React from "react";
import {
  FileText,
  FolderOpen,
  Image,
  Music2,
  Video,
  Star,
  ChevronRight,
  Trash2,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-60 bg-[#f5f5f5] border-r border-gray-300 h-full flex flex-col">
      <div className="p-4 text-sm font-semibold">All Files</div>

      {/* MAIN MENU */}
      <nav className="flex flex-col text-sm">
        <button className="sidebar-item">
          <FolderOpen className="icon" /> All Files
        </button>

        <button className="sidebar-item">
          <FileText className="icon" /> Documents
        </button>

        <button className="sidebar-item">
          <Image className="icon" /> Pictures
        </button>

        <button className="sidebar-item">
          <Music2 className="icon" /> Music
        </button>

        <button className="sidebar-item">
          <Video className="icon" /> Videos
        </button>

        <button className="sidebar-item">
          <Star className="icon" /> Favorites
        </button>
      </nav>

      {/* FOLDERS SECTION */}
      <div className="mt-6 px-4 text-[13px] font-semibold text-gray-700 flex items-center justify-between">
        <span>FOLDERS</span>
        <span className="text-lg font-bold cursor-pointer">+</span>
      </div>

      <div className="mt-2">
        <button className="sidebar-item">
          <FolderOpen className="icon" /> Document Library
        </button>
      </div>

      {/* TRASH */}
      <div className="mt-auto mb-4">
        <button className="sidebar-item text-red-500">
          <Trash2 className="icon" /> Trash
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
