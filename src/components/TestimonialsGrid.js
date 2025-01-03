// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import Image from 'next/image';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';
// import { motion } from 'framer-motion';

// const testimonials = [
//   {
//     name: "Jane D.",
//     role: "CEO at TechFlow",
//     feedback: "InboxIQ has transformed how I handle emails. The AI automation is incredible - it\"s like having a personal email assistant working 24/7.",
//     image: "/Deep Purple.jpg",
//     rating: 5,
//     company: "TechFlow",
//     location: "San Francisco, CA",
//     verified: true
//   },
//   {
//     name: "Harsh P.",
//     role: "Product Designer",
//     feedback: "The inbox zero feature is a game-changer. I went from 3000+ unread emails to a clean inbox in just two days. Absolutely worth every penny!",
//     image: "/Deep Purple.jpg",
//     rating: 5,
//     company: "DesignMate",
//     location: "New York, NY",
//     verified: true
//   },
//   {
//     name: "Sarah M.",
//     role: "Marketing Director",
//     feedback: "Finally, an email tool that actually understands context! The smart categorization and AI responses have saved me countless hours.",
//     image: "/Deep Purple.jpg",
//     rating: 5,
//     company: "GrowthLabs",
//     location: "London, UK",
//     verified: true
//   }
// ];

// const TestimonialSlider = () => {
//   const renderStars = (rating) => (
//     <div className="flex items-center gap-0.5">
//       {[...Array(5)].map((_, index) => (
//         <svg
//           key={index}
//           className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       ))}
//     </div>
//   );

//   return (
//     <section className="relative overflow-hidden py-24">
//       {/* Background decoration */}
//       <div className="absolute inset-0 bg-transparent dark:bg-transparent" />
//       <div className="bg-transparent dark:bg-transparent" />
      
//       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-20">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex flex-col items-center gap-6"
//           >
//             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium">
//               <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
//               Customer Stories
//             </span>
            
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
//               Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">thousands</span>
//             </h2>
            
//             <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg">
//               See why over 10,000+ professionals trust InboxIQ to manage their email workflow
//             </p>
//           </motion.div>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="relative">
//           {/* Decorative blobs */}
//           <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
//           <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
//           <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

//           <Swiper
//             modules={[Pagination, Autoplay, EffectFade]}
//             pagination={{
//               clickable: true,
//               dynamicBullets: true,
//             }}
//             autoplay={{
//               delay: 5000,
//               disableOnInteraction: false,
//             }}
//             spaceBetween={32}
//             slidesPerView={1}
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 },
//             }}
//             className="testimonial-slider !overflow-visible"
//           >
//             {testimonials.map((testimonial, index) => (
//               <SwiperSlide key={index} className="pb-12">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className="group h-full"
//                 >
//                   <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
//                     {/* Verified badge */}
//                     {testimonial.verified && (
//                       <div className="absolute top-6 right-6">
//                         <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
//                         </svg>
//                       </div>
//                     )}

//                     <div className="flex flex-col h-full">
//                       {/* Rating */}
//                       <div className="mb-6">{renderStars(testimonial.rating)}</div>

//                       {/* Testimonial */}
//                       <blockquote className="flex-grow">
//                         <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
//                           "{testimonial.feedback}"
//                         </p>
//                       </blockquote>

//                       {/* Profile */}
//                       <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
//                         <div className="relative w-12 h-12">
//                           <Image
//                             src={testimonial.image}
//                             alt={testimonial.name}
//                             fill
//                             className="object-cover rounded-full ring-2 ring-purple-500/20"
//                           />
//                         </div>
//                         <div>
//                           <div className="font-semibold text-gray-900 dark:text-white">
//                             {testimonial.name}
//                           </div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400">
//                             {testimonial.role} · {testimonial.location}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialSlider;
















import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Jane D.',
    role: 'CEO at TechFlow',
    feedback:
      'InboxIQ has transformed how I handle emails. The AI automation is incredible – it’s like having a personal email assistant working 24/7.',
    image: '/Deep Purple.jpg',
    rating: 5,
    company: 'TechFlow',
    location: 'San Francisco, CA',
    verified: true,
  },
  {
    name: 'Harsh P.',
    role: 'Product Designer',
    feedback:
      'The inbox zero feature is a game-changer. I went from 3000+ unread emails to a clean inbox in just two days. Absolutely worth every penny!',
    image: '/Deep Purple.jpg',
    rating: 5,
    company: 'DesignMate',
    location: 'New York, NY',
    verified: true,
  },
  {
    name: 'Sarah M.',
    role: 'Marketing Director',
    feedback:
      'Finally, an email tool that actually understands context! The smart categorization and AI responses have saved me countless hours.',
    image: '/Deep Purple.jpg',
    rating: 5,
    company: 'GrowthLabs',
    location: 'London, UK',
    verified: true,
  },
];

const TestimonialSlider = () => {
  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Subtle background pattern or gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-pink-50 to-transparent opacity-40 dark:opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              Customer Stories
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Loved by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                thousands
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-lg">
              See why over 10,000+ professionals trust InboxIQ to manage their
              email workflow
            </p>
          </motion.div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Animated decorative blobs (optional) */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-slider !overflow-visible"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group h-full"
                >
                  <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    {/* Verified badge */}
                    {testimonial.verified && (
                      <div className="absolute top-6 right-6">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex flex-col h-full">
                      {/* Rating */}
                      <div className="mb-6">{renderStars(testimonial.rating)}</div>

                      {/* Testimonial */}
                      <blockquote className="flex-grow">
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                          “{testimonial.feedback}”
                        </p>
                      </blockquote>

                      {/* Profile */}
                      <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="relative w-12 h-12">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover rounded-full ring-2 ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role} · {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
