import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-cyan-500/30">
            {/* NAVIGATION BAR */}
            <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center bg-[#0F172A] border-b border-white/10 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/10">
                        <span className="text-[#0F172A] font-black text-xl italic">V</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter leading-none">VitalMotion</span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/doctor/login" className="px-5 py-2 rounded-full border border-white/20 text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                        {/* FIXED: Wrapped the > in braces to prevent syntax error */}
                        Physician Portal {">"}
                    </Link>
                    <Link to="/about" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                        About
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/20 blur-[120px] rounded-full"></div>
                <div className="absolute top-20 right-10 w-80 h-80 bg-purple-500/20 blur-[120px] rounded-full"></div>

                <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-4 block">Microsoft Imagine Cup 2025</span>
                    <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
                        Health. <span className="text-cyan-400 italic">Simplified.</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                        VitalMotion uses AI to watch your heart health in real-time. We help doctors find problems before they become emergencies.
                    </p>
                </div>
            </header>

            {/* BENTO GRID (Main Content) */}
            <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">

                {/* SECTION 1: PROBLEM & MISSION */}
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* The Problem Card */}
                    <div className="lg:col-span-4 p-10 rounded-[2.5rem] bg-[#1E293B] border border-white/5 flex flex-col justify-between shadow-2xl">
                        <div>
                            <h2 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">The Problem</h2>
                            <h3 className="text-4xl font-black mb-6 leading-tight">Most help comes too late.</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Usually people only go to the doctor when they feel pain. By then, the heart is already damaged.
                            </p>
                        </div>
                        <Link to="/user/auth" className="w-full py-5 bg-cyan-400 text-[#0F172A] font-black rounded-2xl text-center hover:scale-[1.02] transition-all text-sm uppercase tracking-widest">
                            Initialize Session
                        </Link>
                    </div>

                    {/* Middle Image Card */}
                    <div className="lg:col-span-4 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl h-[450px]">
                        <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                            alt="Physician Analysis"
                            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>

                    {/* Our Mission Card */}
                    <div className="lg:col-span-4 p-10 rounded-[2.5rem] bg-[#1E293B] border border-white/5 shadow-2xl flex flex-col">
                        <div className="flex-1">
                            <h2 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Our Mission</h2>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-6xl font-black text-white">1000</span>
                                <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">data/second</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-10">
                                VitalMotion monitors 1000+ data points per second to provide doctors with real-time biometric telemetry.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <div className="text-xl font-black text-white">48</div>
                                <div className="text-[8px] text-slate-500 uppercase font-black">Hours</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <div className="text-xl font-black text-white">AI</div>
                                <div className="text-[8px] text-slate-500 uppercase font-black">Diagnostics</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <div className="text-xl font-black text-white">30%</div>
                                <div className="text-[8px] text-slate-500 uppercase font-black">Reduce</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: CLINICAL IMPACT */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[2.5rem] bg-[#1E293B] border border-white/5 flex items-center gap-10 shadow-2xl">
                        <div className="w-1/2 h-[200px] rounded-2xl overflow-hidden border border-white/10 relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop"
                                alt="Biometric Lab"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]"></div>
                        </div>
                        <div className="w-1/2">
                            <h2 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-3 italic">
                                ◈ Clinical Impact
                            </h2>
                            <h3 className="text-3xl font-black mb-3 leading-tight">Faster care.</h3>
                            <p className="text-slate-400 text-[11px] leading-relaxed mb-6">
                                Live data sync allows doctors to take faster actions.
                            </p>
                            <Link to="/user/auth" className="text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-indigo-600 rounded-lg inline-block hover:bg-indigo-500 transition-colors">
                                Access Portal
                            </Link>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-[#1E293B] border border-white/5 shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black tracking-tight">System Status</h3>
                            <span className="px-4 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[9px] font-black uppercase">Active Stream</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-8 rounded-3xl bg-black/20 border border-white/5">
                                <div className="text-4xl font-black text-white mb-2 italic">13 Hours</div>
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Lead Time gained</div>
                            </div>
                            <div className="p-8 rounded-3xl bg-black/20 border border-white/5">
                                <div className="text-4xl font-black text-white mb-2 italic">30%</div>
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Hospital Stay</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-16 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                © 2025 VitalMotion · Imagine Cup 2025
            </footer>
        </div>
    );
};

export default LandingPage;