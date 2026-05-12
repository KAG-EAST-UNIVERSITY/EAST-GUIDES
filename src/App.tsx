import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, Mail, BookOpen, ShieldCheck, LifeBuoy, 
  Menu, X, ExternalLink, Download, ArrowRight,
  MonitorPlay, FileText, AlertTriangle, Phone, ChevronDown, Globe, GraduationCap, ChevronRight
} from 'lucide-react';

// --- DATA ---
const SECTIONS = [
  { id: 'start', title: 'The Digital Front Door', icon: <Globe className="w-5 h-5" /> },
  { id: 'email', title: 'Official Email', icon: <Mail className="w-5 h-5" /> },
  { id: 'lms', title: 'Mastering Moodle LMS', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'seb', title: 'Safe Exam Browser', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'support', title: 'IT Support & Helpdesk', icon: <LifeBuoy className="w-5 h-5" /> },
];

const PDFS = [
  { name: 'Accessing LMS Materials.pdf', size: '1.2 MB' },
  { name: 'Safe Exam Browser Training.pdf', size: '2.5 MB' },
  { name: 'Complete Manual.pdf', size: '4.8 MB' }
];

const QUOTES = [
  "“Education is the passport to the future.” 🚀",
  "“Beyond the Classroom.” ✨",
  "“Ready to navigate your digital campus?” 🦁",
];

// --- COMPONENTS ---

function CollapsibleStep({ step, title, children }: { step: number | string, title: string, children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 bg-white/60 backdrop-blur-lg border border-white/60 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/40 hover:bg-white/60 transition-colors text-left border-b border-white/20"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-east-blue text-white font-bold text-sm">
            {step}
          </span>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 border-t border-white/40 text-slate-600 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN APP ---

export default function App() {
  const [activeSection, setActiveSection] = useState('start');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll
  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Intersection Observer to highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { threshold: 0.3 });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-east-gold selection:text-east-navy relative">
      {/* BACKGROUND BLOBS FOR GLASS EFFECT */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-east-blue/20 blur-[120px]"></div>
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-east-gold/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[120px]"></div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 fixed top-0 left-0 bottom-0 bg-east-navy/95 backdrop-blur-2xl text-slate-300 z-50 border-r border-white/10 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="flex -space-x-1">
               <BookOpen className="w-6 h-6 text-white" />
               <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                 <span className="text-xl">🔥</span>
               </motion.div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-black text-xl leading-none tracking-wide">
                EAST
              </h1>
              <span className="text-[0.5rem] leading-none mt-0.5 opacity-80 tracking-widest text-slate-300">UNIVERSITY</span>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-east-gold mt-4">
            Digital Campus Guide '26
          </p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeSection === section.id 
                ? 'bg-east-blue text-white shadow-md' 
                : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 rounded-xl p-4 text-xs">
            <p className="mb-2">Need immediate help?</p>
            <a href="mailto:ictsupport@east.ac.ke" className="text-east-gold hover:underline flex items-center gap-2">
              <Mail className="w-3 h-3" /> ictsupport@east.ac.ke
            </a>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-east-navy/95 backdrop-blur-xl text-white flex items-center justify-between px-4 z-50 border-b border-white/10 shadow-md">
        <div className="flex items-center gap-2">
           <div className="flex -space-x-1">
               <BookOpen className="w-5 h-5 text-white" />
           </div>
          <span className="font-display font-black tracking-wide">EAST Guide</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE MENU overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-east-navy/90 backdrop-blur-xl p-4 z-40 border-b border-white/10 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id ? 'bg-east-blue text-white' : 'text-slate-300'
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 pt-16 md:pt-0 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-32">
          
          <div className="py-8 md:py-12 mt-4">
             <div className="bg-east-gold/10 border border-east-gold/20 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl transform rotate-12">🦒</div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-east-navy mb-2">Karibu EAST! 👋🏾</h1>
                <p className="text-slate-700 md:text-lg font-medium">Navigating your Digital Campus doesn't have to be hard. Let's get you set up for success beyond the classroom.</p>
             </div>
          </div>

          {/* SEC 1: Front Door */}
          <section id="start" className="py-12 md:py-20 border-b border-slate-200/50">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-4">
                 <span className="text-3xl animate-bounce">🦁</span> 
                 <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 tracking-tight">
                   The Digital Front Door
                 </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 whitespace-pre-line font-medium">
                Your entire digital journey starts at exactly one place. Bookmark it. 📌
              </p>
              
              <div className="bg-white/60 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-2">Main Hub</p>
                <a href="https://east.university" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-bold text-east-blue hover:text-east-navy transition-colors mb-8 group">
                  east.university <ExternalLink className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'School Portal', url: 'https://portal.east.ac.ke/', target: '_blank' },
                    { name: 'E-Learning (LMS)', url: 'https://lms.east.ac.ke/', target: '_blank' },
                    { name: 'E-Library', url: 'https://elibrary.east.university/', target: '_blank' },
                    { name: 'ICT Support', url: 'https://support.east.ac.ke/ostic/open.php', target: '_blank' }
                  ].map(link => (
                    <a 
                      key={link.name} 
                      href={link.url} 
                      target={link.target} 
                      rel={link.target === '_blank' ? "noreferrer" : undefined} 
                      className="flex items-center justify-between p-4 rounded-xl bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/50 shadow-sm transition-all group cursor-pointer"
                      onClick={(e) => {
                        if (link.url.startsWith('#')) {
                          e.preventDefault();
                          scrollTo(link.url.substring(1));
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-east-gold group-hover:scale-125 transition-transform"></div>
                        <span className="font-medium text-slate-700 group-hover:text-east-navy">{link.name}</span>
                      </div>
                      {link.target === '_blank' ? (
                        <ExternalLink className="w-4 h-4 text-slate-400 opacity-50 group-hover:opacity-100 group-hover:text-east-navy transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-50 group-hover:opacity-100 group-hover:text-east-navy transition-all transform group-hover:translate-x-1" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* SEC 2: Email */}
          <section id="email" className="py-12 md:py-20 border-b border-slate-200/50">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">🦉</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                  Official Student Email
                </h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 bg-east-navy/95 backdrop-blur-xl border border-white/10 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-east-blue rounded-full blur-2xl opacity-40 group-hover:bg-east-gold group-hover:opacity-20 transition-all duration-700"></div>
                  <Mail className="w-10 h-10 text-east-gold mb-6" />
                  <p className="text-sm text-slate-300 uppercase tracking-widest mb-2 font-semibold">Your Campus Identity</p>
                  <p className="text-xl md:text-2xl font-mono text-slate-100 mb-6 break-all bg-black/20 p-4 rounded-xl border border-white/5">
                    name1.name2<span className="text-east-gold">@students.east.ac.ke</span>
                  </p>
                  <div className="flex gap-3 items-start bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                     <span className="text-2xl">🙋🏽‍♂️</span>
                     <p className="text-slate-200 text-sm leading-relaxed">
                       <strong>Look here!</strong> Required for official communication, campus resources, and urgent notifications. Check it daily!
                     </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* SEC 3: Moodle */}
          <section id="lms" className="py-12 md:py-20 border-b border-slate-200/50">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">📚</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                  Mastering the Moodle LMS
                </h2>
              </div>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Your virtual classroom. Here is how to navigate it like a pro. 👩🏾‍💻
              </p>

              <div className="space-y-4">
                <CollapsibleStep step="1" title="How to Access">
                  <div className="flex flex-col gap-2 p-2">
                    <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-east-gold"/> Go to <strong>east.university</strong></p>
                    <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-east-gold"/> Click <strong>LMS</strong></p>
                    <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-east-gold"/> Login with Username & Password <span className="text-xs text-slate-400">(provided by IT)</span></p>
                    <p className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-east-gold"/> Click <strong>My Courses</strong> to see enrolled units</p>
                  </div>
                </CollapsibleStep>
                
                <CollapsibleStep step="2" title="Downloading Notes">
                  <p className="mb-2">Notes are uploaded as PDF, DOCX, or PPTX format.</p>
                  <div className="bg-blue-50/70 backdrop-blur-md text-blue-800 p-3 rounded-lg flex gap-3 text-sm font-medium border border-blue-100/50 shadow-sm">
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    Simply click next to the file icon in your course to automatically download your materials.
                  </div>
                </CollapsibleStep>

                <CollapsibleStep step="3" title="Live Classes (BigBlueButton)">
                  <div className="space-y-4">
                    <p>Look for the <strong>BBB Icon</strong> and click <span className="bg-east-blue text-white px-2 py-0.5 rounded text-sm">Join Session</span>.</p>
                    <div className="bg-amber-50/70 backdrop-blur-md border-l-4 border-east-gold p-4 mt-2 shadow-sm">
                      <p className="font-bold text-amber-900 flex gap-2 items-center mb-1">
                        <AlertTriangle className="w-5 h-5" /> CRITICAL STEP
                      </p>
                      <p className="text-amber-800 text-sm">
                        When prompted by the browser, you MUST choose <strong>"Microphone"</strong> (not Listen Only) and click <strong>"Allow"</strong> so you can speak in class.
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4"/> 
                      <strong>Missed class?</strong> Recorded classes can be accessed by clicking <em>"Presentation"</em> in the online class menu.
                    </p>
                  </div>
                </CollapsibleStep>

                <CollapsibleStep step="4" title="Assignments & CATs">
                  <ol className="list-decimal list-inside space-y-3 text-slate-700 pl-2">
                    <li>Click the <strong>Assignment icon</strong>.</li>
                    <li>Download the lecturer's work <span className="text-orange-500 font-medium">(usually Highlighted Orange)</span>.</li>
                    <li>Complete your work offline.</li>
                    <li>Return to the LMS, click <span className="bg-slate-200 px-2 py-1 rounded text-sm mx-1">Add Submission</span>.</li>
                    <li>Upload your completed file.</li>
                  </ol>
                  <div className="mt-4 bg-red-50/70 backdrop-blur-md border border-red-100/50 text-red-800 p-3 rounded-lg flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                    <div className="text-sm">
                      <p className="font-bold">Crucial Step:</p>
                      <p>You MUST click <strong>"Save Changes"</strong> to finalize! Late submissions are strictly penalized.</p>
                    </div>
                  </div>
                </CollapsibleStep>
              </div>
            </motion.div>
          </section>

          {/* SEC 4: SEB */}
          <section id="seb" className="py-12 md:py-20 border-b border-slate-200/50">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🦏</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                  Safe Exam Browser
                </h2>
              </div>
              
              <div className="bg-slate-800/85 backdrop-blur-xl border border-white/10 text-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="font-bold text-lg mb-2 text-emerald-400 relative">What is SEB?</h3>
                <p className="text-slate-300 mb-6 relative">
                  A secure environment for e-assessments that locks down the computer to prevent unauthorized resources during exams.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 relative">
                  <div className="bg-slate-700/40 backdrop-blur-md p-4 rounded-xl flex items-start gap-3 border border-white/5">
                    <Laptop className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Device Req.</p>
                      <p className="text-slate-400 text-xs mt-1">Windows 11 or MacOS. Laptop or Desktop.</p>
                    </div>
                  </div>
                  <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-red-200">Strict Rule</p>
                      <p className="text-red-300/80 text-xs mt-1">Must have a camera. NO mobile phones for exams.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Step-by-Step Training Demo</h3>
              <div className="grid gap-3">
                {[
                  "Log into the LMS and go to 'My Courses'.",
                  "Open the unit: 'Safe Exam Browser Demo'.",
                  "Look for the SEB download link (Windows or macOS) and install it. Accept the terms. (If already installed, just click 'Launch Safe Exam Browser').",
                  "Open the BigBlueButton link in the course, Join Session, and turn on your camera.",
                  "Go back to the unit and click 'Open the Demo Exam'."
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/60 backdrop-blur-lg border border-white/50 rounded-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 text-sm md:text-base pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* SEC 5: Support */}
          <section id="support" className="py-12 md:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛟</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
                  IT Support & Helpdesk
                </h2>
              </div>
              
              <div className="mb-8 p-4 bg-orange-50/70 backdrop-blur-md border border-orange-100/50 shadow-sm rounded-xl flex items-start gap-4">
                <span className="text-3xl pt-0.5 animate-pulse">🦊</span>
                <div>
                  <p className="font-semibold text-orange-900 border-b border-orange-200/50 pb-1 mb-2">Wait! Before you call...</p>
                  <p className="text-orange-800 text-sm">Please search the <strong>"Knowledge Bank"</strong> in the LMS Support System before raising support tickets!</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col items-center text-center justify-center">
                  <div className="w-12 h-12 bg-slate-100/80 text-slate-600 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">General Support</h3>
                  <a href="mailto:ictsupport@east.ac.ke" className="text-east-blue hover:underline font-medium">ictsupport@east.ac.ke</a>
                </div>
                
                <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                  <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Campus Coordinators</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Eugene</p>
                        <p className="text-xs text-slate-500">Buruburu Campus</p>
                      </div>
                      <a href="tel:0115477142" className="flex items-center gap-2 bg-east-gold/10 text-east-navy px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-east-gold/20 transition-colors">
                        <Phone className="w-3 h-3" /> 0115477142
                      </a>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Brian</p>
                        <p className="text-xs text-slate-500">Kitengela Campus</p>
                      </div>
                      <a href="tel:0792688392" className="flex items-center gap-2 bg-east-gold/10 text-east-navy px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-east-gold/20 transition-colors">
                        <Phone className="w-3 h-3" /> 0792688392
                      </a>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Paul</p>
                        <p className="text-xs text-slate-500">Kitengela Campus</p>
                      </div>
                      <a href="tel:0783510612" className="flex items-center gap-2 bg-east-gold/10 text-east-navy px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-east-gold/20 transition-colors">
                        <Phone className="w-3 h-3" /> 0783510612
                      </a>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Dancan</p>
                        <p className="text-xs text-slate-500">Kitengela Campus</p>
                      </div>
                      <a href="tel:0700080983" className="flex items-center gap-2 bg-east-gold/10 text-east-navy px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-east-gold/20 transition-colors">
                        <Phone className="w-3 h-3" /> 0700080983
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      {/* FIXED FOOTER */}
      <footer className="fixed bottom-0 md:left-72 right-0 bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_30px_-10px_rgba(0,0,0,0.1)] z-40">
        <div className="w-full bg-east-gold text-east-navy text-xs font-bold uppercase tracking-widest text-center py-1">
          "Education is the passport to the future." 🚀
        </div>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 whitespace-nowrap pr-4">
            <span className="text-2xl animate-bounce">📚</span>
            <span className="font-bold text-sm text-slate-800">Survival Guides</span>
          </div>
          <div className="flex gap-2 whitespace-nowrap pb-1 md:pb-0">
            {PDFS.map((doc, i) => (
              <button 
                key={i} 
                onClick={() => alert(`The document "${doc.name}" is currently being updated and will be available for download soon.`)}
                className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-white/60 shadow-sm backdrop-blur-md cursor-pointer"
              >
                <Download className="w-3 h-3 text-east-blue" />
                {doc.name}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
