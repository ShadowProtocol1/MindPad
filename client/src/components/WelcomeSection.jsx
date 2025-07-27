import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = ({ user, notesCount }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (notesCount === 0) {
      return "Let's start capturing your thoughts!";
    } else if (notesCount < 5) {
      return "You're building a great collection of notes!";
    } else if (notesCount < 20) {
      return "Your note-taking journey is going strong!";
    } else {
      return "You're a note-taking champion!";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 mb-8 text-white"
    >
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            {getGreeting()}, {user?.name}! 👋
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-100 text-lg"
          >
            {getMotivationalMessage()}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center space-y-2 w-full md:w-auto justify-center"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{notesCount}</div>
              <div className="text-sm text-blue-100">
                {notesCount === 1 ? 'Note' : 'Notes'}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-blue-100">
            Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
