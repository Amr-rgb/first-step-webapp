"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import EventSlide from "./EventSlide";

const HeroWithEvents = () => {
  // Configuration: Number of days to show event slide
  const EVENT_DISPLAY_DAYS = 12; // Change this number to control how many days to show event slide

  const [showEventSlide, setShowEventSlide] = useState(false);
  const [eventPeriodActive, setEventPeriodActive] = useState(false);

  useEffect(() => {
    // Check if we're still in the event period
    const checkEventPeriod = () => {
      // Set event start date to beginning of today
      const eventStartDate = new Date();
      eventStartDate.setHours(0, 0, 0, 0); // Start of today

      const currentDate = new Date();
      const daysDifference = Math.floor(
        (currentDate.getTime() - eventStartDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      console.log("Event Debug:", {
        eventStartDate: eventStartDate.toISOString(),
        currentDate: currentDate.toISOString(),
        daysDifference,
        EVENT_DISPLAY_DAYS,
        shouldShow: daysDifference >= 0 && daysDifference < EVENT_DISPLAY_DAYS,
      });

      if (daysDifference >= 0 && daysDifference < EVENT_DISPLAY_DAYS) {
        setEventPeriodActive(true);
        setShowEventSlide(true);
        console.log("Event slide should be showing");
      } else {
        setEventPeriodActive(false);
        setShowEventSlide(false);
        console.log("Event slide should be hidden");
      }
    };

    checkEventPeriod();

    // Check daily if event period is still active
    const interval = setInterval(checkEventPeriod, 24 * 60 * 60 * 1000); // Check every 24 hours

    return () => clearInterval(interval);
  }, [EVENT_DISPLAY_DAYS]);

  return (
    <div className="relative">
      {/* Show event slide if in event period, otherwise show normal hero */}
      {eventPeriodActive ? <EventSlide /> : <HeroSection />}
    </div>
  );
};

export default HeroWithEvents;
