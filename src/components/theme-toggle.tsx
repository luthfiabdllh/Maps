"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ThemeToggler, type ThemeSelection, type Resolved } from "./animate-ui/primitives/effects/theme-toggler";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-10 w-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full border-0 pointer-events-auto">
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <ThemeToggler
      theme={theme as ThemeSelection || "system"}
      resolvedTheme={resolvedTheme as Resolved || "light"}
      setTheme={setTheme}
    >
      {({ effective, toggleTheme }) => (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => {
            toggleTheme(effective === "light" ? "dark" : "light");
          }} 
          className="h-10 w-10 bg-background/95 backdrop-blur-sm shadow-md rounded-full border-0 pointer-events-auto text-foreground"
        >
          {effective === "light" && <Sun className="h-5 w-5" />}
          {effective === "dark" && <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </ThemeToggler>
  );
}
