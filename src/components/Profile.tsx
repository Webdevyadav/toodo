import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiCamera, FiMoreVertical, FiCheck, FiActivity, FiClock, FiStar } from 'react-icons/fi';
import IconWrapper from './IconComponent';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'User Smith',
    email: 'user@example.com',
    joinDate: 'January 2023',
    bio: 'Task management enthusiast and productivity geek. I love organizing my day and getting things done efficiently.',
    avatar: '👤'
  });
  
  const [editData, setEditData] = useState({...userData});
  
  // Stats data
  const stats = [
    { label: 'Tasks Completed', value: 138, icon: FiCheck, color: 'text-green-500' },
    { label: 'Streaks', value: 14, icon: FiActivity, color: 'text-primary' },
    { label: 'Avg. Completion Time', value: '2.5h', icon: FiClock, color: 'text-secondary' },
    { label: 'Focus Sessions', value: 42, icon: FiStar, color: 'text-accent1' },
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleSave = () => {
    setUserData({...editData});
    setIsEditing(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper icon={FiUser} size={24} className="text-primary" />
        <h1 className="text-2xl font-bold">My Profile</h1>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          className="lg:col-span-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="glass-panel rounded-2xl overflow-hidden"
            variants={item}
          >
            {/* Profile Header with background */}
            <div className="h-28 bg-gradient-to-r from-primary via-secondary to-accent1 relative">
              {/* Edit button */}
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconWrapper icon={FiEdit2} size={18} />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSave}
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconWrapper icon={FiCheck} size={18} />
                </motion.button>
              )}
            </div>
            
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-14 relative z-10 px-6">
              <div className="relative">
                <motion.div 
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-900 flex items-center justify-center text-4xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.avatar}
                      onChange={(e) => setEditData({...editData, avatar: e.target.value})}
                      className="w-full h-full rounded-full bg-transparent text-center text-4xl focus:outline-none"
                      maxLength={2}
                    />
                  ) : (
                    <span>{userData.avatar}</span>
                  )}
                </motion.div>
                {isEditing && (
                  <motion.div
                    className="absolute bottom-0 right-0 p-2 bg-secondary rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconWrapper icon={FiCamera} size={16} />
                  </motion.div>
                )}
              </div>
              
              {/* User Info */}
              <div className="text-center mt-4 w-full">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-xl font-bold bg-transparent border-b border-gray-700 px-2 py-1 text-center focus:outline-none focus:border-primary w-full"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                )}
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-1">
                  <IconWrapper icon={FiMail} size={14} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="bg-transparent border-b border-gray-700 px-2 py-1 text-center focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <span>{userData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-1">
                  <IconWrapper icon={FiCalendar} size={14} />
                  <span>Member since {userData.joinDate}</span>
                </div>
              </div>
              
              {/* Bio */}
              <div className="mt-6 w-full">
                <h3 className="text-sm font-medium text-gray-400 mb-2">About Me</h3>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="w-full bg-gray-800 bg-opacity-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-300">{userData.bio}</p>
                )}
              </div>
            </div>
            
            {/* Bottom actions */}
            <div className="flex justify-around mt-6 pt-4 pb-4 border-t border-gray-800">
              <motion.button
                className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg font-semibold">138</span>
                <span className="text-xs">Tasks</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg font-semibold">14</span>
                <span className="text-xs">Streaks</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg font-semibold">42</span>
                <span className="text-xs">Focus</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Stats and activity */}
        <motion.div 
          className="lg:col-span-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Stats grid */}
          <motion.div variants={item}>
            <h2 className="text-xl font-bold mb-4">My Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass-panel rounded-lg p-4 flex items-center"
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  variants={item}
                >
                  <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                    <IconWrapper icon={stat.icon} size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Recent Activity */}
          <motion.div variants={item}>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="glass-panel rounded-lg p-4">
              <div className="space-y-4">
                {/* Activity timeline */}
                <div className="relative pl-8 pb-4 border-l-2 border-gray-800">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <p className="text-sm text-gray-400">Today, 2:30 PM</p>
                  <p className="font-medium">Completed "Design Project Presentation"</p>
                </div>
                
                <div className="relative pl-8 pb-4 border-l-2 border-gray-800">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-secondary"></div>
                  <p className="text-sm text-gray-400">Today, 11:15 AM</p>
                  <p className="font-medium">Started "Research Market Trends"</p>
                </div>
                
                <div className="relative pl-8 pb-4 border-l-2 border-gray-800">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-accent1"></div>
                  <p className="text-sm text-gray-400">Yesterday, 4:45 PM</p>
                  <p className="font-medium">Created 3 new tasks in "Work" category</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-accent2"></div>
                  <p className="text-sm text-gray-400">Yesterday, 9:30 AM</p>
                  <p className="font-medium">Completed 30 minute focus session</p>
                </div>
              </div>
              
              <motion.button
                className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Activity
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 