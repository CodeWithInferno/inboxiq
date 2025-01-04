// 'use client';
// import { useEffect, useRef } from "react";
// import Navbar from "../app/components/header";
// import TestimonialsGrid from "@/components/TestimonialsGrid";
// import Features from "@/components/Features";
// import Features2 from "@/components/features2";
// import Features3 from "@/components/Features3";
// import Features4 from "@/components/Features4";
// import Footer from "@/components/Footer";
// import { MarqueeDemoHorizontal } from "@/components/marquee"; // Import the Marquee component

// export default function Home() {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && videoRef.current) {
//           const playPromise = videoRef.current.play();
//           if (playPromise !== undefined) {
//             playPromise.catch((error) => {
//               console.error("Autoplay prevented by browser:", error);
//             });
//           }
//         } else if (videoRef.current) {
//           videoRef.current.pause();
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (videoRef.current) {
//       observer.observe(videoRef.current);
//     }

//     return () => {
//       if (videoRef.current) {
//         observer.unobserve(videoRef.current);
//       }
//     };
//   }, []);

//   return (
//     <main className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
//       {/* Global background with subtle noise texture */}
//       <div className="fixed inset-0 -z-10">
//         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#33373e_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:from-transparent dark:via-purple-900/10 dark:to-transparent" />
//       </div>

//       <Navbar />

//       {/* Hero Section */}
//       <section className="relative px-4 pt-20 pb-32">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="animate-float mb-8">
//               <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 backdrop-blur-sm">
//                 ✨ Now in Public Beta
//               </span>
//             </div>

//             <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
//               <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
//                 Stop wasting half your day in mail
//               </span>
//             </h1>

//             <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//               Automate your email with AI, bulk unsubscribe from newsletters, and block cold emails. 
//               <span className="text-purple-600 dark:text-purple-400"> Open-source and privacy-first.</span>
//             </p>

//             <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <button className="px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg hover:shadow-purple-500/30 backdrop-blur-sm">
//                 Get Started Free
//               </button>
//               <a href="#demo" className="group flex items-center gap-2 px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
//                 Watch demo
//                 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Video Section */}
//           <div className="mt-24 px-4" id="demo">
//             <div className="relative mx-auto max-w-6xl">
//               <div className="absolute -left-4 -top-4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob" />
//               <div className="absolute -right-4 -bottom-4 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

//               <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm">
//                 <video
//                   ref={videoRef}
//                   src="/Sample2.mov"
//                   className="w-full object-cover"
//                   muted
//                   loop
//                   playsInline
//                   onMouseEnter={() => videoRef.current.play()}
//                   onMouseLeave={() => videoRef.current.pause()}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Marquee Section */}
//       <section className="mt-16 px-4">
//         <MarqueeDemoHorizontal />
//       </section>

//       {/* Testimonials Section */}
//       <section className="relative py-24">
//         <div className="mx-auto max-w-7xl px-4">
//           <h2 className="text-center space-y-4">
//             <span className="block font-mono text-xl text-purple-600 dark:text-purple-400">
//               InboxIQ love
//             </span>
//             <span className="block text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
//               Clean Inbox, Happy Life
//             </span>
//           </h2>
//           <div className="mt-16">
//             <TestimonialsGrid />
//           </div>
//         </div>
//       </section>
//       <section className="py-24 bg-transparent dark:bg-transparent">
//         <div className="mx-auto max-w-7xl px-4">
//           <Features />
//           <Features2 />
//           <Features3 />
//           <Features4 />
//         </div>
//       </section>

//       <Footer />
//     </main>
//   );
// }


























'use client';
import { useEffect, useRef } from "react";
import Navbar from "../app/components/header";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import Features from "@/components/Features";
import Features2 from "@/components/features2";
import Features3 from "@/components/Features3";
import Features4 from "@/components/Features4";
import Footer from "@/components/Footer";
import { MarqueeDemoHorizontal } from "@/components/marquee";
// import HeroVideoDialog from "@/components/ui/hero-video-dialog"; // Import the HeroVideoDialog component
import Problem from "@/components/Problems"; // Import the Problem component
import Pricing from "@/components/Pricing"; // Import the Pricing component



export default function Home() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Global background with subtle noise texture */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#33373e_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:from-transparent dark:via-purple-900/10 dark:to-transparent" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-float mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 backdrop-blur-sm">
                ✨ Now in Public Beta
              </span>
            </div>

            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                Stop wasting half your day in mail
              </span>
            </h1>

            <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Automate your email with AI, bulk unsubscribe from newsletters, and block cold emails.
              <span className="text-purple-600 dark:text-purple-400"> Open-source and privacy-first.</span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg hover:shadow-purple-500/30 backdrop-blur-sm">
                Get Started Free
              </button>
              <a
                href="#demo"
                className="group flex items-center gap-2 px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Watch demo
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Video Section Replacement */}
          {/* <div className="mt-24 px-4" id="demo">
            <div className="relative mx-auto max-w-6xl">
              <HeroVideoDialog
                className="dark:hidden block"
                animationStyle="top-in-bottom-out"
                videoSrc="/Sample2.mov" // Local video file
                thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                thumbnailAlt="Hero Video"
              />
              <HeroVideoDialog
                className="hidden dark:block"
                animationStyle="top-in-bottom-out"
                videoSrc="/Sample2.mov" // Local video file
                thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                thumbnailAlt="Hero Video"
              />
            </div>
          </div> */}

        </div>
      </section>

      {/* Marquee Section */}
      <section className="mt-16 px-4">
        <MarqueeDemoHorizontal />
      </section>
      <section>
        <Problem />
      </section>
      

      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center space-y-4">
            <span className="block font-mono text-xl text-purple-600 dark:text-purple-400">
              InboxIQ love
            </span>
            <span className="block text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Clean Inbox, Happy Life
            </span>
          </h2>
          <div className="mt-16">
            <TestimonialsGrid />
          </div>
        </div>
      </section>
      <section className="py-24 bg-transparent dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <Features />
          <Features2 />
          <Features3 />
          <Features4 />
        </div>
      </section>
      <Pricing />


      <Footer />
    </main>
  );
}
