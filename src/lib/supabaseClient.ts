import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = 'https://hmjzecpqvdzyofrjbmcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtanplY3BxdmR6eW9mcmpibWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMDgyMzEsImV4cCI6MjA3MDU4NDIzMX0.vUWrypaNZAgP8VWAh5v8mU50JjW0lK9DQcfyJILPZTk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
