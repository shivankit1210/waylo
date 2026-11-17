import type {
  WeatherForecast,
  CurrentWeather,
  DailyWeatherForecast,
} from '@waylo/shared';

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export class WeatherService {
  /**
   * Fetch weather forecast using Open-Meteo free API with automatic advisory
   */
  async getForecast(
    latitude: number,
    longitude: number,
    locationName?: string
  ): Promise<WeatherForecast> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&timezone=auto`;

      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const data: any = await response.json();

      const currentCode = data.current?.weather_code ?? 0;
      const currentTemp = data.current?.temperature_2m ?? 26;
      const currentWind = data.current?.wind_speed_10m ?? 12;
      const isDay = Boolean(data.current?.is_day ?? 1);

      const current: CurrentWeather = {
        time: data.current?.time || new Date().toISOString(),
        temperatureC: Math.round(currentTemp),
        weatherCode: currentCode,
        weatherDescription: WMO_CODE_MAP[currentCode] || 'Partly cloudy',
        windSpeedKmH: Math.round(currentWind),
        isDay,
        ridingAdvisory: this.generateAdvisory(currentCode, currentTemp, currentWind, 0),
      };

      const dailyTimes: string[] = data.daily?.time || [];
      const dailyCodes: number[] = data.daily?.weather_code || [];
      const dailyMaxTemps: number[] = data.daily?.temperature_2m_max || [];
      const dailyMinTemps: number[] = data.daily?.temperature_2m_min || [];
      const dailyPrecipProb: number[] = data.daily?.precipitation_probability_max || [];
      const dailyPrecipSum: number[] = data.daily?.precipitation_sum || [];
      const dailyWindMax: number[] = data.daily?.wind_speed_10m_max || [];

      const daily: DailyWeatherForecast[] = dailyTimes.slice(0, 5).map((date, i) => {
        const code = dailyCodes[i] ?? 0;
        const maxT = dailyMaxTemps[i] ?? 28;
        const minT = dailyMinTemps[i] ?? 20;
        const prob = dailyPrecipProb[i] ?? 0;
        const rainMm = dailyPrecipSum[i] ?? 0;
        const windMax = dailyWindMax[i] ?? 15;

        return {
          date,
          weatherCode: code,
          weatherDescription: WMO_CODE_MAP[code] || 'Fair',
          tempMaxC: Math.round(maxT),
          tempMinC: Math.round(minT),
          precipitationProbability: prob,
          precipitationMm: Number(rainMm.toFixed(1)),
          windSpeedMaxKmH: Math.round(windMax),
          ridingAdvisory: this.generateAdvisory(code, maxT, windMax, prob),
        };
      });

      return {
        locationName: locationName || 'En-route Location',
        latitude,
        longitude,
        elevation: data.elevation,
        current,
        daily,
      };
    } catch {
      // Fallback mock weather for offline/resilience
      return this.getFallbackForecast(latitude, longitude, locationName);
    }
  }

  /**
   * Generate motorcycle/travel advisory from weather metrics
   */
  private generateAdvisory(
    code: number,
    temp: number,
    windKmH: number,
    rainProb: number
  ): string {
    if (code >= 95) {
      return '⚡ Thunderstorms predicted: Avoid high-altitude passes and exposed ridges.';
    }
    if (code >= 61 || rainProb >= 60) {
      return '🌧️ Rain expected: Keep rain gear in top tank bag, decrease speed on curves.';
    }
    if (windKmH >= 35) {
      return '💨 Strong crosswinds: Maintain firm grip and alert posture on highway bridges.';
    }
    if (temp <= 8) {
      return '❄️ Cold temperatures: Wear thermal base layers and insulated riding gloves.';
    }
    if (temp >= 35) {
      return '☀️ High heat: Stay hydrated with electrolytes, schedule shade rest stops.';
    }
    return '🏍️ Optimal road conditions: Clear visibility and pleasant cruising weather!';
  }

  /**
   * Resilient fallback forecast
   */
  private getFallbackForecast(
    latitude: number,
    longitude: number,
    locationName?: string
  ): WeatherForecast {
    const today = new Date();
    const daily: DailyWeatherForecast[] = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        weatherCode: 1,
        weatherDescription: 'Mainly clear',
        tempMaxC: 30 - i,
        tempMinC: 22 - i,
        precipitationProbability: 10 + i * 5,
        precipitationMm: 0,
        windSpeedMaxKmH: 14,
        ridingAdvisory: '🏍️ Great road conditions: Pleasant temperatures and dry asphalt.',
      };
    });

    return {
      locationName: locationName || 'Trip Destination',
      latitude,
      longitude,
      current: {
        time: new Date().toISOString(),
        temperatureC: 28,
        weatherCode: 1,
        weatherDescription: 'Mainly clear',
        windSpeedKmH: 14,
        isDay: true,
        ridingAdvisory: '🏍️ Great road conditions: Clear skies and dry asphalt ahead.',
      },
      daily,
    };
  }
}

export const weatherService = new WeatherService();
