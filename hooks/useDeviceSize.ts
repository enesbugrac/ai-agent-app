import { useState, useEffect } from 'react';

interface DeviceSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const useDeviceSize = (): DeviceSize => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDeviceSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height,
      });
    };

    // Check on initial load
    updateDeviceSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateDeviceSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceSize);
  }, []);

  return deviceSize;
};

export default useDeviceSize; 