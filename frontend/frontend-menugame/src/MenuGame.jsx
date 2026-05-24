import React, { useState, useEffect } from 'react';
import './MenuGame.css';
import { getGames, getCategories } from './api';
import {
  Play,
  Search,
  Gamepad2,
  Heart,
  HardDrive,
  Store,
  Zap,
  Loader2,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────────────── */

function toUiGame(game) {
  const categories = game.categories ?? [];
  return {
    ...game,
    title: game.name || game.title || 'Không có tên',
    image: game.iconUrl || game.image || '',
    
    // Thể loại chính hiển thị nhãn (phần tử đầu tiên)
    category: categories[0]?.name || 'Unknown', 
    
    // ĐA SỬA ĐỔI: Lưu trữ mảng toàn bộ tên thể loại (bao gồm cả chính và phụ) để chạy logic lọc
    allCategoryNames: categories.map((c) => c.name), 
    categoryIds: categories.map((c) => c.id),
    gameType: game.type || game.gameType || 'ONLINE',
  };
}

/* ── static fallback featured content (shown only when DB has < 3 games) ─── */
const FALLBACK_FEATURED = {
  title: 'Black Myth: Wukong',
  description:
    'Khám phá thế giới huyền thoại Tây Du Ký trong tựa game hành động AAA đẳng cấp thế giới. Hóa thân thành Tề Thiên Đại Thánh, chiến đấu với thần linh và quái vật.',
  image:
    'https://images.pexels.com/photos/28122495/pexels-photo-28122495.jpeg?auto=compress&cs=tinysrgb&w=1400',
  category: 'Action',
};

/* ── component ───────────────────────────────────────────────────────────── */

function GameCard({ game, onLaunch }) {
  return (
    <div 
      onClick={() => onLaunch(game.title)} 
      className="card-hover group flex flex-col rounded-xl overflow-hidden bg-game-card border border-white/[0.04] p-2 cursor-pointer transition-all duration-300 hover:bg-white/[0.08]"
    >
      
      {/* 1. Phần Ảnh / Icon */}
      <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-game-surface shrink-0">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { 
            e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 
          }}
        />
        
        {/* Badge Thể loại chính */}
        <div className="absolute top-1.5 left-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/75 text-game-neon border border-game-neon/20 backdrop-blur-md">
            {game.category}
          </span>
        </div>
      </div>

      {/* 2. Phần Tên Game (Chữ căn vào chính giữa khung) */}
      <div className="flex flex-col flex-1 pt-2 pb-1 px-1 justify-center items-center text-center">
        <h3 className="font-bold text-xs text-white/90 leading-tight tracking-wide group-hover:text-game-neon transition-colors line-clamp-2 min-h-[2rem] flex items-center justify-center">
          {game.title}
        </h3>
      </div>

    </div>
  );
}

/* ── Component Hộp thoại thông báo Khởi chạy Đẹp mắt ──────────── */
function LaunchToast({ gameTitle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex flex-col items-center gap-4 bg-game-surface border-2 border-game-neon/60 rounded-2xl px-8 py-6 w-full max-w-sm shadow-[0_0_30px_rgba(0,255,200,0.25)] animate-fade-in-up text-center">
        <div className="w-12 h-12 rounded-full bg-game-neon/10 border border-game-neon/30 flex items-center justify-center">
          <Loader2 size={24} className="text-game-neon animate-spin" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-game-neon uppercase tracking-widest mb-1">Hệ thống kích hoạt</h4>
          <p className="text-xs text-white/80 leading-relaxed">
            Đang khởi chạy <span className="text-white font-extrabold text-sm">{gameTitle}</span>...
          </p>
        </div>
        <button 
          onClick={onClose}
          className="mt-2 px-6 py-1.5 bg-game-neon text-game-deep font-bold text-xs rounded-md transition-all hover:brightness-110 active:scale-95"
        >
          OK
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

export default function MenuGame() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Quản lý bộ lọc song song
  const [activeCategory, setActiveCategory] = useState('Tất cả'); 
  const [activeType, setActiveType] = useState('Tất cả');         

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [launchingGame, setLaunchingGame] = useState(null);

  const handleLaunchGame = (title) => {
    setLaunchingGame(title);
    setTimeout(() => {
      setLaunchingGame(null);
    }, 3000);
  };

  /* ── mounted: fetch games + categories ─────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);
        const [gameRes, catRes] = await Promise.all([getGames(), getCategories()]);
        if (cancelled) return;
        setGames((gameRes || []).map(toUiGame));
        setCategories(catRes || []);
      } catch (e) {
        if (cancelled) return;
        console.error('[api] fetch error:', e);
        setError(e.message);
        setGames([]);
        setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── featured game ──────────────────────────────────────────────────────── */
  const featuredGameBase =
    games.find((g) => g.featured) ?? games[0] ?? FALLBACK_FEATURED;
  const featuredGame = { ...featuredGameBase, rating: featuredGameBase.rating || 4.9 };

  /* ── sidebar category list ───────────────────────────────────────────────── */
  const sidebarCategories = ['Tất cả', ...categories.map((c) => c.name)];

  /* ── Khối lọc gắn trực tiếp vào gametype tương ứng của Backend ───────────── */
  const filterTypes = [
    { label: 'Tất cả', value: 'Tất cả' },
    { label: 'Game Online', value: 'ONLINE' },
    { label: 'Game Offline', value: 'OFFLINE' },
    { label: 'Khác', value: 'OTHERS' }
  ];

  /* ── KẾT HỢP LỌC: Thể loại (Chính + Phụ) + Kiểu game từ Backend + Ô Tìm kiếm ─── */
  const filteredGames = games.filter((g) => {
    // ĐÃ SỬA ĐỔI: Kiểm tra xem thể loại đang chọn có nằm trong mảng (Thể loại chính + Thể loại phụ) của game không
    const gameCats = g.allCategoryNames || [];
    const matchCat = activeCategory === 'Tất cả' || gameCats.includes(activeCategory);
    
    const matchType = activeType === 'Tất cả' || String(g.gameType).toUpperCase() === String(activeType).toUpperCase();
    const matchSearch = (g.title || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="flex h-screen bg-game-deep text-white overflow-hidden">
      {/* ── Sidebar (Không chứa dấu mũi tên) ───────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-game-sidebar border-r border-white/[0.05] overflow-y-auto scrollbar-hidden">
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

        {/* Categories section */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-game-muted px-3 mb-3">
            Thể loại
          </p>
          {sidebarCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`sidebar-link w-full text-left px-4 py-2 rounded-lg transition-all ${
                activeCategory === cat ? ' active text-game-neon bg-white/[0.04]' : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content Region ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Search */}
        <header className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-white/[0.05] bg-game-surface/60 backdrop-blur-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-game-muted w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm trò chơi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-game-muted focus:outline-hidden focus:border-game-neon/60 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </header>

        {/* Main Library View */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep">
          {/* Hero / Featured section */}
          {activeCategory === 'Tất cả' && activeType === 'Tất cả' && searchTerm === '' && (
            <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
              {featuredGame?.image ? (
                <img
                  src={featuredGame.image}
                  alt={featuredGame.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-game-surface" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-game-deep via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center p-8 md:p-14">
                <div className="max-w-xl animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-game-neon/20 text-game-neon border border-game-neon/30">
                      Game nổi bật
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 text-white/70">
                      {featuredGame.category}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                    {featuredGame.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed mb-8 max-w-md">
                    {featuredGame.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLaunchGame(featuredGame.title)} 
                      className="neon-glow flex items-center gap-2 px-7 py-3 rounded-xl bg-game-neon text-game-deep font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                    >
                      <Play size={16} fill="currentColor" />
                      PLAY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid List & Filters */}
          <div className="px-6 py-5">
            {/* Khối nút bấm phân loại dưới banner */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden mb-6 pb-1">
              {filterTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveType(type.value)}
                  className={`category-chip ${
                    activeType === type.value ? 'active' : ''
                  }`}
                >
                  {type.label}
                </button>
              ))}

              <div className="ml-auto shrink-0 text-xs text-game-muted whitespace-nowrap">
                {filteredGames.length} kết quả
              </div>
            </div>

            {/* Grid Container */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Loader2 size={48} className="text-game-neon mb-4 animate-spin" />
                <p className="text-game-muted font-medium">Đang tải game...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Gamepad2 size={48} className="text-red-500/40 mb-4" />
                <p className="text-red-400 font-semibold mb-1">Lỗi tải dữ liệu</p>
                <p className="text-game-muted text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-game-neon/20 text-game-neon border border-game-neon/30 hover:bg-game-neon/30 transition-all"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} onLaunch={handleLaunchGame} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Gamepad2 size={48} className="text-game-muted/30 mb-4" />
                <p className="text-game-muted font-medium">Không tìm thấy kết quả</p>
                <p className="text-game-muted/60 text-sm mt-1">Thử chọn danh mục hoặc từ khóa khác</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Render Hộp thoại thông báo khi state launchingGame có giá trị */}
      {launchingGame && (
        <LaunchToast gameTitle={launchingGame} onClose={() => setLaunchingGame(null)} />
      )}
    </div>
  );
}