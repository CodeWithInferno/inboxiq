'use client';
import { useEffect, useRef } from "react";
import Navbar from "../app/components/header";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import Features from "@/components/Features";

export default function Home() {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#1a1a2e] dark:text-white">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1px)] dark:bg-[radial-gradient(#33373e_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <Navbar />

      {/* Hero Section */}
      <div className="relative px-4 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Floating badge */}
            <div className="animate-bounce mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                ✨ Now in Public Beta
              </span>
            </div>

            {/* Main Headline with gradient text */}
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Stop wasting half your day in mail
            </h1>

            {/* Subheadline with improved spacing */}
            <p className="mt-8 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Automate your email with AI, bulk unsubscribe from newsletters, and block cold emails. 
              <span className="text-purple-600 dark:text-purple-400"> Open-source and privacy-first.</span>
            </p>

            {/* CTA Section */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/30">
                Get Started Free
              </button>
              <a href="#demo" className="group flex items-center gap-2 px-8 py-4 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Watch demo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Video Section with enhanced styling */}
          <div className="mt-24 px-4" id="demo">
            <div className="relative mx-auto max-w-6xl">
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob" />
              <div className="absolute -right-4 -bottom-4 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000" />
              
              {/* Video container with enhanced styling */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src="/Sample2.mov"
                  className="w-full object-cover"
                  muted
                  loop
                  playsInline
                  onMouseEnter={() => videoRef.current.play()}
                  onMouseLeave={() => videoRef.current.pause()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="py-24 bg-transparent dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center space-y-4">
            <span className="block font-mono text-xl text-purple-600 dark:text-purple-400">
              InboxIQ love
            </span>
            <span className="block text-4xl md:text-5xl font-bold">
              Clean Inbox, Happy Life
            </span>
          </h2>
          <div className="mt-16">
            <TestimonialsGrid />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <Features />
        </div>
      </section>
    </main>
  );
}










