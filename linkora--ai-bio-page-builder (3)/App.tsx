
import React, { useState, useCallback, useRef } from 'react';
import { UserProfile, LinkItem, ThemeId } from './types';
import { THEMES } from './constants';
import { Button } from './components/Button';
import { PreviewFrame } from './components/PreviewFrame';
import { generateBio, optimizeLinkTitle } from './services/geminiService';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  bio: '',
  profileImage: null,
  links: [],
  theme: ThemeId.MINIMAL
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioSuggestions, setBioSuggestions] = useState<string[]>([]);
  const [optimizingLinkId, setOptimizingLinkId] = useState<string | null>(null);
  
  // Payment & Verification States
  const [isVerified, setIsVerified] = useState(false);
  const [verificationInput, setVerificationInput] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      url: ''
    };
    updateProfile({ links: [...profile.links, newLink] });
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    const newLinks = profile.links.map(l => l.id === id ? { ...l, ...updates } : l);
    updateProfile({ links: newLinks });
  };

  const removeLink = (id: string) => {
    updateProfile({ links: profile.links.filter(l => l.id !== id) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiBio = async () => {
    if (!profile.name) {
      alert("Add a name or some keywords first!");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const suggestions = await generateBio(profile.name, "Creative and modern professional");
      setBioSuggestions(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleLinkOptimization = async (link: LinkItem) => {
    if (!link.url) return;
    setOptimizingLinkId(link.id);
    try {
      const optimizedTitle = await optimizeLinkTitle(link.url);
      updateLink(link.id, { title: optimizedTitle });
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizingLinkId(null);
    }
  };

  const handleVerifyPayment = () => {
    const validCodes = ["BASIC149", "PRO349", "PREMIUM1999"];
    if (validCodes.includes(verificationInput.toUpperCase())) {
      setIsVerified(true);
      alert("Payment Verified! You can now generate your public link.");
    } else {
      alert("Invalid Code! Please contact support if you have paid.");
    }
  };

  const handleGenerateLink = () => {
    if (!profile.name) {
      alert("Please enter a display name (username) first.");
      return;
    }
    const cleanName = profile.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const finalLink = `${window.location.origin}/u/${cleanName}`;
    setGeneratedUrl(finalLink);
  };

  const plans = [
    {
      name: "Basic",
      price: "₹149",
      duration: "1 Month",
      url: "upi://pay?pa=ubedshaikh300@okhdfcbank&pn=shaikhubed&am=149&cu=INR",
      color: "green",
      icon: "🥉"
    },
    {
      name: "Pro",
      price: "₹349",
      duration: "3 Months",
      url: "upi://pay?pa=ubedshaikh300@okhdfcbank&pn=shaikhubed&am=349&cu=INR",
      color: "blue",
      icon: "🥈"
    },
    {
      name: "Premium",
      price: "₹1999",
      duration: "1 Year",
      url: "upi://pay?pa=ubedshaikh300@okhdfcbank&pn=shaikhubed&am=1999&cu=INR",
      color: "orange",
      icon: "🥇"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 overflow-hidden">
      {/* Editor Side */}
      <div className="flex-1 overflow-y-auto h-screen p-4 lg:p-8 border-r border-gray-200 custom-scrollbar">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold font-outfit text-indigo-600 flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg">LL</span>
              LuminaLink
            </h1>
            <p className="text-gray-500 mt-2">Craft your unique AI-enhanced presence.</p>
          </div>
          <a 
            href="#plans" 
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-200 transition-all hover:-translate-y-0.5"
          >
            Upgrade Plan
          </a>
        </header>

        <div className="max-w-2xl space-y-8 pb-10">
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Profile Basics
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div 
                className="group relative w-24 h-24 bg-gray-100 rounded-full flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  CHANGE
                </div>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </div>
              
              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Display Name / Username</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    placeholder="@yourhandle"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-indigo-600 hover:bg-indigo-50"
                      onClick={handleAiBio}
                      isLoading={isGeneratingBio}
                    >
                      AI Suggest ✨
                    </Button>
                  </div>
                  <textarea 
                    value={profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tell the world who you are..."
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                  {bioSuggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {bioSuggestions.map((s, idx) => (
                        <button 
                          key={idx}
                          onClick={() => { updateProfile({ bio: s }); setBioSuggestions([]); }}
                          className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors text-left max-w-xs"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Verification & Link Section */}
          <section className="bg-gradient-to-br from-gray-900 to-indigo-950 p-6 rounded-2xl shadow-xl text-white">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r-.015.015V21a11.952 11.952 0 00-8.617-3.04L12 21.355z"/></svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold font-outfit">Payment Verification</h2>
                  <p className="text-xs text-indigo-300/70">Enter your plan code to unlock publishing.</p>
                </div>
             </div>

             {!isVerified ? (
               <div className="space-y-4">
                 <div className="flex gap-2">
                    <input 
                      type="text"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      placeholder="Enter your Plan Code"
                      className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none text-white placeholder:text-white/30"
                    />
                    <Button onClick={handleVerifyPayment} className="bg-indigo-500 hover:bg-indigo-600 border-none px-6">
                      Verify
                    </Button>
                 </div>
                 <p className="text-[10px] text-white/40 italic">Don't have a code? Purchase a plan below or contact support.</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="bg-indigo-500/20 p-4 rounded-xl border border-indigo-500/30 flex items-center gap-4">
                    <div className="bg-indigo-500 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-200">Payment Verified Successfully!</p>
                      <p className="text-[11px] text-indigo-300/60">Verification code accepted. Unlimited publishing active.</p>
                    </div>
                 </div>

                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                     <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                     Generate Public Link
                   </h3>
                   <div className="flex gap-2">
                      <Button onClick={handleGenerateLink} className="w-full bg-white text-gray-900 hover:bg-gray-100">
                        Generate Final Link
                      </Button>
                   </div>
                   {generatedUrl && (
                     <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 break-all">
                       <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Your Live URL:</p>
                       <a href={generatedUrl} target="_blank" className="text-indigo-400 font-medium hover:underline text-sm">
                         {generatedUrl}
                       </a>
                       <button 
                        onClick={() => { navigator.clipboard.writeText(generatedUrl); alert('Link copied!'); }}
                        className="ml-2 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded"
                       >
                         Copy
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             )}
          </section>

          {/* Links Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Links & Portfolios
              </h2>
              <Button onClick={addLink} size="sm" className="rounded-full">
                + Add New Link
              </Button>
            </div>

            <div className="space-y-4">
              {profile.links.map((link) => (
                <div key={link.id} className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 relative transition-all hover:shadow-md">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, { title: e.target.value })}
                          placeholder="Title (e.g. My Website)"
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleLinkOptimization(link)}
                          isLoading={optimizingLinkId === link.id}
                        >
                          AI ✨
                        </Button>
                      </div>
                      <input 
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => removeLink(link.id)}
                      className="text-gray-300 hover:text-red-500 p-1 transition-colors self-start"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {profile.links.length === 0 && (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  Your links will show up here.
                </div>
              )}
            </div>
          </section>

          {/* Theme Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Aesthetics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(Object.values(THEMES)).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateProfile({ theme: theme.id })}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    profile.theme === theme.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-inner' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full aspect-square rounded-lg mb-2 ${theme.bgClass} flex items-center justify-center`}>
                    <div className={`w-2/3 h-2 rounded ${theme.buttonClass}`}></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight truncate block">{theme.name}</span>
                  {profile.theme === theme.id && (
                    <div className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="plans" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
            <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2 font-outfit">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Choose Your Plan
            </h2>
            <p className="text-sm text-gray-400 mb-8">Unlock premium features and AI limits.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const colors = {
                  green: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
                  blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
                  orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100"
                };
                const btnColors = {
                  green: "bg-emerald-600 hover:bg-emerald-700",
                  blue: "bg-blue-600 hover:bg-blue-700",
                  orange: "bg-orange-600 hover:bg-orange-700"
                };
                
                return (
                  <div key={plan.name} className={`flex flex-col p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] ${colors[plan.color as keyof typeof colors]}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-2xl">{plan.icon}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/50">{plan.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold font-outfit">{plan.name}</h3>
                    <div className="mt-1 mb-6">
                      <span className="text-2xl font-black">{plan.price}</span>
                      <span className="text-xs opacity-70 ml-1">total</span>
                    </div>
                    <a 
                      href={plan.url}
                      className={`mt-auto text-center py-2.5 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-95 ${btnColors[plan.color as keyof typeof btnColors]}`}
                    >
                      Get {plan.name}
                    </a>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-6 text-gray-400 text-xs font-medium">
               <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  Custom Domains
               </div>
               <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  Advanced Analytics
               </div>
               <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  No Watermark
               </div>
            </div>
          </section>

          {/* Support Footer */}
          <footer className="mt-12 py-8 border-t border-gray-200 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-400 font-medium">Need help or direct support?</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-transform hover:scale-105">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:ubeds@gmail.com" className="text-indigo-600 font-bold hover:underline text-sm">Email Support</a>
              </div>
              
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm transition-transform hover:scale-105">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <a href="https://www.instagram.com/ubedd_0?igsh=MXE5OXhicnA4azgxaw==" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline text-sm">DM on Instagram</a>
              </div>
            </div>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold mt-4">LuminaLink Support System</p>
          </footer>
        </div>
      </div>

      {/* Preview Side */}
      <div className="lg:w-[450px] bg-gray-100 h-screen flex flex-col items-center justify-center p-8 sticky top-0">
        <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm">
          Live Preview
        </div>
        <PreviewFrame profile={profile} />
        <div className="mt-8 flex gap-4">
          <Button variant="secondary" className="shadow-lg">
            Share Page
          </Button>
          <Button className={`shadow-lg border-none px-8 ${isVerified ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-black opacity-50 cursor-not-allowed'}`}>
            {isVerified ? 'Publish Live' : 'Verify to Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}
