import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://opdtdfyuwvkqklpkylri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZHRkZnl1d3ZrcWtscGt5bHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExMzgzMjMsImV4cCI6MjAyNjcxNDMyM30.iTRh5PAp56tHYD56L6dEykR3u78xyvPUznQUoDLywtk';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
