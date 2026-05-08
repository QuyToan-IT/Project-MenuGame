import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, Shield, Pencil, Trash2, X, Check, AlertTriangle, ChevronLeft } from 'lucide-react';
import { StatCard, Field, inputCls } from './SharedComponents';

const INITIAL_USERS = [
  { id: 1, username: 'admin', email: 'admin@game.com', role: 'Admin', status: 'Hoạt động', joinDate: '2024-01-10' },
  { id: 2, username: 'player1', email: 'player1@gmail.com', role: 'User', status: 'Hoạt động', joinDate: '2024-02-15' },
  { id: 3, username: 'pro_gamer', email: 'progamer@yahoo.com', role: 'User', status: 'Bị khóa', joinDate: '2024-03-20' },
];

function UserFormModal({ mode, user, onSave, onClose }) {
  const [form, setForm] = useState(user ?? { username: '', email: '', role: 'User', status: 'Hoạt động' });
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Vui lòng nhập tên tài khoản';
    if (!form.email.trim()) e.email = 'Vui lòng nhập email';
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
            {mode === 'add' ? 'Thêm tài khoản' : 'Chỉnh sửa tài khoản'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-white hover:bg-white/[0.08] transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Tên tài khoản" error={errors.username}>
            <input type="text" value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="Nhập tên tài khoản..." className={inputCls(errors.username)} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="example@email.com" className={inputCls(errors.email)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vai trò">
              <select value={form.role} onChange={(e) => set('role', e.target.value)} className={inputCls()}>
                <option value="User" className="bg-game-surface">User</option>
                <option value="Admin" className="bg-game-surface">Admin</option>
              </select>
            </Field>
            <Field label="Trạng thái">
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls()}>
                <option value="Hoạt động" className="bg-game-surface">Hoạt động</option>
                <option value="Bị khóa" className="bg-game-surface">Bị khóa</option>
              </select>
            </Field>
          </div>
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

function DeleteUserConfirmModal({ user, onConfirm, onClose }) {
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
              Bạn có chắc muốn xóa tài khoản <span className="text-white font-semibold">"{user.username}"</span>?<br />
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

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchUser, setSearchUser] = useState('');
  const [userModal, setUserModal] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const filteredUsers = useMemo(() => users.filter((u) => u.username.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())), [users, searchUser]);
  const adminCount = useMemo(() => users.filter(u => u.role === 'Admin').length, [users]);

  const handleAddUser = () => setUserModal({ mode: 'add', user: null });
  const handleEditUser = (user) => setUserModal({ mode: 'edit', user });
  const handleSaveUser = (formData) => {
    if (userModal.mode === 'add') {
      setUsers([...users, { ...formData, id: Date.now(), joinDate: new Date().toISOString().split('T')[0] }]);
    } else {
      setUsers(users.map((u) => (u.id === userModal.user.id ? { ...userModal.user, ...formData } : u)));
    }
    setUserModal(null);
  };
  const handleDeleteUserConfirm = () => {
    setUsers(users.filter((u) => u.id !== deleteUserTarget.id));
    setDeleteUserTarget(null);
  };

  return (
    <>
      <header className="shrink-0 h-16 flex items-center gap-4 px-6 border-b border-white/[0.05] bg-game-surface/60 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-game-muted hover:text-white transition-colors md:hidden">
          <ChevronLeft size={16} /> Quay lại
        </button>
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <Users size={16} className="text-game-neon" /> Quản lý Tài khoản
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-game-muted w-4 h-4 pointer-events-none" />
            <input type="text" placeholder="Tìm kiếm tài khoản..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="bg-white/[0.06] border border-white/[0.08] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-game-muted focus:outline-hidden focus:border-game-neon/60 transition-all w-48" />
          </div>
          <button onClick={handleAddUser} className="neon-glow flex items-center gap-2 px-4 py-2 rounded-lg bg-game-neon text-game-deep text-sm font-bold transition-all hover:brightness-110 active:scale-95 shrink-0">
            <Plus size={15} /> Thêm tài khoản
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hidden bg-game-deep px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Users} label="Tổng tài khoản" value={users.length} accent="#06b6d4" />
          <StatCard icon={Shield} label="Quản trị viên" value={adminCount} accent="#f59e0b" />
        </div>
        <div className="bg-game-card border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['STT', 'Tài khoản', 'Vai trò', 'Trạng thái', 'Ngày tham gia', 'Hành động'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-game-muted whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-game-muted">
                      <Users size={32} className="mx-auto mb-3 opacity-30" />
                      <p>Không có tài khoản nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                      <td className="px-4 py-3 text-game-muted text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{user.username}</span>
                          <span className="text-xs text-game-muted">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${user.role === 'Admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-game-neon/10 text-game-neon border-game-neon/20'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${user.status === 'Hoạt động' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-game-muted text-xs">{user.joinDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditUser(user)} title="Sửa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-game-neon hover:bg-game-neon/10 transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteUserTarget(user)} title="Xóa" className="w-8 h-8 flex items-center justify-center rounded-lg text-game-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
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
          {filteredUsers.length > 0 && (
            <div className="px-4 py-3 border-t border-white/[0.04] text-xs text-game-muted">
              Hiển thị {filteredUsers.length}/{users.length} tài khoản
            </div>
          )}
        </div>
      </main>

      {userModal && <UserFormModal mode={userModal.mode} user={userModal.user} onSave={handleSaveUser} onClose={() => setUserModal(null)} />}
      {deleteUserTarget && <DeleteUserConfirmModal user={deleteUserTarget} onConfirm={handleDeleteUserConfirm} onClose={() => setDeleteUserTarget(null)} />}
    </>
  );
}