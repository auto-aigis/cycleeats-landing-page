/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare global {
  interface Window {
    Paddle: {
      Environment: { set: (env: string) => void };
      Initialize: (options: { token: string; checkout: { settings?: { displayMode?: string } } }) => void;
      Checkout: {
        open: (options: { items: { priceId: string; quantity: number }[]; customData?: Record<string, unknown>; settings?: { displayMode: string } }) => void;
        close: () => void;
      };
    };
  }
}
