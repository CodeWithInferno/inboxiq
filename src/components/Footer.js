import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Youtube, Mail, MessageCircle, Heart, HelpCircle, FileText, Shield } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about", icon: Mail },
        { name: "Careers", href: "/careers", icon: MessageCircle },
        { name: "Love", href: "/love", icon: Heart },
      ]
    },
    {
      title: "Product",
      links: [
        { name: "AI Features", href: "/ai", icon: MessageCircle },
        { name: "Enterprise", href: "/enterprise", icon: Shield },
        { name: "Integrations", href: "/integrations", icon: Mail },
        { name: "Solutions", href: "/solutions", icon: MessageCircle },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help", icon: HelpCircle },
        { name: "Documentation", href: "/docs", icon: FileText },
        { name: "Tutorials", href: "/tutorials", icon: MessageCircle },
      ]
    }
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

  return (
    <footer className="relative bg-gray-900 text-gray-200 py-20 overflow-hidden">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-900" />
      
      {/* Animated Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-700/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Top Section with Gradient Text */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Power up your
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> inbox</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals who use InboxIQ to take control of their email workflow
          </p>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16"
        >
          {footerSections.map((section, idx) => (
            <motion.div key={idx} variants={item} className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <span className="h-px w-8 bg-purple-400/50"></span>
                <span>{section.title}</span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li key={linkIdx} whileHover={{ x: 5 }} className="transition-colors">
                    <Link href={link.href} className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 group">
                      <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 via-gray-800/50 to-gray-900/50 backdrop-blur-xl mb-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Stay in the loop</h4>
              <p className="text-gray-400">Get the latest updates and tips straight to your inbox</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none flex-grow md:w-64"
              />
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              InboxIQ
            </span>
            <span className="text-sm text-gray-500">© 2024. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            {[Twitter, Linkedin, Youtube].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ scale: 1.2, y: -2 }}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;