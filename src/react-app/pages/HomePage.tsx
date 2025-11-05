



/**
 * @description This file defines the main HomePage component for NYUThrowingAFit fashion brand website.
 *             It implements a Nike-inspired, high-impact single-page design with full-screen hero section,
 *             asymmetrical manifesto layout, Instagram feed integration, and functional newsletter signup.
 *             The component uses real user content including logo, Instagram profile data, and video assets
 *             while maintaining world-class responsive design and accessibility standards.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomForm } from "../components/CustomForm";
import { CommunityFits } from "../components/CommunityFits";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { InstagramEmbed } from "react-social-media-embed";
import { Instagram, ArrowDown, ExternalLink } from "lucide-react";
import formConfigs from "../../shared/form-configs.json";
import { LatestArticles } from "../../components/LatestArticles";


// Import feature configurations
import socialMediaConfig from "../../../Features/Social Media Sharing.Social Media Sharing.1.json";
import instagramEmbedConfig from "../../../Features/Embed.Embed Instagram Post.1.json";

export const HomePage = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle form data changes
  const handleFormChange = (data: any, errors: any) => {
    setFormData(data);
    console.log("Newsletter form data:", data);
    console.log("Validation errors:", errors);
  };

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: "newsletter_signup", ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
        setFormData({});
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error("Form submission failed:", result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Dual Videos */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <style jsx>{`
          @keyframes float-left {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(-8px) translateY(-4px); }
            50% { transform: translateX(-12px) translateY(0px); }
            75% { transform: translateX(-4px) translateY(4px); }
          }
          
          @keyframes float-right {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(8px) translateY(4px); }
            50% { transform: translateX(12px) translateY(0px); }
            75% { transform: translateX(4px) translateY(-4px); }
          }
          
          @keyframes fade-in-hero {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
          
          @keyframes fade-in-text {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
          
          .video-float-left {
            animation: float-left 8s ease-in-out infinite;
          }
          
          .video-float-right {
            animation: float-right 8s ease-in-out infinite;
          }
          
          .hero-fade-in {
            animation: fade-in-hero 1.2s ease-out forwards;
          }
          
          .text-fade-in {
            animation: fade-in-text 1.8s ease-out 0.6s forwards;
            opacity: 0;
          }
          
          .video-hover {
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .video-hover:hover {
            transform: scale(1.05);
          }
        `}</style>
        
        {/* Header Navigation */}
        <header className="absolute top-0 left-0 right-0 p-8 z-30 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-30">
            <img 
              src="https://heyboss.heeyo.ai/1759182119-d3f89767.png" 
              alt="NYUThrowingAFit Logo" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>
          
          {/* Navigation Links */}
<nav className="flex items-center space-x-6 md:space-x-8">
  <Link
    to="/articles"
    className="text-sm md:text-base font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-300"
  >
    Articles
  </Link>
  <Link 
    to="/submit-fit"
    className="text-sm md:text-base font-medium uppercase tracking-wider bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors duration-300"
  >
    Submit Your Fit
  </Link>
</nav>

        </header>

        {/* Dual Video Container */}
        <div className="hero-fade-in relative z-10 w-full max-w-6xl mx-auto px-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
          {/* Left Video */}
          <div className="video-float-left relative w-full lg:w-1/2 aspect-video">
            <video
              className="video-hover w-full h-full object-cover rounded-2xl shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://heyboss.heeyo.ai/user-assets/heropage1_kDTtoEMZ.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Right Video */}
          <div className="video-float-right relative w-full lg:w-1/2 aspect-video">
            <video
              className="video-hover w-full h-full object-cover rounded-2xl shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://heyboss.heeyo.ai/user-assets/heropage2_rrcMwf19.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Text Overlay */}
        <div className="text-fade-in absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-['Inter'] uppercase tracking-[0.2em] text-white text-center leading-none drop-shadow-2xl">
            Throw Your Fit.
          </h1>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/20 z-5" />
      </section>

      <TwoUpParallaxHero />
      
      <LatestArticles />
      
      {/* Community Fits Section */}
      <CommunityFits />

      {/* Instagram Feed Section */}
      <section id="feed" className="py-32 px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-['Anton'] uppercase mb-16 motion-preset-slide-up">
            The Feed
          </h2>
          
          {/* Instagram Embed */}
          <div className="mb-16 flex justify-center motion-preset-fade-in motion-delay-300">
            <div className="w-full max-w-md">
              <InstagramEmbed
                url={instagramEmbedConfig.url}
                width="100%"
              />
            </div>
          </div>
          
          {/* Follow Button */}
          <a
            href={socialMediaConfig["Instagram URL"]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-white text-black px-12 py-4 text-lg font-bold font-['Inter'] uppercase tracking-wide hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 transform hover:scale-105 motion-preset-slide-up motion-delay-500"
          >
            <Instagram className="h-6 w-6" />
            <span>Follow on IG</span>
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section id="subscribe" className="py-32 px-8">
        <div className="max-w-2xl mx-auto text-center">
          {submitSuccess ? (
            <div className="motion-preset-fade-in">
              <h2 className="text-6xl md:text-8xl font-['Anton'] uppercase mb-8 text-white">
                Welcome to<br />
                The Movement
              </h2>
              <p className="text-xl text-white/80 font-['Inter']">
                You're now part of the NYUThrowingAFit family. Get ready for exclusive drops and stories.
              </p>
            </div>
          ) : (
            <div className="motion-preset-slide-up">
              <CustomForm
                id="newsletter_signup"
                schema={(formConfigs as any).newsletter_signup.jsonSchema}
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                theme={{
                  form: {
                    container: "space-y-8",
                    titleSection: "mb-8",
                    title: "text-6xl md:text-8xl font-bold text-white uppercase tracking-tight font-['Anton'] mb-4",
                    description: "text-xl text-white/80 font-['Inter'] max-w-xl mx-auto",
                    fieldsContainer: "space-y-6 max-w-md mx-auto",
                    buttonSection: "flex justify-center pt-8",
                  },
                  buttons: {
                    submit: {
                      base: `w-full px-12 py-4 bg-white text-black text-lg font-bold font-['Inter'] uppercase tracking-wide hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-200 transform hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`,
                      disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    },
                    reset: {
                      base: "hidden",
                      disabled: "",
                    },
                  },
                  field: {
                    container: "mb-6",
                    label: "sr-only",
                    requiredIndicator: "hidden",
                    description: "hidden",
                    errorMessage: "mt-2 text-sm text-white font-medium text-center",
                  },
                  input: {
                    base: "w-full px-4 py-4 border-2 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 text-lg font-['Inter'] text-center",
                    normal: "border-white/30 hover:border-white/50",
                    error: "border-white",
                    disabled: "bg-white/10 cursor-not-allowed opacity-50",
                    placeholder: "placeholder-white/50",
                  },
                  textarea: {
                    base: "",
                    normal: "",
                    error: "",
                    disabled: "",
                  },
                  select: {
                    base: "",
                    normal: "",
                    error: "",
                    disabled: "",
                  },
                  booleanCheckbox: {
                    container: "",
                    input: "",
                    label: "",
                    description: "",
                  },
                  checkboxGroup: {
                    container: "",
                    optionContainer: "",
                    optionLabel: "",
                    checkbox: "",
                  },
                  dateInput: {
                    base: "",
                    normal: "",
                    error: "",
                    disabled: "",
                  },
                  unsupportedField: {
                    container: "",
                    message: "",
                  },
                }}
              />
              <div className="mt-8">
                <h3 className="text-5xl md:text-6xl font-['Anton'] uppercase mb-4">
                  Join the<br />
                  Movement
                </h3>
                <p className="text-lg text-white/80 font-['Inter']">
                  Get exclusive access to drops, events, and stories.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/60">
            Made with <a href="https://heyboss.ai" className="text-blue-400 underline hover:text-blue-300">Heyboss.ai</a>
          </p>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};


/** 两列交错 Parallax（更短更小） */
const TwoUpParallaxHero: React.FC = () => {
  const IMGS = [
    "/hero/IMG_1.jpg",
    "/hero/IMG_2.jpg",
    "/hero/IMG_3.jpg",
    "/hero/IMG_4.jpg",
    "/hero/IMG_5.jpg",
    "/hero/IMG_6.jpg",
  ];

  // 每个卡片的滚动速度（越大移动越多，正负表示方向）
  const speeds = [0.18, -0.14, 0.16, -0.12, 0.15, -0.1];
  const cardsRef = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;

    // 进场淡入
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform += " translateZ(0)"; // 强制合成层
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((el) => el && io.observe(el));

    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const center = window.scrollY + vh * 0.5;

        cardsRef.current.forEach((el, i) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const mid = rect.top + window.scrollY + rect.height / 2;
          const norm = Math.max(-1, Math.min(1, (mid - center) / (vh * 0.7)));
          const dy = norm * speeds[i % speeds.length] * -120; // 轻微位移即可
          el.style.transform = `translateY(${dy}px)`;
        });
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 左上极简文字（可删） */}
      <div className="pointer-events-none absolute top-8 left-6 md:top-12 md:left-10 z-20 select-none">
        <p className="tracking-[0.18em] uppercase text-xs md:text-sm text-white/60">
          NYUTHROWINGAFIT — NYC
        </p>
        <h1 className="mt-1 font-['Anton'] leading-[0.95] text-[36px] md:text-[64px] uppercase">
          We don’t follow.
        </h1>
      </div>

      {/* 网格容器：手机1列、md起2列；卡片更短更小 */}
      <div className="relative mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {IMGS.map((src, i) => (
          <div
            key={src + i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="opacity-0 transition-opacity duration-700"
            style={{ transform: "translateY(24px)" }}
          >
            <figure className="group relative w-full overflow-hidden rounded-2xl shadow-2xl bg-zinc-900"
                    style={{ aspectRatio: "4 / 5", maxHeight: "68vh" }}>
              <img
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              {/* 顶/底渐隐，压噪点 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/22" />
            </figure>
          </div>
        ))}
      </div>

      {/* 背景轻微网格/暗角 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_50%_50%,transparent_0%,transparent_65%,rgba(0,0,0,.45)_100%)]" />
    </section>
  );
};
