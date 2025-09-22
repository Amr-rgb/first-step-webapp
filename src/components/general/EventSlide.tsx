"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import styles from "./EventSlide.module.scss";

const EventSlide = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className={`${styles.eventSlide} ${
        isRTL ? styles.eventSlideRtl : styles.eventSlideLtr
      }`}
    >
      {isRTL ? (
        // Arabic version: Logo left, Content right
        <>
          {/* Left container (logo background) */}
          <div className={styles.eventSlideLeftContainer}></div>

          {/* Right container (background event) */}
          <div className={styles.eventSlideRightContainer}>
            {/* Top - Title */}
            <div className={styles.eventSlideTitleSection}>
              <img
                src="/assets/events/title-background.png"
                alt="Saudi National Day Title"
                className={styles.eventSlideTitleImage}
              />
            </div>

            {/* Middle - Text */}
            <div className={styles.eventSlideTextSection}>
              <p className={styles.eventSlideTextRow1}>
                احتفالًا باليوم الوطني السعودي
              </p>
              <p className={styles.eventSlideTextRow2}>
                <span className={styles.eventSlideNumber95}>95</span> اشتراك
                مجاني
              </p>
            </div>

            {/* Bottom - Button */}
            <div className={styles.eventSlideButtonSection}>
              <Link href="/sign-up/center" className={styles.eventSlideButton}>
                احجز الآن
              </Link>
            </div>
          </div>
        </>
      ) : (
        // English version: Content left, Logo right (swapped)
        <>
          {/* Left container (background event) - Content */}
          <div className={styles.eventSlideRightContainer}>
            {/* Top - Title */}
            <div className={styles.eventSlideTitleSection}>
              <img
                src="/assets/events/title-background.png"
                alt="Saudi National Day Title"
                className={styles.eventSlideTitleImage}
              />
            </div>

            {/* Middle - Text */}
            <div className={styles.eventSlideTextSection}>
              <p className={styles.eventSlideTextRow1}>
                Celebrating Saudi National Day
              </p>
              <p className={styles.eventSlideTextRow2}>
                <span className={styles.eventSlideNumber95}>95</span> days free
                subscription
              </p>
            </div>

            {/* Bottom - Button */}
            <div className={styles.eventSlideButtonSection}>
              <Link href="/sign-up/center" className={styles.eventSlideButton}>
                Book Now
              </Link>
            </div>
          </div>

          {/* Right container (logo background) */}
          <div className={styles.eventSlideLeftContainer}></div>
        </>
      )}
    </div>
  );
};

export default EventSlide;
