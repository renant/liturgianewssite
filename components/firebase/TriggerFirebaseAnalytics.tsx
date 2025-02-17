"use client";
import { createFirebaseApp } from "@/lib/firebase";
import React from "react";

const TriggerFirebaseAnalytics = () => {
  React.useEffect(() => {
    createFirebaseApp();
  }, []);

  return <div></div>;
};

export default TriggerFirebaseAnalytics;
