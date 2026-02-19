
import React, { useState, useEffect, useRef } from 'react';
import { IconConfig, IconShape } from './types';
import { DEFAULT_CONFIG, POPULAR_FONTS, FONT_WEIGHTS, COLOR_PALETTE, POPULAR_ICONS } from './constants';
import IconPreview from './components/IconPreview';

// --- Color Accessibility Utilities ---

const getRGB = (hex: string) => {
  const color = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;
  return [r, g, b].map(val => val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4));
};

const getLuminance = (hex: string) => {
  const [r, g, b] = getRGB(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1: string, color2: string) => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const getRandomContrastColors = () => {
  let bgIndex = 0;
  let textIndex = 0;
  let ratio = 0;
  let attempts = 0;
  const maxAttempts = 100;

  while (ratio < 4.5 && attempts < maxAttempts) {
    bgIndex = Math.floor(Math.random() * COLOR_PALETTE.length);
    textIndex = Math.floor(Math.random() * COLOR_PALETTE.length);
    
    const bgColor = COLOR_PALETTE[bgIndex];
    const textColor = COLOR_PALETTE[textIndex];
    
    if (bgIndex !== textIndex) {
      ratio = getContrastRatio(bgColor, textColor);
    }
    attempts++;
  }

  return {
    backgroundColor: COLOR_PALETTE[bgIndex],
    fontColor: COLOR_PALETTE[textIndex]
  };
};

// ------------------------------------

const App: React.FC = () => {
  const [config, setConfig] = useState<IconConfig>(() => {
    const { backgroundColor, fontColor } = getRandomContrastColors();
    return { 
      ...DEFAULT_CONFIG, 
      backgroundColor, 
      fontColor 
    };
  });

  const [suggestedIcons, setSuggestedIcons] = useState<string[]>([]);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedFontsRef = useRef<Set<string>>(new Set());

  // Logic to prepend 4 unique icons that haven't appeared in the list yet
  const shuffleSuggestions = () => {
    const currentSet = new Set(suggestedIcons);
    const availablePool = POPULAR_ICONS.filter(icon => !currentSet.has(icon));
    
    // Fallback to full pool if we ran out of unique icons
    const source = availablePool.length >= 4 ? availablePool : POPULAR_ICONS;
    
    const newBatch: string[] = [];
    const tempPool = [...source];
    
    for (let i = 0; i < 4 && tempPool.length > 0; i++) {
      const idx = Math.floor(Math.random() * tempPool.length);
      newBatch.push(tempPool.splice(idx, 1)[0]);
    }
    
    setSuggestedIcons(prev => [...newBatch, ...prev]);
  };

  // Initial suggestions
  useEffect(() => {
    shuffleSuggestions();
  }, []);

  // Load fonts
  useEffect(() => {
    const weights = "wght@300;400;500;600;700;900";
    const currentFamily = config.fontFamily;
    
    if (!loadedFontsRef.current.has(currentFamily)) {
      const familyParam = `family=${currentFamily.replace(/ /g, '+')}:${weights}`;
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?${familyParam}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      loadedFontsRef.current.add(currentFamily);
    }
  }, [config.fontFamily]);

  useEffect(() => {
    const weights = "wght@300;400;500;600;700;900";
    const families = POPULAR_FONTS
      .map(f => `family=${f.replace(/ /g, '+')}:${weights}`)
      .join('&');
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    POPULAR_FONTS.forEach(f => loadedFontsRef.current.add(f));
  }, []);

  const handleDownload = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `icon-${config.useIcon ? config.iconName : config.text}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const updateConfig = (updates: Partial<IconConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleRandomizeColors = () => {
    const { backgroundColor, fontColor } = getRandomContrastColors();
    updateConfig({ backgroundColor, fontColor });
  };

  const handleShare = async () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    try {
      if (navigator.share) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "icon.png", { type: "image/png" });
          await navigator.share({
            files: [file],
            title: 'My Custom Icon',
            text: 'Created with IconGen',
          });
        });
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleHexChange = (key: 'fontColor' | 'backgroundColor', value: string) => {
    let hex = value.startsWith('#') ? value : `#${value}`;
    if (hex.length <= 7) {
      updateConfig({ [key]: hex });
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      updateConfig({ fontSize: val });
    } else if (e.target.value === '') {
      updateConfig({ fontSize: 0 });
    }
  };

  const handleFontSizeWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (config.fontSize !== undefined) {
      const step = 5;
      const direction = e.deltaY < 0 ? 1 : -1;
      const nextValue = config.fontSize + (direction * step);
      const boundedValue = Math.max(1, Math.min(1000, nextValue));
      updateConfig({ fontSize: boundedValue });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center bg-[#0a0b0e] text-slate-200">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Control Panel */}
        <div className="lg:col-span-8 bg-[#161922] p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Icon Designer</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Column 1: Typography / Icon */}
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-blue-400">
                    {config.useIcon ? 'Symbol Name' : 'Icon Text'}
                  </label>
                  <div className="flex bg-[#1e222d] p-1 rounded-lg border border-white/5">
                    <button 
                      onClick={() => updateConfig({ useIcon: false })}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${!config.useIcon ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      TEXT
                    </button>
                    <button 
                      onClick={() => updateConfig({ useIcon: true })}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${config.useIcon ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      ICON
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {config.useIcon ? (
                    <div className="flex gap-2">
                      <div className="relative group flex-1">
                        <input 
                          type="text"
                          value={config.iconName}
                          onChange={(e) => updateConfig({ iconName: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                          className="w-full px-5 py-4 bg-[#1e222d] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white font-mono text-lg placeholder-slate-600 shadow-inner"
                          placeholder="e.g. search, bolt, home"
                        />
                      </div>
                      <a 
                        href="https://fonts.google.com/icons?icon.set=Material+Symbols" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center aspect-square px-4 bg-[#1e222d] border border-white/5 rounded-2xl hover:bg-slate-700 transition-all text-blue-400 shadow-inner group-btn"
                        title="Browse all Material Symbols"
                      >
                        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">north_east</span>
                      </a>
                    </div>
                  ) : (
                    <input 
                      type="text"
                      maxLength={5}
                      value={config.text}
                      onChange={(e) => updateConfig({ text: e.target.value })}
                      className="w-full px-5 py-4 bg-[#1e222d] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white font-semibold text-xl placeholder-slate-600 shadow-inner"
                      placeholder="e.g. F"
                    />
                  )}

                  {/* Conditionally render Icon Suggestions only when useIcon is true */}
                  {config.useIcon && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Icon Suggestions</p>
                        <button 
                          onClick={shuffleSuggestions}
                          className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border border-white/5 active:scale-95"
                          title="Shuffle and add 4 new icons"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                          </svg>
                          Shuffle
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-3 p-3 bg-[#1e222d] rounded-2xl border border-white/5 max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
                        {suggestedIcons.map(icon => (
                          <button
                            key={icon}
                            onClick={() => updateConfig({ useIcon: true, iconName: icon })}
                            className={`aspect-square flex items-center justify-center rounded-xl border transition-all ${
                              config.useIcon && config.iconName === icon 
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                : 'bg-[#161922] border-white/5 text-slate-500 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                            title={icon}
                          >
                            <span className="material-symbols-outlined text-[40px]">{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Base Shape</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['square', 'rounded', 'circle'] as IconShape[]).map(shape => (
                    <button
                      key={shape}
                      onClick={() => updateConfig({ shape })}
                      className={`py-3.5 text-xs font-bold rounded-xl border transition-all ${
                        config.shape === shape 
                          ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'bg-[#1e222d] border-white/5 text-slate-500 hover:bg-[#252a36] hover:text-slate-300'
                      }`}
                    >
                      {shape.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {!config.useIcon && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Font Family</label>
                      <div className="relative group">
                        <select 
                          value={config.fontFamily}
                          onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                          className="w-full px-5 py-4 bg-[#1e222d] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none text-white font-medium shadow-inner cursor-pointer"
                        >
                          {POPULAR_FONTS.map(font => (
                            <option key={font} value={font} className="bg-[#1e222d]">{font}</option>
                          ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Font Weight</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FONT_WEIGHTS.map(weight => (
                          <button
                            key={weight.value}
                            onClick={() => updateConfig({ fontWeight: weight.value })}
                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                              config.fontWeight === weight.value 
                                ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                                : 'bg-[#1e222d] border-white/5 text-slate-500 hover:bg-[#252a36]'
                            }`}
                          >
                            {weight.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest text-blue-400">Size (px)</label>
                  <div className="relative group">
                    <input 
                      type="number"
                      min="1"
                      max="1000"
                      step="5"
                      value={config.fontSize || ''}
                      onChange={handleFontSizeChange}
                      onWheel={handleFontSizeWheel}
                      className="w-full pl-5 pr-14 py-4 bg-[#1e222d] border border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-mono text-lg shadow-inner"
                      placeholder="0"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none group-focus-within:text-blue-400">px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Appearance */}
            <div className="space-y-8">
              <div className="p-8 bg-[#1e222d] rounded-3xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-6">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primary Colors</label>
                  <button 
                    onClick={handleRandomizeColors}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border border-white/5 active:scale-95"
                    title="Generate high-contrast random colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Randomize
                  </button>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <input 
                        type="color"
                        value={config.fontColor}
                        onChange={(e) => updateConfig({ fontColor: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-14 h-14 rounded-2xl ring-4 ring-black/30 shadow-2xl transition-all group-hover:scale-110 border border-white/20" style={{ backgroundColor: config.fontColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Accent Color</p>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">#</span>
                        <input 
                          type="text"
                          value={config.fontColor.replace('#', '')}
                          onChange={(e) => handleHexChange('fontColor', e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 bg-[#161922] border border-white/5 rounded-xl font-mono text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <input 
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-14 h-14 rounded-2xl ring-4 ring-black/30 shadow-2xl transition-all group-hover:scale-110 border border-white/20" style={{ backgroundColor: config.backgroundColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Background</p>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">#</span>
                        <input 
                          type="text"
                          value={config.backgroundColor.replace('#', '')}
                          onChange={(e) => handleHexChange('backgroundColor', e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 bg-[#161922] border border-white/5 rounded-xl font-mono text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-[#1e222d] rounded-2xl border border-white/5 opacity-50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Settings stored locally</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Stickies */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 self-start">
          <div className="bg-[#161922] p-8 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Master View</h2>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
              </div>
            </div>

            <div className="relative group p-6 bg-black/40 rounded-3xl border border-white/5 transition-all hover:bg-black/60 shadow-inner">
               <IconPreview 
                 config={config} 
                 size={280} 
                 canvasRef={mainCanvasRef}
                 className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-[1.02]" 
               />
               <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    High Resolution
                  </div>
               </div>
            </div>
            
            <div className="mt-10 w-full space-y-6">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export PNG
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl transition-all border border-white/5 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share Icon
                </button>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-1 font-bold uppercase tracking-widest">
                  <span>Format</span>
                  <span className="text-blue-400">PNG / Transparent</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-1 font-bold uppercase tracking-widest">
                  <span>Render</span>
                  <span className="text-blue-400">GPU Accelerated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 mb-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">Documentation</a>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">Privacy</a>
          <div className="w-1 h-1 rounded-full bg-slate-800"></div>
          <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">Support</a>
        </div>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">IconGen &bull; Premium Creative Suite &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;
