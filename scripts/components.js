async function loadSidebar() {
  const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
  if (!sidebarPlaceholder) return;

  try {
    const response = await fetch("components/sidebar.html");
    if (!response.ok) throw new Error("Componente sidebar.html não encontrado!");
    
    const sidebarHTML = await response.text();
    sidebarPlaceholder.outerHTML = sidebarHTML;
    
    initializeSidebarLogic();

  } catch (error) {
    console.error("Erro ao carregar a sidebar:", error);
    if(sidebarPlaceholder) {
      sidebarPlaceholder.innerHTML = '<p class="p-4 text-red-500">Erro ao carregar a sidebar.</p>';
    }
  }
}

function initializeSidebarLogic() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebarTitle = document.getElementById("sidebar-title");
  const sidebarTextElements = document.querySelectorAll(".sidebar-text-js");

  const applyState = (state) => {
    const isClosed = state === 'closed';

    // Manipula o marginLeft diretamente via style para máxima confiabilidade
    if (window.innerWidth >= 768) { // breakpoint 'md' do Tailwind
      mainContent.style.marginLeft = isClosed ? '5rem' : '16rem'; // 5rem = w-20; 16rem = w-64
    } else {
      mainContent.style.marginLeft = '0'; // Sem margem em telas pequenas
    }
    
    // Controla a aparência da própria sidebar com classes
    sidebar.classList.toggle("w-20", isClosed);
    sidebar.classList.toggle("p-4", isClosed);
    sidebar.classList.toggle("w-64", !isClosed);
    sidebar.classList.toggle("p-8", !isClosed);
    
    // Controla a visibilidade dos textos
    sidebarTitle.classList.toggle("opacity-0", isClosed);
    sidebarTitle.classList.toggle("max-w-0", isClosed);
    sidebarTextElements.forEach(text => {
      text.classList.toggle("opacity-0", isClosed);
      text.classList.toggle("max-w-0", isClosed);
    });
  };

  const toggleSidebar = () => {
    const currentState = localStorage.getItem('sidebarState') || 'open';
    const newState = currentState === 'open' ? 'closed' : 'open';
    localStorage.setItem('sidebarState', newState);
    applyState(newState);
  };

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", toggleSidebar);
  }

  // Listener para o caso de o usuário redimensionar a janela
  window.addEventListener('resize', () => {
    const currentState = localStorage.getItem('sidebarState') || 'open';
    applyState(currentState);
  });

  // Aplica o estado inicial salvo
  const savedState = localStorage.getItem('sidebarState') || 'open';
  applyState(savedState);

  // Lógica para destacar o link da página atual
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
  const navLinks = document.querySelectorAll("#sidebar-nav a");
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    link.classList.remove("bg-accent-bg", "font-semibold");
    link.classList.add("font-medium");
    if (linkPage === currentPage) {
      link.classList.remove("font-medium");
      link.classList.add("bg-accent-bg", "font-semibold");
    }
  });
}