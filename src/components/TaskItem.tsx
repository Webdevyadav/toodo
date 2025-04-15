import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiTrash2, FiFlag, FiClock, FiStar, FiEdit3, FiArrowRight, FiChevronRight, FiAlertCircle, FiMove, FiMenu } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '../context/TodoContext';
import { useTodoContext } from '../context/TodoContext';
import IconWrapper from './IconComponent';

// Extended Task interface to handle optional category properties
interface ExtendedTask extends Task {
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
}

interface TaskItemProps {
  task: ExtendedTask;
  categoryId: string;
  isDragging?: boolean;
  isOverdue?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  categoryId, 
  isDragging = false,
  isOverdue = false
}) => {
  const { toggleTaskCompletion, removeTask, setFocusTask } = useTodoContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging || isSortableDragging ? 50 : 1,
  };
  
  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <IconWrapper icon={FiFlag} className="text-danger" size={16} />;
      case 'medium':
        return <IconWrapper icon={FiFlag} className="text-accent1" size={16} />;
      case 'low':
        return <IconWrapper icon={FiFlag} className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleCompletion = () => {
    if (!task.completed) {
      setShowCompletionEffect(true);
      setTimeout(() => {
        setShowCompletionEffect(false);
        toggleTaskCompletion(categoryId, task.id);
      }, 800);
    } else {
      toggleTaskCompletion(categoryId, task.id);
    }
  };

  const formatDueDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString();
  };
  
  return (
    <motion.div
      variants={item}
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      className={`task-item group relative overflow-hidden backdrop-blur-sm ${
        isDragging || isSortableDragging ? 'dragging' : ''
      } ${
        task.completed ? 'completed' : ''
      } ${
        isOverdue && !task.completed ? 'border-l-4 border-l-danger' : ''
      }`}
      whileHover={{ 
        scale: 1.01, 
        boxShadow: "0 8px 20px rgba(0,0,0,0.14)",
        y: -2
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout="position"
      layoutId={task.id}
      transition={{
        layout: { duration: 0.25, ease: "easeInOut" },
        scale: { duration: 0.2 },
        opacity: { duration: 0.2 }
      }}
    >
      {/* Drag handle button */}
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button 
          className="p-1.5 rounded-full bg-gray-800 bg-opacity-30 hover:bg-primary hover:bg-opacity-20 text-gray-300 mr-2 cursor-grab active:cursor-grabbing touch-manipulation"
          title="Drag to reorder priority"
          whileHover={{ 
            scale: 1.15,
            rotate: [0, -10, 10, -5, 0],
            color: "rgba(139, 92, 246, 1)" // primary color
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          {...listeners}
        >
          <IconWrapper icon={FiMenu} size={16} className="transform rotate-90" />
        </motion.button>
      </motion.div>
      
      {/* Background gradient effect that follows mouse position on hover */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          layoutId={`hover-effect-${task.id}`}
        />
      )}
      
      {/* Animated glowing dot that appears when a task has high priority */}
      {task.priority === 'high' && (
        <motion.div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger"
          animate={{ 
            boxShadow: ["0 0 0px rgba(239, 68, 68, 0)", "0 0 10px rgba(239, 68, 68, 0.7)", "0 0 0px rgba(239, 68, 68, 0)"] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
      
      {/* Colored bar based on priority */}
      <motion.div 
        className={`absolute top-0 right-0 h-full w-1 opacity-50 ${
          task.priority === 'high' ? 'bg-danger' :
          task.priority === 'medium' ? 'bg-accent1' :
          'bg-gray-400'
        }`}
        layoutId={`priority-bar-${task.id}`}
        animate={{ 
          width: isHovered ? '3px' : '2px',
          opacity: isHovered ? 0.8 : 0.5
        }}
      />
      
      {/* Enhanced completion effect with particles */}
      <AnimatePresence>
        {showCompletionEffect && (
          <motion.div 
            className="absolute inset-0 bg-primary bg-opacity-10 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full w-2 h-2"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: i % 3 === 0 ? '#8B5CF6' : i % 3 === 1 ? '#EC4899' : '#3B82F6',
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0 
                }}
                animate={{ 
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut" 
                }}
              />
            ))}
            
            {/* Central checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ 
                scale: [0, 1.5, 1],
                rotate: [-10, 5, 0],
              }}
              transition={{ 
                duration: 0.6, 
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <IconWrapper icon={FiCheck} size={30} className="text-primary" />
            </motion.div>
            
            {/* Pulse ring */}
            <motion.div
              className="absolute w-12 h-12 rounded-full border-2 border-primary"
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ 
                scale: 2.5,
                opacity: 0
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task completion checkbox with enhanced animations */}
      <motion.button
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center relative ${
          task.completed 
            ? 'bg-primary border-primary' 
            : isHovered 
              ? 'border-primary' 
              : 'border-gray-400'
        }`}
        onClick={handleCompletion}
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        animate={{ 
          boxShadow: task.completed 
            ? "0 0 0 2px rgba(139, 92, 246, 0.3)" 
            : isHovered 
              ? "0 0 0 2px rgba(139, 92, 246, 0.2)" 
              : "none"
        }}
      >
        {task.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <IconWrapper icon={FiCheck} size={14} className="text-white" />
          </motion.div>
        )}
        
        {/* Pulse animation for incomplete tasks on hover */}
        {!task.completed && isHovered && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-primary"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ 
              scale: [0.6, 1.4, 0.6], 
              opacity: [0, 0.2, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity
            }}
          />
        )}
      </motion.button>
      
      <motion.div 
        className="flex-1 cursor-pointer" 
        onClick={() => setFocusTask(task)}
        whileHover={{ x: 3 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <motion.h4 
            className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'group-hover:text-white transition-colors duration-300'}`}
            animate={{ 
              x: task.completed ? [0, 5, 0] : 0,
              scale: task.completed ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {task.title}
          </motion.h4>
          
          <div className="flex gap-2 items-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.2 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
            >
              {getPriorityIcon(task.priority)}
            </motion.div>
            
            {task.dueDate && (
              <motion.div 
                className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${
                  isOverdue 
                    ? 'bg-danger bg-opacity-10 text-danger font-medium'
                    : 'bg-gray-800 bg-opacity-50 text-gray-400'
                }`}
                whileHover={{ scale: 1.05, x: 2 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <IconWrapper icon={isOverdue ? FiAlertCircle : FiClock} size={12} />
                <span>{formatDueDate(task.dueDate)}</span>
              </motion.div>
            )}
            
            {task.categoryName && (
              <motion.div 
                className="flex items-center space-x-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                style={{ 
                  backgroundColor: task.categoryColor ? `${task.categoryColor}20` : undefined,
                  color: task.categoryColor || undefined
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {task.categoryIcon && (
                  <span className="mr-1">{task.categoryIcon}</span>
                )}
                {task.categoryName}
              </motion.div>
            )}
          </div>
        </div>
        
        {task.description && (
          <motion.p 
            className="text-sm text-gray-400 mt-1 line-clamp-1 group-hover:line-clamp-2 transition-all duration-300"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.1 }}
          >
            {task.description}
          </motion.p>
        )}
      </motion.div>
      
      {/* Action buttons with enhanced animations */}
      <motion.div 
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-20"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button 
          className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          onClick={() => setFocusTask(task)}
          whileHover={{ 
            scale: 1.1, 
            rotate: 15,
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <IconWrapper icon={FiStar} size={16} className="text-accent1" />
        </motion.button>
        
        <motion.button 
          className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          onClick={() => setFocusTask(task)}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <IconWrapper icon={FiEdit3} size={16} className="text-accent3" />
        </motion.button>
        
        <motion.button 
          className="p-1.5 rounded-full hover:bg-danger hover:bg-opacity-10 transition-colors"
          onClick={() => removeTask(categoryId, task.id)}
          whileHover={{ 
            scale: 1.1, 
            rotate: 15,
            boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.1)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <IconWrapper icon={FiTrash2} size={16} className="text-gray-400 hover:text-danger" />
        </motion.button>
      </motion.div>

      {/* Focus mode button with enhanced animations */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute right-3 flex items-center"
            initial={{ opacity: 0, scale: 0, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <motion.button
              onClick={() => setFocusTask(task)}
              className="bg-primary bg-opacity-20 p-2 rounded-full flex items-center justify-center shadow-lg shadow-primary/10"
              whileHover={{ 
                scale: 1.2, 
                backgroundColor: 'rgba(139, 92, 246, 0.4)',
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <IconWrapper icon={FiChevronRight} size={16} className="text-primary" />
              </motion.div>
            </motion.button>
            <motion.span 
              className="text-xs text-primary font-medium ml-2"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ delay: 0.1 }}
            >
              Focus
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Priority indicator badge */}
      <motion.div
        className="absolute top-0 right-8 px-2 py-0.5 text-xs font-medium rounded-b-md"
        style={{
          backgroundColor: task.priority === 'high' 
            ? 'rgba(239, 68, 68, 0.2)' 
            : task.priority === 'medium'
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(107, 114, 128, 0.2)',
          color: task.priority === 'high' 
            ? '#EF4444' 
            : task.priority === 'medium'
              ? '#F59E0B'
              : '#6B7280'
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'} Priority
      </motion.div>
    </motion.div>
  );
};

export default TaskItem; 