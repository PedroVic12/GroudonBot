import React, { useState, useRef } from 'react';
import { MessageSquare, List, Clock, ChevronRight, Plus, X } from 'lucide-react';

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const editorRef = useRef(null);

  // Nó de Mensagem
  const MessageContainer = ({ node, position, onUpdate }) => {
    return (
      <div 
        className="absolute bg-white rounded-lg shadow-lg w-[300px] border border-gray-200"
        style={{ left: position.x, top: position.y }}
      >
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Mensagem</span>
          </div>
          <button onClick={() => onUpdate(null)} className="text-gray-500 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <textarea
            className="w-full p-2 border border-gray-200 rounded-md"
            placeholder="Digite sua mensagem..."
            value={node.data?.message || ''}
            onChange={(e) => onUpdate({ ...node, data: { ...node.data, message: e.target.value } })}
            rows={3}
          />
        </div>
        <div className="p-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {node.data?.message?.length || 0} caracteres
          </div>
          <button 
            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            onClick={() => setConnectingFrom(node.id)}
          >
            <span>Conectar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Área de Drop para Novos Nós
  const DropZone = ({ position, onDrop }) => {
    const handleDrop = (e) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('nodeType');
      onDrop(nodeType, position);
    };

    return (
      <div 
        className="absolute w-[300px] h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        style={{ left: position.x, top: position.y }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="text-gray-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Arraste um componente aqui</span>
        </div>
      </div>
    );
  };

  // Adiciona um novo nó
  const handleAddNode = (type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {}
    };
    setNodes([...nodes, newNode]);
  };

  // Atualiza um nó existente
  const handleUpdateNode = (updatedNode) => {
    if (!updatedNode) {
      setNodes(nodes.filter(n => n.id !== selectedNode?.id));
      setSelectedNode(null);
      return;
    }
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
    setSelectedNode(updatedNode);
  };

  // Gerencia conexões entre nós
  const handleConnect = (targetNodeId) => {
    if (connectingFrom && connectingFrom !== targetNodeId) {
      setConnections([
        ...connections,
        {
          id: `${connectingFrom}-${targetNodeId}`,
          source: connectingFrom,
          target: targetNodeId
        }
      ]);
    }
    setConnectingFrom(null);
  };

  // Renderiza as conexões
  const ConnectionLines = () => (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {connections.map(({ id, source, target }) => {
        const sourceNode = nodes.find(n => n.id === source);
        const targetNode = nodes.find(n => n.id === target);
        if (!sourceNode || !targetNode) return null;

        return (
          <g key={id}>
            <line
              x1={sourceNode.position.x + 300}
              y1={sourceNode.position.y + 60}
              x2={targetNode.position.x}
              y2={targetNode.position.y + 60}
              stroke={connectingFrom === source ? "#3b82f6" : "#9ca3af"}
              strokeWidth="2"
            />
            <circle
              cx={targetNode.position.x}
              cy={targetNode.position.y + 60}
              r="4"
              fill={connectingFrom === source ? "#3b82f6" : "#9ca3af"}
            />
          </g>
        );
      })}
      {connectingFrom && (
        <line
          x1={nodes.find(n => n.id === connectingFrom)?.position.x + 300}
          y1={nodes.find(n => n.id === connectingFrom)?.position.y + 60}
          x2={connectingFrom ? window.innerWidth - 350 : 0}
          y2={nodes.find(n => n.id === connectingFrom)?.position.y + 60}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r border-gray-200">
        <h3 className="font-bold mb-4">Componentes</h3>
        <div className="space-y-2">
          {[
            { type: 'message', icon: MessageSquare, label: 'Mensagem' },
            { type: 'list', icon: List, label: 'Lista' },
            { type: 'wait', icon: Clock, label: 'Aguardar' }
          ].map(({ type, icon: Icon, label }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', type);
              }}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        className="flex-1 relative overflow-auto p-8"
      >
        <ConnectionLines />
        
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <MessageContainer
              node={node}
              position={node.position}
              onUpdate={handleUpdateNode}
            />
            {/* Drop zone abaixo de cada nó */}
            <DropZone
              position={{ 
                x: node.position.x, 
                y: node.position.y + 180 
              }}
              onDrop={handleAddNode}
            />
          </React.Fragment>
        ))}

        {/* Drop zone inicial se não houver nós */}
        {nodes.length === 0 && (
          <DropZone
            position={{ x: 50, y: 50 }}
            onDrop={handleAddNode}
          />
        )}
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-white p-4 border-l border-gray-200">
        <h3 className="font-bold mb-4">Propriedades</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Nó
              </label>
              <input
                type="text"
                readOnly
                value={selectedNode.id}
                className="w-full p-2 bg-gray-50 rounded border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conexões
              </label>
              <div className="text-sm text-gray-500">
                {connections.filter(c => c.source === selectedNode.id).length} saídas,{' '}
                {connections.filter(c => c.target === selectedNode.id).length} entradas
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Selecione um nó para editar</p>
        )}
      </div>
    </div>
  );
};

export default FlowEditor;
