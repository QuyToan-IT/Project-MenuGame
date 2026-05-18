import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames, getCategories, createGame, updateGame, deleteGame } from '../api';
import {
  Search, Plus, Gamepad2, LayoutGrid, Pencil, Trash2,
  X, Check, AlertTriangle, Shield, ChevronLeft,
} from 'lucide-react';
import { StatCard, Field, inputCls } from './SharedComponents';

/* ──────────────────────────────────────────────────────────────────────────
 * Mappers
 * ────────────────────────────────────────────────────────────────────────── */

function mapBackendToAdmin(game, allCategories) {
  let catName = '';
  const safeCategories = allCategories || [];

  const findCatNameById = (id) => {
    if (id == null) return '';
    const found = safeCategories.find((c) => String(c.id) === String(id));
    return found ? found.name : '';
  };

  if (game.categories) {
    const firstCat = Array.isArray(game.categories)
      ? game.categories[0]
      : [...game.categories][0];
    if (firstCat) {
      if (typeof firstCat === 'object') {
        catName = firstCat.name || findCatNameById(firstCat.id);
      } else {
        catName = findCatNameById(firstCat);
      }
    }
  }

  if (!catName && game.category !== undefined && game.category !== null) {
    if (typeof game.category === 'object') {
      catName = game.category.name || findCatNameById(game.category.id);
    } else if (typeof game.category === 'string' && isNaN(Number(game.category))) {
      catName = game.category;
    } else {
      catName = findCatNameById(game.category);
    }
  }

  if (!catName && game.categoryId) {
    catName = findCatNameById(game.categoryId);
  }

  if (!catName && game.category_id) {
    catName = findCatNameById(game.category_id);
  }

  if (!catName && game.categoryIds && Array.isArray(game.categoryIds) && game.categoryIds.length > 0) {
    catName = findCatNameById(game.categoryIds[0]);
  }

  return {
    id:        game.id,
    title:     game.name      || game.title  || 'Không có tên',
    image:     game.imageUrl  || game.iconUrl || game.image || '',
    category:  catName,
    rating:    game.rating ?? 0,
    gameType:  game.type || game.gameType || 'ONLINE',
  };
}

/**
 * Convert frontend form data to backend Game shape.
 * `gameCategories` is the full list fetched from GET /api/categories so we
 * can look up the selected category name → { id, name } object.
 */
function mapAdminToBackend(game, gameCategories) {
  const catName = game.category;
  let catObj  = (gameCategories || []).find((c) => c.name === catName);

  // Fallback: Đảm bảo không bao giờ gửi mảng categories rỗng nếu có sẵn danh sách
  if (!catObj && gameCategories && gameCategories.length > 0) {
    catObj = gameCategories[0];
  }

  // Làm sạch Object trước khi gửi để tránh bị Backend từ chối do dư thừa metadata
  const cleanCat = catObj ? { id: catObj.id, name: catObj.name } : null;

  return {
    id:         game.id,
    name:       game.title,
    title:      game.title,
    iconUrl:    game.image,
    imageUrl:   game.image,
    image:      game.image,
    type:       game.gameType || 'ONLINE',
    gameType:   game.gameType || 'ONLINE',
    // Cover tất cả các style Request Params / Body mà Backend có thể yêu cầu
    categories:  cleanCat ? [cleanCat] : [],
    category:    cleanCat,
    categoryId:  cleanCat ? cleanCat.id : null,
    category_id: cleanCat ? cleanCat.id : null,
    categoryIds: cleanCat ? [cleanCat.id] : [],
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * GameFormModal  (receives all categories fetched from backend)
 * ────────────────────────────────────────────────────────────────────────── */

function GameFormModal({ mode, game, gameCategories, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    const defaultCat = (gameCategories && gameCategories.length > 0) ? gameCategories[0].name : '';
    if (game) {
      return { ...game, category: game.category || defaultCat };
    }
    return { title: '', image: '', category: defaultCat, gameType: 'ONLINE' };
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title  = 'Vui lòng nhập tên game';
    if (!form.image.trim()) {
      e.image = 'Vui lòng nhập URL ảnh';
    } else if (!/^https?:\/\//i.test(form.image.trim())) {
      e.image = 'Vui lòng nhập URL ảnh hợp lệ (bắt đầu bằng http:// hoặc https://)';
    }
    return e;
  };

  const catOptions = gameCategories || [];

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
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
              <img
                src={form.image} alt="preview"
                className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'; }}
              />
            </div>
          )}
          <Field label="Tên game" error={errors.title}>
            <input
              type="text" value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Nhập tên game..."
              className={inputCls(errors.title)}
            />
          </Field>
          <Field label="Ảnh (URL)" error={errors.image}>
            <input
              type="url" value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://..."
              className={inputCls(errors.image)}
            />
          </Field>
          <Field label="Thể loại">
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputCls()}
            >
              {catOptions.map((c) => (
                <option key={c.id} value={c.name} className="bg-game-surface">
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Loại game">
            <select
              value={form.gameType}
              onChange={(e) => set('gameType', e.target.value)}
              className={inputCls()}
            >
              <option value="ONLINE" className="bg-game-surface">Online</option>
              <option value="OFFLINE" className="bg-game-surface">Offline</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-game-muted hover:text-white hover:bg-white/[0.06] transition-all">Hủy</button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 neon-glow"
          >
            <Check size={14} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * DeleteConfirmModal
 * ────────────────────────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────────────────────────
 * GameManagement
 * ────────────────────────────────────────────────────────────────────────── */

export default function GameManagement() {
  const navigate = useNavigate();

  /* data */
  const [rawGames,        setRawGames]         = useState([]);
  const [gameCategories,  setGameCategories]    = useState([]);
  const [search,          setSearch]            = useState('');
  const [loading,         setLoading]           = useState(true);
  const [error,           setError]             = useState(null);

  /* modal state */
  const [modal,         setModal]           = useState(null);
  const [deleteTarget,  setDeleteTarget]    = useState(null);

  /* derived */
  const games = useMemo(() => (rawGames || []).map(g => mapBackendToAdmin(g, gameCategories)), [rawGames, gameCategories]);

  /* ── load games + categories from backend on mount ─────────────────────── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [gameData, catData] = await Promise.all([getGames(), getCategories()]);
        if (cancelled) return;
        setRawGames(Array.isArray(gameData)       ? gameData       : []);
        setGameCategories(Array.isArray(catData)   ? catData        : []);
      } catch (e) {
        if (cancelled) return;
        setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () => games.filter((g) => g.title.toLowerCase().includes(search.toLowerCase())),
    [games, search]
  );
  const categoryCount = useMemo(() => new Set(games.map((g) => g.category)).size, [games]);

  /* ── CRUD ──────────────────────────────────────────────────────────────── */
  const handleAdd = () =>
    setModal({ mode: 'add', game: null });

  const handleEdit = (game) =>
    setModal({ mode: 'edit', game });

  const handleSave = useCallback(async (formData) => {
    const backendData = mapAdminToBackend(formData, gameCategories);
    try {
      if (formData.id == null) {
        await createGame(backendData);
      } else {
        await updateGame(formData.id, backendData);
      }
      // Lấy lại danh sách mới nhất từ Backend để đảm bảo dữ liệu relationship (Thể loại) được parse chính xác
      const freshGames = await getGames();
      setRawGames(Array.isArray(freshGames) ? freshGames : []);
      setModal(null);
    } catch (e) {
      alert('Lưu thất bại: ' + e.message);
    }
  }, [gameCategories]);

  const handleDelete = useCallback(async (game) => {
    try {
      await deleteGame(game.id);
      setRawGames(rawGames.filter((g) => g.id !== game.id));
      setDeleteTarget(null);
    } catch (e) {
      alert('Xóa thất bại: ' + e.message);
    }
  }, [rawGames]);

  /* ── render ────────────────────────────────────────────────────────────── */
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
            <input
              type="text" placeholder="Tìm kiếm game..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.06] border border-white/[0.08] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-game-muted focus:outline-hidden focus:border-game-neon/60 transition-all w-48"
            />
          </div>
          <button
            onClick={handleAdd}
            className="neon-glow flex items-center gap-2 px-4 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 shrink-0"
          >
            <Plus size={15} /> Thêm game
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Gamepad2 size={48} className="text-game-muted/40 mb-4 animate-pulse" />
            <p className="text-game-muted font-medium">Đang tải dữ liệu...</p>
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
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={Gamepad2} label="Tổng game" value={games.length} accent="#06b6d4" />
              <StatCard icon={LayoutGrid} label="Thể loại" value={categoryCount} accent="#7c3aed" />
            </div>
            <div className="bg-game-card border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['STT', 'Game', 'Thể loại', 'Loại', 'Hành động'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-game-muted whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center text-game-muted">
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
                                <img
                                  src={game.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'} alt={game.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'; }}
                                />
                              </div>
                              <span className="font-semibold text-white whitespace-nowrap">{game.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-game-neon/10 text-game-neon border border-game-neon/20">{game.category || 'Chưa có'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${game.gameType === 'ONLINE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                              {game.gameType}
                            </span>
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
          </>
        )}
      </main>

      {modal && (
        <GameFormModal
          mode={modal.mode}
          game={modal.game}
          gameCategories={gameCategories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          game={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
