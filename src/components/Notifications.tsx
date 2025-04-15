import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckCircle, FiClock, FiTrash2, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';
import IconWrapper from './IconComponent';

// Sample notification data
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Task Completed',
    message: 'You have completed "Morning Meditation" task',
    time: '10 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Task Due Soon',
    message: 'Your task "Update Portfolio" is due in 2 hours',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'New Category Created',
    message: 'You created a new category "Work Projects"',
    time: '2 days ago',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Task Overdue',
    message: 'Task "Submit Report" is now overdue by 1 day',
    time: '1 day ago',
    read: true
  },
  {
    id: '5',
    type: 'success',
    title: 'Progress Update',
    message: 'You completed 75% of your tasks this week!',
    time: '3 days ago',
    read: true
  }
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const clearAll = () => {
    setNotifications([]);
  };
  
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <IconWrapper icon={FiCheckCircle} className="text-green-500" size={20} />;
      case 'warning': return <IconWrapper icon={FiClock} className="text-yellow-500" size={20} />;
      case 'info': return <IconWrapper icon={FiInfo} className="text-blue-500" size={20} />;
      case 'error': return <IconWrapper icon={FiAlertCircle} className="text-red-500" size={20} />;
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <IconWrapper icon={FiBell} size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <motion.div 
              className="bg-primary text-white text-xs font-medium rounded-full px-2 py-1 ml-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {unreadCount} new
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-primary bg-opacity-20 text-primary' 
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'unread' 
                ? 'bg-primary bg-opacity-20 text-primary' 
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Unread
          </button>
          <motion.button
            onClick={markAllAsRead}
            className="ml-2 text-sm text-gray-400 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </motion.button>
          <motion.button
            onClick={clearAll}
            className="ml-2 text-sm text-gray-400 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={notifications.length === 0}
          >
            Clear all
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <motion.div
                key={notification.id}
                className={`glass-panel p-4 rounded-lg ${
                  !notification.read ? 'border-l-4 border-primary' : ''
                }`}
                variants={item}
                layout
                exit={{ opacity: 0, x: -100 }}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        <motion.button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={notification.read}
                          title="Mark as read"
                        >
                          <IconWrapper icon={FiCheckCircle} size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete notification"
                        >
                          <IconWrapper icon={FiTrash2} size={16} />
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="glass-panel p-8 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 1 }}
                >
                  <IconWrapper icon={FiBell} size={48} className="text-gray-500" />
                </motion.div>
              </div>
              <h2 className="text-xl font-semibold mb-2">No notifications</h2>
              <p>You're all caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Notifications; 