import { motion } from "framer-motion";
import Image from "next/image";

const Features3 = () => {
  const features = [
    {
      title: "Effortless Email Drafting",
      description:
        "Leverage AI to generate well-structured and professional email drafts in seconds. Save time and focus on what matters most.",
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
          <path d="M12 20h9" />
          <path d="M12 4h9" />
          <path d="M5 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
        </svg>
      ),
    },
    {
      title: "Contextual Suggestions",
      description:
        "AI suggests tone, style, and phrasing based on the email's purpose, ensuring your message resonates with the recipient.",
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
          <circle cx="12" cy="12" r="10" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      title: "Natural Language Input",
      description:
        "Simply tell our AI what you need in plain English, and let it create precise, actionable email content for you.",
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
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
              <div className="absolute inset-0 rounded-r-2xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
                <Image
                  src="/ss2.jpeg" // Replace with your actual image path
                  alt="AI Email Composition"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 mix-blend-overlay" />
              </div>
              {/* Decorative Borders */}
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
                AI Email Composition
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Write Better Emails.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Faster. Smarter. Effortlessly.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-12"
              >
                Save up to 40% of your time by using AI-powered email drafting
                and personalization tools.
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

export default Features3;
