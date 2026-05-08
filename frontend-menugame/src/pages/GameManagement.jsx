import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Gamepad2, LayoutGrid, Pencil, Trash2, X, Check, AlertTriangle, Shield, ChevronLeft } from 'lucide-react';
import { StatCard, Field, inputCls } from './SharedComponents';

const CATEGORY_OPTIONS = ['MOBA', 'FPS', 'Action', 'Battle Royale', 'RPG', 'Sports', 'Strategy'];

const INITIAL_GAMES = [
  { id: 1, title: 'League of Legends', image: 'https://images.pexels.com/photos/13127582/pexels-photo-13127582.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'MOBA', rating: 4.8 },
  { id: 2, title: 'Valorant', image: 'https://images.pexels.com/photos/8108092/pexels-photo-8108092.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'FPS', rating: 4.7 },
  { id: 3, title: 'Counter-Strike 2', image: 'https://images.pexels.com/photos/8108569/pexels-photo-8108569.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'FPS', rating: 4.6 },
  { id: 4, title: 'Black Myth: Wukong', image: 'https://images.pexels.com/photos/5971335/pexels-photo-5971335.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Action', rating: 4.9, featured: true },
  { id: 5, title: 'Fortnite', image: 'https://images.pexels.com/photos/8108229/pexels-photo-8108229.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Battle Royale', rating: 4.3 },
  { id: 6, title: 'Elden Ring', image: 'https://images.pexels.com/photos/5971321/pexels-photo-5971321.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Action', rating: 4.9 },
  { id: 7, title: 'Cyberpunk 2077', image: 'https://images.pexels.com/photos/8108089/pexels-photo-8108089.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Action', rating: 4.5 },
  { id: 8, title: 'GTA V', image: 'https://images.pexels.com/photos/14389542/pexels-photo-14389542.png?auto=compress&cs=tinysrgb&w=400', category: 'Action', rating: 4.7 },
];

function GameFormModal({ mode, game, onSave, onClose }) {
  const [form, setForm] = useState(game ?? { title: '', image: '', category: 'Action' });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Vui lòng nhập tên game';
    if (!form.image.trim()) e.image = 'Vui lòng nhập URL ảnh';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-game-surface border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">
            {mode === 'add' ? 'Thêm game mới' : 'Chỉnh sửa game'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-white hover:bg-white/[0.08] transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {form.image && (
            <div className="w-full h-36 rounded-xl overflow-hidden border border-white/[0.06] bg-game-card">
              <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <Field label="Tên game" error={errors.title}>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Nhập tên game..." className={inputCls(errors.title)} />
          </Field>
          <Field label="Ảnh (URL)" error={errors.image}>
            <input type="url" value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." className={inputCls(errors.image)} />
          </Field>
          <Field label="Thể loại">
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls()}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-game-surface">{c}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-game-muted hover:text-white hover:bg-white/[0.06] transition-all">Hủy</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 neon-glow">
            <Check size={14} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ game, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-game-surface border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex flex-col items-center px-6 py-8 text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Xác nhận xóa</h3>
            <p className="text-sm text-game-muted">
              Bạn có chắc muốn xóa game <span className="text-white font-semibold">"{game.title}"</span>?<br />
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-game-muted hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all">Hủy</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-400 active:scale-95 transition-all">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameManagement() {
  const navigate = useNavigate();
  const [games, setGames] = useState(INITIAL_GAMES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => games.filter((g) => g.title.toLowerCase().includes(search.toLowerCase())), [games, search]);
  const categoryCount = useMemo(() => new Set(games.map((g) => g.category)).size, [games]);

  const handleAdd = () => setModal({ mode: 'add', game: null });
  const handleEdit = (game) => setModal({ mode: 'edit', game });
  const handleSave = (formData) => {
    if (modal.mode === 'add') {
      setGames([...games, { ...formData, id: Date.now() }]);
    } else {
      setGames(games.map((g) => (g.id === modal.game.id ? { ...modal.game, ...formData } : g)));
    }
    setModal(null);
  };
  const handleDeleteConfirm = () => {
    setGames(games.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <header className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-white/[0.05] bg-game-surface/60 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-game-muted hover:text-white transition-colors md:hidden">
          <ChevronLeft size={16} /> Quay lại
        </button>
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <Shield size={16} className="text-game-neon" /> Quản lý Game
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-game-muted w-4 h-4 pointer-events-none" />
            <input type="text" placeholder="Tìm kiếm game..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white/[0.06] border border-white/[0.08] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-game-muted focus:outline-hidden focus:border-game-neon/60 transition-all w-48" />
          </div>
          <button onClick={handleAdd} className="neon-glow flex items-center gap-2 px-4 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 shrink-0">
            <Plus size={15} /> Thêm game
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Gamepad2} label="Tổng game" value={games.length} accent="#06b6d4" />
          <StatCard icon={LayoutGrid} label="Thể loại" value={categoryCount} accent="#7c3aed" />
        </div>
        <div className="bg-game-card border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['STT', 'Game', 'Thể loại', 'Hành động'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-game-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center text-game-muted">
                      <Gamepad2 size={32} className="mx-auto mb-3 opacity-30" />
                      <p>Không có game nào</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((game, idx) => (
                    <tr key={game.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                      <td className="px-4 py-3 text-game-muted text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-game-surface">
                            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-white whitespace-nowrap">{game.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-game-neon/10 text-game-neon border border-game-neon/20">{game.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(game)} title="Sửa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-game-neon hover:bg-game-neon/10 transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(game)} title="Xóa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-white/[0.04] text-xs text-game-muted">
              Hiển thị {filtered.length}/{games.length} game
            </div>
          )}
        </div>
      </main>

      {modal && <GameFormModal mode={modal.mode} game={modal.game} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteTarget && <DeleteConfirmModal game={deleteTarget} onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} />}
    </>
  );
}