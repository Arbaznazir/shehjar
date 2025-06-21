"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { menuData } from "./data/menuData";
import { useCart } from "./context/CartContext";
import { sendReservationToWhatsApp } from "./services/whatsappService";

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [specialCategories, setSpecialCategories] = useState([]);
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [addedItems, setAddedItems] = useState({});

  // Reservation form state
  const [reservationForm, setReservationForm] = useState({
    name: "",
    phone: "",
    guests: "",
    date: "",
    preferredTime: "",
  });
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);

  useEffect(() => {
    // Add is-homepage class to body for homepage-specific styling
    document.body.classList.add("is-homepage");

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove("is-homepage");
    };
  }, []);

  useEffect(() => {
    // Get random menu items for featured section
    const getRandomItems = () => {
      // Create an array of all menu items from various categories
      const allItems = Object.entries(menuData).reduce(
        (acc, [category, items]) => {
          // Add category property to each item
          const itemsWithCategory = items.map((item) => ({
            ...item,
            categoryName: getCategoryName(category),
          }));
          return [...acc, ...itemsWithCategory];
        },
        []
      );

      // Shuffle and pick 6 random items
      return shuffleArray(allItems).slice(0, 6);
    };

    // Get 3 random categories to feature
    const getRandomCategories = () => {
      const categories = [
        {
          id: "wazwan",
          name: "Wazwan Specialties",
          description:
            "Authentic Kashmiri multi-course delicacies prepared with traditional spices",
        },
        {
          id: "tandoori",
          name: "Tandoor Delights",
          description:
            "Succulent and smoky flavors straight from our clay oven",
        },
        {
          id: "pizza",
          name: "Artisan Pizzas",
          description:
            "Hand-stretched crusts with premium toppings and melted cheese",
        },
        {
          id: "burgers",
          name: "Gourmet Burgers",
          description: "Juicy patties with fresh vegetables and special sauces",
        },
        {
          id: "indian",
          name: "Indian Classics",
          description:
            "Time-honored recipes with aromatic spices and rich gravies",
        },
        {
          id: "desserts",
          name: "Sweet Finishes",
          description: "Indulgent treats to perfectly end your meal",
        },
      ];

      return shuffleArray(categories).slice(0, 3);
    };

    setFeaturedItems(getRandomItems());
    setSpecialCategories(getRandomCategories());
  }, []);

  // Helper function to get category name from ID
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      starters: "Starters",
      rockAndRoll: "Rock & Roll",
      pizza: "Pizza",
      burgers: "Burgers",
      sandwiches: "Sandwiches",
      momos: "Momos",
      rice: "Rice",
      tandoori: "Tandoori",
      indian: "Indian",
      breads: "Breads",
      wazwan: "Wazwan",
      continental: "Continental",
      pasta: "Pasta",
      chineseMeals: "Chinese",
      tea: "Tea",
      coffee: "Coffee",
      beverages: "Beverages",
      desserts: "Desserts",
    };
    return categoryMap[categoryId] || categoryId;
  };

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Format price for display
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  // Get price from item (handles variants)
  const getItemPrice = (item) => {
    if (item.variants && item.variants.length > 0) {
      return item.variants[0].price;
    }
    return item.price;
  };

  // Handle adding item to cart from home page
  const handleAddToCart = (item) => {
    // For items with variants, use the first variant
    const selectedVariant =
      item.variants && item.variants.length > 0 ? item.variants[0].size : null;

    // Add item to cart with quantity of 1
    addToCart(item, 1, selectedVariant);

    // Show visual feedback
    setAddedItems((prev) => ({
      ...prev,
      [item.id]: true,
    }));

    // Reset feedback after 1.5 seconds
    setTimeout(() => {
      setAddedItems((prev) => ({
        ...prev,
        [item.id]: false,
      }));
    }, 1500);
  };

  // Handle reservation form input changes
  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle reservation form submission
  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !reservationForm.name ||
      !reservationForm.phone ||
      !reservationForm.guests ||
      !reservationForm.date ||
      !reservationForm.preferredTime
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(reservationForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Please select a future date");
      return;
    }

    setIsSubmittingReservation(true);

    try {
      // Create reservation object with ID
      const reservation = {
        ...reservationForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Send to WhatsApp
      const success = sendReservationToWhatsApp(reservation);

      if (success) {
        // Reset form
        setReservationForm({
          name: "",
          phone: "",
          guests: "",
          date: "",
          preferredTime: "",
        });

        alert(
          "Reservation request sent! We'll contact you shortly to confirm."
        );
      } else {
        alert(
          "Failed to send reservation request. Please try again or call us directly."
        );
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert(
        "Failed to send reservation request. Please try again or call us directly."
      );
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-full w-full">
          <Image
            src="/images/homepage_top.jpg"
            alt="Shehjar Restaurant"
            fill
            priority
            className="object-cover transform scale-105 animate-slow-zoom"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center max-w-3xl px-4 animate-fade-in-up">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/Shehjar Logo.png"
                alt="Shehjar Logo"
                width={120}
                height={120}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                A Culinary Journey
              </span>
              Through Kashmir
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 drop-shadow-lg">
              Traditional flavors with modern flair - Kashmiri cuisine at its
              finest
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-full text-lg font-bold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-gold"
              >
                Explore Menu
              </Link>
              <Link
                href="#reservation"
                className="px-8 py-3 bg-transparent border-2 border-[rgba(234,219,102,1)] text-[rgba(234,219,102,1)] rounded-full text-lg font-bold hover:bg-[rgba(234,219,102,0.1)] transition-all duration-300"
              >
                Reserve Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                Today's
              </span>{" "}
              Specials
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-6 glow-gold"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Handpicked culinary delights that our chef recommends for your
              dining pleasure
            </p>
          </div>

          {/* Featured Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="dish-card relative p-6 rounded-lg border border-[rgba(182,155,76,0.3)] bg-gradient-to-b from-gray-900 to-black group hover:border-[rgba(234,219,102,0.8)] transition-all duration-300 hover:shadow-gold-lg"
              >
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black px-3 py-1 rounded text-sm font-bold">
                  {item.categoryName}
                </div>

                {/* Favorite Heart Icon */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group-hover:bg-black/80"
                >
                  <svg
                    className={`w-5 h-5 transition-all duration-200 ${
                      isFavorite(item.id)
                        ? "text-red-500 fill-current"
                        : "text-white hover:text-red-300"
                    }`}
                    fill={isFavorite(item.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <h3 className="text-xl font-bold mb-2 mt-4 text-white group-hover:text-[rgba(234,219,102,1)] transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {item.description ||
                    "A delicious blend of flavors that will tantalize your taste buds."}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[rgba(234,219,102,1)] font-bold text-lg">
                    {item.variants
                      ? `${formatPrice(item.variants[0].price)}${
                          item.variants.length > 1
                            ? " - " +
                              formatPrice(
                                item.variants[item.variants.length - 1].price
                              )
                            : ""
                        }`
                      : formatPrice(item.price)}
                  </span>
                  <div
                    className={`px-2 py-1 rounded text-xs ${
                      item.isVeg
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {item.isVeg ? "VEG" : "NON-VEG"}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`inline-block px-4 py-2 bg-gradient-to-r ${
                      addedItems[item.id]
                        ? "from-green-600 to-green-500 scale-105"
                        : "from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"
                    } text-black rounded-full text-sm font-bold hover:opacity-95 transition-all duration-300 shadow-gold transform hover:scale-105`}
                  >
                    {addedItems[item.id] ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcases */}
      {specialCategories.map((category, index) => (
        <section
          key={category.id}
          className={`py-16 relative ${
            index % 2 === 0
              ? "bg-gradient-to-r from-gray-900 to-black"
              : "bg-black"
          }`}
        >
          <div className="container mx-auto px-4">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="animate-on-scroll" data-section-index={index + 1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                    {category.name}
                  </span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mb-6 glow-gold"></div>
                <p className="text-gray-300 mb-8 text-lg">
                  {category.description}
                </p>
                <ul className="space-y-4 mb-8">
                  {menuData[category.id]?.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-start">
                      <span className="w-2 h-2 mt-2 bg-[rgba(234,219,102,1)] rounded-full mr-3 flex-shrink-0 glow-gold"></span>
                      <div>
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                        <span className="text-[rgba(234,219,102,1)] ml-2 text-sm">
                          {item.variants
                            ? `from ${formatPrice(item.variants[0].price)}`
                            : formatPrice(item.price)}
                        </span>
                        {item.isVeg !== undefined && (
                          <span
                            className={`ml-2 text-xs ${
                              item.isVeg ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            •
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/menu"
                  className="px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 inline-block shadow-gold"
                >
                  View Full Menu
                </Link>
              </div>
              <div
                className="relative animate-on-scroll"
                data-section-index={index + 2}
              >
                <div className="grid grid-cols-2 gap-4">
                  {menuData[category.id]?.slice(0, 4).map((item, i) => (
                    <div
                      key={item.id}
                      className={`bg-gray-900 p-4 rounded-lg border border-[rgba(182,155,76,0.3)] hover:border-[rgba(234,219,102,0.8)] transition-all duration-300 ${
                        i === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <h4 className="text-white font-bold truncate">
                        {item.name}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[rgba(234,219,102,1)]">
                          {item.variants
                            ? `${formatPrice(item.variants[0].price)}`
                            : formatPrice(item.price)}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.isVeg ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full mt-2 px-2 py-1 bg-gradient-to-r ${
                          addedItems[item.id]
                            ? "from-green-600 to-green-500"
                            : "from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)]"
                        } text-black rounded text-xs font-medium hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all shadow-gold`}
                      >
                        {addedItems[item.id] ? "✓ Added!" : "Add to Cart"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Reservation CTA */}
      <section
        className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative"
        id="reservation"
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] animate-text-shimmer shadow-gold">
              Reserve
            </span>{" "}
            Your Table
          </h2>
          <div className="w-32 h-[2px] bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-8 glow-gold"></div>
          <p className="text-white max-w-2xl mx-auto mb-8 text-lg drop-shadow-md">
            Experience our exquisite cuisine in an elegant atmosphere. Let us
            create memorable moments for you and your loved ones.
          </p>
          <form
            onSubmit={handleReservationSubmit}
            className="bg-black/80 p-8 max-w-md mx-auto rounded-lg border border-[rgba(182,155,76,0.6)] shadow-xl shadow-[rgba(182,155,76,0.15)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={reservationForm.name}
                  onChange={handleReservationChange}
                  placeholder="Your Name"
                  required
                  className="w-full bg-gray-900/90 border border-[rgba(182,155,76,0.4)] rounded-lg p-3 text-white focus:border-[rgba(234,219,102,1)] focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] transition-all duration-300 placeholder-gray-400"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={reservationForm.phone}
                  onChange={handleReservationChange}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-gray-900/90 border border-[rgba(182,155,76,0.4)] rounded-lg p-3 text-white focus:border-[rgba(234,219,102,1)] focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] transition-all duration-300 placeholder-gray-400"
                />
              </div>
              <div>
                <select
                  name="guests"
                  value={reservationForm.guests}
                  onChange={handleReservationChange}
                  required
                  className="w-full bg-gray-900/90 border border-[rgba(182,155,76,0.4)] rounded-lg p-3 text-white focus:border-[rgba(234,219,102,1)] focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] transition-all duration-300 appearance-none custom-select"
                >
                  <option value="" disabled>
                    Number of Guests
                  </option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5+ People</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  value={reservationForm.date}
                  onChange={handleReservationChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-gray-900/90 border border-[rgba(182,155,76,0.4)] rounded-lg p-3 text-white focus:border-[rgba(234,219,102,1)] focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] transition-all duration-300 date-input"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <select
                  name="preferredTime"
                  value={reservationForm.preferredTime}
                  onChange={handleReservationChange}
                  required
                  className="w-full bg-gray-900/90 border border-[rgba(182,155,76,0.4)] rounded-lg p-3 text-white focus:border-[rgba(234,219,102,1)] focus:outline-none focus:ring-1 focus:ring-[rgba(234,219,102,0.5)] transition-all duration-300 appearance-none custom-select"
                >
                  <option value="" disabled>
                    Preferred Time
                  </option>
                  <option value="lunch">Lunch (12:00 PM - 3:00 PM)</option>
                  <option value="dinner">Dinner (7:00 PM - 10:00 PM)</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmittingReservation}
              className={`w-full px-8 py-4 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg text-lg font-bold hover:opacity-95 transition-all duration-300 shadow-gold hover:shadow-gold-lg transform hover:scale-[1.02] ${
                isSubmittingReservation
                  ? "opacity-50 cursor-not-allowed"
                  : "animate-pulse-subtle"
              }`}
            >
              {isSubmittingReservation ? "Sending..." : "Book Your Table"}
            </button>
            <p className="text-gray-300 text-sm mt-4">
              For special requests or large groups, please call us directly at{" "}
              <a
                href="tel:01933-250090"
                className="text-[rgba(234,219,102,1)] font-medium hover:underline"
              >
                01933-250090
              </a>
            </p>
          </form>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .delay-300 {
          animation-delay: 300ms;
        }

        .shadow-gold-lg {
          box-shadow: 0 0 25px rgba(234, 219, 102, 0.5);
        }

        .dish-card {
          transition: all 0.3s ease;
        }

        .dish-card:hover {
          transform: translateY(-5px);
        }

        .form-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(234, 219, 102, 1)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }

        .custom-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(234, 219, 102, 1)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }

        .custom-select option {
          background-color: #111827;
          color: white;
          padding: 8px;
        }

        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(1) sepia(51%) saturate(200%) hue-rotate(350deg)
            brightness(300%);
          opacity: 0.7;
          cursor: pointer;
        }

        input::placeholder,
        select::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        option:checked {
          background: linear-gradient(
            90deg,
            rgba(182, 155, 76, 0.8),
            rgba(234, 219, 102, 0.8)
          );
          color: black;
        }

        input[type="date"]::-webkit-datetime-edit,
        input[type="date"]::-webkit-datetime-edit-fields-wrapper,
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: white;
        }
      `}</style>
    </main>
  );
}
