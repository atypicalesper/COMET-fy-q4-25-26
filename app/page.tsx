"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/components/rag/AuthContext";
import Sidebar from "@/components/rag/Sidebar";
import ChatArea from "@/components/rag/ChatArea";
import LoginModal from "@/components/rag/LoginModal";

function RagApp() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <LoginModal />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        className="fixed top-3 left-3 z-[100] md:hidden bg-[#12121a] border border-[#2a2a3a] text-[#e8e8f0] w-10 h-10 rounded-lg text-xl flex items-center justify-center cursor-pointer"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatArea userId={user.id} />
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <RagApp />
    </AuthProvider>
  );
}
