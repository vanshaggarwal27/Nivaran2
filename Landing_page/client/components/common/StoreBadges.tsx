import React from "react";

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href="https://apps.apple.com/au/app/snap-send-solve/id416238349"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Download on the App Store"
      >
        <img
          src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=140x40&releaseDate=1293235200"
          alt="Download on the App Store"
          className="h-10 w-auto"
          loading="lazy"
        />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=au.com.usertech.android.snapsendsolve"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Get it on Google Play"
      >
        <img
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          className="h-14 w-auto -ml-2"
          loading="lazy"
        />
      </a>
    </div>
  );
}
