import React from "react";
import { MantineProvider } from "@mantine/core";

export const MantineStyles = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark", fontFamily: '"Exo 2", -apple-system,  sans-serif' }}
    >
      {children}
    </MantineProvider>
  );
};
