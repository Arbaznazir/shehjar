"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getGalleryImages,
  imageCategories,
  addGalleryImage,
  deleteGalleryImage,
  optimizeImage,
  updateGalleryImage,
} from "../services/galleryService";

export default function GalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gallery"); // "gallery" or "upload"
  const [activeCategory, setActiveCategory] = useState("all");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageCategory, setImageCategory] = useState("food");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [optimizationStats, setOptimizationStats] = useState(null);
  const fileInputRef = useRef(null);

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "food",
  });

  // Check authentication
  useEffect(() => {
    const adminUser = localStorage.getItem("adminAuth");
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      loadImages();
    }
    setIsLoading(false);
  }, [router]);

  // Load images when category changes
  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  }, [activeCategory, isAuthenticated]);

  // Load gallery images
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

  // Handle file selection for upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    // Set upload file and default name
    setUploadFile(file);
    setImageName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for display name
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Optimize the image
      const optimized = await optimizeImage(uploadFile);
      setOptimizationStats(optimized);
      setUploadProgress(95);

      // Simulate upload completion
      setTimeout(() => {
        // Save image to gallery
        const newImage = addGalleryImage({
          name: imageName,
          description: imageDescription,
          url: previewUrl, // In production, this would be a server URL
          category: imageCategory,
          width: optimized.optimized.width,
          height: optimized.optimized.height,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Reset form
        setTimeout(() => {
          setIsUploading(false);
          setUploadFile(null);
          setPreviewUrl("");
          setImageName("");
          setImageDescription("");
          setOptimizationStats(null);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Switch to gallery view and reload images
          setActiveTab("gallery");
          loadImages();
        }, 1000);
      }, 800);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  // Handle image deletion
  const handleDeleteImage = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this image? This cannot be undone."
      )
    ) {
      deleteGalleryImage(id);
      loadImages();
      if (selectedImage && selectedImage.id === id) {
        setSelectedImage(null);
      }
    }
  };

  // Handle image selection for details view
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setEditData({
      name: image.name,
      description: image.description || "",
      category: image.category,
    });
  };

  // Close details view
  const handleCloseDetails = () => {
    setSelectedImage(null);
    setIsEditMode(false);
  };

  // Enter edit mode
  const handleEditMode = () => {
    setIsEditMode(true);
  };

  // Save edit changes
  const handleSaveEdit = () => {
    if (selectedImage) {
      updateGalleryImage(selectedImage.id, editData);
      setSelectedImage({
        ...selectedImage,
        ...editData,
      });
      setIsEditMode(false);
      loadImages();
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditData({
      name: selectedImage.name,
      description: selectedImage.description || "",
      category: selectedImage.category,
    });
    setIsEditMode(false);
  };

  // Handle search
  const handleSearch = () => {
    loadImages();
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    loadImages();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
          Gallery Manager
        </h1>
        <p className="text-gray-400">
          Upload, organize, and manage images for your website gallery
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-6 py-3 font-medium ${
            activeTab === "gallery"
              ? "border-b-2 border-[rgba(234,219,102,1)] text-[rgba(234,219,102,1)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Image Gallery
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-3 font-medium ${
            activeTab === "upload"
              ? "border-b-2 border-[rgba(234,219,102,1)] text-[rgba(234,219,102,1)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Upload New Image
        </button>
      </div>

      {activeTab === "gallery" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar with categories & filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-3 text-white">Categories</h3>
              <ul className="space-y-2">
                {imageCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-[rgba(182,155,76,0.2)] to-[rgba(234,219,102,0.2)] text-[rgba(234,219,102,1)]"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="font-medium mb-3 text-white">Search</h3>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search images..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)]"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 bg-[rgba(182,155,76,1)] text-black rounded-r-md"
                >
                  🔍
                </button>
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-2 text-sm text-gray-400 hover:text-white"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Main gallery grid */}
          <div className="lg:col-span-3">
            {selectedImage ? (
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h3 className="font-medium text-white">Image Details</h3>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative h-80 w-full bg-gray-800 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">
                          Category
                        </label>
                        <select
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)]"
                        >
                          {imageCategories
                            .filter((cat) => cat.id !== "all")
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-md"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-medium mb-2 text-white">
                        {selectedImage.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {selectedImage.description || "No description provided"}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-800 p-3 rounded-md">
                          <span className="block text-gray-400 text-sm">
                            Category
                          </span>
                          <span className="text-white">
                            {
                              imageCategories.find(
                                (c) => c.id === selectedImage.category
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-md">
                          <span className="block text-gray-400 text-sm">
                            Dimensions
                          </span>
                          <span className="text-white">
                            {selectedImage.width} × {selectedImage.height}
                          </span>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-md">
                          <span className="block text-gray-400 text-sm">
                            Added
                          </span>
                          <span className="text-white">
                            {new Date(
                              selectedImage.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-md">
                          <span className="block text-gray-400 text-sm">
                            Image ID
                          </span>
                          <span className="text-white truncate">
                            {selectedImage.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-800">
                        <button
                          onClick={() => handleDeleteImage(selectedImage.id)}
                          className="px-4 py-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800/50"
                        >
                          Delete Image
                        </button>
                        <button
                          onClick={handleEditMode}
                          className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-md"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {images.length === 0 ? (
                  <div className="bg-gray-900 rounded-lg p-10 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-xl font-medium mb-2 text-white">
                      No images found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery
                        ? `No images matching "${searchQuery}"`
                        : activeCategory !== "all"
                        ? `No images in the "${
                            imageCategories.find((c) => c.id === activeCategory)
                              ?.name
                          }" category`
                        : "Upload your first image to get started"}
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-md font-medium"
                    >
                      Upload New Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="bg-gray-900 rounded-lg overflow-hidden hover:border-[rgba(234,219,102,0.5)] border border-gray-800 transition-colors cursor-pointer"
                        onClick={() => handleSelectImage(image)}
                      >
                        <div className="relative h-48 w-full bg-gray-800">
                          <Image
                            src={image.url}
                            alt={image.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3
                            className="font-medium mb-1 truncate"
                            title={image.name}
                          >
                            {image.name}
                          </h3>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                              {
                                imageCategories.find(
                                  (c) => c.id === image.category
                                )?.name
                              }
                            </span>
                            <span className="text-xs text-gray-400">
                              {image.width} × {image.height}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Upload New Image
          </h2>

          <form onSubmit={handleUpload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">
                    Select Image File (JPG, PNG)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                    disabled={isUploading}
                  />
                </div>

                {previewUrl && (
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Preview</label>
                    <div className="relative h-64 w-full bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Image preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                {uploadFile && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2">
                        Image Name
                      </label>
                      <input
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        placeholder="Give your image a descriptive name"
                        required
                        disabled={isUploading}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-400 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white min-h-[100px]"
                        placeholder="Add a description of this image"
                        disabled={isUploading}
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-400 mb-2">
                        Category
                      </label>
                      <select
                        value={imageCategory}
                        onChange={(e) => setImageCategory(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        disabled={isUploading}
                      >
                        {imageCategories
                          .filter((cat) => cat.id !== "all")
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {isUploading && (
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">
                            {uploadProgress < 100
                              ? "Processing & uploading..."
                              : "Upload complete!"}
                          </span>
                          <span className="text-white text-sm">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {optimizationStats && (
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <h4 className="font-medium mb-2 text-[rgba(234,219,102,1)]">
                          Image Optimized
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Original size:
                            </span>
                            <span className="text-white">
                              {(
                                optimizationStats.original.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Optimized size:
                            </span>
                            <span className="text-white">
                              {(
                                optimizationStats.optimized.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Saved:</span>
                            <span className="text-green-400">
                              {Math.round(
                                ((optimizationStats.original.size -
                                  optimizationStats.optimized.size) /
                                  optimizationStats.original.size) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Format:</span>
                            <span className="text-white">
                              {optimizationStats.original.type.split("/")[1]} →{" "}
                              {optimizationStats.optimized.type.split("/")[1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!uploadFile || isUploading}
                        className="px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isUploading
                          ? "Processing..."
                          : "Upload & Optimize Image"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
