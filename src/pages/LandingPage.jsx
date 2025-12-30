import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">

            {/* --- ADVANCED HUD BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Dynamic Energy Orbs */}
                <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/10 blur-[160px] rounded-full animate-bounce [animation-duration:15s]" />

                {/* Clinical Grid with HUD scanlines */}
                <div className="absolute inset-0 opacity-[0.07]"
                     style={{
                         backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
                         backgroundSize: '40px 40px'
                     }}>
                </div>

                {/* Floating HUD Coordinates */}
                <div className="absolute top-20 right-20 text-[8px] text-cyan-500/30 font-mono flex flex-col items-end gap-1 uppercase tracking-widest">
                    <span>REF: 002.55.91</span>
                    <span>LAT: 32.7157° N</span>
                    <span>LON: 117.1611° W</span>
                    <div className="w-24 h-px bg-cyan-500/20 mt-1"></div>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="max-w-7xl mx-auto px-10 py-8 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                        <span className="text-[#020617] font-black italic text-xl">V</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">VitalMotion</span>
                </div>
                <div className="flex items-center gap-10">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                        <span className="text-[8px] text-green-500 font-bold tracking-widest uppercase animate-pulse">● System Encrypted</span>
                        <div className="h-0.5 w-full bg-green-500/20 rounded-full mt-1"></div>
                    </div>
                    <Link to="/doctor/login" className="text-cyan-400 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all">Physician Portal</Link>
                    <Link to="/about" className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:border-white/40 transition-all backdrop-blur-md">About</Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative pt-16 pb-12 px-10 max-w-7xl mx-auto z-10">
                <span className="block text-[12px] uppercase tracking-[0.8em] text-cyan-500 font-bold mb-6 italic opacity-70">
                    Microsoft Imagine Cup 2025 // Neural Telemetry
                </span>
                <h1 className="text-7xl md:text-[110px] font-black leading-[0.8] tracking-tighter italic mb-10">
                    Health. <span className="text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)] animate-pulse">Simplified.</span>
                </h1>

                {/* --- TRANSPARENT GLOWING MONITOR --- */}
                <div className="relative w-full h-40 bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                        {/* Static baseline with minor "noise" pulses */}
                        <path d="M0,50 L1000,50" className="stroke-white/5 stroke-[0.5]" />

                        {/* ECG Waveform with glow filter */}
                        <path
                            d="M0,50 L100,50 L105,45 L110,50 L120,50 L130,10 L140,90 L150,50 L170,50 L180,40 L195,50 L300,50 L305,45 L310,50 L320,50 L330,10 L340,90 L350,50 L370,50 L380,40 L395,50 L500,50 L505,45 L510,50 L520,50 L530,10 L540,90 L550,50 L570,50 L580,40 L595,50 L700,50 L705,45 L710,50 L720,50 L730,10 L740,90 L750,50 L770,50 L780,40 L795,50 L900,50 L905,45 L910,50 L920,50 L930,10 L940,90 L950,50 L970,50 L980,40 L995,50 L1000,50"
                            className="stroke-cyan-400 stroke-[2] fill-none ecg-line-anim drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        />
                    </svg>
                    {/* Trailing scan line effect */}
                    <div className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent scanline-anim"></div>
                </div>
            </header>

            {/* BENTO GRID CONTENT */}
            <main className="max-w-7xl mx-auto px-10 pb-32 grid lg:grid-cols-12 gap-8 relative z-10">

                {/* Left Block */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            {['1000+', 'AI Pattern', 'Early Alert'].map((val, i) => (
                                <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-center group hover:bg-slate-800/60 hover:border-cyan-500/50 transition-all duration-300">
                                    <div className="text-xl font-black mb-1 group-hover:scale-110 transition-transform">{val.split(' ')[0]}</div>
                                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{val.split(' ').slice(1).join(' ') || 'Signals'}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 relative group">
                            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-500" alt="Surgeon" />
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:opacity-0 transition-opacity"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Clinical Impact Card with Neon Pulse Border */}
                        <div className="bg-[#1e293b]/20 border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between min-h-[420px] relative overflow-hidden group hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-45 transition-transform duration-700">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            </div>
                            <div>
                                <div className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rotate-45 animate-pulse"></span> CLINICAL IMPACT
                                </div>
                                <h3 className="text-4xl font-black mb-4 italic tracking-tight leading-none text-slate-100">Preventative <br/>Intelligence.</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">Early identification allow clinicians to intervene before conditions escalate into life-threatening emergencies.</p>
                            </div>
                            <Link to="/user/auth" className="relative group/btn inline-block">
                                <div className="absolute inset-0 bg-cyan-400 blur-md opacity-20 group-hover/btn:opacity-50 transition-opacity"></div>
                                <div className="relative px-8 py-5 bg-cyan-400 text-[#020617] font-black rounded-2xl text-center text-xs uppercase tracking-widest shadow-xl transition-transform active:scale-95">Check Heart Health</div>
                            </Link>
                        </div>

                        {/* Holographic Expert Section */}
                        <div className="rounded-[2.5rem] overflow-hidden relative border border-white/10 bg-[#020617] h-[420px] group">
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="w-64 h-64 bg-cyan-500/5 blur-[80px] group-hover:bg-cyan-500/15 transition-all"></div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-110 group-hover:grayscale-0 transition-all duration-1000"
                                alt="Holographic Analysis"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent opacity-90"></div>
                            <div className="absolute bottom-10 left-10 z-20">
                                <h4 className="text-2xl font-black italic mb-1 text-slate-100">Expert Support</h4>
                                <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-[0.3em]">Authorized Clinical Access</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Block */}
                <div className="lg:col-span-5">
                    <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[3.5rem] h-full flex flex-col backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        {/* Top-right tech decoration */}
                        <div className="absolute top-0 right-0 p-10 flex gap-1 opacity-20">
                            {[1,2,3].map(i => <div key={i} className="w-1 h-5 bg-cyan-500 rounded-full"></div>)}
                        </div>

                        <h3 className="text-[10px] font-black text-slate-500 tracking-[0.6em] uppercase mb-12 flex items-center gap-4">
                            The Global Reality <span className="h-px flex-1 bg-white/5"></span>
                        </h3>

                        <div className="space-y-6 mb-12 relative z-10">
                            {[
                                { t: "Leading Cause of Death", d: "Nearly half of global population lacks essential healthcare." },
                                { t: "Billions Underserved", d: "Cardiovascular diseases remain the leading global fatality." },
                                { t: "Late Detection", d: "Many conditions detected only after symptoms become severe." }
                            ].map((card, i) => (
                                <div key={i} className="p-7 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all group">
                                    <div className="font-black text-xs mb-2 text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{card.t}</div>
                                    <div className="text-[12px] text-slate-500 font-medium leading-relaxed">{card.d}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-10 border-t border-white/5 flex gap-6 relative z-10">
                            <div className="flex-1 bg-cyan-400/[0.03] p-8 rounded-[2.5rem] border border-cyan-400/10 text-center hover:border-cyan-400/30 transition-all">
                                <div className="text-3xl font-black italic text-cyan-400 mb-1">12h</div>
                                <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">Gain Time</div>
                            </div>
                            <div className="flex-1 bg-purple-500/[0.03] p-8 rounded-[2.5rem] border border-purple-500/10 text-center hover:border-purple-500/30 transition-all">
                                <div className="text-3xl font-black italic text-purple-400 mb-1">60%</div>
                                <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">Reduced Severity</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-20 border-t border-white/5 text-center relative z-10">
                <div className="flex justify-center gap-3 mb-6 opacity-30">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>)}
                </div>
                <p className="text-[10px] uppercase tracking-[1em] font-black text-slate-700">VitalMotion // Secure Neural Telemetry // 2025</p>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                .ecg-line-anim {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: sweep 5s linear infinite;
                }
                .scanline-anim {
                    animation: moveScan 5s linear infinite;
                }
                @keyframes sweep {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes moveScan {
                    from { transform: translateX(-100px); }
                    to { transform: translateX(1200px); }
                }
            `}} />
        </div>
    );
};

export default LandingPage;