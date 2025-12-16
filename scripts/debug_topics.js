
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPublications() {
    console.log('Checking publications...');
    const { data: publications, error } = await supabase
        .from('publications')
        .select('id, title, max_entries, status');

    if (error) {
        console.error('Error fetching publications:', error);
        return;
    }

    if (!publications || publications.length === 0) {
        console.log('No publications found.');
        return;
    }

    console.log(`Found ${publications.length} publications.`);

    for (const pub of publications) {
        const { count, error: countError } = await supabase
            .from('publication_topics')
            .select('*', { count: 'exact', head: true })
            .eq('publication_id', pub.id);

        const { count: unassignedCount, error: unassignedError } = await supabase
            .from('publication_topics')
            .select('*', { count: 'exact', head: true })
            .eq('publication_id', pub.id)
            .is('assigned_user_id', null);

        console.log(`\nTitle: ${pub.title} (ID: ${pub.id})`);
        console.log(`  Status: ${pub.status}`);
        console.log(`  Max Entries: ${pub.max_entries}`);
        console.log(`  Actual Topics: ${countError ? 'Error' : count}`);
        console.log(`  Unassigned Topics: ${unassignedError ? 'Error' : unassignedCount}`);

        if (count === 0) {
            console.warn('  WARNING: No topics for this publication!');
        }
    }
}

checkPublications();
