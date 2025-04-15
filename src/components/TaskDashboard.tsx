import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoContext } from '../context/TodoContext';
import { TaskPriority } from '../context/TodoContext';
import TaskList from './TaskList';
import CategoryCard from './CategoryCard';
import { FiPlus, FiX, FiCalendar, FiFlag, FiEdit3, FiList, FiGrid } from 'react-icons/fi';
import IconWrapper from './IconComponent';

const TaskDashboard: React.FC = () => {
  const { categories, currentCategory, addTask } = useTodoContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  
  // Find selected category if one is selected
  const selectedCategory = currentCategory 
    ? categories.find(category => category.id === currentCategory) 
    : null;
  
  // Get all tasks for the "All Tasks" view
  const allTasks = categories.flatMap(category => 
    category.tasks.map(task => ({
      ...task,
      categoryName: category.name,
      categoryColor: category.color,
      categoryIcon: category.icon
    }))
  );

  const handleAddTask = () => {
    if (newTask.title.trim() && selectedCategory) {
      const title: string = newTask.title;
      const description: string = newTask.description;
      const priority: TaskPriority = newTask.priority as TaskPriority;
      const dueDate = newTask.dueDate ? new Date(newTask.dueDate) : undefined;
      
      addTask(
        selectedCategory.id,
        title,
        description,
        priority,
        dueDate
      );
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      
      // Close form
      setIsAddingTask(false);
    }
  };

  const dashboardVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        when: "beforeChildren", 
        staggerChildren: 0.1,
        duration: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 25 }
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-4"
      variants={dashboardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Task List Section Always at Top */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {selectedCategory ? (
              <>
                <motion.div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-opacity-90"
                  style={{ backgroundColor: selectedCategory.color }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {selectedCategory.icon}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-display font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedCategory.name} Tasks
                </motion.h2>
              </>
            ) : (
              <motion.h2 
                className="text-2xl font-display font-bold"
                variants={itemVariants}
              >
                All Tasks
              </motion.h2>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.div className="bg-gray-800 bg-opacity-40 rounded-lg p-1 flex items-center mr-2">
              <motion.button
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-primary bg-opacity-20 text-primary' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
              >
                <IconWrapper icon={FiList} size={16} />
              </motion.button>
              <motion.button
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary bg-opacity-20 text-primary' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
              >
                <IconWrapper icon={FiGrid} size={16} />
              </motion.button>
            </motion.div>
            
            {selectedCategory && (
              <motion.button 
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingTask(true)}
              >
                <IconWrapper icon={FiPlus} size={16} />
                <span>Add Task</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Task Add Form */}
        <AnimatePresence>
          {isAddingTask && (
            <motion.div 
              className="mb-6 glass-panel p-5 relative overflow-hidden"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3
              }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
                layoutId="taskFormHighlight"
              />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">New Task</h3>
                <motion.button 
                  onClick={() => setIsAddingTask(false)}
                  className="text-gray-400 hover:text-white"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconWrapper icon={FiX} size={20} />
                </motion.button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-gray-300 mb-1 text-sm">Task Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-white bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-gray-300 mb-1 text-sm">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-white bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter description..."
                    rows={2}
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Due Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconWrapper icon={FiCalendar} size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full pl-10 px-4 py-2 bg-white bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Priority</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconWrapper icon={FiFlag} size={16} className="text-gray-400" />
                    </div>
                    <select 
                      className="w-full pl-10 px-4 py-2 bg-white bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <motion.button 
                    className="btn-ghost"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddingTask(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                  >
                    <IconWrapper icon={FiEdit3} size={16} />
                    <span>Create Task</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <TaskList 
          tasks={selectedCategory ? selectedCategory.tasks : allTasks} 
          categoryId={selectedCategory?.id} 
        />
      </motion.div>

      {/* Categories Section (only shown if on All Tasks view) */}
      {!selectedCategory && (
        <motion.div className="mt-10" variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <motion.h3 
              className="text-xl font-display font-bold"
              variants={itemVariants}
            >
              Categories
            </motion.h3>
            <motion.button 
              className="btn-ghost flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <IconWrapper icon={FiPlus} size={16} />
              <span>New Category</span>
            </motion.button>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, staggerChildren: 0.05 }}
          >
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
            <motion.div 
              className="category-card border-dashed border-gray-700 flex items-center justify-center cursor-pointer h-36"
              whileHover={{ scale: 1.03, y: -5, borderColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categories.length * 0.05 + 0.1 }}
            >
              <div className="text-center">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <IconWrapper icon={FiPlus} size={20} className="text-primary" />
                </motion.div>
                <p className="text-gray-400 font-medium">Add Category</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskDashboard; 