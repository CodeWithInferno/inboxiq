// import { motion } from 'framer-motion';
// import Image from 'next/image';

// const Features = () => {
//   const features = [
//     {
//       title: "Automate your replies",
//       description: "Our AI agent will reply, forward, or archive emails based on the rules you provide it.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
//         </svg>
//       )
//     },
//     {
//       title: "Planning mode",
//       description: "Let our AI plan what to do for you. Accept or reject in a click.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//           <polyline points="14 2 14 8 20 8" />
//           <line x1="16" y1="13" x2="8" y2="13" />
//           <line x1="16" y1="17" x2="8" y2="17" />
//           <polyline points="10 9 9 9 8 9" />
//         </svg>
//       )
//     },
//     {
//       title: "Instruct in plain English",
//       description: "It's as easy as talking to an assistant or sending a prompt to ChatGPT.",
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//         </svg>
//       )
//     }
//   ];

//   return (
//     <section className="relative py-24 overflow-hidden">
//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-transparent dark:bg-transparent" />
      
//       <div className="container mx-auto px-4">
//         <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
//           {/* Image Section */}
//           <motion.div 
//             initial={{ opacity: 0, x: -100 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="relative w-full lg:w-1/2"
//           >
//             <div className="relative aspect-square lg:aspect-[4/3] w-full max-w-2xl mx-auto">
//               <div className="absolute inset-0 rounded-2xl overflow-hidden">
//                 <Image
//                   src="/ss1.png"
//                   alt="Demo Image"
//                   fill
//                   className="object-cover object-center"
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                 />
//                 {/* Gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 mix-blend-overlay" />
//               </div>
//               {/* Decorative elements */}
//               <div className="absolute -inset-x-20 -inset-y-20 border-2 border-purple-200 dark:border-purple-800/30 rounded-3xl -z-10 transform -rotate-3" />
//               <div className="absolute -inset-x-20 -inset-y-20 border-2 border-pink-200 dark:border-pink-800/30 rounded-3xl -z-10 transform rotate-3" />
//             </div>
//           </motion.div>

//           {/* Content Section */}
//           <motion.div 
//             initial={{ opacity: 0, x: 100 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="w-full lg:w-1/2"
//           >
//             <div className="max-w-xl">
//               <motion.span 
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="inline-block px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
//               >
//                 AI Email Assistant
//               </motion.span>

//               <motion.h2 
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6"
//               >
//                 Sorting, replying, archiving.
//                 <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//                   Automate on your own terms.
//                 </span>
//               </motion.h2>

//               <motion.p 
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="text-lg text-gray-600 dark:text-gray-300 mb-12"
//               >
//                 Keep getting emails that require the same response? Let InboxIQ handle it.
//               </motion.p>

//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="space-y-8"
//               >
//                 {features.map((feature, index) => (
//                   <motion.div
//                     key={feature.title}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
//                     className="flex gap-4 group"
//                   >
//                     <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
//                       {feature.icon}
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                         {feature.title}
//                       </h3>
//                       <p className="text-gray-600 dark:text-gray-300">
//                         {feature.description}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Features;














import { motion } from 'framer-motion';
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: "Automate your replies",
      description: "Our AI agent will reply, forward, or archive emails based on the rules you provide it.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    },
    {
      title: "Planning mode",
      description: "Let our AI plan what to do for you. Accept or reject in a click.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      title: "Instruct in plain English",
      description: "It's as easy as talking to an assistant or sending a prompt to ChatGPT.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-24 overflow-visible">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-1/2 -ml-24 lg:-ml-32"
          >
            <div className="relative aspect-square lg:aspect-[4/3] w-full max-w-3xl">
              <div className="absolute inset-0 rounded-r-2xl overflow-hidden">
                <Image
                  src="/ss1.png"
                  alt="Demo Image"
                  fill
                  className="object-cover object-center scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 mix-blend-overlay" />
              </div>
              {/* Refined decorative elements */}
              <div className="absolute -inset-x-16 -inset-y-16 border border-purple-200/50 dark:border-purple-800/30 rounded-r-3xl -z-10 transform -rotate-2" />
              <div className="absolute -inset-x-16 -inset-y-16 border border-pink-200/50 dark:border-pink-800/30 rounded-r-3xl -z-10 transform rotate-2" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="max-w-xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              >
                AI Email Assistant
              </motion.span>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Sorting, replying, archiving.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Automate on your own terms.
                </span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-12"
              >
                Keep getting emails that require the same response? Let InboxIQ handle it.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 ease-out">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;