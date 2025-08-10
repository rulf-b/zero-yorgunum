"use client";
import React, { useState, useEffect } from "react";

export default function Admin2UserPage() {
  const [admin2User, setAdmin2User] = useState({ username: '', password: '' });
  const [admin2UserLoading, setAdmin2UserLoading] = useState(false);
  const [admin2UserMsg, setAdmin2UserMsg] = useState('');

  useEffect(() => {
    setAdmin2UserLoading(true);
    fetch('/api/admin-users')
      .then(res => res.json())
      .then(data => {
        if (data.username) setAdmin2User({ username: data.username, password: data.password });
        setAdmin2UserLoading(false);
      })
      .catch(() => setAdmin2UserLoading(false));
  }, []);

  const saveAdmin2User = async () => {
    setAdmin2UserLoading(true);
    setAdmin2UserMsg('');
    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin2User)
    });
    if (res.ok) {
      setAdmin2UserMsg('Kullanıcı bilgileri güncellendi!');
    } else {
      setAdmin2UserMsg('Hata oluştu!');
    }
    setAdmin2UserLoading(false);
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded p-4 my-8 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2 text-orange-800">2. Admin Paneli Kullanıcı Bilgileri</h3>
      {admin2UserLoading ? (
        <div>Yükleniyor...</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); saveAdmin2User(); }} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
            <input type="text" value={admin2User.username} onChange={e => setAdmin2User((v) => ({ ...v, username: e.target.value }))} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input type="text" value={admin2User.password} onChange={e => setAdmin2User((v) => ({ ...v, password: e.target.value }))} className="w-full p-2 border rounded" required />
          </div>
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700" disabled={admin2UserLoading}>Kaydet</button>
          {admin2UserMsg && <div className="text-sm mt-2 text-orange-700">{admin2UserMsg}</div>}
        </form>
      )}
    </div>
  );
} 