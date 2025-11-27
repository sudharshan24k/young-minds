import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function createTestEvent() {
    console.log('🎨 Creating December 2025 Art Challenge event...\n');

    const eventData = {
        title: 'December 2025 Art Challenge',
        theme: 'Winter Wonders',
        activity_category: 'express',
        type: 'competition',
        start_date: '2025-12-01',
        end_date: '2025-12-31',
        status: 'active',
        pricing: 0,
        description: 'Share your creative winter-themed artwork with us!',
        guidelines: 'Submit original artwork in any medium',
        icon: 'Palette',
        color: 'bg-pink-500'
    };

    const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

    if (error) {
        console.error('❌ Error creating event:', error.message);
        return;
    }

    console.log('✅ Event created successfully!');
    console.log('\nEvent details:');
    console.log('  ID:', data[0].id);
    console.log('  Title:', data[0].title);
    console.log('  Theme:', data[0].theme);
    console.log('  Status:', data[0].status);
    console.log('  Month/Year:', data[0].month_year);
    console.log('  Start:', data[0].start_date);
    console.log('  End:', data[0].end_date);

    // Verify month_year was auto-populated
    if (data[0].month_year) {
        console.log('\n✅ month_year field auto-populated by database trigger!');
    } else {
        console.log('\n⚠️  month_year field not auto-populated (might need to run migration)');
    }
}

createTestEvent().catch(console.error);
