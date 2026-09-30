/**
 * Telegram WebApp API Helper
 * Gracefully degrades when running outside Telegram (e.g. standalone browser)
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation: () => void;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        headerColor?: string;
        backgroundColor?: string;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        BackButton?: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
        openTelegramLink?: (url: string) => void;
        openLink?: (url: string) => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initDataUnsafe;
};

export const initTelegramApp = () => {
  if (typeof window === 'undefined') return;
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  try {
    tg.ready();
    tg.expand();
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }
    if (tg.setHeaderColor) {
      tg.setHeaderColor('#090d16');
    }
    if (tg.setBackgroundColor) {
      tg.setBackgroundColor('#090d16');
    }
  } catch (err) {
    console.warn('Telegram WebApp init notice:', err);
  }
};

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'selection' = 'light') => {
  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (!haptic) return;

  try {
    if (type === 'selection') {
      haptic.selectionChanged();
    } else if (type === 'success' || type === 'warning') {
      haptic.notificationOccurred(type);
    } else {
      haptic.impactOccurred(type);
    }
  } catch {
    // Graceful fallback
  }
};

export const getTelegramUser = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};
