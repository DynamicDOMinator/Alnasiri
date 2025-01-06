"use client";
import React, { useState, useEffect } from "react";

const Test = () => {
  const users = [
    {
      mapUrl:
        "https://www.google.com/maps/@30.0557871,31.233309,19.25z?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoJLDEwMjExMjMzSAFQAw%3D%3D",
    },
    {
      mapUrl:
        "https://www.google.com/maps/place/Pyramids+of+Giza/@29.9764804,31.1313023,15z/data=!4m6!3m5!1s0x14584587f0c24a97:0x9a1cbfc31578c7c2!8m2!3d29.9764804!4d31.1313023!16zL20vMGYxcnE?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoJLDEwMjExMjMzSAFQAw%3D%3D",
    },
  ];

  const [mapUrls, setMapUrls] = useState([]);

  const convertToEmbedUrl = async (url) => {
    try {
      const apiKey = "AIzaSyBUup3wJD1T6htAHG_ayRCM9BDOC6VoPeA";
      const baseUrl = "https://www.google.com/maps/embed/v1/search";

      // Handle mobile share URLs (maps.app.goo.gl)
      if (url.includes("maps.app.goo.gl")) {
        // Use search instead of place for mobile URLs
        return `${baseUrl}?q=point+of+interest&zoom=15&key=${apiKey}`;
      }

      // Handle regular map URLs with coordinates
      if (url.includes("@")) {
        const coordinates = url.split("@")[1].split(",");
        const lat = coordinates[0];
        const lng = coordinates[1];
        return `https://www.google.com/maps/embed/v1/place?q=${lat},${lng}&key=${apiKey}`;
      }

      // Handle place URLs
      if (url.includes("/place/")) {
        const placeMatch = url.match(/@([\d.-]+),([\d.-]+)/);
        if (placeMatch) {
          const lat = placeMatch[1];
          const lng = placeMatch[2];
          return `https://www.google.com/maps/embed/v1/place?q=${lat},${lng}&key=${apiKey}`;
        }
      }

      throw new Error("Invalid Google Maps URL structure.");
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchUrls = async () => {
      const updatedUrls = await Promise.all(
        users.map(async (user) => {
          const embedUrl = await convertToEmbedUrl(user.mapUrl);
          return embedUrl;
        })
      );
      setMapUrls(updatedUrls);
    };

    fetchUrls();
  });

  return (
    <div className="py-32">
      <div>
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h2>{user.name}</h2>
            <p>{user.address}</p>
            <div style={{ width: "100%", height: "400px" }}>
              <iframe
                src={mapUrls[index]}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
