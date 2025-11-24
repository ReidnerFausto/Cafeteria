import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  // CORREÇÃO: O estado inicial já verifica o tamanho da tela na hora.
  // Se a tela for larga (>= 768px), a sidebar começa aberta. Se for celular, começa fechada.
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  const location = useLocation();

const menuItems = [
    { 
      name: 'Início', 
      path: '/', 
      // Dashboard (Grid)
      icon: <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" /> 
    },
    { 
      name: 'Pedidos (Cozinha)', 
      path: '/pedidos', 
      // Prancheta de Pedidos
      icon: <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /> 
    },
    { 
      name: 'Cardápio (Venda)', 
      path: '/venda', 
      // --- NOVO ÍCONE: CARDÁPIO ABERTO (Book Open) ---
      icon: <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25c.938-.332 1.948-.512 3-.512 2.25 0 4.275.809 5.854 2.146a.75.75 0 0 0 .582 0A11.23 11.23 0 0 1 18 18c1.052 0 2.062.18 3 .512V4.262c-.938-.332-1.948-.512-3-.512a9.707 9.707 0 0 0-5.25.783V4.533Z" /> 
    },
    { 
      name: 'Editar Menu', 
      path: '/cardapio-admin', 
      // Lápis de Edição
      icon: <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /> 
    },
    { 
      name: 'Promoções', 
      path: '/promocoes', 
      // Etiqueta de Desconto
      icon: <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.303a3 3 0 0 0 .879 2.121l9.58 9.58a3 3 0 0 0 4.242 0l4.303-4.303a3 3 0 0 0 0-4.242l-9.58-9.58A3 3 0 0 0 9.553 2.25H5.25ZM6 6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 6Z" clipRule="evenodd" /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-light-bg font-sans text-secondary">
      
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64 p-8' : 'w-20 p-4'} 
        hidden md:flex flex-col bg-card-bg border-r border-gray-200 fixed h-full transition-all duration-300 z-20`}
      >
        <div className="mb-8 flex justify-between items-center">
          <h3 className={`text-2xl font-bold text-primary overflow-hidden whitespace-nowrap transition-all ${!sidebarOpen && 'w-0 opacity-0'}`}>
            Café Gestor
          </h3>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3.75 6.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3.75 12h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5ZM3.75 17.25h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`relative block py-3 ${sidebarOpen ? 'pl-12 pr-4' : 'px-2 text-center'} rounded-lg transition-colors duration-200 
              ${location.pathname === item.path ? 'bg-accent-bg font-semibold' : 'hover:bg-accent-bg font-medium'}`}
            >
              <div className={`${sidebarOpen ? 'absolute left-4 top-1/2 -translate-y-1/2' : 'mx-auto'} w-6 h-6`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
              </div>
              <span className={`whitespace-nowrap transition-all ${!sidebarOpen && 'hidden'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Área Principal (Onde as páginas mudam) */}
      <main 
        className={`flex-1 p-4 md:p-10 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}
      >
        <Outlet /> 
      </main>
    </div>
  );
}