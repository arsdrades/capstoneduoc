import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://ltfqtkcfoumbtomhjluu.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZnF0a2Nmb3VtYnRvbWhqbHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTk3OTksImV4cCI6MjA0Mjg5NTc5OX0.YtVIJD5mQlmA7I3vraxUaV8fcgyWkx3VTd3qgpAE0So'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('usuarios') // Consulta la tabla "usuarios"
      .select('*')
      .eq('email', email)
      .single(); // Obtiene un solo usuario

    if (error) throw error;
    return data; 
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al iniciar sesión:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return null;
  }
};