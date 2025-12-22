
import React, { useState } from 'react';
import { HardDrive, Network, Calculator, Info } from 'lucide-react';

const Tools: React.FC = () => {
  // Storage Calculator States
  const [channels, setChannels] = useState(8);
  const [resolution, setResolution] = useState('2'); // Megapixels
  const [days, setDays] = useState(30);
  const [fps, setFps] = useState(15);
  const [storageResult, setStorageResult] = useState<number | null>(null);

  const calculateStorage = () => {
    // Basic calculation formula for H.264/H.265 (Simplified)
    // Bitrate estimate: 2MP @ 15fps H.265 ~ 2048kbps
    const baseBitrate = parseInt(resolution) * 1024 * (fps / 15);
    const totalGigabytes = (channels * baseBitrate * 3600 * 24 * days) / (8 * 1024 * 1024);
    const totalTerabytes = totalGigabytes / 1024;
    setStorageResult(parseFloat(totalTerabytes.toFixed(2)));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ferramentas de Cálculo</h2>
        <p className="text-slate-500">Utilidades inteligentes para projetos de CFTV e infraestrutura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Storage Calculator */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <HardDrive size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Calculadora de Armazenamento (HDD)</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Canais</label>
              <input 
                type="number" 
                value={channels} 
                onChange={(e) => setChannels(parseInt(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolução (MP)</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="1">720p (1MP)</option>
                <option value="2">1080p (2MP)</option>
                <option value="4">2K (4MP)</option>
                <option value="8">4K (8MP)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dias de Gravação</label>
              <input 
                type="number" 
                value={days} 
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Quadros (FPS)</label>
              <input 
                type="number" 
                value={fps} 
                onChange={(e) => setFps(parseInt(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <button 
            onClick={calculateStorage}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Calculator size={18} />
            Calcular Armazenamento
          </button>

          {storageResult !== null && (
            <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium text-sm">Capacidade Necessária</p>
                <p className="text-3xl font-black text-indigo-900">{storageResult} TB</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-400 italic">Baseado em compressão H.265</p>
                <p className="text-xs font-semibold text-indigo-700">Sugestão: {Math.ceil(storageResult / 2) * 2} TB WD Purple/SkyHawk</p>
              </div>
            </div>
          )}
        </div>

        {/* Bandwidth Tool Info */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Network size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Guia de Largura de Banda</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                <Info size={16} />
                <span>Dica Técnica</span>
              </div>
              <p className="text-sm text-slate-600">
                Para redes locais de CFTV, sempre utilize switches GIGABIT em cascata para evitar gargalos em troncos de câmeras.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase">Estimativas de Fluxo (Câmera Individual)</p>
              {[
                { res: '1080p / 15 FPS', h264: '4 Mbps', h265: '2 Mbps' },
                { res: '4MP / 15 FPS', h264: '8 Mbps', h265: '4 Mbps' },
                { res: '4K / 15 FPS', h264: '16 Mbps', h265: '8 Mbps' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm font-semibold text-slate-700">{row.res}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-slate-500">H.264: <strong>{row.h264}</strong></span>
                    <span className="text-emerald-600">H.265: <strong>{row.h265}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
