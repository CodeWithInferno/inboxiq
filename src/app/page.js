'use client';
import Navbar from "../app/components/header";
import { useEffect, useRef } from "react";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import Features from "@/components/Features";

export default function Home() {
  const videoRef = useRef(null);

  // Play video on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 } // Play when 50% of video is visible
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
    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#1a1a2e] dark:text-white bg-[radial-gradient(#e5e7eb_1.5px,transparent_1px)] dark:bg-[radial-gradient(#33373e_1px,transparent_1px)] [background-size:16px_16px]">
      <Navbar />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
        {/* Main Headline */}
        <h1 className="font-serif text-gray-400 font-extrabold  text-6xl md:text-6xl lg:text-7xl leading-tight max-w-2xl">
          Stop wasting half your day in mail
        </h1>

        {/* Subheadline */}
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
          Automate your email with AI, bulk unsubscribe from newsletters, and block cold emails. Open-source.
        </p>

        {/* Call-to-Action Button */}
        <button
          className="px-8 py-4 mt-5 text-white font-semibold text-lg rounded-md transition-transform transform hover:scale-105
             bg-gradient-to-r from-pink-500 to-purple-500 border-2 border-purple-500
             shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>


      </div>

      {/* Video Section */}
      <div className="flex items-center justify-center mt-12">
        <video
          ref={videoRef}
          src="/Sample2.mov" // Replace with actual video path
          className="rounded-3xl shadow-lg"
          muted
          loop
          style={{
            width: "90%",
            maxHeight: "100vh",
            objectFit: "cover",
            boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.5)", // Blue shadow effect
          }}
          onMouseEnter={() => videoRef.current.play()}
          onMouseLeave={() => videoRef.current.pause()}
        />
      </div>

      {/* Testimonials and Features Section */}
      <section>
        <h2 className="mt-48 text-center font-bold">
          <p className="leading-tight font-mono text-xl">InboxIQ love</p>
          <span className="mt-2 leading-tight text-4xl">Clean Inbox, Happy Life</span>
        </h2>
        <div className="w-full  text-left mx-auto mt-8 px-4">
          <TestimonialsGrid />
        </div>
        <div className="mt-16 ">
          <Features />
        </div>
      </section>
    </div>
  );
}
