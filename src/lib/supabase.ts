import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string; 

// This acts as a smart bridge: it uses secure mobile storage on phones, 
// and safe browser storage on the web, while preventing SSR crashes.
const customStorage = Platform.OS === 'web' 
  ? {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') return window.localStorage.getItem(key);
        return null;
      },
      setItem: (key: string, value: string) => { 
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      },
      removeItem: (key: string) => { 
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      },
    }
  : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});