export interface DeviceState {
    isDesktop: boolean;
    isMobile: boolean;
}

const userAgent: string = navigator.userAgent;

const isMobileDevice = (): boolean => {
    const regex = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i]
    return regex.some((m) => userAgent.match(m))
}

const isDesktopDevice = (): boolean => !isMobileDevice;

const isMobile = isMobileDevice();
const isDesktop = isDesktopDevice();

export const useDevice = (): DeviceState => ({
  isDesktop,
  isMobile
})