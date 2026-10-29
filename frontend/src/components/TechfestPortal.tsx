'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Compass, 
  Mic, 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X,
  ChevronRight,
  Calendar,
  MapPin,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';

export default function TechfestPortal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Pillars / Category Grid Data
  const pillars = [
    {
      id: 'competitions',
      title: 'Competitions',
      tag: 'Flagship Tracks',
      desc: 'Compete across robotics, algorithmic coding, web3, and autonomous AI challenges for prestigious awards.',
      icon: Trophy,
      count: '12+ Tracks'
    },
    {
      id: 'workshops',
      title: 'Technical Workshops',
      tag: 'Hands-on Learning',
      desc: 'Master cloud architecture, agentic AI, embedded microservices, and quantum computing with industry leaders.',
      icon: Cpu,
      count: '15+ Sessions'
    },
    {
      id: 'exhibitions',
      title: 'Global Expo',
      tag: 'Futuristic Tech',
      desc: 'Experience groundbreaking technological innovations, humanoid robotics, and aerospace defense prototypes.',
      icon: Compass,
      count: '40+ Exhibits'
    },
    {
      id: 'lectures',
      title: 'Keynote Lectures',
      tag: 'Thought Leadership',
      desc: 'Engage with Nobel Laureates, Turing Award winners, global tech founders, and visionary innovators.',
      icon: Mic,
      count: '8 Speakers'
    },
    {
      id: 'hackathons',
      title: '24-Hour Hackathon',
      tag: 'Build & Deploy',
      desc: 'Build real-time AI agents, IoT solutions, and cloud systems to solve critical real-world problem statements.',
      icon: Terminal,
      count: '₹5L Prize Pool'
    },
    {
      id: 'ai-summit',
      title: 'AI & Robotics Summit',
      tag: 'Emerging Tech',
      desc: 'Explore real-time digital twins, neural computing, and autonomous system reliability architecture.',
      icon: Sparkles,
      count: 'Special Event'
    }
  ];

  // Stats Bar Data
  const stats = [
    { value: '50,000+', label: 'Global Footfall' },
    { value: '₹15,00,000+', label: 'Total Prize Pool' },
    { value: '120+', label: 'Partner Colleges' },
    { value: '45+', label: 'Tech Sessions' }
  ];

  const navLinks = [
    { name: 'Competitions', href: '#competitions' },
    { name: 'Workshops', href: '#workshops' },
    { name: 'Exhibitions', href: '#exhibitions' },
    { name: 'Keynotes', href: '#lectures' },
    { name: 'Hackathons', href: '#hackathons' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0907] text-[#E5E4E2] font-sans selection:bg-[#6F4E37]/40 selection:text-[#E6E0F0] relative overflow-hidden">
      
      {/* Dynamic Background Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#6F4E37]/25 via-[#E6E0F0]/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#6F4E37]/15 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#6F4E37]/10 blur-[150px] pointer-events-none -z-10 rounded-full" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
        style={{ backgroundImage: `radial-gradient(#E5E4E2 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0D0907]/80 backdrop-blur-md border-b border-[#E5E4E2]/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-[#6F4E37]/20 border border-[#6F4E37]/50 flex items-center justify-center text-[#E6E0F0] group-hover:scale-105 group-hover:border-[#6F4E37] transition duration-300 shadow-lg shadow-[#6F4E37]/20">
              <Zap className="w-5 h-5 text-[#E6E0F0]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-[#E5E4E2] font-mono group-hover:text-white transition">
                TECHFEST<span className="text-[#6F4E37] font-sans">2026</span>
              </span>
              <span className="text-[10px] text-[#E5E4E2]/50 block tracking-widest uppercase font-semibold">
                Annual Tech Conclave
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#E5E4E2]/70 hover:text-white transition hover:scale-105 duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#register"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#6F4E37] to-[#8D6246] hover:from-[#7C573D] hover:to-[#9F6F50] text-[#E5E4E2] text-xs font-bold tracking-wider uppercase transition shadow-md shadow-[#6F4E37]/30 hover:shadow-lg hover:shadow-[#6F4E37]/40 active:scale-95"
            >
              Register Now
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#6F4E37]/20 text-[#E5E4E2] border border-[#6F4E37]/30 hover:border-[#6F4E37] transition"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0D0907]/95 border-b border-[#E5E4E2]/10 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#E5E4E2]/80 hover:text-white text-base font-medium py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#E5E4E2]/10">
              <a
                href="#register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center py-3 rounded-lg bg-[#6F4E37] text-white text-xs font-bold uppercase tracking-wider"
              >
                Register Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-6">
        
        {/* Event Meta Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#6F4E37]/20 border border-[#6F4E37]/40 text-[#E6E0F0] text-xs font-semibold tracking-wider uppercase backdrop-blur-md animate-pulse">
          <Calendar className="w-3.5 h-3.5 text-[#E6E0F0]" />
          <span>December 18 - 20, 2026</span>
          <span className="text-[#E5E4E2]/40">•</span>
          <MapPin className="w-3.5 h-3.5 text-[#E6E0F0]" />
          <span>Campus Arena & Virtual Metaverse</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#E5E4E2] max-w-5xl mx-auto leading-[1.1]">
          Engineering Tomorrow’s <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6E0F0] via-[#D3B8AE] to-[#6F4E37]">
            Technological Frontier
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#E5E4E2]/70 max-w-2xl mx-auto font-normal leading-relaxed">
          Join 50,000+ innovators, researchers, and engineers at Asia’s premier science and technology festival. Experience autonomous robotics, neural interfaces, and competitive hackathons.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#competitions"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6F4E37] via-[#7F573D] to-[#99694B] text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#6F4E37]/30 hover:scale-105 transition duration-300 flex items-center justify-center space-x-2"
          >
            <span>Explore All Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#hackathons"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0D0907]/60 hover:bg-[#6F4E37]/20 text-[#E5E4E2] border border-[#E5E4E2]/20 font-bold text-sm tracking-wider uppercase transition duration-300 flex items-center justify-center space-x-2"
          >
            <Terminal className="w-4 h-4 text-[#E6E0F0]" />
            <span>Join 24h Hackathon</span>
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 my-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0D0907]/60 border border-[#E5E4E2]/10 backdrop-blur-xl shadow-2xl">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center p-3">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#E6E0F0] font-mono tracking-tight">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-[#E5E4E2]/60 uppercase tracking-wider font-semibold mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars / Categories Grid */}
      <section id="competitions" className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#6F4E37] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#E6E0F0]" />
              <span>Festival Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5E4E2] tracking-tight">
              Flagship Domains & Tracks
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#E5E4E2]/60 max-w-md">
            Dive into specialized tracks designed to challenge foundational knowledge and push boundary breakthroughs.
          </p>
        </div>

        {/* 6-Card Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isHovered = selectedPillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setSelectedPillar(pillar.id)}
                onMouseLeave={() => setSelectedPillar(null)}
                className={`group relative p-7 rounded-2xl bg-[#0D0907]/70 border transition-all duration-300 backdrop-blur-sm cursor-pointer flex flex-col justify-between ${
                  isHovered 
                    ? 'border-[#6F4E37] shadow-xl shadow-[#6F4E37]/20 -translate-y-1.5' 
                    : 'border-[#E5E4E2]/10 hover:border-[#6F4E37]/50'
                }`}
              >
                {/* Subtle Gradient Glow inside Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6F4E37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="space-y-4">
                  {/* Icon & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#6F4E37]/20 border border-[#6F4E37]/40 flex items-center justify-center text-[#E6E0F0] group-hover:scale-110 group-hover:bg-[#6F4E37]/30 transition duration-300">
                      <Icon className="w-6 h-6 text-[#E6E0F0]" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5E4E2]/5 text-[#E5E4E2]/80 border border-[#E5E4E2]/10 group-hover:border-[#6F4E37]/40">
                      {pillar.count}
                    </span>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#E6E0F0]/70 block mb-1">
                      {pillar.tag}
                    </span>
                    <h3 className="text-xl font-bold text-[#E5E4E2] group-hover:text-white transition">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#E5E4E2]/65 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="pt-6 mt-6 border-t border-[#E5E4E2]/10 flex items-center justify-between text-xs font-bold text-[#E6E0F0] group-hover:text-white transition">
                  <span>Explore Track Guidelines</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Hackathon Spotlight Banner */}
      <section id="hackathons" className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#6F4E37]/40 bg-gradient-to-r from-[#6F4E37]/30 via-[#0D0907]/90 to-[#6F4E37]/20 backdrop-blur-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#6F4E37] text-white uppercase tracking-widest inline-flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Flagship Hackathon
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-[#E5E4E2] tracking-tight">
              24-Hour Autonomous Agents Hackathon
            </h3>
            <p className="text-sm text-[#E5E4E2]/75 leading-relaxed">
              Form squads of up to 4 engineers. Build production-grade generative agents, verifiable compliance systems, or distributed cloud meshes with direct mentorship from industry architects.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <a
                href="#register"
                className="px-6 py-3 rounded-xl bg-white text-[#0D0907] font-bold text-xs uppercase tracking-wider hover:bg-[#E5E4E2] transition shadow-lg shadow-white/10"
              >
                Apply for Hackathon
              </a>
              <span className="text-xs text-[#E5E4E2]/60 font-mono">
                Prize Pool: <strong className="text-white">₹5,00,000 + Venture Grants</strong>
              </span>
            </div>
          </div>

          {/* Decorative Background Code Element */}
          <div className="absolute right-4 bottom-[-20px] opacity-10 hidden lg:block font-mono text-xs select-none pointer-events-none text-[#E6E0F0]">
            <pre>{`// Autonomous Verification Loop
async function auditAgent(stream) {
  const verdict = await verifyClaims(stream);
  return verdict.authorized ? publish() : rollback();
}`}</pre>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E5E4E2]">
          Ready to Test Your Engineering Limits?
        </h2>
        <p className="text-sm text-[#E5E4E2]/70 max-w-xl mx-auto">
          Passports granting full access to competition tracks, global exhibitions, and keynote lectures are now open.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your student or enterprise email"
            className="w-full px-4 py-3 rounded-xl bg-[#0D0907] border border-[#E5E4E2]/20 text-xs text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 focus:outline-none focus:border-[#6F4E37] transition"
          />
          <button className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl bg-[#6F4E37] hover:bg-[#7F573D] text-white text-xs font-bold uppercase tracking-wider transition">
            Claim Pass
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E4E2]/10 bg-[#0D0907] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#E5E4E2]/50">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-[#E5E4E2]">TECHFEST 2026</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#competitions" className="hover:text-white transition">Rulebook</a>
            <a href="#workshops" className="hover:text-white transition">Schedule</a>
            <a href="#register" className="hover:text-white transition">Passports</a>
            <a href="#privacy" className="hover:text-white transition">Code of Conduct</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

