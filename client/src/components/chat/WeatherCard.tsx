import { Card } from "@/components/ui/card";
import { WeatherData, ForecastDay } from "@/types/chat";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Sun,
  Cloud,
  CloudRain
} from "lucide-react";

interface WeatherCardProps {
  weather: WeatherData;
}

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  default: Cloud,
};

const getWeatherIcon = (description: string) => {
  if (description.toLowerCase().includes('sun') || description.toLowerCase().includes('clear')) {
    return weatherIcons.sun;
  }
  if (description.toLowerCase().includes('rain')) {
    return weatherIcons.rain;
  }
  return weatherIcons.cloud;
};

const getForecastIcon = (iconType: string) => {
  switch (iconType) {
    case 'sun':
      return Sun;
    case 'rain':
      return CloudRain;
    case 'cloud':
    default:
      return Cloud;
  }
};

export function WeatherCard({ weather }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon(weather.description);

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-4 border border-primary/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-weather-location">
            {weather.location}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-weather-description">
            {weather.description}
          </p>
        </div>
        <div className="w-15 h-15 rounded-full bg-primary/20 flex items-center justify-center">
          <WeatherIcon className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 text-primary mr-2" />
          <span className="text-foreground">
            <strong data-testid="text-temperature">{weather.temperature}°C</strong>
          </span>
        </div>
        <div className="flex items-center">
          <Droplets className="h-4 w-4 text-primary mr-2" />
          <span className="text-foreground" data-testid="text-humidity">
            {weather.humidity}% humidity
          </span>
        </div>
        <div className="flex items-center">
          <Wind className="h-4 w-4 text-primary mr-2" />
          <span className="text-foreground" data-testid="text-wind-speed">
            {weather.windSpeed} km/h
          </span>
        </div>
        <div className="flex items-center">
          <Eye className="h-4 w-4 text-primary mr-2" />
          <span className="text-foreground" data-testid="text-visibility">
            {weather.visibility} km
          </span>
        </div>
      </div>

      {/* 5-day forecast */}
      {weather.forecast && (
        <div className="pt-3 border-t border-border/50">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => {
              const ForecastIcon = getForecastIcon(day.icon);
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground" data-testid={`forecast-day-${index}`}>
                    {day.day}
                  </div>
                  <ForecastIcon className="h-4 w-4 text-primary mx-auto my-1" />
                  <div className="text-xs text-foreground" data-testid={`forecast-temp-${index}`}>
                    {day.temperature}°
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
