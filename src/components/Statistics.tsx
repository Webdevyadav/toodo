import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPieChart, FiBarChart2, FiCalendar, FiCheck, FiClock, FiFlag } from 'react-icons/fi';
import { useTodoContext, Task } from '../context/TodoContext';
import IconWrapper from './IconComponent';

const Statistics: React.FC = () => {
  const { categories } = useTodoContext();
  const [isLoading, setIsLoading] = useState(true);
  // Get all tasks from all categories
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [statSummary, setStatSummary] = useState({
    totalTasks: 67,
    completedTasks: 38,
    completionRate: 57,
    pendingTasks: 29,
    overdueTasks: 5,
    avgCompletionTime: 36,
    highPriorityRate: 30,
    tasksThisWeek: 18,
    tasksCompletedThisWeek: 12
  });
  
  const [categoryStats, setCategoryStats] = useState<{id: string, name: string, count: number, completedCount: number, color: string}[]>([
    { id: '1', name: 'Work', count: 14, completedCount: 8, color: '#6C63FF' },
    { id: '2', name: 'Personal', count: 12, completedCount: 7, color: '#FF6584' },
    { id: '3', name: 'Fitness', count: 9, completedCount: 5, color: '#06D6A0' },
    { id: '4', name: 'Learning', count: 7, completedCount: 3, color: '#FFC107' },
    { id: '5', name: 'Projects', count: 11, completedCount: 6, color: '#FF5722' },
    { id: '6', name: 'Family', count: 6, completedCount: 4, color: '#8B5CF6' },
    { id: '7', name: 'Health', count: 8, completedCount: 5, color: '#EC4899' }
  ]);
  
  // Animation variants with improved smoothness
  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.8,
        type: "spring",
        stiffness: 50,
        damping: 15
      }
    }
  };
  
  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };
  
  const chartItem = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay: 0.3
      }
    }
  };
  
  // Generate statistics from tasks data - but use placeholder data for demos
  useEffect(() => {
    // Extract all tasks from categories (only used to maintain compatibility)
    const tasks = categories.flatMap(category => 
      category.tasks.map(task => ({
        ...task,
        categoryId: category.id
      }))
    );
    setAllTasks(tasks);
    
    // We won't use real calculateStats anymore, just simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, [categories]);
  
  const calculateStats = () => {
    // Calculate basic stats
    const completed = allTasks.filter((t: Task) => t.completed).length;
    const total = allTasks.length;
    const pending = allTasks.filter((t: Task) => !t.completed).length;
    
    // Calculate overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = allTasks.filter((t: Task) => {
      if (!t.dueDate || t.completed) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    
    // Calculate weekly stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const tasksThisWeek = allTasks.filter((t: Task) => {
      if (!t.createdAt) return false;
      const createdDate = new Date(t.createdAt);
      return createdDate >= weekStart;
    }).length;
    
    const tasksCompletedThisWeek = allTasks.filter((t: Task) => {
      if (!t.completed) return false;
      // Use updatedAt as the completion date
      const completedDate = new Date(t.updatedAt);
      return completedDate >= weekStart;
    }).length;
    
    // Calculate priority stats
    const highPriorityTasks = allTasks.filter((t: Task) => t.priority === 'high').length;
    const highPriorityRate = total > 0 ? (highPriorityTasks / total) * 100 : 0;
    
    // Calculate category stats
    const categoryData = categories.map(category => {
      const categoryTasks = allTasks.filter((t: Task) => t.categoryId === category.id);
      const completedCategoryTasks = categoryTasks.filter((t: Task) => t.completed);
      
      return {
        id: category.id,
        name: category.name,
        count: categoryTasks.length,
        completedCount: completedCategoryTasks.length,
        color: category.color || '#6366F1'
      };
    });
    
    setCategoryStats(categoryData);
    
    // Update stat summary
    setStatSummary({
      totalTasks: total,
      completedTasks: completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      pendingTasks: pending,
      overdueTasks: overdue,
      avgCompletionTime: 48, // Placeholder 
      highPriorityRate,
      tasksThisWeek,
      tasksCompletedThisWeek
    });
  };
  
  // Custom progress circle component
  const ProgressCircle = ({ 
    percentage, 
    size = 120, 
    strokeWidth = 12, 
    color = 'var(--color-primary)' 
  }: { 
    percentage: number, 
    size?: number, 
    strokeWidth?: number, 
    color?: string 
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            className="text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className="text-primary"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.span 
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            {Math.round(percentage)}%
          </motion.span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "20px" }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mt-1"
          />
        </div>
      </div>
    );
  };
  
  // Bar chart component
  const BarChart = ({ data }: { data: {name: string, value: number, color: string}[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    return (
      <div className="flex flex-col h-60 mt-4">
        <div className="flex-1 flex items-end relative">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center mx-1">
              <motion.div 
                className="w-full rounded-t-md relative cursor-pointer"
                style={{ backgroundColor: item.color }}
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: hoveredIndex === index ? item.color : item.color + "cc"
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: item.color
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 50
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10"
                  >
                    {item.name}: {item.value}
                  </motion.div>
                )}
              </motion.div>
              <div className="text-xs text-center mt-2 w-full text-gray-400 truncate px-1">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Line chart component for weekly performance
  const LineChart = ({ data }: { data: {day: string, completed: number, created: number}[] }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.created))) + 2;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    
    return (
      <div className="h-60 w-full mt-4 relative">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{Math.round(maxValue - (i * (maxValue / 4)))}</span>
          ))}
          <span>0</span>
        </div>
        
        <div className="absolute left-6 right-4 top-0 bottom-0 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className="border-b border-gray-700/50 w-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
            />
          ))}
        </div>
        
        <div className="absolute left-6 right-4 top-0 bottom-16 flex">
          {data.map((item, index) => (
            <div key={index} className="flex-1 relative">
              {/* Created tasks line */}
              <motion.div
                className="absolute bottom-0 left-1/2 w-2 bg-primary/20 rounded-t-sm z-10"
                style={{ 
                  height: `${(item.created / maxValue) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(item.created / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              />
              
              {/* Completed tasks line */}
              <motion.div
                className="absolute bottom-0 left-1/2 w-2 bg-green-500 rounded-t-sm z-20"
                style={{ 
                  height: `${(item.completed / maxValue) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(item.completed / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: 0.7 + (index * 0.1) }}
              />
              
              {/* Connector lines */}
              {index < data.length - 1 && (
                <>
                  <motion.div
                    className="absolute bottom-0 right-0 h-px bg-primary/40 z-0"
                    style={{ 
                      bottom: `${(item.created / maxValue) * 100}%`,
                      width: '100%',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 h-px bg-green-500/40 z-0"
                    style={{ 
                      bottom: `${(item.completed / maxValue) * 100}%`,
                      width: '100%',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                  />
                </>
              )}
              
              {/* Hover tooltip */}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-30"
                >
                  <div><span className="text-primary">Created:</span> {item.created}</div>
                  <div><span className="text-green-500">Completed:</span> {item.completed}</div>
                </motion.div>
              )}
              
              <div className="absolute bottom-[-24px] transform left-1/2 -translate-x-1/2 text-xs text-gray-400">
                {item.day}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-0 right-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-gray-400">Created</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Completed</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Donut chart component
  const DonutChart = ({ data }: { data: {name: string, value: number, color: string}[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    
    // Calculate stroke-dasharray and stroke-dashoffset for each segment
    let accumulatedPercent = 0;
    const segments = data.map(item => {
      const percent = (item.value / total) * 100;
      const segment = {
        name: item.name,
        color: item.color,
        value: item.value,
        percent,
        offset: accumulatedPercent
      };
      accumulatedPercent += percent;
      return segment;
    });
    
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    
    return (
      <div className="relative w-[180px] h-[180px] mx-auto">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <g transform="translate(90, 90)">
            {segments.map((segment, index) => {
              const dasharray = (segment.percent / 100) * circumference;
              const dashoffset = ((100 - segment.offset - segment.percent) / 100) * circumference;
              
              return (
                <motion.circle
                  key={index}
                  r={radius}
                  cx="0"
                  cy="0"
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={hoveredSegment === segment.name ? 22 : 18}
                  strokeDasharray={`${dasharray} ${circumference - dasharray}`}
                  strokeDashoffset={dashoffset}
                  transform="rotate(-90)"
                  onMouseEnter={() => setHoveredSegment(segment.name)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashoffset }}
                  transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                  className="cursor-pointer transition-all duration-300"
                />
              );
            })}
            <circle r="40" cx="0" cy="0" fill="#1F2937" />
          </g>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="text-center"
          >
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-400">Total Tasks</div>
          </motion.div>
        </div>
        
        {hoveredSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-[-40px] left-[50%] transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10"
          >
            {hoveredSegment}: {segments.find(s => s.name === hoveredSegment)?.value} tasks
          </motion.div>
        )}
      </div>
    );
  };
  
  // Radar chart component for productivity dimensions
  const RadarChart = () => {
    const dimensions = [
      { name: "Focus", value: 76, color: "#4ADE80" },
      { name: "Deadlines", value: 85, color: "#FB7185" },
      { name: "Volume", value: 92, color: "#60A5FA" },
      { name: "Consistency", value: 68, color: "#F59E0B" },
      { name: "Planning", value: 78, color: "#8B5CF6" }
    ];
    
    const maxValue = 100;  // Values are percentages
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 100;
    
    // Calculate points for each dimension
    const getPointsForDimension = (value: number, index: number) => {
      const angleSlice = (Math.PI * 2) / dimensions.length;
      const angle = index * angleSlice - Math.PI / 2; // Start from top
      
      const radius = (value / maxValue) * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };
    
    // Calculate points for grid circles
    const getGridCirclePoints = (percentage: number) => {
      const radius = (percentage / 100) * maxRadius;
      const points = [];
      
      for (let i = 0; i < 360; i += 1) {
        const angle = (i * Math.PI) / 180;
        points.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      }
      
      return points;
    };
    
    // Generate path for dimension values
    const generatePath = () => {
      return dimensions.map((dim, i) => {
        const point = getPointsForDimension(dim.value, i);
        return (i === 0 ? 'M' : 'L') + point.x + ',' + point.y;
      }).join(' ') + 'Z'; // Close the path
    };
    
    return (
      <div className="relative w-[300px] h-[300px] mx-auto">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((percentage, i) => {
            const points = getGridCirclePoints(percentage);
            const pathData = points.map((point, j) => 
              (j === 0 ? 'M' : 'L') + point.x + ',' + point.y
            ).join(' ') + 'Z';
            
            return (
              <motion.path
                key={`grid-${i}`}
                d={pathData}
                fill="none"
                stroke="#374151"
                strokeWidth="0.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              />
            );
          })}
          
          {/* Axis lines */}
          {dimensions.map((dim, i) => {
            const point = getPointsForDimension(maxValue, i);
            return (
              <motion.line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="#1F2937"
                strokeWidth="0.75"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.6 }}
              />
            );
          })}
          
          {/* Data shape */}
          <motion.path
            d={generatePath()}
            fill="rgba(99, 102, 241, 0.15)"
            stroke="rgba(99, 102, 241, 0.8)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Data points */}
          {dimensions.map((dim, i) => {
            const point = getPointsForDimension(dim.value, i);
            return (
              <motion.circle
                key={`point-${i}`}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={dim.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + (i * 0.1), duration: 0.5 }}
                whileHover={{ scale: 1.5 }}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        {dimensions.map((dim, i) => {
          const point = getPointsForDimension(maxValue + 15, i);
          return (
            <motion.div
              key={`label-${i}`}
              className="absolute text-xs font-medium"
              style={{
                left: point.x,
                top: point.y,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + (i * 0.1) }}
            >
              <div className="flex flex-col items-center">
                <span className="text-white">{dim.name}</span>
                <motion.span 
                  className="text-xs mt-1 rounded-full px-2 py-0.5" 
                  style={{ backgroundColor: `${dim.color}30`, color: dim.color }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + (i * 0.1) }}
                >
                  {dim.value}%
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <motion.div 
          className="w-20 h-20 rounded-full mb-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="w-full h-full rounded-full border-4 border-t-primary border-r-secondary border-b-accent1 border-l-transparent absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
          />
          <motion.div 
            className="w-full h-full rounded-full border-4 border-r-accent1 border-transparent absolute inset-0"
            animate={{ rotate: -180 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-400"
        >
          Analyzing your productivity data...
        </motion.p>
        <div className="mt-3 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              className="w-2 h-2 rounded-full bg-primary"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.5 + (i * 0.2), 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.6
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8 relative">
      {/* Floating animated elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-transparent opacity-10 blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-accent1 to-transparent opacity-10 blur-lg"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
      >
        <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg">
          <IconWrapper icon={FiTrendingUp} size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-gray-400">Track your productivity and progress</p>
        </div>
      </motion.div>
      
      {/* Stats summary grid with improved shadows and animations */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="glass-panel rounded-lg p-4 shadow-lg shadow-primary/5 border border-gray-700/50"
          variants={item}
          whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--color-primary-rgb), 0.15)" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
        >
          <div className="mb-2 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Tasks</span>
            <IconWrapper icon={FiCheck} className="text-primary" size={18} />
          </div>
          <div className="text-3xl font-bold">{statSummary.totalTasks}</div>
          <div className="text-sm text-gray-400 mt-1">
            <span className="text-green-500">{statSummary.completedTasks}</span> completed
          </div>
          <motion.div
            className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${(statSummary.completedTasks / statSummary.totalTasks) * 100}%` }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="glass-panel rounded-lg p-4 shadow-lg shadow-secondary/5 border border-gray-700/50"
          variants={item}
          whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--color-secondary-rgb), 0.15)" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
        >
          <div className="mb-2 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Completion Rate</span>
            <IconWrapper icon={FiPieChart} className="text-secondary" size={18} />
          </div>
          <div className="text-3xl font-bold">{Math.round(statSummary.completionRate)}%</div>
          <div className="text-sm text-gray-400 mt-1">
            <span className="text-green-500">{statSummary.completedTasks}</span> of {statSummary.totalTasks} tasks
          </div>
          <motion.div
            className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-secondary to-accent1"
              initial={{ width: 0 }}
              animate={{ width: `${statSummary.completionRate}%` }}
              transition={{ delay: 0.7, duration: 1 }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="glass-panel rounded-lg p-4 shadow-lg shadow-accent1/5 border border-gray-700/50"
          variants={item}
          whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--color-accent1-rgb), 0.15)" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
        >
          <div className="mb-2 flex justify-between items-center">
            <span className="text-gray-400 text-sm">This Week</span>
            <IconWrapper icon={FiCalendar} className="text-accent1" size={18} />
          </div>
          <div className="text-3xl font-bold">{statSummary.tasksThisWeek}</div>
          <div className="text-sm text-gray-400 mt-1">
            <span className="text-green-500">{statSummary.tasksCompletedThisWeek}</span> completed this week
          </div>
        </motion.div>
        
        <motion.div 
          className="glass-panel rounded-lg p-4 shadow-lg shadow-accent1/5 border border-gray-700/50"
          variants={item}
          whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(var(--color-accent1-rgb), 0.15)" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
        >
          <div className="mb-2 flex justify-between items-center">
            <span className="text-gray-400 text-sm">Overdue Tasks</span>
            <IconWrapper icon={FiClock} className="text-red-500" size={18} />
          </div>
          <div className="text-3xl font-bold">{statSummary.overdueTasks}</div>
          <div className="text-sm text-gray-400 mt-1">
            <span className={statSummary.overdueTasks > 0 ? "text-red-500" : "text-green-500"}>
              {statSummary.overdueTasks > 0 ? "Need attention" : "All tasks on track"}
            </span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Main charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Completion rate chart */}
        <motion.div 
          className="glass-panel rounded-lg p-6 overflow-hidden relative"
          variants={chartItem}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <IconWrapper icon={FiPieChart} className="mr-2 text-secondary" />
            Completion Rate
            <motion.span 
              className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Last 30 days
            </motion.span>
          </h2>
          
          <div className="flex flex-col items-center">
            <ProgressCircle 
              percentage={statSummary.completionRate} 
              size={180}
              color="var(--color-primary)"
            />
            <div className="mt-6 text-center">
              <motion.div 
                className="inline-flex items-center bg-gray-800/50 px-3 py-1.5 rounded-full mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <p className="text-gray-300">Task Completion Rate</p>
              </motion.div>
              <p className="text-sm text-gray-400 mt-1">
                You've completed {statSummary.completedTasks} out of {statSummary.totalTasks} total tasks
              </p>
              
              <motion.div 
                className="mt-4 grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/30">
                  <span className="text-xs text-gray-400">Daily Avg</span>
                  <span className="text-lg font-medium">3.2</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/30">
                  <span className="text-xs text-gray-400">Weekly</span>
                  <span className="text-lg font-medium">22</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-800/30">
                  <span className="text-xs text-gray-400">Best Day</span>
                  <span className="text-lg font-medium">Mon</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Priority distribution */}
        <motion.div 
          className="glass-panel rounded-lg p-6 overflow-hidden relative"
          variants={chartItem}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-accent1/10 to-transparent blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <IconWrapper icon={FiFlag} className="mr-2 text-accent1" />
            Task Priority Distribution
          </h2>
          
          <div className="flex justify-center items-center space-x-10 relative">
            <div className="relative">
              <ProgressCircle 
                percentage={statSummary.highPriorityRate} 
                size={130}
                color="#ef4444"
              />
              <motion.div
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-20"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-2 border-dashed border-red-500 rounded-full" />
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">{Math.round(statSummary.highPriorityRate)}%</span>
                  <motion.div
                    className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${statSummary.highPriorityRate}%` }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">
                    {Math.round(100 - statSummary.highPriorityRate - 20)}%
                  </span>
                  <motion.div
                    className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.div 
                      className="h-full bg-yellow-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - statSummary.highPriorityRate - 20}%` }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">20%</span>
                  <motion.div
                    className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `20%` }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-gray-800/30 p-2 rounded-lg mt-4 text-sm text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <IconWrapper icon={FiFlag} className="inline mr-1 text-red-500" size={14} />
                Focus on the {Math.round(statSummary.highPriorityRate)}% high priority tasks first!
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Add new radar chart for productivity metrics */}
        <motion.div 
          className="glass-panel rounded-lg p-6 overflow-hidden relative"
          variants={chartItem}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >
          <motion.div 
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-tl from-primary/5 to-transparent blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <IconWrapper icon={FiTrendingUp} className="mr-2 text-primary" />
            Productivity Metrics
            <motion.span 
              className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Last 30 days
            </motion.span>
          </h2>
          
          <RadarChart />
          
          <motion.div
            className="mt-4 text-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <IconWrapper icon={FiPieChart} className="inline-block mr-1 text-primary" size={14} />
            Your productivity is excellent in task volume, but could improve in consistency
          </motion.div>
        </motion.div>
        
        {/* Add new weekly performance chart */}
        <motion.div 
          className="glass-panel rounded-lg p-6 overflow-hidden relative col-span-full"
          variants={chartItem}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >
          <motion.div 
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <IconWrapper icon={FiTrendingUp} className="mr-2 text-green-500" />
            Weekly Performance
            <motion.span 
              className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Last 7 days
            </motion.span>
          </h2>
          
          <LineChart 
            data={[
              { day: 'Mon', completed: 4, created: 6 },
              { day: 'Tue', completed: 5, created: 4 },
              { day: 'Wed', completed: 3, created: 5 },
              { day: 'Thu', completed: 7, created: 3 },
              { day: 'Fri', completed: 6, created: 8 },
              { day: 'Sat', completed: 2, created: 3 },
              { day: 'Sun', completed: 3, created: 2 },
            ]}
          />
          
          <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Avg. Created</div>
              <div className="text-2xl font-semibold">4.4</div>
              <div className="text-xs text-green-500 flex items-center">
                <IconWrapper icon={FiTrendingUp} size={12} className="mr-1" />
                +12% from last week
              </div>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Avg. Completed</div>
              <div className="text-2xl font-semibold">4.3</div>
              <div className="text-xs text-green-500 flex items-center">
                <IconWrapper icon={FiTrendingUp} size={12} className="mr-1" />
                +8% from last week
              </div>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Most Productive</div>
              <div className="text-2xl font-semibold">Thu</div>
              <div className="text-xs text-gray-400">7 tasks completed</div>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Busiest Day</div>
              <div className="text-2xl font-semibold">Fri</div>
              <div className="text-xs text-gray-400">8 tasks created</div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Distribution by category donut chart */}
        <motion.div 
          className="glass-panel rounded-lg p-6 overflow-hidden relative"
          variants={chartItem}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5 }}
        >
          <motion.div 
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-accent1/5 to-transparent blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <IconWrapper icon={FiPieChart} className="mr-2 text-accent1" />
            Tasks Distribution
          </h2>
          
          <DonutChart 
            data={categoryStats.slice(0, 5).map(cat => ({
              name: cat.name,
              value: cat.count,
              color: cat.color
            }))}
          />
          
          <motion.div
            className="mt-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {categoryStats.slice(0, 5).map((cat, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-1.5 bg-gray-800/30 px-2 py-1 rounded-full text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span>{cat.name}</span>
                <span className="text-gray-400">({cat.count})</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics; 