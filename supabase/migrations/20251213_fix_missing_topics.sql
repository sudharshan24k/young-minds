
DO $$
DECLARE
    r RECORD;
    i INTEGER;
BEGIN
    FOR r IN SELECT * FROM publications WHERE status = 'active' LOOP
        -- check if topics exist
        IF NOT EXISTS (SELECT 1 FROM publication_topics WHERE publication_id = r.id) THEN
            RAISE NOTICE 'Fixing publication % (ID: %)', r.title, r.id;
            FOR i IN 1..r.max_entries LOOP
                INSERT INTO publication_topics (publication_id, title, order_index, status)
                VALUES (r.id, 'Chapter ' || i, i, 'open');
            END LOOP;
        END IF;
    END LOOP;
END $$;
