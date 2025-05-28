export interface IPLocation {
  latitude: number;
  longitude: number;
}

export async function getLocationFromIP(): Promise<IPLocation> {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        latitude: data.lat,
        longitude: data.lon
      };
    }
    
    // Default to 0,0 if the API call fails
    return { latitude: 0, longitude: 0 };
  } catch (error) {
    console.error('Failed to get location from IP:', error);
    // Default to 0,0 if there's an error
    return { latitude: 0, longitude: 0 };
  }
} 