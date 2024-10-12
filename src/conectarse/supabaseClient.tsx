import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Definir URL y clave anónima de Supabase
const supabaseUrl: string = 'https://ltfqtkcfoumbtomhjluu.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZnF0a2Nmb3VtYnRvbWhqbHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTk3OTksImV4cCI6MjA0Mjg5NTc5OX0.YtVIJD5mQlmA7I3vraxUaV8fcgyWkx3VTd3qgpAE0So';

// Crear el cliente de Supabase tipado como `SupabaseClient`
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
