import React, { useState, useRef } from 'react';
import PanoramaViewer from '../components/PanoramaViewer';

function Panorama() {
  const [url, setUrl] = useState('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/equirect.jpg');
  const [snapshotUrl, setSnapshotUrl] = useState('');
  const captureSnapshotRef = useRef(null);

  const handleSnapshotReady = (captureFn) => {
    captureSnapshotRef.current = captureFn;
  };

  const handleCaptureSnapshot = () => {
    try {
      if (!captureSnapshotRef.current) return;
      const img = captureSnapshotRef.current();
      setSnapshotUrl(img);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to capture panorama image.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#f3f4f6]">Panoramic View</h1>
          <p className="text-sm text-gray-400">Paste an equirectangular image URL to explore in 360°.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#0f141b] border border-[#1f2733] rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-panorama.jpg"
                className="w-full rounded-xl border border-[#1f2733] bg-[#0b0f14] py-2 px-3 text-sm outline-none focus:border-[#caa74a] focus:ring-2 focus:ring-[#caa74a]/20 text-gray-200 placeholder-gray-500"
              />
              <div className="mt-3 text-xs text-gray-500">
                Use a 2:1 equirectangular image for best results.
              </div>
            </div>
            <div className="bg-[#0f141b] border border-[#1f2733] rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Panorama</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setUrl(objectUrl);
                  }
                }}
                className="w-full text-sm text-gray-300"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setUrl('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@main/equirect.jpg')}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-200 rounded-lg border border-white/10 text-sm transition-colors"
                  type="button"
                >
                  Use Sample
                </button>
                <button
                  onClick={() => setUrl('')}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-200 rounded-lg border border-white/10 text-sm transition-colors"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0f141b] border border-[#1f2733] rounded-xl p-4">
              <PanoramaViewer imageUrl={url} onSnapshotReady={handleSnapshotReady} />
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleCaptureSnapshot}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-medium"
                type="button"
              >
                Capture Panorama as Image
              </button>
            </div>
          </div>
        </div>

        {snapshotUrl && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0f141b] border border-[#1f2733] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-[#f3f4f6]">Panorama Snapshot</h2>
                <a
                  href={snapshotUrl}
                  download="panorama-view.png"
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  Download
                </a>
              </div>
              <img src={snapshotUrl} alt="Panorama snapshot" className="w-full max-h-[480px] object-contain rounded-lg" />
            </div>
            <div className="bg-[#0f141b] border border-[#1f2733] rounded-xl p-4">
              <div className="text-sm text-gray-400">
                Tip: Use CORS-enabled image URLs to allow snapshot export. GitHub, public CDNs, or your own server configured with `Access-Control-Allow-Origin: *` work best.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Panorama;
