

export const SUPABASE_FOLDERS = {
    USERS_PROFILE: 'users_profile',
    RESTAURANTS: 'restaurants',
    FOODS: 'foods',
};

export const getSupabaseUserProfileFolder = () => `${SUPABASE_FOLDERS.USERS_PROFILE}`;
export const getSupabaseRestaurantFolder = () => `${SUPABASE_FOLDERS.RESTAURANTS}`;
export const getSupabaseFoodFolder = () => `${SUPABASE_FOLDERS.FOODS}`;
