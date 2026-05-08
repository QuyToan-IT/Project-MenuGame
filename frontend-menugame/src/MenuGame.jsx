import React, { useState } from 'react';
import './MenuGame.css';
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

const INITIAL_GAMES = [
  {
    id: 1,
    title: 'League of Legends',
    image: 'https://images.pexels.com/photos/13127582/pexels-photo-13127582.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'MOBA',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Valorant',
    image: 'https://images.pexels.com/photos/8108092/pexels-photo-8108092.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'FPS',
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Counter-Strike 2',
    image: 'https://images.pexels.com/photos/8108569/pexels-photo-8108569.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'FPS',
    rating: 4.6,
  },
  {
    id: 4,
    title: 'Black Myth: Wukong',
    image: 'https://images.pexels.com/photos/5971335/pexels-photo-5971335.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Action',
    rating: 4.9,
    featured: true,
  },
  {
    id: 5,
    title: 'Fortnite',
    image: 'https://images.pexels.com/photos/8108229/pexels-photo-8108229.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Battle Royale',
    rating: 4.3,
  },
  {
    id: 6,
    title: 'Elden Ring',
    image: 'https://images.pexels.com/photos/5971321/pexels-photo-5971321.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Action',
    rating: 4.9,
  },
  {
    id: 7,
    title: 'Cyberpunk 2077',
    image: 'https://images.pexels.com/photos/8108089/pexels-photo-8108089.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Action',
    rating: 4.5,
  },
  {
    id: 8,
    title: 'GTA V',
    image: 'https://images.pexels.com/photos/14389542/pexels-photo-14389542.png?auto=compress&cs=tinysrgb&w=400',
    category: 'Action',
    rating: 4.7,
  },
];


const FEATURED_GAME = {
  title: 'Black Myth: Wukong',
  description: 'Khám phá thế giới huyền thoại Tây Du Ký trong tựa game hành động AAA đẳng cấp thế giới. Hóa thân thành Tề Thiên Đại Thánh, chiến đấu với thần linh và quái vật.',
  image: 'https://images.pexels.com/photos/28122495/pexels-photo-28122495.jpeg?auto=compress&cs=tinysrgb&w=1400',
  category: 'Action',
  rating: 4.9,
};

const CATEGORIES = ['Tất cả', 'MOBA', 'FPS', 'Action', 'Battle Royale'];

const NAV_LINKS = [
  { icon: Gamepad2, label: 'Tất cả game', key: 'all' },
  { icon: Heart, label: 'Yêu thích', key: 'favorites' },
  { icon: HardDrive, label: 'Đã cài đặt', key: 'installed' },
  { icon: Store, label: 'Cửa hàng', key: 'store' },
];

function GameCard({ game }) {
  return (
    <div className="card-hover group relative rounded-xl overflow-hidden bg-game-card cursor-pointer">
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay - always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-game-neon/20 text-game-neon border border-game-neon/30 backdrop-blur-sm">
            {game.category}
          </span>

        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-sm text-white leading-tight truncate">{game.title}</h3>

          {/* Play button - appears on hover */}
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

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const filteredGames = INITIAL_GAMES.filter((game) => {
    const matchSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'Tất cả' || game.category === activeCategory;
    return matchSearch && matchCategory;
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
          <span className="text-base font-bold tracking-tight text-white">Menu<span className="text-game-neon">Game</span></span>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mx-4" />

        {/* Categories section */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-game-muted px-3 mb-3">Thể loại</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`sidebar-link w-full text-left${activeCategory === cat ? ' active' : ''}`}
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
          {/* Chỉ hiện phần Hero khi đang ở mục Tất cả và không gõ ô tìm kiếm */}
          {activeCategory === 'Tất cả' && searchTerm === '' && (
            <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
            <img
              src={FEATURED_GAME.image}
              alt={FEATURED_GAME.title}
              className="w-full h-full object-cover"
            />
            {/* Multi-layer overlay */}
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
                    {FEATURED_GAME.category}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                  {FEATURED_GAME.title}
                </h2>
                <p className="text-sm md:text-base text-white/60 leading-relaxed mb-8 max-w-md">
                  {FEATURED_GAME.description}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => alert(`Đang khởi chạy ${FEATURED_GAME.title}...`)}
                    className="neon-glow flex items-center gap-2 px-7 py-3 rounded-xl bg-game-neon text-game-deep font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                  >
                    <Play size={16} fill="currentColor" />
                    PLAY NOW
                  </button>

                </div>
                {/* Scroll hint */}
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
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-chip${activeCategory === cat ? ' active' : ''}`}
                >
                  {cat}
                </button>
              ))}

              <div className="ml-auto shrink-0 text-xs text-game-muted whitespace-nowrap">
                {filteredGames.length} game
              </div>
            </div>

            {/* Game grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} onCategoryClick={setActiveCategory} />
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

export default App;
