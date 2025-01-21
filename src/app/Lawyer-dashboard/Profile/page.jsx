"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import React from "react";

// Add this at the top level, outside of any component
const loadGoogleMapsScript = (() => {
  let isLoaded = false;
  let callbacks = [];

  function loadScript() {
    if (window.google && window.google.maps) {
      isLoaded = true;
      callbacks.forEach((cb) => cb());
      callbacks = [];
      return;
    }

    // Define callback function before loading script
    window.initMap = () => {
      isLoaded = true;
      callbacks.forEach((cb) => cb());
      callbacks = [];
    };

    const script = document.createElement("script");
    const apiKey = "AIzaSyBUup3wJD1T6htAHG_ayRCM9BDOC6VoPeA";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap&v=beta`;
    script.async = true;

    document.head.appendChild(script);
  }

  return (callback) => {
    if (isLoaded && window.google && window.google.maps) {
      callback();
    } else {
      callbacks.push(callback);
      if (callbacks.length === 1) {
        loadScript();
      }
    }
  };
})();

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("error");
  const [formData, setFormData] = useState({
    city: "",
    officeName: "",
    priorities: [],
    image: null,
    location: "",
    bio: "",
    phone: "",
    whatsapp: "",
    speaksEnglish: false,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [categories, setCategories] = useState([]);
  const [specialtySelections, setSpecialtySelections] = useState([
    { id: 1, value: "", isRequired: true },
    { id: 2, value: "", isRequired: false },
    { id: 3, value: "", isRequired: false },
    { id: 4, value: "", isRequired: false },
  ]);

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${API_BASE_URL}/lawyer/get-lawyer-office-by`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setFormData((prev) => ({
          ...prev,
          city: data.law_office || "",
          officeName: data.law_office || "",
          priorities: data.specialties || [],
          location: data.google_map || "",
          bio: data.bio || "",
          phone: data.call_number || "",
          whatsapp: data.whatsapp_number || "",
          speaksEnglish: data.speaking_english || false,
        }));

        // Set initial specialty selections based on loaded priorities
        if (data.specialties && data.specialties.length > 0) {
          setSpecialtySelections(
            data.specialties.map((specialty, index) => ({
              id: index + 1,
              value: specialty,
              isRequired: index === 0,
            }))
          );
        }

        if (data.profile_image) {
          setImagePreview(data.profile_image);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setNotificationMessage("حدث خطأ أثناء تحميل الملف الشخصي");
        setNotificationType("error");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    fetchLawyerProfile();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${API_BASE_URL}/speciality/get-all-speciality`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setNotificationMessage("حدث خطأ في تحميل التخصصات");
        setNotificationType("error");
        setShowNotification(true);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!token) {
        throw new Error("No token found");
      }

      // Create the request data object with only the data we have
      const requestData = {
        law_office: formData.officeName || "",
        specialties: formData.priorities || [], // This will be the array of specialty IDs
        bio: formData.bio || "",
        google_map: formData.location || "",
        profile_image: formData.image || "",
      };

      console.log("Sending data:", requestData);

      const response = await axios.put(
        `${API_BASE_URL}/lawyer/edit-lawyer-office`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the response (for debugging)
      console.log("Response:", response.data);

      setIsEditing(false);
      setNotificationMessage("تم تحديث الملف الشخصي بنجاح");
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      let errorMessage = "حدث خطأ أثناء تحديث الملف الشخصي";

      // Check for specific validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          // Get the first validation error message
          const firstError = Object.values(validationErrors)[0];
          if (firstError && firstError[0]) {
            errorMessage = firstError[0];
          }
        }
      }

      setNotificationType("error");
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const isValidGoogleMapsUrl = (url) => {
    return url.includes("google.com/maps") || url.includes("goo.gl/maps");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location" && value && !isValidGoogleMapsUrl(value)) {
      setNotificationMessage("الرجاء إدخال رابط صحيح من خرائط جوجل");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (e) => {
    const value = String(e.target.value); // Convert to string for consistency
    setFormData((prev) => {
      // Don't add if already selected
      if (prev.priorities.includes(value)) {
        return prev;
      }
      // Only add if less than 7 items
      if (prev.priorities.length < 7) {
        return {
          ...prev,
          priorities: [...prev.priorities, value],
        };
      }
      return prev;
    });
  };

  const removePriority = (priorityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      priorities: prev.priorities.filter(
        (priority) => priority !== priorityToRemove
      ),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const MapSelector = () => {
    const mapRef = React.useRef(null);
    const searchBoxRef = React.useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
      const initializeMap = () => {
        try {
          if (!window.google || !window.google.maps || !mapRef.current) {
            console.log("Google Maps not loaded yet");
            return;
          }

          const mapOptions = {
            center: { lat: 24.7136, lng: 46.6753 },
            zoom: 6,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapId: "9796f5e900df0b54",
            gestureHandling: "greedy",
          };

          const newMap = new google.maps.Map(mapRef.current, mapOptions);
          setMap(newMap);

          // Create marker icon
          const createMarkerIcon = () => {
            const pinElement = document.createElement("div");
            pinElement.innerHTML = `
              <div style="transform: translate(-50%, -100%);">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            `;
            return pinElement;
          };

          // Create initial marker
          const newMarker = new google.maps.marker.AdvancedMarkerElement({
            map: null,
            position: mapOptions.center,
            content: createMarkerIcon(),
          });

          // Handle map clicks
          newMap.addListener("click", (event) => {
            const position = event.latLng;
            newMarker.position = position;
            newMarker.map = newMap;

            const lat = position.lat();
            const lng = position.lng();
            setFormData((prev) => ({
              ...prev,
              location: `https://www.google.com/maps?q=${lat},${lng}`,
            }));
          });

          // Create location button
          const createLocationButton = () => {
            const locationButton = document.createElement("button");
            locationButton.type = "button";
            locationButton.className =
              "gm-control-active gm-fullscreen-control bg-white rounded-lg shadow-md p-2 m-2 hover:bg-gray-100 transition-colors";
            locationButton.style.border = "none";
            locationButton.style.outline = "none";
            locationButton.style.cursor = "pointer";

            const spinnerContainer = document.createElement("div");
            spinnerContainer.style.display = "none";
            spinnerContainer.innerHTML = `
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            `;

            const locationIcon = document.createElement("div");
            locationIcon.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            `;

            locationButton.appendChild(locationIcon);
            locationButton.appendChild(spinnerContainer);

            let isButtonLocating = false;

            locationButton.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (isButtonLocating) return;

              isButtonLocating = true;
              locationIcon.style.display = "none";
              spinnerContainer.style.display = "block";

              if (navigator.geolocation) {
                const geolocationOptions = {
                  enableHighAccuracy: true, // Request the most accurate position
                  timeout: 15000, // Increased timeout to 15 seconds
                  maximumAge: 0, // Force fresh location reading
                };

                // Try to get a more accurate position with a timeout
                const getAccuratePosition = () => {
                  return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        if (position.coords.accuracy <= 100) {
                          // Accuracy is within 100 meters
                          resolve(position);
                        } else {
                          // Try again if accuracy is not good enough
                          setTimeout(() => {
                            navigator.geolocation.getCurrentPosition(
                              resolve,
                              reject,
                              geolocationOptions
                            );
                          }, 2000);
                        }
                      },
                      reject,
                      geolocationOptions
                    );
                  });
                };

                getAccuratePosition()
                  .then((position) => {
                    const pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };

                    // Smooth animation to new position
                    newMap.panTo(pos);
                    newMap.setZoom(18); // Increased zoom level for better precision

                    // Update marker position
                    newMarker.position = pos;
                    newMarker.map = newMap;

                    setFormData((prev) => ({
                      ...prev,
                      location: `https://www.google.com/maps?q=${pos.lat},${pos.lng}`,
                    }));

                    // Log accuracy for debugging
                    console.log(
                      `Location accuracy: ${position.coords.accuracy} meters`
                    );

                    isButtonLocating = false;
                    locationIcon.style.display = "block";
                    spinnerContainer.style.display = "none";
                  })
                  .catch((error) => {
                    console.error("Error getting location:", error);
                    let errorMessage = "تعذر الوصول إلى موقعك الحالي";

                    switch (error.code) {
                      case error.PERMISSION_DENIED:
                        errorMessage = "يرجى السماح بالوصول إلى موقعك";
                        break;
                      case error.POSITION_UNAVAILABLE:
                        errorMessage = "معلومات الموقع غير متوفرة";
                        break;
                      case error.TIMEOUT:
                        errorMessage = "انتهت مهلة طلب الموقع";
                        break;
                    }

                    setNotificationMessage(errorMessage);
                    setNotificationType("error");
                    setShowNotification(true);
                    isButtonLocating = false;
                    locationIcon.style.display = "block";
                    spinnerContainer.style.display = "none";
                  });
              } else {
                setNotificationMessage("متصفحك لا يدعم تحديد الموقع");
                setNotificationType("error");
                setShowNotification(true);
                isButtonLocating = false;
                locationIcon.style.display = "block";
                spinnerContainer.style.display = "none";
              }
            });

            return locationButton;
          };

          // Add location button to map
          const locationButton = createLocationButton();
          newMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
            locationButton
          );

          // Update the initial location setting logic
          if (formData.location) {
            try {
              // Handle different URL formats
              const url = new URL(formData.location);
              let lat, lng;

              if (url.searchParams.has("q")) {
                // Handle ?q= format
                const coordinates = url.searchParams.get("q").split(",");
                lat = parseFloat(coordinates[0]);
                lng = parseFloat(coordinates[1]);
              } else if (url.searchParams.has("ll")) {
                // Handle ?ll= format
                const coordinates = url.searchParams.get("ll").split(",");
                lat = parseFloat(coordinates[0]);
                lng = parseFloat(coordinates[1]);
              } else if (url.pathname.includes("@")) {
                // Handle @lat,lng format
                const matches = url.pathname.match(
                  /@(-?\d+\.\d+),(-?\d+\.\d+)/
                );
                if (matches) {
                  lat = parseFloat(matches[1]);
                  lng = parseFloat(matches[2]);
                }
              }

              if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                const pos = { lat, lng };
                newMap.setCenter(pos);
                newMap.setZoom(17); // Higher zoom level for better precision
                newMarker.position = pos;
                newMarker.map = newMap;
              }
            } catch (error) {
              console.error("Error parsing location URL:", error);
            }
          }

          setMarker(newMarker);
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      };

      if (typeof window !== "undefined") {
        loadGoogleMapsScript(initializeMap);
      }
    }, []);

    return (
      <div className="w-full space-y-2">
        <div className="flex gap-2 mb-2">
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="ابحث عن موقع..."
            className="w-full p-2 border-2 rounded-lg"
          />
        </div>
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-lg border-2 border-gray-300"
        />
      </div>
    );
  };

  const locationSection = (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <span className="block text-gray-700 font-medium mb-2">
        موقع المكتب على خرائط جوجل:
      </span>
      {isEditing ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showMap ? "إخفاء الخريطة" : "اختر الموقع على الخريطة"}
          </button>

          {showMap && <MapSelector />}

          {selectedLocation && (
            <div className="text-sm text-gray-600">
              تم اختيار الموقع: {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </div>
          )}

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="سيتم تحديث الرابط تلقائياً عند اختيار الموقع"
            className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            readOnly
          />
        </div>
      ) : (
        <div className="space-y-2">
          {formData.location ? (
            <span className="block p-2 text-blue-600 hover:underline">
              <a
                href={formData.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0C6.478 0 3.618 2.86 3.618 6.382c0 4.788 6.382 13.618 6.382 13.618s6.382-7.75 6.382-13.618C16.382 2.86 13.522 0 10 0zm0 9.764a3.382 3.382 0 110-6.764 3.382 3.382 0 010 6.764z" />
                </svg>
                عرض الموقع على الخريطة
              </a>
            </span>
          ) : (
            <span className="block p-2 text-gray-500">
              لم يتم إضافة موقع المكتب بعد
            </span>
          )}
        </div>
      )}
    </div>
  );

  const addSpecialtySelection = () => {
    if (specialtySelections.length >= 7) {
      setNotificationMessage("لا يمكن إضافة أكثر من 7 تخصصات");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    setSpecialtySelections((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        value: "",
        isRequired: false,
      },
    ]);
  };

  const handleSpecialtyChange = (id, value) => {
    setSpecialtySelections((prev) => {
      const updated = prev.map((selection) =>
        selection.id === id ? { ...selection, value } : selection
      );

      // Update formData.priorities with the new values
      const newPriorities = updated
        .map((selection) => selection.value)
        .filter(Boolean);

      setFormData((prevFormData) => ({
        ...prevFormData,
        priorities: newPriorities,
      }));

      return updated;
    });
  };

  return (
    <div dir="rtl" className="lg:max-w-3xl mx-auto px-4">
      {/* Notification Component */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`bg-white border-r-4 ${
              notificationType === "success"
                ? "border-green-500"
                : "border-red-500"
            } shadow-lg rounded-lg px-4 py-3 flex items-center`}
          >
            <div
              className={`${
                notificationType === "success"
                  ? "text-green-500 bg-green-100"
                  : "text-red-500 bg-red-100"
              } rounded-full p-1 mr-3`}
            >
              {notificationType === "success" ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="mr-2">
              <p className="text-gray-800">{notificationMessage}</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 lg:pt-16 pt-10 bg-white z-30 sticky top-0">
        <h1 className="lg:text-3xl text-center lg:text-right font-bold text-gray-800">
          معلومات صفحتي الشخصية
        </h1>
      </div>

      {/* Profile Form */}
      <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-xl p-6 shadow-sm">
        {/* Profile Image Section */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-500">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="w-full h-full bg-blue-500" />
            )}
          </div>

          <label
            htmlFor="profile-image"
            className="cursor-pointer block text-center mt-4"
          >
            <span className="border-2 border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors inline-block">
              تعديل الصورة
            </span>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Bio Section */}
        <div className="text-center space-y-2 text-gray-700 max-w-2xl">
          <p>{formData.bio}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Bio Input */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              نبذة تعريفية:
            </span>
            {isEditing ? (
              <input
                name="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <p className="block p-2">{formData.bio}</p>
            )}
          </div>

          {/* City Input */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              مدينة العمل:
            </span>
            {isEditing ? (
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <span className="block p-2">{formData.city}</span>
            )}
          </div>

          {/* Office Name Input */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              اسم المكتب:
            </span>
            {isEditing ? (
              <input
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            ) : (
              <span className="block p-2">{formData.officeName}</span>
            )}
          </div>

          {/* Specialties Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="block text-gray-700 font-medium mb-2">
              التخصصات حسب الأولوية:
            </span>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specialtySelections.map((selection, index) => {
                    const toArabicNumerals = (num) => {
                      const arabicNumerals = [
                        "",
                        "١",
                        "٢",
                        "٣",
                        "٤",
                        "٥",
                        "٦",
                        "٧",
                      ];
                      return arabicNumerals[num] || num.toString();
                    };

                    return (
                      <div
                        key={`specialty-${selection.id}`}
                        className="flex flex-col gap-2"
                      >
                        <p className="text-gray-600 text-right">
                          {`أولوية ${toArabicNumerals(index + 1)}`}
                        </p>
                        <select
                          value={selection.value}
                          onChange={(e) =>
                            handleSpecialtyChange(selection.id, e.target.value)
                          }
                          dir="rtl"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={selection.isRequired}
                        >
                          <option value="">
                            {selection.isRequired
                              ? "اختر التخصص الرئيسي"
                              : "اختر التخصص"}
                          </option>
                          {categories.map((category) => (
                            <option
                              key={`category-${category.id}-selection-${selection.id}`}
                              value={category.id}
                              disabled={specialtySelections.some(
                                (s) =>
                                  s.value === String(category.id) &&
                                  s.id !== selection.id
                              )}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={addSpecialtySelection}
                  className={`w-full p-3 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-right ${
                    specialtySelections.length >= 7
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={specialtySelections.length >= 7}
                >
                  {specialtySelections.length >= 7
                    ? "تم الوصول إلى الحد الأقصى للتخصصات"
                    : "+ إضافة تخصص آخر"}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.priorities.map((priorityId, index) => {
                  const category = categories.find(
                    (cat) => cat.id === Number(priorityId)
                  );
                  return (
                    category && (
                      <span
                        key={`priority-${priorityId}-${index}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {category.name}
                      </span>
                    )
                  );
                })}
              </div>
            )}
          </div>

          {/* Location Section */}
          {locationSection}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-500 ml-2 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                  setShowMap(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                تعديل الملف الشخصي
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
