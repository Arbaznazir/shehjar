"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { restaurantInfo } from "../data/restaurantInfo";
import Image from "next/image";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".animate-on-scroll");

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.75) {
          section.classList.add("active");
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[70vh] mt-16">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-full w-full">
          <Image
            src="/images/about_top.jpg"
            alt="About Shehjar"
            fill
            priority
            className="object-cover animate-slow-zoom"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 animate-fade-in-up">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/Shehjar Logo.png"
                alt={restaurantInfo.name}
                width={120}
                height={120}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] animate-text-shimmer drop-shadow-lg">
                Our Story
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-6 glow-gold animate-width"></div>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg animate-fade-in font-medium">
              The heritage and passion behind {restaurantInfo.name} Restaurant &
              Bakery
            </p>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Our History Section */}
        <section id="history" className="mb-20 animate-on-scroll">
          <div className="dish-card p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Our Heritage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-gray-300 mb-4">
                  Founded in the heart of Kashmir, {restaurantInfo.name} has
                  been serving authentic Kashmiri cuisine for generations. Our
                  journey began with a simple dream: to share the rich flavors
                  of our homeland with the world.
                </p>
                <p className="text-gray-300 mb-4">
                  What started as a small family kitchen has grown into one of
                  the most beloved culinary destinations in the region. Through
                  decades of dedication to quality and tradition, we've
                  established ourselves as guardians of authentic Kashmiri
                  flavors.
                </p>
                <p className="text-gray-300">
                  Located in {restaurantInfo.address.split("-").join(", ")}, our
                  restaurant has become a landmark for both locals and tourists
                  seeking an authentic taste of Kashmir's rich culinary
                  heritage.
                </p>
              </div>
              <div className="relative h-64 md:h-full min-h-[250px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <Image
                  src="/images/homepage_main_course.jpg"
                  alt="Shehjar History"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="text-sm text-gray-300 italic">
                    Our journey from a family kitchen to a beloved restaurant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section id="philosophy" className="mb-20 animate-on-scroll">
          <div className="dish-card p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Our Philosophy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <p className="text-gray-300 mb-4 animate-on-scroll-item">
                  At {restaurantInfo.name}, we believe that food is more than
                  sustenance—it's a cultural heritage that tells the story of
                  our people. Every dish we serve is a chapter in Kashmir's rich
                  culinary narrative, prepared with recipes passed down through
                  generations.
                </p>
                <p className="text-gray-300 mb-4 animate-on-scroll-item">
                  Our philosophy is simple: authentic ingredients, traditional
                  techniques, and heartfelt hospitality. We source only the
                  finest local ingredients, ensuring that every meal captures
                  the true essence of Kashmiri cuisine.
                </p>
                <p className="text-gray-300 animate-on-scroll-item">
                  We take pride in offering not just a meal, but an
                  experience—one that transports you to the valleys and
                  mountains of Kashmir through flavors that have been perfected
                  over centuries.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 animate-on-scroll-item hover-lift">
                    <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-black text-xl">🌿</span>
                    </div>
                    <h3 className="font-bold mb-2">Quality Ingredients</h3>
                    <p className="text-sm text-gray-400">
                      We source the freshest, highest-quality ingredients from
                      local suppliers.
                    </p>
                  </div>

                  <div
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 animate-on-scroll-item hover-lift"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-black text-xl">👨‍🍳</span>
                    </div>
                    <h3 className="font-bold mb-2">Authentic Recipes</h3>
                    <p className="text-sm text-gray-400">
                      Our chefs honor traditional Kashmiri recipes passed down
                      through generations.
                    </p>
                  </div>

                  <div
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 animate-on-scroll-item hover-lift"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-black text-xl">💖</span>
                    </div>
                    <h3 className="font-bold mb-2">Warm Hospitality</h3>
                    <p className="text-sm text-gray-400">
                      We treat every guest like family, ensuring a memorable
                      dining experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/homepage_desert.jpg"
                    alt="Traditional Cooking"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white font-medium text-center px-4">
                      Preserving traditional flavors with modern techniques
                    </p>
                  </div>
                </div>

                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/normal.jpg"
                    alt="Fresh Ingredients"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <p className="text-white font-medium text-center px-4">
                      Every meal crafted with care and passion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="mb-20 animate-on-scroll">
          <div className="dish-card p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Meet Our Team
            </h2>
            <p className="text-gray-300 mb-8 max-w-3xl">
              Our dedicated team of chefs, servers, and staff work tirelessly to
              create exceptional dining experiences. With deep knowledge of
              Kashmiri cuisine and a passion for hospitality, they are the heart
              and soul of {restaurantInfo.name}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-[rgba(182,155,76,0.3)] to-[rgba(234,219,102,0.3)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-5xl">👨‍🍳</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Master Chefs</h3>
                <p className="text-gray-400 text-sm">
                  Our culinary artists bring decades of experience and a deep
                  understanding of Kashmiri flavor profiles to every dish they
                  create.
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-[rgba(182,155,76,0.3)] to-[rgba(234,219,102,0.3)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-5xl">🤵</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Service Team</h3>
                <p className="text-gray-400 text-sm">
                  Attentive, knowledgeable, and always with a smile, our service
                  team ensures your dining experience is memorable from start to
                  finish.
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-[rgba(182,155,76,0.3)] to-[rgba(234,219,102,0.3)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-5xl">👨‍🍞</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Bakery Artisans</h3>
                <p className="text-gray-400 text-sm">
                  Our bakery team crafts fresh breads and desserts daily,
                  blending traditional Kashmiri recipes with modern techniques.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Experience Authentic Kashmiri Cuisine
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit us at {restaurantInfo.name} to embark on a culinary journey
            through the rich flavors of Kashmir. We look forward to serving you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/menu"
              className="px-8 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium transition-transform hover:scale-105 glow-gold"
            >
              View Our Menu
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-[rgba(234,219,102,1)] text-[rgba(234,219,102,1)] rounded-lg font-medium transition-colors hover:bg-[rgba(234,219,102,0.1)]"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>

      <Footer />

      <style jsx global>{`
        .animate-text-shimmer {
          animation: textShimmer 3s linear infinite,
            pulse-glow 2s ease-in-out infinite alternate;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.5s ease-out forwards;
        }

        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1.5s ease-out forwards;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .animate-on-scroll.active {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slow-zoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }

        .glow-gold {
          box-shadow: 0 0 15px rgba(234, 219, 102, 0.8);
        }

        .shadow-gold {
          text-shadow: 0 0 20px rgba(234, 219, 102, 0.6);
        }

        @keyframes pulse-glow {
          0% {
            text-shadow: 0 0 10px rgba(234, 219, 102, 0.3);
          }
          100% {
            text-shadow: 0 0 25px rgba(234, 219, 102, 0.9),
              0 0 40px rgba(234, 219, 102, 0.4);
          }
        }

        .animate-width {
          animation: width-expand 1.5s ease-in-out forwards;
          width: 0;
        }

        @keyframes width-expand {
          from {
            width: 0;
          }
          to {
            width: 6rem;
          }
        }

        /* Enhanced animations for text and elements */
        .animate-on-scroll-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-on-scroll.active .animate-on-scroll-item {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-on-scroll-item:nth-child(2) {
          transition-delay: 0.2s;
        }

        .animate-on-scroll-item:nth-child(3) {
          transition-delay: 0.4s;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2),
            0 0 15px rgba(234, 219, 102, 0.5);
          border-color: rgba(234, 219, 102, 0.8);
        }

        /* Improved title animation */
        h2.text-3xl {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        h2.text-3xl::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            rgba(182, 155, 76, 1),
            rgba(234, 219, 102, 1)
          );
          animation: line-reveal 1.5s ease-out forwards 0.5s;
        }

        .animate-on-scroll.active h2,
        .animate-on-scroll.active h3,
        .animate-on-scroll.active p {
          animation: text-reveal 0.8s ease-out forwards;
        }

        .animate-on-scroll.active p {
          animation-delay: 0.2s;
        }

        @keyframes line-reveal {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes text-reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Letter animation for the main title - without moving bar */
        .letter-animate {
          display: inline-block;
          animation: textShimmer 3s linear infinite,
            pulse-glow 2s ease-in-out infinite alternate;
          position: relative;
        }
      `}</style>
    </main>
  );
}
