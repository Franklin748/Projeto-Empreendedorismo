import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  ArrowLeftRight, 
  FileText, 
  Truck, 
  History, 
  Settings, 
  User 
} from 'lucide-react';
import OrdemServico from './OrdemServico';

const COR_FUNDO_CLARO = '#D8E0E5'; 

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ordem-servico', label: 'Ordem de Serviço', icon: ClipboardList },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'entrada-saida', label: 'Entrada/Saída', icon: ArrowLeftRight },
    { id: 'relatorio-diario', label: 'Relatório Diário', icon: FileText },
    { id: 'veiculos', label: 'Veículos', icon: Truck },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0F1C2C', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar Lateral */}
      <aside style={{ width: '240px', backgroundColor: '#0F1C2C', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px', boxSizing: 'border-box', flexShrink: 0 }}>
        
        <div>
          {/* Logo */}
          <div style={{ 
            marginBottom: '28px', 
            backgroundColor: COR_FUNDO_CLARO, 
            padding: '10px 16px', 
            borderRadius: '12px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            maxWidth: '160px'
          }}>
            <img 
              src="/logo-topo.png" 
              alt="Nix Core Logo" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Navegação */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé Sidebar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF' }}>
            <div style={{ border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Nome</span>
          </div>
        </div>

      </aside>

      {/* Área de Conteúdo Principal (Troca Conforme Menu) */}
      <main style={{ flex: 1, padding: '16px', boxSizing: 'border-box', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        
        {/* TELA 1: HOME / DASHBOARD */}
        {activeMenu === 'dashboard' && (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: COR_FUNDO_CLARO, 
            borderRadius: '24px', 
            padding: '24px 32px', 
            boxSizing: 'border-box', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#000000', margin: '0 0 4px 0' }}>
                Home page
              </h1>
              <p style={{ fontSize: '12px', color: '#555555', margin: 0 }}>
                Acompanhamento geral da empresa
              </p>
            </div>

            <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px' }} />
          </div>
        )}

        {/* TELA 2: ORDEM DE SERVIÇO */}
        {activeMenu === 'ordem-servico' && (
          <OrdemServico />
        )}

      </main>

    </div>
  );
};

export default Dashboard;