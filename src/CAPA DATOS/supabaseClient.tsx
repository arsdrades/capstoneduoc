import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl: string = 'https://ltfqtkcfoumbtomhjluu.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZnF0a2Nmb3VtYnRvbWhqbHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTk3OTksImV4cCI6MjA0Mjg5NTc5OX0.YtVIJD5mQlmA7I3vraxUaV8fcgyWkx3VTd3qgpAE0So';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para login de usuario
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single(); // Asegúrate de que 'single' devuelva un único registro

    if (error) throw error; // Maneja el error si ocurre
    return data; // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return null; // Si ocurre un error, retorna null
  }
};

// Función para guardar un producto
export const guardarProducto = async (nombre: string, alto: number, ancho: number, largo: number) => {
  try {
    // Primero verifica si el producto ya existe en la base de datos
    const { data: existingProduct, error: fetchError } = await supabase
      .from('producto')
      .select('*')
      .eq('nombre', nombre)
      .single();

    // Si ocurre un error en la consulta, retornamos el error
    if (fetchError && fetchError.code !== 'PGRST116') {
      return { success: false, data: null, error: { message: fetchError.message, details: fetchError.details, hint: fetchError.hint } };
    }

    // Si el producto ya existe (es decir, no hay error y tenemos un `existingProduct`), devolvemos un mensaje de error
    if (existingProduct) {
      return { success: false, data: null, error: { message: 'El producto ya existe', details: `Producto con nombre "${nombre}" ya existe.`, hint: null } };
    }

    // Si no existe, procedemos a insertar el nuevo producto
    const { data, error } = await supabase
      .from('producto')
      .insert([{ nombre, ancho, alto, largo }]);

    if (error) {
      // Incluye información detallada del error en el retorno
      return { success: false, data: null, error: { message: error.message, details: error.details, hint: error.hint } };
    }

    return { success: true, data, error: null }; // Retorna los datos del producto insertado sin errores
  } catch (error) {
    // Captura cualquier otro error inesperado
    console.error('Error crítico al guardar el producto:', error);
    return { success: false, data: null, error: { message: 'Error crítico al guardar el producto', details: error } };
  }
};

// Función para obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const { data, error } = await supabase
      .from('producto')
      .select('*'); // Obtiene todos los productos

    if (error) throw error; // Si ocurre un error, lanzamos una excepción
    return data; // Retorna los productos obtenidos
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return []; // Retorna un array vacío si ocurre un error
  }
};

// Función para eliminar un producto por ID
export const eliminarProducto = async (id: number) => {
  try {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id); // Elimina el producto con el ID especificado

    if (error) throw error; // Si ocurre un error, lanzamos una excepción
    return true; // Retorna true si se elimina correctamente
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return false; // Retorna false si ocurre un error
  }
};
