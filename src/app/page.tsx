'use client';

import Navbar from './components/Navbar';
import ChatBot from './components/Chatbot';
import Hero from './components/Hero';
import Features from './components/Features';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
      </main>
      <ChatBot />
    </div>
  );
}
