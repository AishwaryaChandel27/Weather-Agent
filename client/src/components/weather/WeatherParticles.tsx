import { useTheme } from "@/hooks/useTheme";

export function WeatherParticles() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Light mode particles (clouds/sun rays) */}
      {resolvedTheme === "light" && (
        <>
          <div className="weather-particle w-3 h-3 bg-accent/30 top-10 left-10" />
          <div className="weather-particle w-2 h-2 bg-primary/20 top-20 right-20" />
          <div className="weather-particle w-4 h-4 bg-accent/20 top-32 left-1/3" />
          <div className="weather-particle w-2 h-2 bg-primary/30 top-40 right-1/4" />
          <div className="weather-particle w-3 h-3 bg-accent/25 top-16 left-2/3" />
        </>
      )}
      
      {/* Dark mode particles (stars/moon) */}
      {resolvedTheme === "dark" && (
        <>
          <div className="weather-particle w-2 h-2 bg-accent/40 top-16 right-16" />
          <div className="weather-particle w-1 h-1 bg-foreground/30 top-24 left-24" />
          <div className="weather-particle w-3 h-3 bg-primary/30 top-40 right-32" />
          <div className="weather-particle w-1 h-1 bg-accent/50 top-12 left-1/2" />
          <div className="weather-particle w-2 h-2 bg-foreground/20 top-32 right-1/3" />
        </>
      )}
    </div>
  );
}
