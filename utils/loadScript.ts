// utils/loadScript.ts
export const loadGoogleMapsScript = (apiKey: string) => {
  return new Promise<void>((resolve, reject) => {
    if (window.google) {
      resolve(); // Google Maps already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps API failed to load'));
    document.head.appendChild(script);
  });
};
