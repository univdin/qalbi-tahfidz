"use client";

import { useMemo } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from "adhan";

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  qiblaDirection: number;
}

export function usePrayerTimes(latitude = -6.2088, longitude = 106.8456) {
  return useMemo(() => {
    const coords = new Coordinates(latitude, longitude);
    const date = new Date();

    const params = CalculationMethod.Singapore();
    const prayerTimes = new PrayerTimes(coords, date, params);
    const qiblaDir = Qibla(coords);

    const formatTime = (time: Date) =>
      time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const next = prayerTimes.nextPrayer();
    const nextTime = prayerTimes.timeForPrayer(next);

    return {
      fajr: formatTime(prayerTimes.fajr),
      dhuhr: formatTime(prayerTimes.dhuhr),
      asr: formatTime(prayerTimes.asr),
      maghrib: formatTime(prayerTimes.maghrib),
      isha: formatTime(prayerTimes.isha),
      nextPrayerName: next ? next.toUpperCase() : "FAJR",
      nextPrayerTime: nextTime ? formatTime(nextTime) : formatTime(prayerTimes.fajr),
      qiblaDirection: Math.round(qiblaDir),
    };
  }, [latitude, longitude]);
}
