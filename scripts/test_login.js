import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testLogin = async () => {
    console.log('Testing login...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@youngminds.com',
        password: 'admin123'
    });

    if (error) {
        console.error('Login Failed:', error.message);
    } else {
        console.log('Login Success!');
        console.log('Session active for user:', data.user.id);
    }
};

testLogin();
