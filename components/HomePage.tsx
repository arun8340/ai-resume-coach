"use client";

import Image from "next/image";
import { FileText, Sparkles, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Build Your <span className="text-green-600">AI-Powered</span> Resume
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto md:mx-0">
            Tailor your resume, generate personalized cover letters, and practice
            interviews — all with AI assistance designed to land you your dream job.
          </p>
          <Link
            href="/resume"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/Resume-bro.svg"
            alt="Resume mockup illustration"
            width={450}
            height={350}
            className="w-full max-w-sm md:max-w-md"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-green-500" />}
              title="Smart Resume Builder"
              desc="Generate ATS-friendly resumes tailored for specific roles."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-green-500" />}
              title="AI-Powered Cover Letters"
              desc="Personalized cover letters that stand out to recruiters."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-green-500" />}
              title="Interview Practice"
              desc="Prepare for interviews with realistic AI-driven questions."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-green-500" />}
              title="Instant Feedback"
              desc="Get actionable insights to improve your applications."
            />
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Start building your AI-powered resume and cover letter today.
        </p>
        <Link
          href="/get-started"
          className="px-8 py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition"
        >
          Get Started for Free
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition text-center flex flex-col items-center">
      {icon}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}
