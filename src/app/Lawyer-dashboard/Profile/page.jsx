"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import React from "react";
import { FaCamera, FaUser } from "react-icons/fa";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // Track the current server image URL
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("error");
  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    law_office: "",
    specialties: [],
    google_map: "",
    profile_img: null,
    call_number: "",
    whatsapp_number: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [lawyerUuid, setLawyerUuid] = useState(null);

  const router = useRouter();

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${API_BASE_URL}/speciality/get-all-speciality`
        );
        if (isMounted) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means run once on mount

  // Fetch lawyer profile once on mount
  useEffect(() => {
    let isMounted = true;

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

        if (!isMounted) return;

        const { lawyer_office, user, profile_image_link } = response.data;

        // Store the UUID
        setLawyerUuid(user.uuid);

        // Set both current URL and preview
        if (profile_image_link) {
          setCurrentImageUrl(profile_image_link);
          setImagePreview(profile_image_link);
        }

        // Update specialty selections with existing values
        if (lawyer_office.specialties && lawyer_office.specialties.length > 0) {
          // Create an array of specialty IDs
          const specialtyIds = lawyer_office.specialties.map((spec) =>
            typeof spec === "object" ? spec.id.toString() : spec.toString()
          );

          // Create selections array with at least 4 slots
          const newSelections = Array(Math.max(4, specialtyIds.length))
            .fill(null)
            .map((_, index) => ({
              id: index + 1,
              value: specialtyIds[index] || "",
              isRequired: index === 0,
            }));

          setSpecialtySelections(newSelections);

          setFormData((prev) => ({
            ...prev,
            city: user?.city === null ? "" : user?.city,
            law_office:
              lawyer_office?.law_office === null
                ? ""
                : lawyer_office?.law_office,
            specialties: specialtyIds,
            google_map:
              lawyer_office?.google_map === null
                ? ""
                : lawyer_office?.google_map,
            bio: lawyer_office?.bio === null ? "" : lawyer_office?.bio,
            profile_img: null,
            call_number:
              lawyer_office?.call_number === null
                ? ""
                : lawyer_office?.call_number,
            whatsapp_number:
              lawyer_office?.whatsapp_number === null
                ? ""
                : lawyer_office?.whatsapp_number,
          }));
        } else {
          // If no specialties, just update other form data
          setFormData((prev) => ({
            ...prev,
            city: user?.city === null ? "" : user?.city,
            law_office:
              lawyer_office?.law_office === null
                ? ""
                : lawyer_office?.law_office,
            specialties: [],
            google_map:
              lawyer_office?.google_map === null
                ? ""
                : lawyer_office?.google_map,
            bio: lawyer_office?.bio === null ? "" : lawyer_office?.bio,
            profile_img: null,
            call_number: "",
            whatsapp_number: "",
          }));
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (isMounted) {
          setNotificationMessage("حدث خطأ أثناء تحميل الملف الشخصي");
          setNotificationType("error");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
          setIsLoading(false);
        }
      }
    };

    fetchLawyerProfile();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means run once on mount

  // Fetch cities
  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(
          `${API_BASE_URL}/lawyer/get-all-cities`
        );
        const cityNames = response.data.map((city) => city.name); // Extract city names
        setCities(cityNames);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCitiesData();
  }, []);

  // Update specialties in formData when specialty selections change
  useEffect(() => {
    const selectedSpecialties = specialtySelections
      .map((selection) => selection.value)
      .filter((value) => value !== "");

    setFormData((prev) => ({
      ...prev,
      specialties: selectedSpecialties,
    }));
  }, [specialtySelections]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!token) {
        throw new Error("No token found");
      }

      // Get non-empty specialties from selections
      const specialtiesToSend = specialtySelections
        .map((selection) => selection.value)
        .filter((value) => value !== "");

      console.log("Sending specialties:", specialtiesToSend);

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append each specialty ID as a separate field with array notation
      specialtiesToSend.forEach((specialtyId) => {
        formDataToSend.append(`specialties[]`, specialtyId);
      });

      // Append other fields
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("google_map", formData.google_map);
      formDataToSend.append("law_office", formData.law_office);
      formDataToSend.append("call_number", formData.call_number);
      formDataToSend.append("whatsapp_number", formData.whatsapp_number);

      // Only append profile_img if a new image is selected
      if (formData.profile_img instanceof File) {
        formDataToSend.append("profile_img", formData.profile_img);
      }

      // Log all form data being sent
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(
        `${API_BASE_URL}/lawyer/edit-lawyer-office`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);
      setNotificationMessage("تم تحديث الملف الشخصي بنجاح");
      setNotificationType("success");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      // Update image URL only if a new image was uploaded and returned
      if (
        formData.profile_img instanceof File &&
        response.data.profile_image_link
      ) {
        setCurrentImageUrl(response.data.profile_image_link);
        setImagePreview(response.data.profile_image_link);
      }

      // Reset the file input
      setFormData((prev) => ({
        ...prev,
        profile_img: null,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "حدث خطأ أثناء تحديث الملف الشخصي";

      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_img: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidGoogleMapsUrl = (url) => {
    if (!url || url === "") return true;
    try {
      const urlString = url.startsWith("http") ? url : `https://${url}`;
      const urlObj = new URL(urlString);
      return (
        urlObj.hostname.includes("google.com") ||
        urlObj.hostname.includes("goo.gl")
      );
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "google_map" && !isValidGoogleMapsUrl(value)) {
      setNotificationMessage("الرجاء إدخال رابط خريطة جوجل صحيح");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (e) => {
    const value = String(e.target.value); // Convert to string for consistency
    setFormData((prev) => {
      // Don't add if already selected
      if (prev.specialties.includes(value)) {
        return prev;
      }
      // Only add if less than 7 items
      if (prev.specialties.length < 7) {
        return {
          ...prev,
          specialties: [...prev.specialties, value],
        };
      }
      return prev;
    });
  };

  const handleSpecialtyChange = (selectionId, value) => {
    // Update the specialty selections
    setSpecialtySelections((prev) => {
      const updated = prev.map((selection) =>
        selection.id === selectionId ? { ...selection, value } : selection
      );
      console.log("Updated selections:", updated);
      return updated;
    });
  };

  const MapSelector = () => {
    const mapRef = React.useRef(null);
    const searchBoxRef = React.useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
      const initializeMap = () => {
        try {
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

          // Initialize SearchBox
          const searchBoxInstance = new google.maps.places.SearchBox(
            searchBoxRef.current
          );
          setSearchBox(searchBoxInstance);

          // Listen for search box events
          searchBoxInstance.addListener("places_changed", () => {
            const places = searchBoxInstance.getPlaces();

            if (places.length === 0) return;

            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            // Update map and marker position
            newMap.setCenter(place.geometry.location);
            newMap.setZoom(17);

            if (marker) {
              marker.position = place.geometry.location;

              // Update form data with new coordinates
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              setFormData((prev) => ({
                ...prev,
                google_map: `https://www.google.com/maps?q=${lat},${lng}`,
              }));
            }
          });

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
              google_map: `https://www.google.com/maps?q=${lat},${lng}`,
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

            const handleLocationClick = async () => {
              if (isLocating) return;
              setIsLocating(true);
              locationIcon.style.display = "none";
              spinnerContainer.style.display = "block";

              try {
                const position = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => resolve(pos),
                    (err) => reject(err),
                    {
                      enableHighAccuracy: true, // Request high accuracy
                      timeout: 30000, // Increase timeout to 30 seconds
                      maximumAge: 0, // Don't use cached position
                    }
                  );
                });

                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                // Try to get more accurate location using reverse geocoding
                try {
                  const geocoder = new google.maps.Geocoder();
                  const result = await new Promise((resolve, reject) => {
                    geocoder.geocode({ location: pos }, (results, status) => {
                      if (status === "OK" && results[0]) {
                        resolve(results[0]);
                      } else {
                        reject(new Error("Geocoding failed"));
                      }
                    });
                  });

                  // Use the most precise location from geocoding result
                  const preciseLocation = result.geometry.location;
                  const preciseLat = preciseLocation.lat();
                  const preciseLng = preciseLocation.lng();

                  // Update map and marker with precise location
                  newMap.setCenter({ lat: preciseLat, lng: preciseLng });
                  newMap.setZoom(18); // Higher zoom for better precision
                  newMarker.position = { lat: preciseLat, lng: preciseLng };

                  // Update form data with precise coordinates
                  setFormData((prev) => ({
                    ...prev,
                    google_map: `https://www.google.com/maps?q=${preciseLat},${preciseLng}`,
                  }));
                } catch (geocodeError) {
                  // Fallback to using raw GPS coordinates if geocoding fails
                  console.warn(
                    "Geocoding failed, using raw coordinates:",
                    geocodeError
                  );
                  newMap.setCenter(pos);
                  newMap.setZoom(18);
                  newMarker.map = newMap;
                  newMarker.position = pos;

                  setFormData((prev) => ({
                    ...prev,
                    google_map: `https://www.google.com/maps?q=${pos.lat},${pos.lng}`,
                  }));
                }
              } catch (error) {
                console.error("Error getting location:", error);
                let errorMessage = "تعذر الوصول إلى موقعك الحالي";

                if (error.code) {
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
                }

                setNotificationMessage(errorMessage);
                setNotificationType("error");
                setShowNotification(true);
              } finally {
                setIsLocating(false);
                locationIcon.style.display = "block";
                spinnerContainer.style.display = "none";
              }
            };

            locationButton.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLocationClick();
            });

            return locationButton;
          };

          // Add location button to map
          const locationButton = createLocationButton();
          newMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
            locationButton
          );

          // Update the initial location setting logic
          if (formData.google_map) {
            try {
              // Handle different URL formats
              const url = new URL(formData.google_map);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="w-full space-y-2 ">
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
            name="google_map"
            value={
              formData.google_map === null || formData.google_map === ""
                ? "لا يوجد"
                : formData.google_map
            }
            onChange={handleChange}
            placeholder="سيتم تحديث الرابط تلقائياً عند اختيار الموقع"
            className="w-full border-2 hidden p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            readOnly
          />
        </div>
      ) : (
        <div className="space-y-2">
          {formData.google_map ? (
            <span className="block p-2 text-blue-600 hover:underline">
              <a
                href={formData.google_map}
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
            <span className="block p-2 text-gray-500">لا يوجد</span>
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

  const handleViewProfile = () => {
    if (lawyerUuid) {
      router.push(`/lawyer-profile/${lawyerUuid}`);
    } else {
      setNotificationMessage("حدث خطأ في الوصول إلى الصفحة الشخصية");
      setNotificationType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-green-600" />
        </div>
      ) : (
        <>
          {/* Notification */}
          {showNotification && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
              <div
                className={`${
                  notificationType === "success" ? "bg-green-500" : "bg-red-500"
                } text-white px-6 py-3 rounded-lg shadow-lg`}
              >
                {notificationMessage}
              </div>
            </div>
          )}

          {/* Header - Add button here */}
          <div className="mb-8 lg:max-w-4xl lg:pt-16 pt-10 bg-white mx-auto z-30 sticky top-0">
            <div className="flex flex-col md:flex-row-reverse justify-center  md:justify-between items-center">
              <h1 className="lg:text-3xl pb-2 text-gray-800 font-bold">
                معلومات صفحتي الشخصية
              </h1>
              <button
                onClick={handleViewProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
              >
                عرض الصفحة الشخصية
                <FaUser size={14} />
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div
            dir="rtl"
            className="flex flex-col mb-20 lg:mb-0 md:max-w-4xl mx-auto items-center justify-center gap-6 bg-white rounded-xl lg:p-6 shadow-sm"
          >
            {/* Profile Image Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                {imagePreview || currentImageUrl ? (
                  <Image
                    height={100}
                    width={100}
                    src={imagePreview || currentImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-16 h-16 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="profile_img"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <input
                    type="file"
                    id="profile_img"
                    name="profile_img"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <FaCamera size={20} />
                </label>
              )}
            </div>

            {/* Add floating button for mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
              <button
                onClick={handleViewProfile}
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FaUser size={20} />
              </button>
            </div>

            {/* Bio Section */}
            <div className="text-center space-y-2 text-gray-700 max-w-2xl"></div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Bio Input */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-gray-700 font-medium mb-2">
                  نبذة تعريفية:
                </span>
                {isEditing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    value={
                      formData.bio === null || formData.bio === ""
                        ? "لا يوجد"
                        : formData.bio
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="block p-2">{formData.bio || "لا يوجد"}</p>
                )}
              </div>

              {/* City Input */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block pb-2 text-sm font-medium text-gray-700">
                  مدينة العمل:
                </span>
                {isEditing ? (
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      اختر مدينة
                    </option>
                    {cities.map((city, index) => (
                      <option key={`city-${index}`} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="block p-2">{formData.city || "لا يوجد"}</p>
                )}
              </div>

              {/* Office Name Input */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-gray-700 font-medium mb-2">
                  اسم المكتب:
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    name="law_office"
                    value={
                      formData.law_office === null || formData.law_office === ""
                        ? "لا يوجد"
                        : formData.law_office
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        law_office: e.target.value,
                      }))
                    }
                    className="w-full border-2 p-2 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="block p-2">
                    {formData.law_office || "لا يوجد"}
                  </p>
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
                                handleSpecialtyChange(
                                  selection.id,
                                  e.target.value
                                )
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
                    {formData.specialties?.map((specialtyId, index) => {
                      const category = categories.find(
                        (cat) => cat.id === Number(specialtyId)
                      );
                      return (
                        category && (
                          <span
                            key={`priority-${specialtyId}-${index}`}
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

              {/* Phone Numbers Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-gray-700 font-medium mb-2">
                  رقم المكتب:
                </span>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      966+
                    </span>
                    <input
                      type="tel"
                      name="call_number"
                      maxLength={9}
                      value={formData.call_number || ""}
                      onChange={handleChange}
                      className="w-full border-2 p-2 pl-16 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="5XXXXXXXX"
                    />
                  </div>
                ) : (
                  <p className="block p-2">
                    {formData.call_number
                      ? `05${formData.call_number}`
                      : "لا يوجد"}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="block text-gray-700 font-medium mb-2">
                  رقم الواتساب:
                </span>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      966+
                    </span>
                    <input
                      type="tel"
                      name="whatsapp_number"
                      maxLength={9}
                      value={formData.whatsapp_number || ""}
                      onChange={handleChange}
                      className="w-full border-2 p-2 pl-16 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="5XXXXXXXX"
                    />
                  </div>
                ) : (
                  <p className="block p-2">
                    {formData.whatsapp_number
                      ? `05${formData.whatsapp_number}`
                      : "لا يوجد"}
                  </p>
                )}
              </div>

              {/* Location Section */}
              {locationSection}

              {/* Form Actions */}
              <div className="flex justify-center space-x-4 sticky bottom-2">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="bg-blue-500 ml-2 mx text-white px-6 py-2 rounded-lg hover:bg-blue-600"
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
        </>
      )}
    </div>
  );
}
