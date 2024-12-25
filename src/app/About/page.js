"use client";
import React, { useEffect, useState } from "react";

function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // This code runs only in the browser
    const storedData = localStorage.getItem("yourKey");
    setData(storedData);
    // ... use the data as needed
  }, []);

  return (
    <div>
      Welcome from about page
      <h1 className="text-xl font-bold underline">Hello world!</h1>
      {/* Optionally display the data */}
      {data && <p>Data from localStorage: {data}</p>}
    </div>
  );
}

export default About;
