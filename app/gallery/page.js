"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getGalleryImages,
  imageCategories,
} from "../admin/services/galleryService";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadImages();
    setIsLoading(false);
  }, [activeCategory]);

  const loadImages = () => {
    const galleryImages = getGalleryImages(
      activeCategory === "all" ? null : activeCategory
    );

    // Apply search filter if needed
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setImages(
        galleryImages.filter(
          (img) =>
            img.name.toLowerCase().includes(query) ||
            (img.description && img.description.toLowerCase().includes(query))
        )
      );
    } else {
      setImages(galleryImages);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadImages();
  };

  const clearSearch = () => {
    setSearchQuery("");
    loadImages();
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[50vh] mt-16">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-full w-full">
          <Image
            src="/images/about_top.jpg"
            alt="Gallery"
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
                alt="Shehjar Logo"
                width={80}
                height={80}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] animate-text-shimmer drop-shadow-lg">
                Our Gallery
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-6 glow-gold"></div>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-2 drop-shadow-lg animate-fade-in font-medium">
              Explore the visual journey of our restaurant, cuisine, and
              memorable moments
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter & Search */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {imageCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-auto">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gallery..."
                  className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-l-lg text-white focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-r-lg hover:opacity-90"
                >
                  Search
                </button>
              </form>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-400 hover:text-white mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-[rgba(234,219,102,1)] text-xl">
              Loading gallery...
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-lg">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-medium mb-2">No images found</h3>
            <p className="text-gray-400">
              {searchQuery
                ? `No images matching "${searchQuery}"`
                : activeCategory !== "all"
                ? `No images available in the ${
                    imageCategories.find((c) => c.id === activeCategory)?.name
                  } category yet`
                : "Our gallery will be updated soon with beautiful images"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer hover-lift bg-gray-900"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium truncate">
                      {image.name}
                    </h3>
                    {image.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-10">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[rgba(234,219,102,1)] text-2xl z-10"
          >
            ✕
          </button>
          <div className="max-w-5xl w-full">
            <div className="relative h-[60vh] md:h-[75vh] w-full bg-gray-900/50">
              <Image
                src={lightboxImage.url}
                alt={lightboxImage.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-gray-900/80 p-4 mt-2 rounded-lg">
              <h3 className="text-xl font-medium text-white">
                {lightboxImage.name}
              </h3>
              {lightboxImage.description && (
                <p className="text-gray-300 mt-1">
                  {lightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        .hover-lift {
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5),
            0 0 15px rgba(234, 219, 102, 0.3);
        }

        .glow-gold {
          box-shadow: 0 0 15px rgba(234, 219, 102, 0.8);
        }
      `}</style>
    </main>
  );
}
