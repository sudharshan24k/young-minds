import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testAnon = async () => {
    console.log('Testing signInAnonymously...');
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success!');
        console.log('User ID:', data.user.id);
        console.log('Role:', data.user.role);

        // Test RLS access
        const { data: events, error: dbError } = await supabase.from('events').select('*').limit(1);
        if (dbError) {
            console.error('DB Access Error:', dbError.message);
        } else {
            console.log('DB Access Success. Events found:', events.length);
        }
    }
};

testAnon();
