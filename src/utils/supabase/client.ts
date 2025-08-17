import appConfig from '@/config';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(appConfig.SUPABASE_URL, appConfig.SUPABASE_KEY);