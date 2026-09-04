import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Plus, 
  Circle,
  ChevronDown
} from 'lucide-react';

// Cores
const COLOR_PRIMARY = '#2381FD';
const COLOR_BG_LIGHT = '#D8E0E5';
const COLOR_TOTAL = '#95BDFB';
const COLOR_ABERTO = '#FECB65';
const COLOR_EXECUCAO = '#7A55D3';
const COLOR_CONCLUIDO = '#34AC4C';
const COLOR_ALTA = '#FF4D4D';

const PRIORITY_ORDER = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
const STATUS_ORDER = { 'Em Execução': 3, 'Aberto': 2, 'Concluído': 1 };

const MOCK_ORDERS = [
  {
    id: 'OS-0128',
    dataAbertura: '2024-05-24T08:30:00',
    dataFormatada: '24/05/2024 08:30',
    equipamento: 'Escavadeiro CAT 320',
    solicitante: 'Marcos Lima',
    responsavel: 'Jogão silva',
    status: 'Em Execução',
    prioridade: 'Alta',
    horimetro: '4256 h',
    local: 'Frente de Lavra 3',
    tipoServico: 'Preventiva',
    descricao: 'Manutenção preventiva 250 h',
    historico: [
      { data: '24/05/2024 10:15', evento: 'Serviço em execução', responsavel: 'Pessoal responsável' },
      { data: '24/05/2024 09:00', evento: 'Peças Separadas', responsavel: 'Pessoal responsável' },
      { data: '24/05/2024 08:50', evento: 'OS aberta', responsavel: 'Pessoal responsável' },
    ]
  },
  {
    id: 'OS-0129',
    dataAbertura: '2024-05-25T10:00:00',
    dataFormatada: '25/05/2024 10:00',
    equipamento: 'Carregadeira Volvo L120',
    solicitante: 'Carlos Eduardo',
    responsavel: 'Ana Souza',
    status: 'Aberto',
    prioridade: 'Média',
    horimetro: '1820 h',
    local: 'Pátio Principal',
    tipoServico: 'Corretiva',
    descricao: 'Troca de vazamento hidráulico',
    historico: [
      { data: '25/05/2024 10:00', evento: 'OS aberta', responsavel: 'Carlos Eduardo' },
    ]
  },
  {
    id: 'OS-0127',
    dataAbertura: '2024-05-23T14:15:00',
    dataFormatada: '23/05/2024 14:15',
    equipamento: 'Caminhão Scania G450',
    solicitante: 'Roberto Mendes',
    responsavel: 'Jogão silva',
    status: 'Concluído',
    prioridade: 'Baixa',
    horimetro: '8900 h',
    local: 'Oficina Central',
    tipoServico: 'Inspeção',
    descricao: 'Inspeção periódica de pneuma e freios',
    historico: [
      { data: '23/05/2024 16:00', evento: 'Serviço Concluído', responsavel: 'Jogão silva' },
      { data: '23/05/2024 14:15', evento: 'OS aberta', responsavel: 'Roberto Mendes' },
    ]
  }
];

const DEFAULT_COLUMNS = [
  { key: 'id', label: 'Nº da OS' },
  { key: 'data', label: 'Data da abertura' },
  { key: 'equipamento', label: 'Equipamento' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'responsavel', label: 'Responsavel' },
  { key: 'status', label: 'Status' },
  { key: 'prioridade', label: 'Prioridade' }
];

const OrdemServico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOS, setSelectedOS] = useState(MOCK_ORDERS[0]);
  const [sortField, setSortField] = useState('id'); // 'id', 'data', 'status', 'prioridade', 'equipamento', 'solicitante', 'responsavel'
  const [sortOrder, setSortOrder] = useState('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const metrics = useMemo(() => {
    return {
      total: MOCK_ORDERS.length,
      aberto: MOCK_ORDERS.filter(o => o.status === 'Aberto').length,
      execucao: MOCK_ORDERS.filter(o => o.status === 'Em Execução').length,
      concluidas: MOCK_ORDERS.filter(o => o.status === 'Concluído').length,
    };
  }, []);

  // Reordena as colunas para trazer a selecionada para a frente
  const columns = useMemo(() => {
    if (['data', 'status', 'prioridade', 'equipamento', 'solicitante', 'responsavel'].includes(sortField)) {
      const targetCol = DEFAULT_COLUMNS.find(c => c.key === sortField);
      const otherCols = DEFAULT_COLUMNS.filter(c => c.key !== sortField);
      return [targetCol, ...otherCols];
    }
    return DEFAULT_COLUMNS;
  }, [sortField]);

  const filteredAndSortedOrders = useMemo(() => {
    let result = MOCK_ORDERS.filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        item.id.toLowerCase().includes(term) ||
        item.equipamento.toLowerCase().includes(term) ||
        item.solicitante.toLowerCase().includes(term) ||
        item.responsavel.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        item.prioridade.toLowerCase().includes(term)
      );
    });

    return result.sort((a, b) => {
      if (sortField === 'status') {
        const valA = STATUS_ORDER[a.status] || 0;
        const valB = STATUS_ORDER[b.status] || 0;
        return sortOrder === 'asc' ? valB - valA : valA - valB;
      }
      if (sortField === 'prioridade') {
        const valA = PRIORITY_ORDER[a.prioridade] || 0;
        const valB = PRIORITY_ORDER[b.prioridade] || 0;
        return sortOrder === 'asc' ? valB - valA : valA - valB;
      }
      if (sortField === 'data') {
        const dateA = new Date(a.dataAbertura).getTime();
        const dateB = new Date(b.dataAbertura).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'equipamento') {
        return sortOrder === 'asc' 
          ? a.equipamento.localeCompare(b.equipamento) 
          : b.equipamento.localeCompare(a.equipamento);
      }
      if (sortField === 'solicitante') {
        return sortOrder === 'asc' 
          ? a.solicitante.localeCompare(b.solicitante) 
          : b.solicitante.localeCompare(a.solicitante);
      }
      if (sortField === 'responsavel') {
        return sortOrder === 'asc' 
          ? a.responsavel.localeCompare(b.responsavel) 
          : b.responsavel.localeCompare(a.responsavel);
      }
      return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    });
  }, [searchTerm, sortField, sortOrder]);

  const handleApplyFilter = (field) => {
    setSortField(field);
    setSortOrder('asc');
    setIsFilterOpen(false);
  };

  const getBadgeStyle = (type, value) => {
    let baseColor = COLOR_PRIMARY;
    if (type === 'status') {
      if (value === 'Em Execução') baseColor = COLOR_EXECUCAO;
      if (value === 'Aberto') baseColor = COLOR_ABERTO;
      if (value === 'Concluído') baseColor = COLOR_CONCLUIDO;
    } else if (type === 'prioridade') {
      if (value === 'Alta') baseColor = COLOR_ALTA;
      if (value === 'Média') baseColor = COLOR_ABERTO;
      if (value === 'Baixa') baseColor = COLOR_PRIMARY;
    }

    return {
      backgroundColor: `${baseColor}1C`,
      border: `1px solid ${baseColor}`,
      color: baseColor,
      borderRadius: '8px',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block',
      textAlign: 'center'
    };
  };

  return (
    <div style={{ flex: 1, backgroundColor: COLOR_BG_LIGHT, borderRadius: '24px', padding: '24px', boxSizing: 'border-box', overflowY: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#000', margin: '0 0 4px 0' }}>Ordem de Serviço</h1>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Acompanhamento de todas as Ordens de Serviço</p>
        </div>
        
        <button 
          onClick={() => {}} 
          style={{ 
            backgroundColor: COLOR_PRIMARY, 
            color: '#FFF', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '10px 20px', 
            fontWeight: '700', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Nova OS
        </button>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLOR_TOTAL }} />
          <div>
            <div style={{ fontSize: '13px', color: '#666' }}>Total OS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>{metrics.total}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Todas as ordens</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLOR_ABERTO }} />
          <div>
            <div style={{ fontSize: '13px', color: '#666' }}>Aberto</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>{metrics.aberto}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Em andamento</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLOR_EXECUCAO }} />
          <div>
            <div style={{ fontSize: '13px', color: '#666' }}>Em Execução</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>{metrics.execucao}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Em andamento</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLOR_CONCLUIDO }} />
          <div>
            <div style={{ fontSize: '13px', color: '#666' }}>Concluidas</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>{metrics.concluidas}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>Finalizados</div>
          </div>
        </div>
      </div>

      {/* Tabela com Filtro */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px 0', borderBottom: `2px solid ${COLOR_PRIMARY}`, display: 'inline-block', paddingBottom: '4px' }}>
          Ordem de Serviço
        </h2>

        {/* Busca e Botão Filtrar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#EFEFEF', borderRadius: '8px', padding: '0 12px' }}>
            <Search size={16} color="#888" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Buscar por número, equipamento ou solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '13px', padding: '10px 0' }}
            />
          </div>

          {/* Menu Dropdown de Filtros Expandido */}
          <div style={{ position: 'relative' }} ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ backgroundColor: '#E0E0E0', border: 'none', borderRadius: '8px', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              <Filter size={14} /> Filtrar <ChevronDown size={14} />
            </button>

            {isFilterOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '230px', zIndex: 10, padding: '6px 0' }}>
                <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#888', borderBottom: '1px solid #EEE' }}>
                  FILTRAR / ORDENAR POR:
                </div>
                <button onClick={() => handleApplyFilter('status')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'status' ? '#F0F7FF' : 'none', color: sortField === 'status' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'status' ? '600' : '400', cursor: 'pointer' }}>
                  Status (Execução › Aberto › Concluído)
                </button>
                <button onClick={() => handleApplyFilter('prioridade')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'prioridade' ? '#F0F7FF' : 'none', color: sortField === 'prioridade' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'prioridade' ? '600' : '400', cursor: 'pointer' }}>
                  Prioridade (Alta › Média › Baixa)
                </button>
                <button onClick={() => handleApplyFilter('equipamento')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'equipamento' ? '#F0F7FF' : 'none', color: sortField === 'equipamento' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'equipamento' ? '600' : '400', cursor: 'pointer' }}>
                  Equipamento (A-Z)
                </button>
                <button onClick={() => handleApplyFilter('solicitante')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'solicitante' ? '#F0F7FF' : 'none', color: sortField === 'solicitante' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'solicitante' ? '600' : '400', cursor: 'pointer' }}>
                  Solicitante (A-Z)
                </button>
                <button onClick={() => handleApplyFilter('responsavel')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'responsavel' ? '#F0F7FF' : 'none', color: sortField === 'responsavel' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'responsavel' ? '600' : '400', cursor: 'pointer' }}>
                  Responsável (A-Z)
                </button>
                <button onClick={() => handleApplyFilter('data')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'data' ? '#F0F7FF' : 'none', color: sortField === 'data' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'data' ? '600' : '400', cursor: 'pointer' }}>
                  Data da Abertura (Crescente)
                </button>
                <button onClick={() => handleApplyFilter('id')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: sortField === 'id' ? '#F0F7FF' : 'none', color: sortField === 'id' ? COLOR_PRIMARY : '#333', fontSize: '13px', fontWeight: sortField === 'id' ? '600' : '400', cursor: 'pointer' }}>
                  Nº da OS (Crescente)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabela Reordenável */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#E2E8F0', color: '#333' }}>
                {columns.map((col, index) => (
                  <th 
                    key={col.key} 
                    style={{ 
                      padding: '10px', 
                      borderRadius: index === 0 ? '6px 0 0 6px' : index === columns.length - 1 ? '0 6px 6px 0' : '0',
                      cursor: 'pointer'
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.map((os) => {
                const isSelected = selectedOS?.id === os.id;
                
                const renderCellContent = (colKey) => {
                  if (colKey === 'id') return <span style={{ color: COLOR_PRIMARY, fontWeight: '600' }}>{os.id}</span>;
                  if (colKey === 'data') return os.dataFormatada;
                  if (colKey === 'equipamento') return os.equipamento;
                  if (colKey === 'solicitante') return os.solicitante;
                  if (colKey === 'responsavel') return os.responsavel;
                  if (colKey === 'status') return <span style={getBadgeStyle('status', os.status)}>{os.status}</span>;
                  if (colKey === 'prioridade') return <span style={getBadgeStyle('prioridade', os.prioridade)}>{os.prioridade}</span>;
                  return null;
                };

                return (
                  <tr 
                    key={os.id} 
                    onClick={() => setSelectedOS(os)}
                    style={{ 
                      cursor: 'pointer', 
                      backgroundColor: isSelected ? 'rgba(35, 129, 253, 0.05)' : 'transparent',
                      borderBottom: '1px solid #F0F0F0'
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: '12px 10px' }}>
                        {renderCellContent(col.key)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico e Detalhes da OS */}
      {selectedOS && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '16px' }}>
          
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px 0', borderBottom: `2px solid ${COLOR_PRIMARY}`, display: 'inline-block', paddingBottom: '2px' }}>
              Historico da OS-({selectedOS.id}):
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
              {selectedOS.historico.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {idx !== selectedOS.historico.length - 1 && (
                    <div style={{ position: 'absolute', left: '5px', top: '16px', width: '2px', height: '28px', backgroundColor: '#CBD5E1' }} />
                  )}
                  <Circle size={12} fill={COLOR_PRIMARY} color={COLOR_PRIMARY} style={{ flexShrink: 0, marginRight: '16px', zIndex: 1 }} />
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '12px', color: '#333' }}>
                    <span style={{ width: '140px', fontWeight: '500' }}>{item.data}</span>
                    <span style={{ flex: 1, fontWeight: '600' }}>{item.evento}</span>
                    <span style={{ color: '#666' }}>{item.responsavel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px 0' }}>
              Detalhes da OS:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Equipamento:</span>
                <span style={{ fontWeight: '600' }}>{selectedOS.equipamento}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Horimetro:</span>
                <span style={{ fontWeight: '600' }}>{selectedOS.horimetro}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Local:</span>
                <span style={{ fontWeight: '600' }}>{selectedOS.local}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Tipo de Serviço:</span>
                <span style={{ fontWeight: '600' }}>{selectedOS.tipoServico}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontWeight: '700' }}>Prioridades:</span>
                <span style={{ color: COLOR_ALTA, fontWeight: '700' }}>{selectedOS.prioridade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ color: '#666' }}>Descrição:</span>
                <span style={{ fontWeight: '500', textAlign: 'right', maxWidth: '180px' }}>{selectedOS.descricao}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default OrdemServico;