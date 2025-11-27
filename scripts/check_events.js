import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function checkDatabase() {
    console.log('🔍 Checking current events table structure...\n');

    // Check existing events
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .limit(5);

    if (error) {
        console.error('❌ Error fetching events:', error.message);
        return;
    }

    console.log('✅ Found ' + events.length + ' existing events');

    if (events.length > 0) {
        console.log('\n📋 Sample event structure:');
        const sampleEvent = events[0];
        console.log('Fields:', Object.keys(sampleEvent).join(', '));
        console.log('\nHas status field?', 'status' in sampleEvent ? '✅ Yes' : '❌ No');
        console.log('Has month_year field?', 'month_year' in sampleEvent ? '✅ Yes' : '❌ No');
    } else {
        console.log('ℹ️  No events found in database yet');
    }
}

checkDatabase().catch(console.error);
