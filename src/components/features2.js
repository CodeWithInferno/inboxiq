import { motion } from "framer-motion";
import Image from "next/image";

const Features2 = () => {
  const features = [
    {
      title: "Streamlined Event Management",
      description:
        "Easily add events from your emails to your calendar with one click, ensuring you never miss an important meeting or deadline.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      title: "Integrated AI Insights",
      description:
        "Automatically detect event details like date, time, and location from your emails and sync them seamlessly to your calendar.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 20l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 overflow-visible">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-1/2 -mr-24 lg:-mr-32"
          >
            <div className="relative aspect-square lg:aspect-[4/3] w-full max-w-3xl">
              <div className="absolute inset-0 rounded-l-2xl overflow-hidden">
              <Image
  src="/ss2.png" // Replace with your actual image path
  alt="Calendar Integration"
  fill
  className="object-contain object-center"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 to-pink-500/5 mix-blend-overlay" />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -inset-x-16 -inset-y-16 border border-purple-200/50 dark:border-purple-800/30 rounded-l-3xl -z-10 transform rotate-2" />
              <div className="absolute -inset-x-16 -inset-y-16 border border-pink-200/50 dark:border-pink-800/30 rounded-l-3xl -z-10 transform -rotate-2" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
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
                Calendar Integration
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Sync Emails to Your Calendar.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Stay on top of your schedule effortlessly.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-12"
              >
                Save an average of 3 hours per week by automatically syncing
                important events from your emails into your calendar.
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
                    className="flex gap-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
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

export default Features2;
