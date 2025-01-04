import React from 'react';
import { motion } from "framer-motion";
import { Mail, FilterX, AlertCircle, Zap, ArrowRight } from 'lucide-react';

const Problem = () => {
  const problems = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Cluttered Inbox",
      description: "Drowning in a sea of unread emails? Our AI-powered system helps you surface what truly matters.",
      gradient: "from-blue-500/20 via-purple-500/20 to-purple-500/10",
      stat: "62%",
      statText: "of professionals struggle with email overload"
    },
    {
      icon: <FilterX className="w-8 h-8" />,
      title: "Manual Email Sorting",
      description: "Stop wasting hours organizing emails. Let our smart filters do the heavy lifting for you.",
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/10",
      stat: "4.5h",
      statText: "saved weekly with automated sorting"
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Missed Opportunities",
      description: "Never miss an important email again with our priority inbox and smart notifications.",
      gradient: "from-pink-500/20 via-red-500/20 to-pink-500/10",
      stat: "89%",
      statText: "reduction in missed important emails"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-purple-500 uppercase tracking-wider">
              Common Email Challenges
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
          >
            Transform Your Inbox Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Experience email management reimagined with AI-powered solutions that save time and boost productivity.
          </motion.p>
        </div>

        {/* Problem Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card Background with Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Icon Container */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {problem.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {problem.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {problem.description}
                </p>

                {/* Stats */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-2xl font-bold text-purple-500 mb-1">
                        {problem.stat}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {problem.statText}
                      </span>
                    </div>
                    <button className="group/btn flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;