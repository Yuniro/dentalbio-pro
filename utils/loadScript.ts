// utils/loadScript.ts
export const loadGoogleMapsScript = (apiKey: string) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve(); // Script is already loaded
    } else {
      console.log("here");
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.onload = () => resolve();
      script.onerror = (e) => reject(new Error('Google Maps API script loading failed.'));
      document.head.appendChild(script);
    }
  });
};
