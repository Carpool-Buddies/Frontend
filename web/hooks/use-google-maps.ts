"use client";

import { useEffect, useState } from "react";

type LoadStatus = "idle" | "loading" | "ready" | "error";

let _status: LoadStatus = "idle";
const _listeners: Array<(status: LoadStatus) => void> = [];

function notify(status: LoadStatus) {
  _status = status;
  _listeners.forEach((fn) => fn(status));
}

/**
 * Lazily loads the Google Maps JavaScript API (with Places library).
 * Safe to call from multiple components — the script is injected only once.
 */
export function useGoogleMaps() {
  const [status, setStatus] = useState<LoadStatus>(_status);

  useEffect(() => {
    const listener = (s: LoadStatus) => setStatus(s);
    _listeners.push(listener);

    if (_status === "idle") {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        notify("error");
      } else {
        notify("loading");
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=he`;
        script.async = true;
        script.onload = () => notify("ready");
        script.onerror = () => notify("error");
        document.head.appendChild(script);
      }
    }

    return () => {
      const idx = _listeners.indexOf(listener);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  }, []);

  return { isReady: status === "ready", isError: status === "error" };
}
