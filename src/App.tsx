import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { client } from './sanityClient';
import { 
  Laptop, Mail, BookOpen, ShieldCheck, LifeBuoy, 
  Menu, X, ExternalLink, Download, ArrowRight,
  MonitorPlay, FileText, AlertTriangle, Phone, ChevronDown, Globe, GraduationCap, ChevronRight,
  Wifi, Zap, Sparkles, HelpCircle, MessageSquare
} from 'lucide-react';

// --- DATA ---
const SECTIONS = [
  { id: 'start', title: 'The Digital Front Door', icon: <Globe className="w-5 h-5" /> },
  { id: 'videos', title: 'Video Training Vault', icon: <MonitorPlay className="w-5 h-5" /> },
  { id: 'email', title: 'Official Email', icon: <Mail className="w-5 h-5" /> },
  { id: 'lms', title: 'Mastering Moodle LMS', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'seb', title: 'Safe Exam Browser', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'support', title: 'IT Support & Helpdesk', icon: <LifeBuoy className="w-5 h-5" /> },
  { id: 'faq', title: 'FAQ & Knowledge Base', icon: <HelpCircle className="w-5 h-5" /> },
];

const FAQS = [
  {
    q: "How do I log in to the LMS for my classes?",
    a: "Go to the main website (east.university), click the 'LMS' button, and log in using the username and password provided by the IT Department."
  },
  {
    q: "What is the official student email format?",
    a: "Your official email is formatted as name1.name2@students.east.ac.ke. You must use this for all official university communication and resources."
  },
  {
    q: "I forgot my password or can't log in. What do I do?",
    a: "First, search the Official Knowledge Base using the link above. If that doesn't fix it, email ictsupport@east.ac.ke or officially raise a support ticket. Include your student ID and a screenshot of the error!"
  },
  {
    q: "Can I use my phone for online exams?",
    a: "No. You must use a Windows 11 or macOS laptop/desktop with a working camera. You are required to download and install the Safe Exam Browser (SEB) to take secure exams."
  },
  {
    q: "How do I attend online classes?",
    a: "Look for the BigBlueButton (BBB) icon inside your LMS course. Click 'Join Session', allow microphone and camera permissions, and you are in!"
  },
  {
    q: "Who do I contact for urgent campus IT help?",
    a: "Reach out to your lead IT facilitators: Dancan & Brian (Kitengela Campus) or Eugene (Buruburu & Online Campus)."
  },
  {
    q: "Where can I find my academic results?",
    a: "Academic information and results are hosted on the School Portal at https://kageu.edumaat.net/."
  }
];

const PDFS = [
  { name: 'Access Learning Resources on LMS.pptx', size: '2.4 MB' },
  { name: 'Safe Exam Browser Training.pdf', size: '2.5 MB' },
  { name: 'Accessing LMS for Students.pptx', size: '3.1 MB' }
];

// --- COMPONENTS ---

// Alive Emoji for that "living" feel
function AliveEmoji({ emoji, delay = 0 }: { emoji: string, delay?: number }) {
  return (
    <motion.span 
      className="inline-block"
      animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 4, delay, ease: "easeInOut" }}
    >
      {emoji}
    </motion.span>
  );
}

function QuoteCard({ quote, emoji }: { quote: string, emoji: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="my-6 p-4 bg-gradient-to-br from-east-gold/20 to-amber-100/10 backdrop-blur-md border border-east-gold/30 rounded-2xl shadow-sm flex items-start gap-4 italic text-slate-700 font-medium"
    >
      <AliveEmoji emoji={emoji} />
      <p>"{quote}"</p>
    </motion.div>
  );
}

function CollapsibleStep({ step, title, children, defaultOpen = false }: { step: number | string, title: string, children: ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <motion.div 
      initial={false}
      className="mb-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 transition-colors text-left border-b border-white/30"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-east-navy to-east-blue text-white font-black text-sm shadow-inner">
            {step}
          </span>
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-3 text-slate-600 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- MAIN APP ---

export default function App() {
  const [activeSection, setActiveSection] = useState('start');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from Sanity
  useEffect(() => {
    async function fetchData() {
      try {
        const faqData = await client.fetch(`*[_type == "faq"] | order(order asc)`);
        const videoData = await client.fetch(`*[_type == "video"] | order(order asc)`);
        const announceData = await client.fetch(`*[_type == "announcement" && isActive == true][0]`);
        
        if (faqData && faqData.length > 0) {
          setFaqs(faqData.map((f: any) => ({ q: f.question, a: f.answer })));
        } else {
          setFaqs(FAQS); // Fallback to hardcoded if database is empty
        }

        if (videoData && videoData.length > 0) {
          setVideos(videoData);
        }

        if (announceData) {
          setAnnouncement(announceData);
        }
      } catch (error) {
        console.error("Sanity fetch error:", error);
        setFaqs(FAQS); // Fallback on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Smooth scroll
  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { threshold: 0.4, rootMargin: "-80px 0px 0px 0px" });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Download simulation
  const handleDownload = (name: string) => {
    const btn = document.getElementById(`btn-${name.replace(/\s+/g, '-')}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="animate-spin inline-block w-4 h-4 border-2 border-east-blue border-t-transparent rounded-full mr-2"></span> Opening...`;
      
      // Attempt to open the file from the public/manuals folder
      setTimeout(() => {
        btn.innerHTML = originalText;
        const fileUrl = `./manuals/${name}`;
        window.open(fileUrl, '_blank');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex font-sans selection:bg-east-gold selection:text-east-navy relative overflow-x-hidden text-[15px] leading-relaxed">
      
      {/* PREMIUM BACKGROUND BLOBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full bg-east-blue/10 blur-[140px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-east-gold/15 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] right-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/10 blur-[150px]"></div>
        {/* Subtle dot pattern overlay for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex flex-col w-[280px] fixed top-0 left-0 bottom-0 bg-east-navy/95 backdrop-blur-3xl text-slate-300 z-50 border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="flex -space-x-1 items-center justify-center bg-white/10 p-2 rounded-xl border border-white/20">
               <span className="text-2xl"><AliveEmoji emoji="🦁" /></span>
               <span className="text-xl -ml-2 z-10"><AliveEmoji emoji="🎓" delay={1} /></span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-2xl leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-east-gold">
                EAST
              </h1>
              <span className="text-[0.6rem] leading-none mt-1 opacity-90 tracking-[0.2em] font-semibold text-east-gold">UNIVERSITY</span>
            </div>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-6 border-b border-white/10 pb-4">
            Digital Campus Guide '26
          </p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4 custom-scrollbar">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold relative overflow-hidden group ${
                activeSection === section.id 
                ? 'text-white shadow-lg bg-white/10' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {activeSection === section.id && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-east-blue to-east-navy opacity-80" />
              )}
              <span className="relative z-10">{section.icon}</span>
              <span className="relative z-10">{section.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-east-blue/20 to-slate-800/50 rounded-2xl p-5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-east-gold/20 rounded-full blur-xl"></div>
            <p className="mb-2 text-xs font-bold text-white relative z-10">Stuck in the Matrix?</p>
            <a href="https://support.east.ac.ke/ostic/open.php" target="_blank" rel="noreferrer" className="text-east-gold hover:text-white font-medium flex items-center gap-2 text-sm relative z-10 transition-colors">
              Raise a Ticket <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-east-navy/90 backdrop-blur-2xl text-white flex items-center justify-between px-5 z-50 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
           <div className="flex items-center justify-center bg-white/10 p-1.5 rounded-lg border border-white/20">
               <span className="text-lg leading-none">🦁</span>
           </div>
          <span className="font-display font-bold tracking-wide text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-east-gold">EAST Guide</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors active:scale-95"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* PREMIUM MOBILE MENU overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-east-navy/95 backdrop-blur-3xl p-6 z-40 overflow-y-auto"
          >
            <div className="flex flex-col space-y-3 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">Navigation</p>
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                    activeSection === section.id 
                    ? 'bg-gradient-to-r from-east-blue to-east-navy text-white shadow-lg border border-white/10' 
                    : 'bg-white/5 text-slate-300 border border-white/5 active:bg-white/10'
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
            <div className="mt-12 p-6 bg-gradient-to-br from-east-gold/20 to-transparent rounded-3xl border border-east-gold/30 flex flex-col items-center text-center">
              <span className="text-4xl mb-3"><AliveEmoji emoji="🛠️" /></span>
              <p className="text-white font-bold mb-1">Need IT Rescue?</p>
              <p className="text-slate-300 text-sm mb-4">Don't let tech issues ruin your vibe.</p>
              <a href="https://support.east.ac.ke/ostic/open.php" target="_blank" rel="noreferrer" className="bg-east-gold text-east-navy px-6 py-3 rounded-full font-bold text-sm w-full shadow-lg hover:shadow-east-gold/50 transition-shadow">
                Open Support Ticket
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[280px] pt-16 md:pt-0 relative z-10 min-w-0">
        <div className="max-w-[800px] mx-auto px-5 sm:px-10 pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-10 md:py-16 mt-4 sm:mt-10"
          >
             <div className="bg-white/60 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-east-gold to-orange-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                <div className="absolute top-6 right-6 text-5xl md:text-7xl opacity-10 transform rotate-12 pointer-events-none transition-transform duration-700 group-hover:rotate-0"><AliveEmoji emoji="🦒" /></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-east-navy/5 text-east-navy font-bold text-xs uppercase tracking-widest mb-6 border border-east-navy/10">
                  <Sparkles className="w-3 h-3 text-east-gold" /> Freshers '26
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-east-navy mb-4 tracking-tight leading-[1.1]">
                  Karibu <span className="text-transparent bg-clip-text bg-gradient-to-r from-east-blue to-east-gold">EAST!</span> <AliveEmoji emoji="👋🏾" />
                </h1>
                <p className="text-slate-600 md:text-xl font-medium max-w-xl leading-relaxed">
                  Starting university is a massive achievement. If the online campus feels like a maze right now, don't panic. Consider this web app your map. <strong className="text-east-navy font-bold">The blindfold is off.</strong> Let's get you set up.
                </p>
             </div>
          </motion.div>

          {/* SEC 1: Front Door */}
          <section id="start" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-east-blue to-indigo-600 text-white flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-2xl"><AliveEmoji emoji="📌" /></span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800 tracking-tight">
                   The Digital Front Door
                 </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                You don't need to memorize a hundred different links. Your entire digital journey starts at exactly one place. Bookmark it now.
              </p>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                  <div>
                    <p className="text-east-gold text-xs uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> The Main Hub
                    </p>
                    <a href="https://east.university" target="_blank" rel="noreferrer" className="text-3xl md:text-4xl font-display font-black text-east-navy hover:text-east-blue transition-colors group flex items-center gap-3">
                      east.university 
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-east-blue group-hover:text-white transition-all transform group-hover:translate-x-2">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                    </a>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'School Portal', desc: 'Admissions & Fees', url: 'https://portal.east.ac.ke/', icon: '🏛️' },
                    { name: 'E-Learning (LMS)', desc: 'Your Digital Classroom', url: 'https://elearning.east.ac.ke/', icon: '💻' },
                    { name: 'E-Library', desc: 'MyLOFT Research', url: 'https://elibrary.east.university/', icon: '📚' },
                    { name: 'ICT Support', desc: 'Get tech rescue', url: 'https://support.east.ac.ke/ostic/open.php', icon: '🛟' }
                  ].map((link, idx) => (
                    <motion.a 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      key={link.name} 
                      href={link.url} 
                      target="_blank"
                      rel="noreferrer" 
                      className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/80 hover:bg-white hover:shadow-xl hover:shadow-east-blue/5 border border-slate-100 transition-all group"
                    >
                      <div className="text-3xl bg-white p-2 rounded-xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                        {link.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 group-hover:text-east-blue transition-colors">{link.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{link.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-east-blue transform group-hover:translate-x-1 transition-all mt-1" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <QuoteCard quote="The portal is our village square. Everything happens here, comrade." emoji="🛖" />
            </motion.div>
          </section>

          {/* SEC: Videos */}
          <section id="videos" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-2xl"><AliveEmoji emoji="🎥" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  Video Training Vault
                </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 font-medium italic">
                "Kindly watch these step-by-step guides to ensure a smooth journey this semester." 🎓✨
              </p>

              <div className="grid gap-6">
                {/* Dynamic Videos from Admin Hub */}
                {(!loading && videos.length > 0) ? (
                  <>
                    {/* Featured/Embedded Video (the first one marked as isEmbedded) */}
                    {videos.filter(v => v.isEmbedded).slice(0, 1).map((video, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl border border-white overflow-hidden group">
                        <div className="aspect-video w-full bg-slate-900 rounded-[1.8rem] overflow-hidden relative shadow-inner">
                           <iframe 
                              src={video.url} 
                              className="absolute inset-0 w-full h-full border-0"
                              allow="autoplay"
                              title={video.title}
                           ></iframe>
                        </div>
                        <div className="p-6">
                           <h3 className="text-xl font-black text-east-navy mb-2 flex items-center gap-2">
                             <GraduationCap className="w-5 h-5 text-east-gold" /> {video.title}
                           </h3>
                           <p className="text-slate-500 text-sm font-medium">{video.description}</p>
                        </div>
                      </div>
                    ))}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {videos.filter(v => !v.isEmbedded || videos.filter(ev => ev.isEmbedded).indexOf(v) > 0).map((video, idx) => (
                        <motion.a
                          key={idx}
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ y: -5 }}
                          className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-east-blue/5 transition-all flex flex-col gap-4 group"
                        >
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-pink-600'} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            {idx % 2 === 0 ? <Mail className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 group-hover:text-east-blue transition-colors">{video.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{video.description}</p>
                          </div>
                          <div className="mt-auto pt-4 flex items-center gap-2 text-east-blue font-black text-[10px] uppercase tracking-widest">
                            Watch Video <ExternalLink className="w-3 h-3" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Fallback Static Videos */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl border border-white overflow-hidden group">
                      <div className="aspect-video w-full bg-slate-900 rounded-[1.8rem] overflow-hidden relative shadow-inner">
                         <iframe 
                            src="https://drive.google.com/file/d/1H6blCFajEYmEpKJZo16VTKVOX8olZK2j/preview" 
                            className="absolute inset-0 w-full h-full border-0"
                            allow="autoplay"
                            title="KAG EAST Orientation Video"
                         ></iframe>
                      </div>
                      <div className="p-6">
                         <h3 className="text-xl font-black text-east-navy mb-2 flex items-center gap-2">
                           <GraduationCap className="w-5 h-5 text-east-gold" /> Master Orientation Guide
                         </h3>
                         <p className="text-slate-500 text-sm font-medium">Your complete roadmap to the KAG EAST digital experience.</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { 
                          title: "Email & Portal Login", 
                          desc: "How to access student email & register units.", 
                          url: "https://rb.gy/rx5hq9",
                          icon: <Mail className="w-5 h-5" />,
                          color: "from-blue-500 to-indigo-600"
                        },
                        { 
                          title: "LMS & Online Classes", 
                          desc: "Mastering Moodle & BigBlueButton classes.", 
                          url: "https://rebrand.ly/wym00kj",
                          icon: <BookOpen className="w-5 h-5" />,
                          color: "from-purple-500 to-pink-600"
                        }
                      ].map((video, idx) => (
                        <motion.a
                          key={idx}
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ y: -5 }}
                          className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-east-blue/5 transition-all flex flex-col gap-4 group"
                        >
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${video.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            {video.icon}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 group-hover:text-east-blue transition-colors">{video.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{video.desc}</p>
                          </div>
                          <div className="mt-auto pt-4 flex items-center gap-2 text-east-blue font-black text-[10px] uppercase tracking-widest">
                            Watch Video <ExternalLink className="w-3 h-3" />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <QuoteCard quote="Kindly take time to go through these carefully. Knowledge is the first step to transformation!" emoji="📚" />
            </motion.div>
          </section>

          {/* SEC 2: Email */}
          <section id="email" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg transform rotate-6">
                    <span className="text-2xl"><AliveEmoji emoji="🦉" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  Your Academic Passport
                </h2>
              </div>
              
              <div className="bg-gradient-to-br from-east-navy to-[#152a42] text-white p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-east-gold/30 rounded-full blur-3xl group-hover:bg-east-blue/40 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-8 h-8 text-east-gold" />
                    <h3 className="text-xl font-bold text-slate-100">Official Student Email</h3>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl mb-6 shadow-inner">
                    <p className="text-sm text-slate-400 font-medium mb-2">Standard Format:</p>
                    <p className="text-lg md:text-2xl font-mono text-white break-all flex items-center flex-wrap gap-x-2">
                      <span>firstname.lastname</span>
                      <span className="text-east-gold font-bold bg-east-gold/10 px-2 py-1 rounded-lg">@students.east.ac.ke</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-start bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                     <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                       <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                       <p className="font-bold text-emerald-300 mb-1">MANDATORY NOTICE</p>
                       <p className="text-emerald-100/80 text-sm leading-relaxed">
                         This email is required for all official communication, accessing educational resources, and receiving urgent campus notifications. <strong>Make it a habit to check it daily!</strong>
                       </p>
                     </div>
                  </div>
                </div>
              </div>
              
              <QuoteCard quote="Coffee, Chai & your official Student Email. The holy trinity of a campus morning." emoji="☕" />
            </motion.div>
          </section>

          {/* SEC 3: Moodle */}
          <section id="lms" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg transform -rotate-3">
                    <span className="text-2xl"><AliveEmoji emoji="🧑🏾‍💻" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  Mastering the LMS
                </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                The Learning Management System is your digital classroom. Let's make sure you don't get lost in the sauce.
              </p>

              <div className="space-y-4">
                <CollapsibleStep step={1} title="Logging In & Finding Classes" defaultOpen={true}>
                  <div className="relative pl-6 border-l-2 border-east-gold/30 space-y-6 pb-2">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-3 h-3 bg-white border-2 border-east-gold rounded-full"></div>
                      <p className="text-slate-700"><strong className="text-east-navy">Step 1:</strong> Go to <a href="https://east.university" className="text-east-blue font-bold hover:underline">east.university</a> and click the LMS icon.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-3 h-3 bg-white border-2 border-east-gold rounded-full"></div>
                      <p className="text-slate-700"><strong className="text-east-navy">Step 2:</strong> Log in using the Username and Password provided by the IT Department.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-3 h-3 bg-east-gold rounded-full shadow-[0_0_10px_rgba(243,145,33,0.5)]"></div>
                      <p className="text-slate-700"><strong className="text-east-navy">Step 3:</strong> Navigate to <strong>"My Courses"</strong> to see all the units you are enrolled in.</p>
                    </div>
                  </div>
                </CollapsibleStep>
                
                <CollapsibleStep step={2} title="Downloading Notes & Resources">
                  <p className="mb-4 text-slate-700">Lecturers will upload notes in PDF, DOCX, or PPTX formats. Here is the trick:</p>
                  
                  {/* Visual Simulator */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 font-sans text-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">LMS Preview</div>
                    <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg cursor-pointer group">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div className="flex-1">
                        <p className="text-blue-600 group-hover:underline font-medium relative inline-block">
                          Introduction_to_Computing_Week1.pdf
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                            className="absolute -right-8 top-1 text-east-gold"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </p>
                        <p className="text-slate-400 text-xs">1.2 MB PDF Document</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50/80 backdrop-blur-md text-blue-900 p-4 rounded-xl flex gap-3 font-medium border border-blue-100 shadow-sm">
                    <span className="text-xl">💡</span>
                    <p><strong>Do not click on the blank space.</strong> Click directly on the text/link right next to the file icon. It will automatically download.</p>
                  </div>
                </CollapsibleStep>

                <CollapsibleStep step={3} title="Live Classes (BigBlueButton) 🔴">
                  <div className="space-y-5">
                    <p className="text-slate-700">The BigBlueButton (BBB) is our customized online learning platform. When you see the blue <strong>'b'</strong> icon, a live class is scheduled.</p>
                    
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-7xl opacity-5"><AliveEmoji emoji="🪤" /></div>
                      <h4 className="font-black text-red-700 mb-3 flex items-center gap-2 uppercase tracking-wide text-sm">
                        <AlertTriangle className="w-5 h-5" /> The Audio Trap
                      </h4>
                      <p className="text-red-900/80 font-medium mb-4">When joining, you will be prompted with two options. If you choose wrong, you will be a ghost in class.</p>
                      
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-white border-2 border-green-500 rounded-xl p-3 text-center shadow-sm relative">
                          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"></motion.div>
                          <span className="text-2xl block mb-1">🎤</span>
                          <p className="font-bold text-green-700 text-sm">Microphone</p>
                          <p className="text-[10px] text-green-600 mt-1 uppercase font-bold">Must Click This</p>
                        </div>
                        <div className="flex-1 bg-slate-100 border-2 border-slate-300 rounded-xl p-3 text-center opacity-50 grayscale">
                          <span className="text-2xl block mb-1">🎧</span>
                          <p className="font-bold text-slate-500 text-sm">Listen Only</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Do not click</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-red-800 bg-red-100/50 p-3 rounded-lg font-medium border border-red-200">
                        Your browser will immediately ask for permission. You <strong>MUST click "Allow"</strong> every single time!
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 flex items-center gap-2 bg-slate-100 p-3 rounded-xl font-medium">
                      <MonitorPlay className="w-5 h-5 text-east-blue"/> 
                      <span><strong>Missed a class?</strong> Don't stress. Recorded classes are under "Presentation" in the online class menu.</span>
                    </p>
                  </div>
                </CollapsibleStep>

                <CollapsibleStep step={4} title="Submitting Assignments 📝">
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        { title: "Download the Task", desc: "Click the assignment link (usually highlighted orange) to download the instructions." },
                        { title: "Do the Work", desc: "Complete the assignment offline on your computer. Take your time, do your research." },
                        { title: "Upload", desc: "Return to the LMS assignment page and click the 'Add Submission' button." },
                        { title: "Select File", desc: "Choose the completed file from your computer and click 'Upload this file'." }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-east-navy text-white font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{step.title}</p>
                            <p className="text-slate-600 text-xs mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
                      <h4 className="font-black text-amber-900 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> THE FINAL TRAP
                      </h4>
                      <p className="text-amber-800 text-sm font-medium">
                        You are not done yet! You <strong className="bg-amber-200 px-1 rounded">MUST click "Save Changes"</strong> to finalize your submission. If you don't, it remains a draft and late submissions are heavily penalized!
                      </p>
                    </div>
                  </div>
                </CollapsibleStep>
              </div>
              
              <QuoteCard quote="Searching for that 'b' icon like a pro detective. FOUND IT! 🕵🏾‍♂️" emoji="🔍" />
            </motion.div>
          </section>

          {/* SEC 4: SEB */}
          <section id="seb" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-2xl"><AliveEmoji emoji="🦏" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  Safe Exam Browser
                </h2>
              </div>
              
              <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2rem] shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-900 to-slate-900 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <h3 className="font-black text-xl mb-3 text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" /> The Digital Guardrails
                  </h3>
                  <p className="text-slate-300 mb-8 font-medium leading-relaxed max-w-2xl">
                    The SEB is a secure web environment that temporarily turns your computer into a locked-down workstation during CATs and final exams. No googling, no cheating. Just you and the exam.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl flex items-start gap-4 border border-white/10">
                      <Laptop className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white mb-1">Strict Device Rule</p>
                        <p className="text-slate-400 text-sm">You MUST use a Windows 11 or macOS computer (Laptop or Desktop).</p>
                      </div>
                    </div>
                    <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 p-5 rounded-2xl flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-red-200 mb-1">Zero Tolerance</p>
                        <p className="text-red-200/70 text-sm">Device MUST have a working camera. NO MOBILE PHONES allowed for exams.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                    <h4 className="font-bold text-emerald-300 mb-3 text-sm uppercase tracking-wider">How to Practice (Demo Exam)</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300 font-medium">
                      <li>Go to LMS &gt; "My Courses" &gt; <strong>"Safe Exam Browser Demo"</strong>.</li>
                      <li>Download & Install SEB software.</li>
                      <li>Open the BigBlueButton link, Join Session, and <strong>turn on your camera</strong>.</li>
                      <li>Go back to the unit page and click <strong>"Open the Demo Exam"</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <QuoteCard quote="When the Safe Exam Browser opens and works on the first try... Form ni kuiva! 😲✨" emoji="🙏🏾" />
            </motion.div>
          </section>

          {/* SEC 5: Support */}
          <section id="support" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-2xl"><AliveEmoji emoji="🛟" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  IT Support Squad
                </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Don't suffer in silence. If the tech is acting up, we are here to help.
              </p>
              
              {/* THE CLINIC BANNER */}
              {(!loading && announcement) ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  className="mb-10 bg-gradient-to-r from-east-navy via-[#1e3f6b] to-east-navy border border-east-gold/30 rounded-3xl p-1 shadow-2xl overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNDMsMTQ1LDMzLDAuMTUpIi8+PC9zdmc+')]"></div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-[1.4rem] p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-20 h-20 rounded-full bg-east-gold/20 flex items-center justify-center flex-shrink-0 border border-east-gold/30">
                      <span className="text-4xl"><AliveEmoji emoji="🚨" /></span>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-east-gold text-east-navy text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">Announcement</div>
                      <h3 className="text-2xl font-black text-white mb-2">{announcement.title}</h3>
                      <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-lg">
                        {announcement.message}
                      </p>
                    </div>
                    {announcement.date && (
                      <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center min-w-[140px]">
                        <p className="text-white font-black text-xl">{announcement.date}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (loading && (
                <div className="mb-10 h-32 bg-slate-200 animate-pulse rounded-3xl" />
              ))}
              <div className="mb-8 p-5 bg-amber-50 border border-amber-200 shadow-sm rounded-2xl flex items-start gap-4">
                <span className="text-3xl pt-1"><AliveEmoji emoji="🦊" /></span>
                <div>
                  <p className="font-bold text-amber-900 mb-1">24/7 Knowledge Base</p>
                  <p className="text-amber-800 text-sm font-medium">
                    Before raising a ticket, please search the <a href="https://support.east.ac.ke/ostic/kb/index.php" target="_blank" rel="noreferrer" className="font-bold underline hover:text-amber-600">ICT Knowledge Base</a> for quick fixes!
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                  <div className="w-14 h-14 bg-east-blue/10 text-east-blue rounded-2xl flex items-center justify-center mb-5">
                    <LifeBuoy className="w-7 h-7" />
                  </div>
                  <h3 className="font-black text-xl text-slate-800 mb-2">General IT Support</h3>
                  <p className="text-slate-500 text-sm mb-6 font-medium">Log in to the support portal to track your ticket history!</p>
                  <div className="space-y-3">
                    <a href="https://support.east.ac.ke/ostic/open.php" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-east-navy hover:bg-east-blue text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-east-navy/20">
                      Open a Support Ticket
                    </a>
                    <a href="mailto:ictsupport@east.ac.ke" className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-3 rounded-xl font-bold transition-colors">
                      <Mail className="w-4 h-4" /> ictsupport@east.ac.ke
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                  <h3 className="font-black text-sm text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Wifi className="w-4 h-4" /> Campus Coordinators
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { name: 'Paul', role: 'IT Officer', location: 'Kitengela Campus', phone: '0783510612', highlight: true },
                      { name: 'Eugene', role: 'Coordinator', location: 'Buruburu Campus', phone: '0115477142' },
                      { name: 'Dancan', role: 'Coordinator', location: 'Kitengela Campus', phone: '0700080983' },
                      { name: 'Brian', role: 'Coordinator', location: 'Kitengela Campus', phone: '0792688392' }
                    ].map((person, i) => (
                      <li key={i} className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${person.highlight ? 'bg-east-gold/10 border border-east-gold/20' : 'hover:bg-slate-50 border border-transparent'}`}>
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            {person.name} 
                            {person.highlight && <span className="text-[9px] bg-east-gold text-east-navy px-1.5 py-0.5 rounded uppercase font-black tracking-widest">Lead</span>}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{person.location}</p>
                        </div>
                        <a href={`tel:${person.phone}`} className="flex items-center gap-2 bg-slate-100 text-east-navy px-3 py-2 rounded-xl text-sm font-bold hover:bg-east-navy hover:text-white transition-all">
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <QuoteCard quote="That 'Save Changes' button is your true best friend. Don't ghost it." emoji="👻" />
            </motion.div>
          </section>

          {/* SEC 6: FAQ & Knowledge Base */}
          <section id="faq" className="py-16 border-t border-slate-200/50 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-east-navy to-east-blue text-white flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-2xl"><AliveEmoji emoji="🧠" /></span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800">
                  FAQ & Knowledge Base
                </h2>
              </div>
              
              {/* KNOWLEDGE BASE LINK */}
              <motion.a 
                href="https://support.east.ac.ke/ostic/kb/index.php" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                className="mb-10 block bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl border border-east-blue/20 rounded-[2rem] p-8 shadow-xl group transition-all"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-east-blue/10 flex items-center justify-center text-east-blue group-hover:bg-east-blue group-hover:text-white transition-all">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-east-navy mb-1 group-hover:text-east-blue transition-colors">
                      Search the Official IT Knowledge Base 🧠
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      90% of your issues (password resets, submission errors) already have step-by-step guides waiting for you here.
                    </p>
                  </div>
                  <div className="bg-east-blue text-white p-3 rounded-full group-hover:translate-x-2 transition-transform">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </motion.a>

              {/* FAQ ACCORDION */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <CollapsibleStep step={index + 1} title={faq.q}>
                      <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                    </CollapsibleStep>
                  </div>
                ))}
              </div>

              <QuoteCard quote="The answer you seek is often just one click away. Be a digital detective!" emoji="🕵🏾‍♂️" />
            </motion.div>
          </section>

        </div>
        
        {/* SURVIVAL KIT SECTION (Replaces fixed footer) */}
        <div className="bg-east-navy pt-16 pb-20 px-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-east-blue via-east-gold to-emerald-500"></div>
          <div className="max-w-[800px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-display font-black text-white mb-2 flex items-center gap-3">
                  Grab Your Survival Kit <AliveEmoji emoji="🎒" />
                </h2>
                <p className="text-slate-400 font-medium">Download the official offline manuals. Keep them safe.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-east-gold font-bold text-sm uppercase tracking-widest">Mastering these tools is the</p>
                <p className="text-white font-black text-xl">First test of independent learning.</p>
              </div>
            </div>
            
            {/* Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-8 md:pb-0 snap-x custom-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
              {PDFS.map((doc, i) => (
                <button 
                  key={i} 
                  id={`btn-${doc.name.replace(/\s+/g, '-')}`}
                  onClick={() => handleDownload(doc.name)}
                  className="snap-center flex-shrink-0 w-[260px] md:w-auto flex flex-col items-start gap-4 bg-white/10 hover:bg-white/20 text-left p-6 rounded-3xl transition-all border border-white/10 group relative overflow-hidden"
                >
                  <div className="absolute -right-6 -bottom-6 text-7xl opacity-5 group-hover:scale-110 transition-transform"><AliveEmoji emoji="📄" /></div>
                  <div className="w-12 h-12 rounded-full bg-east-gold/20 flex items-center justify-center text-east-gold group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight mb-1">{doc.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{doc.size} {doc.name.split('.').pop()?.toUpperCase()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Marquee */}
        <div className="bg-slate-900 border-t border-white/5 py-3 overflow-hidden">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }}
             transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
             className="whitespace-nowrap flex text-xs font-bold uppercase tracking-[0.3em] text-slate-500"
           >
             {[...Array(4)].map((_, i) => (
               <span key={i} className="mx-8 flex items-center gap-8">
                 KAG E.A.S.T University <span className="w-1 h-1 rounded-full bg-east-gold inline-block"></span> 
                 #1 Online University in Kenya <span className="w-1 h-1 rounded-full bg-east-gold inline-block"></span> 
                 The University of Transformation
               </span>
             ))}
           </motion.div>
        </div>
      </main>

    </div>
  );
}