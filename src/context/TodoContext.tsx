import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  tasks: Task[];
}

interface TodoContextType {
  categories: Category[];
  addCategory: (name: string, color: string, icon: string) => void;
  removeCategory: (id: string) => void;
  addTask: (categoryId: string, title: string, description: string, priority: TaskPriority, dueDate?: Date) => void;
  removeTask: (categoryId: string, taskId: string) => void;
  toggleTaskCompletion: (categoryId: string, taskId: string) => void;
  updateTaskOrder: (categoryId: string, tasks: Task[]) => void;
  updateTaskPriority: (categoryId: string, taskId: string, priority: TaskPriority) => void;
  focusTask: Task | null;
  setFocusTask: (task: Task | null) => void;
  currentCategory: string | null;
  setCurrentCategory: (categoryId: string | null) => void;
}

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Default categories with sample tasks
const defaultCategories: Category[] = [
  {
    id: uuidv4(),
    name: 'Personal',
    color: '#FF6584',
    icon: '🏠',
    tasks: [
      {
        id: uuidv4(),
        title: 'Meditation',
        description: 'Morning meditation session',
        completed: false,
        categoryId: '1',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: 'Grocery shopping',
        description: 'Buy fruits and vegetables',
        completed: true,
        categoryId: '1',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Work',
    color: '#6C63FF',
    icon: '💼',
    tasks: [
      {
        id: uuidv4(),
        title: 'Update portfolio',
        description: 'Add recent projects to portfolio',
        completed: false,
        categoryId: '2',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Fitness',
    color: '#06D6A0',
    icon: '💪',
    tasks: [
      {
        id: uuidv4(),
        title: 'Go for a run',
        description: '5K morning run',
        completed: false,
        categoryId: '3',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];

// Provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('toodo-categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('toodo-categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string, color: string, icon: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
      icon,
      tasks: []
    };
    
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const addTask = (categoryId: string, title: string, description: string, priority: TaskPriority, dueDate?: Date) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      categoryId,
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate
    };

    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: [...category.tasks, newTask]
        };
      }
      return category;
    }));
  };

  const removeTask = (categoryId: string, taskId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.filter(task => task.id !== taskId)
        };
      }
      return category;
    }));
  };

  const toggleTaskCompletion = (categoryId: string, taskId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
                updatedAt: new Date()
              };
            }
            return task;
          })
        };
      }
      return category;
    }));
  };

  const updateTaskOrder = (categoryId: string, tasks: Task[]) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks
        };
      }
      return category;
    }));
  };

  const updateTaskPriority = (categoryId: string, taskId: string, priority: TaskPriority) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                priority,
                updatedAt: new Date()
              };
            }
            return task;
          })
        };
      }
      return category;
    }));
  };

  const contextValue: TodoContextType = {
    categories,
    addCategory,
    removeCategory,
    addTask,
    removeTask,
    toggleTaskCompletion,
    updateTaskOrder,
    updateTaskPriority,
    focusTask,
    setFocusTask,
    currentCategory,
    setCurrentCategory
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}; 