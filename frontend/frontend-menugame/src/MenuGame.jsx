import React, { useState, useEffect, useCallback } from 'react';
import './MenuGame.css';
import { getGames, getCategories } from './api';
import {
  Play,
  Search,
  Gamepad2,
  Heart,
  HardDrive,
  Store,
  ChevronRight,
  Zap,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────────────── */

function toUiGame(game) {
  const categories = game.categories ?? [];
  return {
    ...game,
    title: game.name || game.title || 'Không có tên',
    image: game.iconUrl || game.image || '',
    category: categories[0]?.name || 'Unknown',
    categoryIds: categories.map((c) => c.id),
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

function GameCard({ game }) {
  return (
    <div className="card-hover group relative rounded-xl overflow-hidden bg-game-card cursor-pointer">
      {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; }}
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-game-neon/20 text-game-neon border border-game-neon/30 backdrop-blur-sm">
            {game.category}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-sm text-white leading-tight truncate">
            {game.title}
          </h3>
          <div className="play-btn-overlay mt-2">
            <button
              onClick={() => alert(`Đang khởi chạy ${game.title}...`)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-game-neon text-game-deep font-bold text-xs transition-all hover:brightness-110 active:scale-95"
            >
              <Play size={12} fill="currentColor" />
              PLAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuGame() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  /* ── featured game: first game from DB or static fallback ───────────────── */
  const featuredGameBase =
    games.find((g) => g.featured) ?? games[0] ?? FALLBACK_FEATURED;

  /* Tránh mutate trực tiếp object state/constant (gây lỗi Cannot assign to read only property) */
  const featuredGame = { ...featuredGameBase, rating: featuredGameBase.rating || 4.9 };

  /* ── category list for chips ───────────────────────────────────────────── */
  const categoryNames = categories.map((c) => c.name);
  const allCategories = ['Tất cả', ...categoryNames];

  /* ── filter categories in UI ───────────────────────────────────────────── */
  const filteredGames = games.filter((g) => {
    const matchCat = activeCategory === 'Tất cả' || g.category === activeCategory;
    const matchSearch = (g.title || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex h-screen bg-game-deep text-white overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────── */}
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
          {/* Always include backend categories; shown dynamically */}
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`sidebar-link w-full text-left${
                activeCategory === cat ? ' active' : ''
              }`}
            >
              <ChevronRight size={14} className="opacity-50" />
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-white/[0.05] bg-game-surface/60 backdrop-blur-xl">
          {/* Search */}
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

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep">
          {/* ── Hero / Featured ─────────────────── */}
          {activeCategory === 'Tất cả' && searchTerm === '' && (
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

              {/* Content */}
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
                      onClick={() => alert(`Đang khởi chạy ${featuredGame.title}...`)}
                      className="neon-glow flex items-center gap-2 px-7 py-3 rounded-xl bg-game-neon text-game-deep font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                    >
                      <Play size={16} fill="currentColor" />
                      PLAY NOW
                    </button>
                  </div>
                  <p className="mt-10 text-white/30 text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="inline-block w-4 h-px bg-white/20" />
                    Cuộn xuống để xem thư viện
                    <span className="inline-block w-4 h-px bg-white/20" />
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Filters & Grid ──────────────────── */}
          <div className="px-6 py-5">
            {/* Category chips */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden mb-6 pb-1">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-chip${
                    activeCategory === cat ? ' active' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="ml-auto shrink-0 text-xs text-game-muted whitespace-nowrap">
                {filteredGames.length} game
              </div>
            </div>

            {/* Loading / Error / Game grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Gamepad2 size={48} className="text-game-muted/40 mb-4 animate-pulse" />
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
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Gamepad2 size={48} className="text-game-muted/30 mb-4" />
                <p className="text-game-muted font-medium">Không tìm thấy game</p>
                <p className="text-game-muted/60 text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
