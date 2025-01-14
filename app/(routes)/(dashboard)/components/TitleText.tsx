"use client";
import React from "react";

import { useUser } from "@clerk/nextjs";
import { useColorThemeStore } from "@/hooks/useColorThemeStore";

export function TitleText() {
  const { user } = useUser();

  const { colorTheme } = useColorThemeStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl">
        Welcome,{" "}
        <span
          style={{ color: colorTheme }}
          className="font-bold transition-all duration-500"
        >
          {user.firstName}!
        </span>
      </h1>
      <p className="text-lg text-gray-500">
        Here is a summary of your finances
      </p>
    </div>
  );
}
