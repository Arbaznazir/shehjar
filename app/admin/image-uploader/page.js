"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ImageUploader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminUser = localStorage.getItem("adminAuth");
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      // In a real app, we would fetch existing images from the server
      // For this demo, we'll simulate with some sample data
      setImages([
        {
          id: 1,
          name: "chicken-biryani.jpg",
          url: "/images/chicken-biryani.jpg",
        },
        {
          id: 2,
          name: "butter-chicken.jpg",
          url: "/images/butter-chicken.jpg",
        },
        { id: 3, name: "default-food.jpg", url: "/images/default-food.jpg" },
      ]);
    }
    setIsLoading(false);
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, this would be handled by a server upload
    // For demo purposes, we'll just create a local preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    setUploadedImage(file);
    // Set default image name based on file name, but allow editing
    setImageName(file.name);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!uploadedImage) return;

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, this would send the file to a server
      // and receive a URL in response

      // Create a simulated image entry
      const newImage = {
        id: Date.now(),
        name: imageName,
        url: `/images/${imageName}`, // This would be a real URL from server in production
      };

      setImages([newImage, ...images]);
      setUploadedImage(null);
      setPreviewUrl("");
      setImageName("");
      setUploading(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const handleDeleteImage = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      // In a real app, this would delete from the server
      setImages(images.filter((image) => image.id !== id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Image path copied to clipboard!");
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Image Uploader
          </h1>
          <p className="text-gray-400">
            Upload and manage images for your menu items.
          </p>
        </div>

        {/* Upload Section */}
        <div className="dish-card rounded-lg p-6 mb-10">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Upload New Image
          </h2>

          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2">
                Choose Image (JPG, PNG)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>

            {previewUrl && (
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Preview</label>
                <div className="relative h-48 w-full bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Image preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {uploadedImage && (
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">
                  Image Name (how it will be saved)
                </label>
                <input
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  This will be the filename used to reference the image in your
                  menu items.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!uploadedImage || uploading}
                className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </form>
        </div>

        {/* Library Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Image Library
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="dish-card rounded-lg overflow-hidden"
              >
                <div className="relative h-40 w-full bg-gray-800">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2 truncate" title={image.name}>
                    {image.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                    >
                      Copy Path
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="px-3 py-1.5 bg-red-900/50 text-red-200 rounded text-xs hover:bg-red-800/50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">
                No images available yet. Upload your first image.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 p-6 bg-gray-900/50 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-[rgba(234,219,102,1)]">
            Note to Developers
          </h3>
          <p className="text-gray-400 text-sm">
            This is a client-side demo of image management. In a production
            environment:
          </p>
          <ul className="list-disc list-inside text-gray-400 text-sm mt-2">
            <li>
              Images would be uploaded to a server or cloud storage (AWS S3,
              Cloudinary, etc.)
            </li>
            <li>Image references would be stored in a database</li>
            <li>The backend would generate optimized versions of each image</li>
            <li>Use Next.js Image optimization features for production</li>
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
