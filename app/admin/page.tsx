'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [status, setStatus] = useState('');
  const [shows, setShows] = useState<any[]>([]);
  const [editingShow, setEditingShow] = useState<any>(null);
  
  // Toggles between Auto and Manual modes
  const [mode, setMode] = useState<'tmdb' | 'manual'>('tmdb');

  // Auto Import State
  const [tmdbId, setTmdbId] = useState('');

  // Manual Add State
  const [manualForm, setManualForm] = useState({
    title: '', type: 'Drama', categories: '', posterPath: '', status: 'Completed', rating: '0', overview: '', episodeCount: ''
  });

  // Link inputs state
  const [link540p_1, setLink540p_1] = useState('');
  const [link540p_2, setLink540p_2] = useState('');
  const [link720p_1, setLink720p_1] = useState('');
  const [link720p_2, setLink720p_2] = useState('');
  const [link1080p_1, setLink1080p_1] = useState('');
  const [link1080p_2, setLink1080p_2] = useState('');
  const [link1080pHD_1, setLink1080pHD_1] = useState('');
  const [link1080pHD_2, setLink1080pHD_2] = useState('');

  const fetchShows = async () => {
    const res = await fetch('/api/admin/shows');
    if (res.ok) {
      const data = await res.json();
      setShows(data);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // 1. Auto Import Handler
  const handleAutoImport = async () => {
    setStatus('Importing from TMDb... Please wait.');
    try {
      const response = await fetch('/api/import-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: Number(tmdbId) }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ Success! Imported: ${data.show.title}`);
        setTmdbId('');
        fetchShows();
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setStatus(`❌ Detailed Error: ${error.message}`);
    }
  };

  // 2. Manual Add Handler
  const handleManualAdd = async () => {
    if (!manualForm.title) return alert("Title is required!");
    setStatus('Creating manual entry...');
    try {
      const response = await fetch('/api/admin/manual-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ Success! Created: ${data.show.title}`);
        setManualForm({ title: '', type: 'Drama', categories: '', posterPath: '', status: 'Completed', rating: '0', overview: '', episodeCount: '' });
        fetchShows();
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setStatus(`❌ Detailed Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to completely delete "${title}"?`)) return;
    await fetch(`/api/admin/shows?id=${id}`, { method: 'DELETE' });
    fetchShows();
  };

  const openLinkEditor = (show: any) => {
    const firstEpisode = show.seasons[0]?.episodes[0];
    if (!firstEpisode) return alert("No episodes found for this show to attach links to. (Did you delete them in the DB?)");
    
    setEditingShow({ showId: show.id, episodeId: firstEpisode.id, title: show.title });
    
    const links = firstEpisode.links || [];
    
    const l540 = links.filter((l: any) => l.quality === '540p');
    setLink540p_1(l540[0]?.url || '');
    setLink540p_2(l540[1]?.url || '');

    const l720 = links.filter((l: any) => l.quality === '720p');
    setLink720p_1(l720[0]?.url || '');
    setLink720p_2(l720[1]?.url || '');

    const l1080 = links.filter((l: any) => l.quality === '1080p');
    setLink1080p_1(l1080[0]?.url || '');
    setLink1080p_2(l1080[1]?.url || '');

    const lHD = links.filter((l: any) => l.quality === '1080pHD');
    setLink1080pHD_1(lHD[0]?.url || '');
    setLink1080pHD_2(lHD[1]?.url || '');
  };

  const saveLinks = async () => {
    const newLinks = [];
    if (link540p_1) newLinks.push({ quality: '540p', url: link540p_1 });
    if (link540p_2) newLinks.push({ quality: '540p', url: link540p_2 });
    if (link720p_1) newLinks.push({ quality: '720p', url: link720p_1 });
    if (link720p_2) newLinks.push({ quality: '720p', url: link720p_2 });
    if (link1080p_1) newLinks.push({ quality: '1080p', url: link1080p_1 });
    if (link1080p_2) newLinks.push({ quality: '1080p', url: link1080p_2 });
    if (link1080pHD_1) newLinks.push({ quality: '1080pHD', url: link1080pHD_1 });
    if (link1080pHD_2) newLinks.push({ quality: '1080pHD', url: link1080pHD_2 });

    await fetch('/api/admin/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episodeId: editingShow.episodeId, links: newLinks }),
    });

    alert('Links saved successfully!');
    setEditingShow(null);
    fetchShows();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#1dbf73]">KCollect Admin Dashboard</h1>

        {/* INPUT TABS */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('tmdb')} className={`px-6 py-2 font-bold rounded-t-lg transition-colors ${mode === 'tmdb' ? 'bg-gray-800 text-[#1dbf73]' : 'bg-gray-700 text-gray-400'}`}>
            TMDb Auto-Import
          </button>
          <button onClick={() => setMode('manual')} className={`px-6 py-2 font-bold rounded-t-lg transition-colors ${mode === 'manual' ? 'bg-gray-800 text-[#1dbf73]' : 'bg-gray-700 text-gray-400'}`}>
            Manual Entry
          </button>
        </div>

        {/* TOP SECTION: Importer Forms */}
        <div className="bg-gray-800 p-6 rounded-b-xl rounded-tr-xl shadow-lg mb-10 border-t-4 border-[#1dbf73]">
          
          {mode === 'tmdb' ? (
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2 text-gray-300 font-bold">Import New Show (TMDb ID):</label>
                <input type="number" value={tmdbId} onChange={(e) => setTmdbId(e.target.value)} placeholder="e.g., 202250" className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-[#1dbf73] outline-none"/>
              </div>
              <button onClick={handleAutoImport} className="bg-[#1dbf73] hover:bg-[#18a060] font-bold py-3 px-8 rounded">Import</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Title *</label>
                  <input type="text" value={manualForm.title} onChange={e => setManualForm({...manualForm, title: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none"/>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Poster URL (Direct Link)</label>
                  <input type="text" value={manualForm.posterPath} onChange={e => setManualForm({...manualForm, posterPath: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none" placeholder="https://...image.jpg"/>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Type</label>
                  <select value={manualForm.type} onChange={e => setManualForm({...manualForm, type: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none">
                    <option>Drama</option><option>Movie</option><option>Variety</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Status</label>
                  <select value={manualForm.status} onChange={e => setManualForm({...manualForm, status: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none">
                    <option>Completed</option><option>Ongoing</option><option>Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Genres (Comma separated)</label>
                  <input type="text" value={manualForm.categories} onChange={e => setManualForm({...manualForm, categories: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none" placeholder="Comedy, Action"/>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Rating (Out of 10)</label>
                  <input type="number" step="0.1" value={manualForm.rating} onChange={e => setManualForm({...manualForm, rating: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none"/>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-400 font-bold">Episode Count</label>
                  <input type="number" value={manualForm.episodeCount} onChange={e => setManualForm({...manualForm, episodeCount: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm focus:border-[#1dbf73] outline-none" placeholder="e.g., 16"/>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-400 font-bold">Overview / Summary</label>
                <textarea value={manualForm.overview} onChange={e => setManualForm({...manualForm, overview: e.target.value})} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm h-20 focus:border-[#1dbf73] outline-none"></textarea>
              </div>
              <button onClick={handleManualAdd} className="bg-[#1dbf73] hover:bg-[#18a060] font-bold py-3 px-8 rounded w-full">Create Custom Show</button>
            </div>
          )}

        </div>
        {status && <div className="mb-10 p-4 rounded bg-gray-800 text-center text-sm font-bold text-[#1dbf73] border border-[#1dbf73]">{status}</div>}

        {/* BOTTOM SECTION: Show List & Link Editor */}
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Manage Library ({shows.length})</h2>
            <div className="space-y-4">
              {shows.map(show => (
                <div key={show.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                  <div>
                    <h3 className="font-bold text-lg">{show.title}</h3>
                    <p className="text-xs text-gray-400">{show.type} • {show.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openLinkEditor(show)} className="bg-[#1dbf73] hover:bg-[#18a060] px-4 py-2 rounded text-sm font-bold">Links</button>
                    <button onClick={() => handleDelete(show.id, show.title)} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-bold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            {editingShow ? (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg sticky top-10 border border-[#1dbf73]">
                <h2 className="text-xl font-bold mb-2">Edit Links</h2>
                <p className="text-sm text-[#1dbf73] mb-6">{editingShow.title}</p>
                
                <div className="space-y-6 mb-6">
                  {/* Link inputs exactly as they were */}
                  <div className="border-l-2 border-[#1dbf73] pl-3">
                    <label className="text-xs text-gray-400 font-bold mb-1 block">540p Links</label>
                    <input type="text" value={link540p_1} onChange={e => setLink540p_1(e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 1"/>
                    <input type="text" value={link540p_2} onChange={e => setLink540p_2(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 2"/>
                  </div>
                  <div className="border-l-2 border-[#1dbf73] pl-3">
                    <label className="text-xs text-gray-400 font-bold mb-1 block">720p Links</label>
                    <input type="text" value={link720p_1} onChange={e => setLink720p_1(e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 1"/>
                    <input type="text" value={link720p_2} onChange={e => setLink720p_2(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 2"/>
                  </div>
                  <div className="border-l-2 border-[#1dbf73] pl-3">
                    <label className="text-xs text-gray-400 font-bold mb-1 block">1080p Links</label>
                    <input type="text" value={link1080p_1} onChange={e => setLink1080p_1(e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 1"/>
                    <input type="text" value={link1080p_2} onChange={e => setLink1080p_2(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 2"/>
                  </div>
                  <div className="border-l-2 border-[#1dbf73] pl-3">
                    <label className="text-xs text-gray-400 font-bold mb-1 block">1080pHD Links</label>
                    <input type="text" value={link1080pHD_1} onChange={e => setLink1080pHD_1(e.target.value)} className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 1"/>
                    <input type="text" value={link1080pHD_2} onChange={e => setLink1080pHD_2(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm outline-none focus:border-[#1dbf73]" placeholder="Link 2"/>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={saveLinks} className="flex-1 bg-[#1dbf73] hover:bg-[#18a060] py-2 rounded font-bold">Save</button>
                  <button onClick={() => setEditingShow(null)} className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded font-bold">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-dashed border-gray-600 text-center text-gray-500 flex items-center justify-center h-64">
                Click "Links" on a show to add download URLs here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}