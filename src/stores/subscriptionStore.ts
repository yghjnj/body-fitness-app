import { create } from 'zustand';

// Developer/admin emails — always VIP, no payment needed
const DEV_EMAILS = ['admin@fitbody.app'];

interface SubscriptionState {
  isVIP: boolean;
  isLoading: boolean;
  vipExpiry: string | null;
  isDeveloper: boolean;
  setIsVIP: (vip: boolean) => void;
  setLoading: (loading: boolean) => void;
  activateVIP: (planType: string) => void;
  checkDeveloper: (email: string) => boolean;
  setDeveloper: (dev: boolean) => void;
}

const STORAGE_KEY = 'fitbody-subscription';

let saved = { isVIP: false, vipExpiry: null as string | null, isDeveloper: false };
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  }
} catch {}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isVIP: saved.isVIP,
  isLoading: false,
  vipExpiry: saved.vipExpiry,
  isDeveloper: saved.isDeveloper,

  setIsVIP: (vip) => {
    set({ isVIP: vip });
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), isVIP: vip }));
      }
    } catch {}
  },

  setLoading: (loading) => set({ isLoading: loading }),

  activateVIP: (planType) => {
    const now = new Date();
    let expiry: string | null = null;
    if (planType === 'monthly') expiry = new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    else if (planType === 'yearly') expiry = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();

    const state = { isVIP: true, vipExpiry: expiry };
    set(state);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get() }));
      }
    } catch {}
  },

  checkDeveloper: (email: string) => {
    const isDev = DEV_EMAILS.includes(email.toLowerCase().trim());
    if (isDev) {
      set({ isDeveloper: true, isVIP: true });
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isDeveloper: true, isVIP: true, vipExpiry: null }));
        }
      } catch {}
    }
    return isDev;
  },

  setDeveloper: (dev) => {
    set({ isDeveloper: dev, isVIP: dev });
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isVIP: dev, isDeveloper: dev, vipExpiry: null }));
      }
    } catch {}
  },
}));
