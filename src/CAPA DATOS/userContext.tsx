import React, { createContext, useState, useContext } from 'react';

// Definimos la interfaz para los datos del usuario
interface User {
  email: string;
  nombre: string;
  apellido: string;
}

// Definimos el tipo de nuestro contexto
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Creamos el contexto de usuario
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook para usar el contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};

// Proveedor de usuario que envuelve la aplicación
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};