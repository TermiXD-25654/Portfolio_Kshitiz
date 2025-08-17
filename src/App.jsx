import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
    Github, Linkedin, Mail, Download, ExternalLink, Sun, Moon, 
    Rocket, Star, Sparkles, Code2, Menu, X 
} from "lucide-react";

/**
 * ============================================================================
 * CONFIGURATION — YOUR SINGLE SOURCE OF TRUTH
 * ============================================================================
 * This object holds all the personal data, making it easy to update your
 * portfolio without touching the component code.
 */
const SITE_CONFIG = {
  name: "Kshitiz Mishra",
  tagline: "Young Roboticist & Designer",
  bio: "Engineering-focused roboticist passionate about CAD, simulation, and building fast, reliable robots. Experienced with SolidWorks, MATLAB, Python/C++, ROS, PyBullet, Gazebo, and MoveIt.",
  resumeUrl: "/resume.pdf", // Replace with your actual resume path
  photoUrl: "https://placehold.co/320x320/1e293b/94a3b8?text=KM", // Replace with your photo
  skills: [
    { name: "Robotics", icon: "🤖" },
    { name: "CAD/SolidWorks", icon: "🎨" },
    { name: "Simulation", icon: "🔮" },
    { name: "MATLAB", icon: "📊" },
    { name: "Python", icon: "🐍" },
    { name: "C++", icon: "⚡" },
    { name: "ROS", icon: "🔧" },
    { name: "PyBullet", icon: "🎯" },
    { name: "Gazebo", icon: "🌐" },
    { name: "MoveIt", icon: "🦾" },
  ],
  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-username",
    email: "mailto:youremail@example.com",
  },
  projects: [
    {
      title: "3-DOF Robotic Arm (IK)",
      description: "Inverse-kinematics-based pick & place arm using depth camera inputs; optimized trajectories and modular control pipeline.",
      tags: ["Robotic Arm", "IK", "OpenCV", "ROS"],
      image: "https://placehold.co/600x400/0f172a/60a5fa?text=Robotic+Arm",
      demo: "#",
      github: "#",
    },
    {
      title: "Hexapod Gait Analysis",
      description: "Learned gait from video data, built a mathematical model, and validated with a hexapod simulator.",
      tags: ["Hexapod", "Gait", "ML", "Simulation"],
      image: "https://placehold.co/600x400/0f172a/818cf8?text=Hexapod+Gait",
      demo: "#",
      github: "#",
    },
    {
      title: "Mandibular Distractor Design",
      description: "Curvilinear distraction osteogenesis device with worm-screw + slotted strip locking; CAD + mechanism study.",
      tags: ["Medical Device", "Mechanism", "CAD"],
      image: "https://placehold.co/600x400/0f172a/c084fc?text=Medical+Device",
      demo: "#",
      github: "#",
    },
    {
      title: "Line Following Robot (PID)",
      description: "High-speed line follower with 3 IR sensors + ADXL; tuned PID for minimal lateral error and sharp turns.",
      tags: ["Line Following", "PID", "Arduino"],
      image: "https://placehold.co/600x400/0f172a/e879f9?text=Line+Follower",
      demo: "#",
      github: "#",
    },
  ],
};

/**
 * ============================================================================
 * 🌌 STARFIELD BACKGROUND
 * ============================================================================
 * An animated starfield background that adds to the cosmic theme. Only visible in dark mode.
 */
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.5,
    }));

    const shootingStars = [];
    const createShootingStar = () => {
      if (Math.random() < 0.01 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 10 + 5,
          alpha: 1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += Math.sin(Date.now() * 0.001 * star.speed) * 0.01;
        star.alpha = Math.max(0.1, Math.min(1, star.alpha));
      });

      // Draw shooting stars
      createShootingStar();
      shootingStars.forEach((star, index) => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x + star.length, star.y - star.length);
        const gradient = ctx.createLinearGradient(star.x, star.y, star.x + star.length, star.y - star.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        star.x += star.speed;
        star.y += star.speed;
        star.alpha -= 0.02;
        if (star.alpha <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-0 dark:opacity-70 transition-opacity duration-500" />;
}

/**
 * ============================================================================
 * 🌈 THEME & UTILITIES
 * ============================================================================
 */
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "dark" ? "light" : "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * ============================================================================
 * 🧭 NAVBAR
 * ============================================================================
 */
const sections = [
  { id: "hero", label: "Home", icon: <Rocket size={16} /> },
  { id: "about", label: "About", icon: <Star size={16} /> },
  { id: "projects", label: "Projects", icon: <Code2 size={16} /> },
  { id: "resume", label: "Resume", icon: <Download size={16} /> },
  { id: "contact", label: "Contact", icon: <Mail size={16} /> },
];

function Navbar({ onNavigate, theme, toggleTheme }) {
  const [active, setActive] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-purple-500/20">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate("hero")}
            className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-xl hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Sparkles size={20} className="text-purple-500" />
            {SITE_CONFIG.name}
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleNavClick(s.id)}
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium transition-all duration-300 ${
                  active === s.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </nav>
      </header>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-purple-500/20 p-4"
          >
            <div className="flex flex-col gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavClick(s.id)}
                  className={`flex items-center gap-3 text-base px-4 py-3 rounded-lg font-medium transition-colors w-full text-left ${
                    active === s.id
                      ? "bg-purple-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggleButton({ theme, toggleTheme }) {
    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            className="p-2 rounded-full text-purple-500 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-100 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, y: -10, rotate: -30 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: 10, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}

/**
 * ============================================================================
 * 🎯 HERO
 * ============================================================================
 */
function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section id="hero" className="relative pt-32 sm:pt-40 pb-20 overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-200/20 via-blue-200/20 to-transparent dark:from-purple-900/20 dark:via-blue-900/20 dark:to-transparent" />
      </motion.div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-500/30 mb-6"
          >
            <Rocket className="text-purple-500 dark:text-purple-400" size={16} />
            <span className="text-sm text-purple-600 dark:text-purple-300">Welcome to my universe</span>
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {SITE_CONFIG.name}
            </span>
          </h1>
          <p className="mt-4 text-xl text-blue-600 dark:text-blue-400 font-medium">{SITE_CONFIG.tagline}</p>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-prose leading-relaxed">{SITE_CONFIG.bio}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={SITE_CONFIG.resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
            >
              <Download size={16} /> Download Resume
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-purple-500/50 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              <Sparkles size={16} /> Let's Connect
            </motion.a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
            <img
              src={SITE_CONFIG.photoUrl}
              alt="Profile"
              className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full object-cover border-4 border-purple-500/10 dark:border-purple-500/30 shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/10 to-transparent dark:from-purple-600/20" />
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity }}
      >
        <div className="text-purple-600 dark:text-purple-400 text-sm flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-purple-500 dark:from-purple-400 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

/**
 * ============================================================================
 * 🧑‍💻 ABOUT
 * ============================================================================
 */
function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  };

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Tech Arsenal
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          My toolkit for building the future of robotics - from low-level programming to high-level system design
        </p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {SITE_CONFIG.skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5, y: -5, zIndex: 10 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="relative flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-purple-500/30 hover:border-purple-500/60 backdrop-blur-sm transition-all">
              <span className="text-2xl">{skill.icon}</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{skill.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/**
 * ============================================================================
 * 🧩 PROJECTS
 * ============================================================================
 */
function ProjectCard({ p }) {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.15)" }}
      className="group relative rounded-2xl overflow-hidden bg-white/50 dark:bg-gradient-to-b dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-purple-500/30 backdrop-blur-sm transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-blue-600/5 dark:from-purple-600/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative overflow-hidden h-48">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/50 to-transparent dark:from-slate-900 dark:to-transparent opacity-80 dark:opacity-60" />
      </div>
      <div className="relative p-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          {p.title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="text-xs rounded-full px-3 py-1 font-medium bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={p.demo} className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-shadow">
            Demo <ExternalLink size={14} />
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={p.github} className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-4 py-2 border border-purple-500/50 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 transition-colors">
            Code <Github size={14} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Mission Control
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">My engineering expeditions and robotic innovations</p>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2"
      >
        {SITE_CONFIG.projects.map((p) => (
          <motion.div key={p.title} variants={itemVariants}>
            <ProjectCard p={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/**
 * ============================================================================
 * 📄 RESUME
 * ============================================================================
 */
function Resume() {
  return (
    <section id="resume" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-10 dark:opacity-30 animate-pulse" />
        </div>
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
          >
            <Star className="absolute top-0 left-1/2 -translate-x-1/2 text-purple-400 opacity-50" size={20} />
            <Star className="absolute bottom-0 left-1/2 -translate-x-1/2 text-blue-400 opacity-50" size={20} />
            <Star className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-400 opacity-50" size={20} />
            <Star className="absolute right-0 top-1/2 -translate-y-1/2 text-cyan-400 opacity-50" size={20} />
          </motion.div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Launch My Resume
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Ready to explore my complete journey? Download my resume for a detailed mission briefing.
          </p>
          <motion.div className="mt-8" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href={SITE_CONFIG.resumeUrl}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
              download
            >
              <Rocket size={20} /> Download Resume
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * ============================================================================
 * ✉️ CONTACT
 * ============================================================================
 */
function Contact() {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const onSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: "Message sent to the cosmos! I'll respond at light speed.", type: "success" });
    setTimeout(() => setMessage(null), 5000);
    formRef.current?.reset();
  };
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Contact Station
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Let's build something stellar together</p>
      </motion.div>
      <div className="max-w-2xl mx-auto">
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Your Name" required className="rounded-xl border border-slate-300 dark:border-purple-500/30 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all" />
            <input name="email" type="email" placeholder="Your Email" required className="rounded-xl border border-slate-300 dark:border-purple-500/30 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all" />
          </div>
          <textarea name="message" rows={5} placeholder="Your Message" required className="w-full rounded-xl border border-slate-300 dark:border-purple-500/30 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm transition-all resize-none" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-shadow">
            Send Transmission
          </motion.button>
        </form>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-6 p-4 text-center text-sm rounded-xl backdrop-blur-sm ${
                message.type === 'success' 
                ? 'text-green-800 dark:text-green-300 bg-green-500/20 border border-green-500/30' 
                : 'text-red-800 dark:text-red-300 bg-red-500/20 border border-red-500/30'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-12 flex items-center justify-center gap-6">
          <motion.a whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} href={SITE_CONFIG.socials.github} className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
            <Github size={24}/>
          </motion.a>
          <motion.a whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} href={SITE_CONFIG.socials.linkedin} className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
            <Linkedin size={24}/>
          </motion.a>
          <motion.a whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }} href={SITE_CONFIG.socials.email} className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
            <Mail size={24}/>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * 🔚 FOOTER
 * ============================================================================
 */
function Footer() {
  return (
    <footer className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-500 dark:text-slate-400">
      <div className="border-t border-slate-200 dark:border-purple-500/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Star className="text-purple-500 dark:text-purple-400" size={16} />
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Exploring the cosmos of code.</p>
        </div>
        <motion.button whileHover={{ y: -2 }} onClick={() => scrollToId("hero")} className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
          <Rocket size={16} />
          Back to launch
        </motion.button>
      </div>
    </footer>
  );
}

/**
 * ============================================================================
 * 🧱 APP SHELL
 * ============================================================================
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const navigate = (id) => scrollToId(id);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white selection:bg-purple-500/30 font-sans relative overflow-x-hidden transition-colors duration-300">
      <StarField />
      <div className="relative z-10">
        <Navbar onNavigate={navigate} theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Hero />
          <About />
          <Projects />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
