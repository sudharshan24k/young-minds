import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createAdmin = async () => {
    const email = 'admin@youngminds.com';
    const password = 'admin123';

    console.log(`Creating admin user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Admin User',
                role: 'admin' // Note: This is client-side metadata, not secure for real admin checks but fits current schema
            }
        }
    });

    if (error) {
        console.error('Error creating admin user:', error.message);
    } else {
        console.log('Admin user created/logged in successfully.');
        console.log('User ID:', data.user?.id);
        console.log('Session:', data.session ? 'Active' : 'Pending Confirmation');

        if (!data.session) {
            console.log('IMPORTANT: Email confirmation may be required. Check your email or Supabase dashboard.');
        }
    }
};

createAdmin();
