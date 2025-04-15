import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiFlag, FiTag, FiCheckCircle } from 'react-icons/fi';
import { useTodoContext } from '../context/TodoContext';
import IconWrapper from './IconComponent';

interface AddTaskProps {
  onClose: () => void;
  initialCategoryId?: string;
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, initialCategoryId }) => {
  const { addTask, categories } = useTodoContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState(initialCategoryId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    const categoryId = category || (categories.length > 0 ? categories[0].id : '');
    
    // Slight delay for animation effect
    setTimeout(() => {
      addTask(
        categoryId,
        title,
        description,
        priority,
        dueDate ? new Date(dueDate) : undefined
      );
      
      onClose();
    }, 500);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Task Title</label>
          <input
            type="text"
            className="w-full bg-white bg-opacity-5 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full bg-white bg-opacity-5 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
            placeholder="Add details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div variants={itemVariants}>
            <label className="flex items-center text-sm font-medium mb-1">
              <IconWrapper icon={FiCalendar} size={16} className="mr-2 text-primary" />
              Due Date
            </label>
            <input
              type="date"
              className="w-full bg-white bg-opacity-5 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label className="flex items-center text-sm font-medium mb-1">
              <IconWrapper icon={FiFlag} size={16} className="mr-2 text-accent1" />
              Priority
            </label>
            <select
              className="w-full bg-white bg-opacity-5 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </motion.div>
        </div>
        
        <motion.div variants={itemVariants}>
          <label className="flex items-center text-sm font-medium mb-1">
            <IconWrapper icon={FiTag} size={16} className="mr-2 text-accent2" />
            Category
          </label>
          <select
            className="w-full bg-white bg-opacity-5 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </motion.div>
        
        <motion.div 
          className="pt-4 flex justify-end gap-3"
          variants={itemVariants}
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 bg-opacity-50 text-gray-300 rounded-lg hover:bg-opacity-70 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg flex items-center gap-2 font-medium disabled:opacity-70"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <IconWrapper icon={FiCheckCircle} size={18} />
                <span>Create Task</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddTask; 