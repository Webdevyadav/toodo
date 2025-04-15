import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskDashboard from './components/TaskDashboard';
import { useTodoContext } from './context/TodoContext';
import FocusMode from './components/FocusMode';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Today from './components/Today';
import Important from './components/Important';
import Statistics from './components/Statistics';

const App: React.FC = () => {
  const { focusTask, setFocusTask } = useTodoContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activePage, setActivePage] = useState<string>('dashboard');

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageTransition = {
    type: "spring",
    stiffness: 250,
    damping: 30,
    duration: 0.5
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Navigation handler
  const handleNavigate = (page: string) => {
    setActivePage(page);
    // Close focus mode when navigating
    if (focusTask) {
      setFocusTask(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark overflow-hidden relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-gray-900 to-dark overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at center, rgba(61, 90, 254, 0.2) 0%, transparent 70%)',
              transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`
            }}
          />
        </div>

        {/* Enhanced animated background with floating particles */}
        <div className="animated-bg">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 50 + 10,
                height: Math.random() * 50 + 10,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: i % 3 === 0 
                  ? 'linear-gradient(45deg, rgba(61, 90, 254, 0.2), rgba(33, 150, 243, 0.1))' 
                  : i % 3 === 1 
                  ? 'linear-gradient(45deg, rgba(123, 31, 162, 0.2), rgba(156, 39, 176, 0.1))' 
                  : 'linear-gradient(45deg, rgba(255, 87, 34, 0.2), rgba(244, 67, 54, 0.1))',
                filter: "blur(8px)"
              }}
              animate={{
                y: [Math.random() * -70, Math.random() * 70, Math.random() * -70],
                x: [Math.random() * -70, Math.random() * 70, Math.random() * -70],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <motion.div 
              className="relative inline-block"
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <h1 className="text-8xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent1 bg-clip-text text-transparent animate-gradient-x">
                toodo
              </h1>
              <motion.span 
                className="absolute -top-4 -right-4 text-6xl transform rotate-12"
                animate={{ 
                  scale: [1, 1.2, 1], 
                  rotate: [12, 15, 12]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                ✨
              </motion.span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 mt-2 text-lg font-light tracking-wide"
            >
              Your tasks, beautifully organized
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            {/* Multi-layer spinner */}
            <div className="relative mx-auto w-20 h-20">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-accent1 border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary border-b-secondary border-l-accent1"
                animate={{ rotate: -180 }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-70 blur-sm"></div>
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
              className="mt-6 text-sm text-gray-400"
            >
              Loading your productivity suite...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <MotionConfig transition={pageTransition}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex flex-col relative bg-dark"
      >
        {/* Enhanced animated background */}
        <div className="animated-bg fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-primary bg-opacity-5 filter blur-[100px]"
            style={{ 
              top: '-300px', 
              right: '-300px',
              x: (mousePosition.x - 0.5) * -40,
              y: (mousePosition.y - 0.5) * -40,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-secondary bg-opacity-5 filter blur-[80px]"
            style={{ 
              bottom: '-200px', 
              left: '-200px',
              x: (mousePosition.x - 0.5) * 30,
              y: (mousePosition.y - 0.5) * 30,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-accent1 bg-opacity-3 filter blur-[60px]"
            style={{ 
              top: '40%', 
              left: '60%',
              x: (mousePosition.x - 0.5) * 20,
              y: (mousePosition.y - 0.5) * 20,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Light particles floating in background */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white bg-opacity-5"
              style={{
                width: Math.random() * 30 + 5,
                height: Math.random() * 30 + 5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(5px)"
              }}
              animate={{
                y: [Math.random() * -100, Math.random() * 100, Math.random() * -100],
                x: [Math.random() * -100, Math.random() * 100, Math.random() * -100],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern overlay */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
        
        {/* Main app layout */}
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            onNavigate={handleNavigate}
          />
          
          {/* Main content area with sidebar */}
          <div className="flex flex-1 relative overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
              isOpen={sidebarOpen} 
              onNavigate={handleNavigate} 
              activePage={activePage}
            />
            
            {/* Main content */}
            <main 
              className={`flex-1 p-4 pt-2 transition-all duration-300 ease-out overflow-y-auto ${
                sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'
              }`}
              style={{ height: 'calc(100vh - 64px)' }}
            >
              <AnimatePresence mode="wait">
                {focusTask ? (
                  <motion.div
                    key="focus-mode"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.4
                    }}
                    className="glass-container h-full"
                  >
                    <FocusMode 
                      taskId={focusTask?.id || ''}
                      onClose={() => setFocusTask(null)}
                    />
                  </motion.div>
                ) : (
                  <>
                    {activePage === 'dashboard' && (
                      <motion.div
                        key="task-dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <TaskDashboard />
                      </motion.div>
                    )}
                    
                    {activePage === 'notifications' && (
                      <motion.div
                        key="notifications"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Notifications />
                      </motion.div>
                    )}
                    
                    {activePage === 'settings' && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Settings />
                      </motion.div>
                    )}
                    
                    {activePage === 'profile' && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Profile />
                      </motion.div>
                    )}
                    
                    {activePage === 'today' && (
                      <motion.div
                        key="today"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Today />
                      </motion.div>
                    )}
                    
                    {activePage === 'important' && (
                      <motion.div
                        key="important"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Important />
                      </motion.div>
                    )}
                    
                    {activePage === 'stats' && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="glass-container h-full"
                      >
                        <Statistics />
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
        
        {/* App corner decorations */}
        <div className="fixed top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary to-transparent opacity-10 pointer-events-none rounded-br-full blur-xl"></div>
        <div className="fixed bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-accent1 to-transparent opacity-10 pointer-events-none rounded-tl-full blur-xl"></div>
      </motion.div>
    </MotionConfig>
  );
};

export default App; 