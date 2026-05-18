import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, LayoutGrid, Tags } from 'lucide-react';
import GameManagement from './GameManagement';
import CategoryManagement from './CategoryManagement';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('games');

  return (
    <div className="flex h-screen bg-game-deep text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-game-sidebar border-r border-white/[0.05]">
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-game-neon/20 border border-game-neon/40 flex items-center justify-center">
            <Zap size={16} className="text-game-neon" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Menu<span className="text-game-neon">Game</span>
          </span>
        </div>

        <div className="h-px bg-white/[0.05] mx-4" />

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-game-muted px-3 mb-3">
            Quản trị
          </p>
          <button onClick={() => setActiveTab('games')} className={`sidebar-link w-full text-left ${activeTab === 'games' ? 'active' : ''}`}>
            <Shield size={14} className={activeTab === 'games' ? 'opacity-80' : 'opacity-50'} />
            Quản lý Game
          </button>
          <button onClick={() => setActiveTab('categories')} className={`sidebar-link w-full text-left ${activeTab === 'categories' ? 'active' : ''}`}>
            <Tags size={14} className={activeTab === 'categories' ? 'opacity-80' : 'opacity-50'} />
            Quản lý Thể loại
          </button>
          <button onClick={() => navigate('/')} className="sidebar-link w-full text-left">
            <LayoutGrid size={14} className="opacity-50" />
            Về trang chính
          </button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'games' ? <GameManagement /> : <CategoryManagement />}
      </div>
    </div>
  );
}