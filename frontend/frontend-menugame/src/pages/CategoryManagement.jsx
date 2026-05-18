import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames, getCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { Search, Plus, Tags, Pencil, Trash2, X, Check, AlertTriangle, ChevronLeft, LayoutGrid } from 'lucide-react';
import { StatCard, Field, inputCls } from './SharedComponents';

/* backend Category entity has only { id, name }.
   description and gameCount are frontend-only meta fields.              */
const CATEGORY_OPTIONS = ['MOBA', 'FPS', 'Action', 'Battle Royale', 'RPG', 'Sports', 'Strategy'];

function mapBackendToAdmin(cat, counts = {}) {
  return {
    id: cat.id,
    name: cat.name || '',
    description: cat.description || '',
    gameCount: counts[cat.id] || 0,
  };
}

function mapAdminToBackend(cat) {
  return { id: cat.id, name: cat.name, description: cat.description };
}

function CategoryFormModal({ mode, category, onSave, onClose }) {
  const [form, setForm] = useState(category ?? { name: '', description: '', gameCount: 0 });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập tên thể loại';
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
            {mode === 'add' ? 'Thêm thể loại' : 'Chỉnh sửa thể loại'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-white hover:bg-white/[0.08] transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Tên thể loại" error={errors.name}>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nhập tên thể loại..." className={inputCls(errors.name)} />
          </Field>
          <Field label="Mô tả" error={errors.description}>
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Mô tả ngắn về thể loại này..." className={inputCls(errors.description) + ' resize-none'} />
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

function DeleteCategoryConfirmModal({ category, onConfirm, onClose }) {
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
              Bạn có chắc muốn xóa thể loại <span className="text-white font-semibold">"{category.name}"</span>?<br />
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

export default function CategoryManagement() {
  const navigate = useNavigate();
  const [rawCategories, setRawCategories] = useState([]);
  const [rawGames, setRawGames] = useState([]);
  const [searchCat, setSearchCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catModal, setCatModal] = useState(null);
  const [deleteCatTarget, setDeleteCatTarget] = useState(null);

  const categories = useMemo(
    () => {
      const counts = {};
      (rawGames || []).forEach(g => {
        const catIds = [];
        if (g.categories && Array.isArray(g.categories)) g.categories.forEach(c => catIds.push(c.id));
        if (g.categoryId) catIds.push(g.categoryId);
        if (g.category_id) catIds.push(g.category_id);
        if (g.categoryIds && Array.isArray(g.categoryIds)) g.categoryIds.forEach(id => catIds.push(id));
        
        [...new Set(catIds)].forEach(id => {
          if (id) counts[id] = (counts[id] || 0) + 1;
        });
      });
      return (rawCategories || []).map(cat => mapBackendToAdmin(cat, counts));
    },
    [rawCategories, rawGames]
  );

  /* ── load from backend on mount ────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [catData, gameData] = await Promise.all([getCategories(), getGames()]);
        if (cancelled) return;
        setRawCategories(Array.isArray(catData) ? catData : []);
        setRawGames(Array.isArray(gameData) ? gameData : []);
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

  const filteredCategories = useMemo(
    () => categories.filter((c) =>
      c.name.toLowerCase().includes(searchCat.toLowerCase())
    ), [categories, searchCat]
  );
  const activeCategoriesCount = useMemo(
    () => categories.filter((c) => c.gameCount > 0).length,
    [categories]
  );

  /* ── CRUD ──────────────────────────────────────────────────────────────── */
  const handleAddCategory = () => setCatModal({ mode: 'add', category: null });
  const handleEditCategory = (category) => setCatModal({ mode: 'edit', category });
  const handleSaveCategory = async (formData) => {
    const backendData = mapAdminToBackend(formData);
    try {
      if (catModal.mode === 'add') {
        const created = await createCategory(backendData);
        setRawCategories([...(rawCategories || []), created]);
      } else {
        const updated = await updateCategory(formData.id, backendData);
        setRawCategories(rawCategories.map((c) => (c.id === formData.id ? updated : c)));
      }
      setCatModal(null);
    } catch (e) {
      alert('Lưu thất bại: ' + e.message);
    }
  };
  const handleDeleteCategoryConfirm = async () => {
    try {
      await deleteCategory(deleteCatTarget.id);
      setRawCategories(rawCategories.filter((c) => c.id !== deleteCatTarget.id));
      setDeleteCatTarget(null);
    } catch (e) {
      alert('Xóa thất bại: ' + e.message);
    }
  };

  return (
    <>
      <header className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-white/[0.05] bg-game-surface/60 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-game-muted hover:text-white transition-colors md:hidden">
          <ChevronLeft size={16} /> Quay lại
        </button>
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <Tags size={16} className="text-game-neon" /> Quản lý Thể loại
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-game-muted w-4 h-4 pointer-events-none" />
            <input type="text" placeholder="Tìm kiếm thể loại..." value={searchCat} onChange={(e) => setSearchCat(e.target.value)} className="bg-white/[0.06] border border-white/[0.08] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-game-muted focus:outline-hidden focus:border-game-neon/60 transition-all w-48" />
          </div>
          <button onClick={handleAddCategory} className="neon-glow flex items-center gap-2 px-4 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 shrink-0">
            <Plus size={15} /> Thêm thể loại
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Tags size={48} className="text-game-muted/40 mb-4 animate-pulse" />
            <p className="text-game-muted font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Tags size={48} className="text-red-500/40 mb-4" />
            <p className="text-red-400 font-semibold mb-1">Lỗi tải dữ liệu</p>
            <p className="text-game-muted text-sm mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-medium bg-game-neon/20 text-game-neon border border-game-neon/30 hover:bg-game-neon/30 transition-all">
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={Tags} label="Tổng thể loại" value={categories.length} accent="#06b6d4" />
              <StatCard icon={LayoutGrid} label="Đang có game" value={activeCategoriesCount} accent="#10b981" />
            </div>
            <div className="bg-game-card border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['STT', 'Tên thể loại', 'Mô tả', 'Số game', 'Hành động'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-game-muted whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-16 text-center text-game-muted">
                          <Tags size={32} className="mx-auto mb-3 opacity-30" />
                          <p>Không có thể loại nào</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category, idx) => (
                        <tr key={category.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                          <td className="px-4 py-3 text-game-muted text-xs">{idx + 1}</td>
                          <td className="px-4 py-3 font-semibold text-white">{category.name}</td>
                          <td className="px-4 py-3 text-game-muted text-xs">{category.description || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-white/[0.05] text-game-muted border-white/[0.08]">
                              {category.gameCount}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditCategory(category)} title="Sửa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-game-neon hover:bg-game-neon/10 transition-all">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => setDeleteCatTarget(category)} title="Xóa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
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
              {filteredCategories.length > 0 && (
                <div className="px-4 py-3 border-t border-white/[0.04] text-xs text-game-muted">
                  Hiển thị {filteredCategories.length}/{categories.length} thể loại
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {catModal && <CategoryFormModal mode={catModal.mode} category={catModal.category} onSave={handleSaveCategory} onClose={() => setCatModal(null)} />}
      {deleteCatTarget && <DeleteCategoryConfirmModal category={deleteCatTarget} onConfirm={handleDeleteCategoryConfirm} onClose={() => setDeleteCatTarget(null)} />}
    </>
  );
}
