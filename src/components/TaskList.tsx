import React, { useState, useEffect, useMemo } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
  DragMoveEvent,
  UniqueIdentifier
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import { Task, TaskPriority } from '../context/TodoContext';
import { useTodoContext } from '../context/TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiArrowUp, FiMenu } from 'react-icons/fi';
import IconWrapper from './IconComponent';

interface TaskListProps {
  tasks: Task[];
  categoryId?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, categoryId }) => {
  const { updateTaskOrder, updateTaskPriority } = useTodoContext();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [recentlyMovedTask, setRecentlyMovedTask] = useState<string | null>(null);

  // Calculate completion stats
  const stats = useMemo(() => {
    const total = localTasks.length;
    const completed = localTasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [localTasks]);

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Reset recently moved task indicator after animation
  useEffect(() => {
    if (recentlyMovedTask) {
      const timer = setTimeout(() => {
        setRecentlyMovedTask(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recentlyMovedTask]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slightly increased to prevent accidental drags
        tolerance: 8,
        delay: 0, // Remove delay for immediate response
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setOverId(active.id);
    const task = localTasks.find(task => task.id === active.id);
    if (task) {
      setDraggedTask(task);
    }
    
    // Add class to body to indicate dragging is in progress
    document.body.classList.add('dragging-active');
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event;
    if (over) {
      setOverId(over.id);
    }
  };

  // Update task priority based on its position in the pending tasks list
  const updateTaskPriorityByPosition = (tasks: Task[], categoryId: string) => {
    const pendingTasks = tasks.filter(task => !task.completed);
    
    pendingTasks.forEach((task, index) => {
      let newPriority: TaskPriority;
      const pendingCount = pendingTasks.length;
      
      if (pendingCount <= 3) {
        // For few tasks, simple approach
        if (index === 0) {
          newPriority = 'high';
        } else if (index === pendingCount - 1) {
          newPriority = 'low';
        } else {
          newPriority = 'medium';
        }
      } else {
        // For more tasks, proportional approach
        if (index < Math.ceil(pendingCount * 0.25)) {
          // Top 25% get high priority
          newPriority = 'high';
        } else if (index < Math.ceil(pendingCount * 0.75)) {
          // Middle 50% get medium priority
          newPriority = 'medium'; 
        } else {
          // Bottom 25% get low priority
          newPriority = 'low';
        }
      }
      
      // Only update if priority has changed
      if (task.priority !== newPriority) {
        updateTaskPriority(categoryId, task.id, newPriority);
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = localTasks.findIndex(task => task.id === active.id);
      const newIndex = localTasks.findIndex(task => task.id === over.id);
      
      const newOrder = arrayMove(localTasks, oldIndex, newIndex);
      setLocalTasks(newOrder);
      
      // Mark task as recently moved for animation
      setRecentlyMovedTask(active.id as string);
      
      // Always update order in context to persist changes
      const taskCategoryId = categoryId || (draggedTask?.categoryId || '');
      if (taskCategoryId) {
        updateTaskOrder(taskCategoryId, newOrder);
        
        // Update priorities based on new positions
        updateTaskPriorityByPosition(newOrder, taskCategoryId);
      }
    }
    
    setActiveId(null);
    setDraggedTask(null);
    setOverId(null);
    
    // Remove dragging class
    document.body.classList.remove('dragging-active');
  };

  // Enhanced drag animation with smoother transitions
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
          transform: 'scale(1.05)',
        }
      }
    }),
    easing: 'cubic-bezier(0.2, 0, 0.1, 1)',
    duration: 350, // Shorter for snappier response
  };

  // Group tasks by completion status
  const pendingTasks = localTasks.filter(task => !task.completed);
  const completedTasks = localTasks.filter(task => task.completed);

  // Get overdue tasks (due date is in the past and task is not completed)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = pendingTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < today
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const listItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.98
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      x: -10, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  // Progress indicator effect
  const progressIndicatorVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${stats.percentage}%`,
      transition: { 
        duration: 1, 
        ease: "easeOut",
        delay: 0.1 
      }
    }
  };

  // Rendering a placeholder for the drop target
  const renderDropPlaceholder = (itemId: string) => {
    if (activeId === itemId || overId !== itemId) return null;
    
    return (
      <motion.div 
        className="h-2 w-full bg-primary rounded-full my-2"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.5, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.2 }}
      />
    );
  };

  // Get the class for a recently moved task
  const getRecentlyMovedClass = (taskId: string) => {
    if (recentlyMovedTask === taskId) {
      return "recently-moved-task";
    }
    return "";
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      {/* Progress indicator */}
      <motion.div 
        className="mb-6 glass-panel overflow-hidden p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Progress</span>
          <motion.div
            className="text-sm font-medium flex items-center gap-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <span className="text-primary font-semibold text-lg">{stats.percentage}%</span>
            <span>completed</span>
          </motion.div>
        </div>
        
        <div className="w-full h-3 bg-gray-800 bg-opacity-20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent2 rounded-full"
            variants={progressIndicatorVariants}
            initial="initial"
            animate="animate"
          >
            {stats.percentage > 3 && (
              <motion.div
                className="h-full w-full"
                animate={{ 
                  background: ["linear-gradient(90deg, #8B5CF6, #10B981)", "linear-gradient(90deg, #10B981, #8B5CF6)"],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <div>
            <span className="text-white font-medium">{stats.completed}</span> of <span className="text-white font-medium">{stats.total}</span> tasks completed
          </div>
          {stats.percentage < 100 && pendingTasks.length > 0 && (
            <motion.div 
              className="flex items-center gap-1 text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <IconWrapper icon={FiArrowUp} size={12} />
              <span>Drag tasks to reorder priority</span>
            </motion.div>
          )}
          {stats.percentage === 100 && (
            <motion.div 
              className="text-accent2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              All tasks completed!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Priority guide */}
      <motion.div
        className="mb-4 p-3 text-xs bg-black bg-opacity-20 rounded-lg flex items-center justify-between"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded-md font-medium">High Priority ↑</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-md font-medium">Medium Priority</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-400 rounded-md font-medium">Low Priority ↓</span>
        </div>
        <div className="text-primary">Use the <IconWrapper icon={FiMenu} size={10} className="inline transform rotate-90" /> handle to reorder</div>
      </motion.div>

      <div className="space-y-6">
        {/* Overdue tasks section */}
        <AnimatePresence>
          {overdueTasks.length > 0 && (
            <motion.div 
              key="overdue-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <motion.div 
                className="flex items-center gap-2 mb-3 text-danger font-medium"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              >
                <IconWrapper icon={FiAlertCircle} size={18} className="text-danger" />
                <h3 className="text-lg font-semibold">Overdue</h3>
              </motion.div>
              
              <SortableContext items={overdueTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-0"
                >
                  <AnimatePresence>
                    {overdueTasks.map(task => (
                      <React.Fragment key={task.id}>
                        {renderDropPlaceholder(task.id)}
                        <motion.div 
                          variants={listItemVariants}
                          exit="exit"
                          layout
                          className={`mb-2 ${activeId === task.id ? "opacity-50 transform scale-105 z-50" : ""} ${getRecentlyMovedClass(task.id)}`}
                          animate={recentlyMovedTask === task.id ? {
                            backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(0, 0, 0, 0)'],
                            borderColor: ['rgba(139, 92, 246, 0.8)', 'rgba(255, 255, 255, 0.2)'],
                            transition: { duration: 1.5 }
                          } : {}}
                        >
                          <TaskItem 
                            task={task} 
                            categoryId={categoryId || task.categoryId} 
                            isOverdue={true}
                            isDragging={activeId === task.id}
                          />
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pending tasks section */}
        <div className="mb-6">
          <motion.div 
            className="flex items-center justify-between mb-3"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 500 }}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Pending</h3>
              <motion.div 
                className="bg-white bg-opacity-10 rounded-full h-5 min-w-5 px-2 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
              >
                {pendingTasks.length}
              </motion.div>
            </div>
          </motion.div>
          
          <SortableContext items={pendingTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-0"
            >
              <AnimatePresence>
                {pendingTasks.length > 0 ? (
                  pendingTasks
                    .filter(task => !overdueTasks.includes(task))
                    .map(task => (
                      <React.Fragment key={task.id}>
                        {renderDropPlaceholder(task.id)}
                        <motion.div 
                          variants={listItemVariants}
                          exit="exit"
                          layout
                          className={`mb-2 ${activeId === task.id ? "opacity-50 scale-105 z-50" : ""} ${getRecentlyMovedClass(task.id)}`}
                          animate={recentlyMovedTask === task.id ? {
                            backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(0, 0, 0, 0)'],
                            borderColor: ['rgba(139, 92, 246, 0.8)', 'rgba(255, 255, 255, 0.2)'],
                            transition: { duration: 1.5 }
                          } : {}}
                        >
                          <TaskItem 
                            task={task} 
                            categoryId={categoryId || task.categoryId}
                            isDragging={activeId === task.id}
                          />
                        </motion.div>
                      </React.Fragment>
                    ))
                ) : (
                  overdueTasks.length === 0 && (
                    <motion.div 
                      className="glass-panel border-dashed border-gray-700 p-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-gray-400 mb-4">No pending tasks. Great job!</p>
                      <motion.div 
                        className="inline-block"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 15, 
                          delay: 0.5 
                        }}
                      >
                        <AddTask 
                          initialCategoryId={categoryId} 
                          onClose={() => {/* Refresh tasks */}}
                        />
                      </motion.div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </div>

        {/* Completed tasks section */}
        <AnimatePresence>
          {completedTasks.length > 0 && (
            <motion.div 
              key="completed-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pb-6"
            >
              <motion.div 
                className="flex items-center gap-2 mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <IconWrapper icon={FiCheckCircle} size={18} className="text-accent2" />
                <h3 className="text-lg font-semibold">Completed</h3>
                <motion.div 
                  className="bg-accent2 bg-opacity-20 text-accent2 rounded-full h-5 min-w-5 px-2 flex items-center justify-center text-xs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                >
                  {completedTasks.length}
                </motion.div>
              </motion.div>
              
              <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-0"
                >
                  <AnimatePresence>
                    {completedTasks.map(task => (
                      <React.Fragment key={task.id}>
                        {renderDropPlaceholder(task.id)}
                        <motion.div 
                          variants={listItemVariants}
                          exit="exit"
                          layout
                          className={`task-complete mb-2 ${activeId === task.id ? "opacity-50 scale-105 z-50" : ""} ${getRecentlyMovedClass(task.id)}`}
                          animate={recentlyMovedTask === task.id ? {
                            backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(0, 0, 0, 0)'],
                            borderColor: ['rgba(139, 92, 246, 0.8)', 'rgba(255, 255, 255, 0.2)'],
                            transition: { duration: 1.5 }
                          } : {}}
                        >
                          <TaskItem 
                            task={task} 
                            categoryId={categoryId || task.categoryId}
                            isDragging={activeId === task.id}
                          />
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drag overlay for beautiful dragging effect */}
      <DragOverlay adjustScale={true} dropAnimation={dropAnimation} zIndex={1000}>
        {draggedTask ? (
          <div className="opacity-95 w-full transform scale-105 shadow-xl task-item dragging">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.2 }}
            >
              <TaskItem 
                task={draggedTask} 
                categoryId={categoryId || draggedTask.categoryId} 
                isDragging={true}
              />
            </motion.div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskList; 