import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Minimize2, Maximize2, Send, ArrowLeft } from 'lucide-react';

const LISTA_ATIVIDADES = [
  { codigo: 'D', descricao: 'Deslocamento' },
  { codigo: 'B', descricao: 'Balança / Descarga' },
  { codigo: 'G', descricao: 'Garagem / Recolhe' },
  { codigo: 'C', descricao: 'Coleta' },
  { codigo: 'E', descricao: 'Espera' },
  { codigo: 'A', descricao: 'Abastecimento Combust.' },
  { codigo: 'RF', descricao: 'Refeição' },
  { codigo: 'O', descricao: 'Outro' },
  { codigo: 'S', descricao: 'Socorro mec. / Pneu' },
  { codigo: 'M', descricao: 'Mudança de motorista' },
  { codigo: 'P', descricao: 'Pintura' },
  { codigo: 'T', descricao: 'Transbordo' },
  { codigo: 'V', descricao: 'Varrição mecanizada' },
  { codigo: 'L', descricao: 'Lavagem (pipas)' },
  { codigo: 'AP', descricao: 'Abastec. pintura (pipas)' }
];

const RelatorioDiario = ({ onVoltar, onEnviar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [etapa, setEtapa] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cabeçalho
  const [headerData, setHeaderData] = useState({
    motorista: '', veiculo: '', placa: '', data: '', regional: '', procedencia: '', horimetroInicial: '', horimetroFinal: '', hora: ''
  });

  // Coletores
  const [coletores, setColetores] = useState(['']);
  const [coletorParaExcluir, setColetorParaExcluir] = useState(null);

  // Tabelas Atividades (20 linhas)
  const createEmptyRows = (count) => Array.from({ length: count }, () => ({ atividade: '', hora: '', quilometragem: '' }));
  const [atividadesEsq, setAtividadesEsq] = useState(createEmptyRows(20));
  const [atividadesDir, setAtividadesDir] = useState(createEmptyRows(20));

  // Tabela Descargas (6 linhas)
  const [descargas, setDescargas] = useState(Array.from({ length: 6 }, () => ({ local: '', ticket: '', peso: '' })));

  // Abastecimento / Pessoal
  const [abastecimento, setAbastecimento] = useState({
    litros: '', motorista1: '', motorista2: '', motorista3: '', motorista4: '', fiscal1: '', fiscal2: '', auxTrafego: '', qtdeViagens: ''
  });

  const handleAddColetor = () => setColetores(prev => [...prev, '']);
  const handleUpdateColetor = (index, value) => {
    const updated = [...coletores];
    updated[index] = value;
    setColetores(updated);
  };
  const handleConfirmRemoveColetor = () => {
    if (coletorParaExcluir !== null) {
      setColetores(prev => prev.filter((_, idx) => idx !== coletorParaExcluir));
      setColetorParaExcluir(null);
    }
  };

  const handleAtividadeChange = (side, index, field, value) => {
    if (side === 'esq') {
      const updated = [...atividadesEsq];
      updated[index][field] = value;
      setAtividadesEsq(updated);
    } else {
      const updated = [...atividadesDir];
      updated[index][field] = value;
      setAtividadesDir(updated);
    }
  };

  const totalPeso = descargas.reduce((acc, curr) => acc + (parseFloat(curr.peso) || 0), 0);

  const handleEnviar = () => {
    const payload = { headerData, coletores, atividadesEsq, atividadesDir, descargas, abastecimento };
    if (onEnviar) {
      onEnviar(payload);
    } else {
      console.log('Relatório Enviado:', payload);
      alert('Relatório enviado com sucesso!');
    }
  };

  // CARD 1: DADOS DA OPERAÇÃO (Branco)
  const CardDadosOperacao = () => (
    <div style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
      
      {/* Cabeçalho do Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F1C2C' }}>Dados da Operação</h2>
        {!isMobile && (
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            title={isMinimized ? "Expandir" : "Minimizar"}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
        )}
      </div>

      {!isMinimized && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Motorista</label>
              <input type="text" value={headerData.motorista} onChange={e => setHeaderData({...headerData, motorista: e.target.value})} style={cardInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Veículo</label>
              <input type="text" value={headerData.veiculo} onChange={e => setHeaderData({...headerData, veiculo: e.target.value})} style={cardInputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Placa</label>
              <input type="text" value={headerData.placa} onChange={e => setHeaderData({...headerData, placa: e.target.value})} style={cardInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data</label>
              <input type="date" value={headerData.data} onChange={e => setHeaderData({...headerData, data: e.target.value})} style={cardInputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Regional</label>
            <input type="text" value={headerData.regional} onChange={e => setHeaderData({...headerData, regional: e.target.value})} style={cardInputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Procedência</label>
            <input type="text" value={headerData.procedencia} onChange={e => setHeaderData({...headerData, procedencia: e.target.value})} style={cardInputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Horímetro Inicial</label>
              <input type="text" value={headerData.horimetroInicial} onChange={e => setHeaderData({...headerData, horimetroInicial: e.target.value})} style={cardInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Horímetro Final</label>
              <input type="text" value={headerData.horimetroFinal} onChange={e => setHeaderData({...headerData, horimetroFinal: e.target.value})} style={cardInputStyle} />
            </div>
          </div>

          {/* SESSÃO DE COLETORES COM SCROLLBAR */}
          <div>
            <label style={labelStyle}>Coletores (Total: {coletores.length})</label>
            
            {/* Div com altura fixa e scrollbar interna para não esticar o card */}
            <div style={{ maxHeight: '140px', overflowY: 'auto', paddingRight: '4px', marginBottom: '8px' }}>
              {coletores.map((coletor, idx) => (
                <div key={idx} style={{ marginBottom: '8px', display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder={`Coletor ${idx + 1}`} value={coletor} onChange={(e) => handleUpdateColetor(idx, e.target.value)} style={cardInputStyle} />
                  {idx > 0 && (
                    <button onClick={() => setColetorParaExcluir(idx)} style={{ backgroundColor: '#FF4D4D', border: 'none', borderRadius: '8px', padding: '0 10px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleAddColetor} style={{ width: '100%', backgroundColor: '#E2E8F0', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#333' }}>
              <Plus size={16} /> Adicionar Coletor
            </button>
          </div>

          <div>
            <label style={labelStyle}>Hora</label>
            <input type="time" value={headerData.hora} onChange={e => setHeaderData({...headerData, hora: e.target.value})} style={cardInputStyle} />
          </div>
        </>
      )}

      {/* BOTÕES INTEGRADOS NO CARD DA ESQUERDA */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        <button onClick={onVoltar} style={{ flex: 1, backgroundColor: '#0F1C2C', color: '#FFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Voltar
        </button>

        {isMobile ? (
          <button onClick={() => setEtapa(2)} style={{ flex: 1, backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Continuar
          </button>
        ) : (
          <button onClick={handleEnviar} style={{ flex: 1, backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Send size={16} /> Enviar
          </button>
        )}
      </div>

    </div>
  );

  // CARD 2: TABELAS (Cinza/Azul)
  const CardTabelas = () => (
    <div style={{ backgroundColor: '#B2C0CC', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      
      {/* Duas Tabelas de Atividades */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#94A3B8', color: '#FFF' }}>
                <th style={thStyle}>Atividade</th>
                <th style={thStyle}>Hora</th>
                <th style={thStyle}>Quilometragem</th>
              </tr>
            </thead>
            <tbody>
              {atividadesEsq.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#F8FAFC' : '#FFF' }}>
                  <td style={tdStyle}>
                    <select value={row.atividade} onChange={(e) => handleAtividadeChange('esq', idx, 'atividade', e.target.value)} style={selectAtividadeStyle}>
                      <option value="">-</option>
                      {LISTA_ATIVIDADES.map(item => <option key={item.codigo} value={item.codigo}>{row.atividade === item.codigo ? item.codigo : `${item.codigo} - ${item.descricao}`}</option>)}
                    </select>
                  </td>
                  <td style={tdStyle}><input type="text" value={row.hora} onChange={(e) => handleAtividadeChange('esq', idx, 'hora', e.target.value)} style={tableInputStyle} /></td>
                  <td style={tdStyle}><input type="text" value={row.quilometragem} onChange={(e) => handleAtividadeChange('esq', idx, 'quilometragem', e.target.value)} style={tableInputStyle} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#94A3B8', color: '#FFF' }}>
                <th style={thStyle}>Atividade</th>
                <th style={thStyle}>Hora</th>
                <th style={thStyle}>Quilometragem</th>
              </tr>
            </thead>
            <tbody>
              {atividadesDir.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#F8FAFC' : '#FFF' }}>
                  <td style={tdStyle}>
                    <select value={row.atividade} onChange={(e) => handleAtividadeChange('dir', idx, 'atividade', e.target.value)} style={selectAtividadeStyle}>
                      <option value="">-</option>
                      {LISTA_ATIVIDADES.map(item => <option key={item.codigo} value={item.codigo}>{row.atividade === item.codigo ? item.codigo : `${item.codigo} - ${item.descricao}`}</option>)}
                    </select>
                  </td>
                  <td style={tdStyle}><input type="text" value={row.hora} onChange={(e) => handleAtividadeChange('dir', idx, 'hora', e.target.value)} style={tableInputStyle} /></td>
                  <td style={tdStyle}><input type="text" value={row.quilometragem} onChange={(e) => handleAtividadeChange('dir', idx, 'quilometragem', e.target.value)} style={tableInputStyle} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Descargas e Abastecimento */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
        
        {/* Descargas */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#94A3B8', color: '#FFF' }}>
                <th colSpan="4" style={{ ...thStyle, textAlign: 'center' }}>Descargas</th>
              </tr>
              <tr style={{ backgroundColor: '#CBD5E1' }}>
                <th style={{ ...thStyle, width: '35px' }}>Nº</th>
                <th style={thStyle}>Local</th>
                <th style={thStyle}>Ticket</th>
                <th style={thStyle}>Peso</th>
              </tr>
            </thead>
            <tbody>
              {descargas.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '700' }}>{idx + 1}º</td>
                  <td style={tdStyle}><input type="text" value={item.local} onChange={e => { const u = [...descargas]; u[idx].local = e.target.value; setDescargas(u); }} style={tableInputStyle} /></td>
                  <td style={tdStyle}><input type="text" value={item.ticket} onChange={e => { const u = [...descargas]; u[idx].ticket = e.target.value; setDescargas(u); }} style={tableInputStyle} /></td>
                  <td style={tdStyle}><input type="number" value={item.peso} onChange={e => { const u = [...descargas]; u[idx].peso = e.target.value; setDescargas(u); }} style={tableInputStyle} /></td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#E2E8F0', fontWeight: '700' }}>
                <td colSpan="3" style={{ ...tdStyle, paddingLeft: '8px' }}>Total do peso coletado:</td>
                <td style={{ ...tdStyle, color: '#2563EB', textAlign: 'center' }}>{totalPeso ? totalPeso.toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Abastecimento */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#94A3B8', color: '#FFF' }}>
                <th colSpan="3" style={{ ...thStyle, textAlign: 'center' }}>
                  Abastecimento <input type="text" value={abastecimento.litros} onChange={e => setAbastecimento({...abastecimento, litros: e.target.value})} style={{ width: '60px', border: 'none', borderBottom: '1px solid #FFF', background: 'transparent', color: '#FFF', textAlign: 'center', outline: 'none', fontWeight: 'bold' }} /> Litros
                </th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Motorista:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.motorista1} onChange={e => setAbastecimento({...abastecimento, motorista1: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Motorista:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.motorista2} onChange={e => setAbastecimento({...abastecimento, motorista2: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Motorista:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.motorista3} onChange={e => setAbastecimento({...abastecimento, motorista3: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Motorista:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.motorista4} onChange={e => setAbastecimento({...abastecimento, motorista4: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Fiscal:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.fiscal1} onChange={e => setAbastecimento({...abastecimento, fiscal1: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Fiscal:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.fiscal2} onChange={e => setAbastecimento({...abastecimento, fiscal2: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr><td style={{ ...tdStyle, fontWeight: 'bold' }}>Aux.tráfego:</td><td style={{ ...tdStyle, textAlign: 'center' }}>:</td><td style={tdStyle}><input type="text" value={abastecimento.auxTrafego} onChange={e => setAbastecimento({...abastecimento, auxTrafego: e.target.value})} style={tableInputStyle} /></td></tr>
              <tr style={{ backgroundColor: '#E2E8F0' }}><td colSpan="2" style={{ ...tdStyle, fontWeight: 'bold' }}>Qtde. viagens:</td><td style={tdStyle}><input type="text" value={abastecimento.qtdeViagens} onChange={e => setAbastecimento({...abastecimento, qtdeViagens: e.target.value})} style={tableInputStyle} /></td></tr>
            </tbody>
          </table>
        </div>

      </div>

      {isMobile && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => setEtapa(1)} style={{ flex: 1, backgroundColor: '#0F1C2C', color: '#FFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Voltar para Dados
          </button>
          <button onClick={handleEnviar} style={{ flex: 1, backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Send size={16} /> Enviar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0F1C2C', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box', overflowY: 'auto', fontFamily: 'sans-serif' }}>
      
      <h1 style={{ color: '#FFF', fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '20px' }}>Relatorio Diario</h1>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* DESKTOP */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: isMinimized ? '260px 1fr' : '360px 1fr', gap: '20px', alignItems: 'start', transition: 'grid-template-columns 0.3s ease' }}>
            <CardDadosOperacao />
            <CardTabelas />
          </div>
        )}

        {/* MOBILE */}
        {isMobile && (
          <>
            {etapa === 1 && <CardDadosOperacao />}
            {etapa === 2 && <CardTabelas />}
          </>
        )}
      </div>

      {/* Modal para Deletar Coletor */}
      {coletorParaExcluir !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', width: '300px', textAlign: 'center' }}>
            <AlertTriangle size={36} color="#FF4D4D" style={{ marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 8px 0' }}>Confirmar Exclusão</h4>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 16px 0' }}>Deseja remover o Coletor {coletorParaExcluir + 1}?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setColetorParaExcluir(null)} style={{ flex: 1, backgroundColor: '#E2E8F0', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleConfirmRemoveColetor} style={{ flex: 1, backgroundColor: '#FF4D4D', color: '#FFF', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const labelStyle = { fontSize: '11px', fontWeight: '700', fontStyle: 'italic', color: '#333', marginBottom: '4px', display: 'block' };
const cardInputStyle = { width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '12px', boxSizing: 'border-box', outline: 'none' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '11px' };
const thStyle = { padding: '6px', fontSize: '11px', fontWeight: '700', fontStyle: 'italic' };
const tdStyle = { padding: '4px', border: '1px solid #E2E8F0' };
const tableInputStyle = { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', textAlign: 'center' };
const selectAtividadeStyle = { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', textAlign: 'center', cursor: 'pointer' };

export default RelatorioDiario;