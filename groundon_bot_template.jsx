import React, { useState, useRef } from 'react';
import { MessageSquare, List, Clock, Trash2, Settings } from 'lucide-react';

const ConnectionPoint = ({ position, onStartConnection, onEndConnection, isActive, side }) => {
  const getPositionClass = () => {
    switch(side) {
      case 'top': return 'top-0 left-1/2 -translate-y-1/2 -translate-x-1/2';
      case 'right': return 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2';
      case 'bottom': return 'bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2';
      case 'left': return 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2';
      default: return '';
    }
  };

  return (
    <button
      className={`absolute w-4 h-4 rounded-full border-2 ${
        isActive ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-500'
      } ${getPositionClass()} z-10`}
      onClick={(e) => {
        e.stopPropagation();
        if (onStartConnection && !isActive) {
          onStartConnection(position);
        } else if (onEndConnection && position.id !== isActive?.id) {
          onEndConnection(position);
        }
      }}
    />
  );
};

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const editorRef = useRef(null);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('nodeType', type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x, y },
      data: { message: '', title: `Novo ${type}` }
    };

    setNodes([...nodes, newNode]);
  };

  const startConnection = (point) => {
    setActiveConnection(point);
  };

  const completeConnection = (endPoint) => {
    if (activeConnection && activeConnection.nodeId !== endPoint.nodeId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: activeConnection,
        to: endPoint
      };
      setConnections([...connections, newConnection]);
    }
    setActiveConnection(null);
  };

  const Node = ({ node }) => {
    const handleDragNode = (e, nodeId) => {
      const rect = editorRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNodes(nodes.map(n => 
        n.id === nodeId ? { ...n, position: { x, y } } : n
      ));
    };

    const getNodeIcon = () => {
      switch (node.type) {
        case 'message': return <MessageSquare className="w-5 h-5" />;
        case 'list': return <List className="w-5 h-5" />;
        case 'wait': return <Clock className="w-5 h-5" />;
        default: return null;
      }
    };

    return (
      <div
        className="absolute bg-white rounded-lg shadow-lg w-[300px]"
        style={{
          left: node.position.x,
          top: node.position.y
        }}
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData('nodeId', node.id);
        }}
        onDrag={(e) => handleDragNode(e, node.id)}
        onClick={() => setSelectedNode(node)}
      >
        {/* Pontos de conexão */}
        {['top', 'right', 'bottom', 'left'].map(side => (
          <ConnectionPoint
            key={side}
            position={{
              id: `${node.id}-${side}`,
              nodeId: node.id,
              side: side
            }}
            side={side}
            onStartConnection={startConnection}
            onEndConnection={completeConnection}
            isActive={activeConnection?.nodeId === node.id && activeConnection?.side === side}
          />
        ))}

        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            {getNodeIcon()}
            <span className="font-medium">{node.data.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNodes(nodes.filter(n => n.id !== node.id));
              setConnections(connections.filter(c => 
                c.from.nodeId !== node.id && c.to.nodeId !== node.id
              ));
            }}
            className="p-1 rounded hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <textarea
            value={node.data.message}
            onChange={(e) => {
              setNodes(nodes.map(n =>
                n.id === node.id
                  ? { ...n, data: { ...n.data, message: e.target.value } }
                  : n
              ));
            }}
            className="w-full p-2 border rounded-md"
            placeholder="Digite sua mensagem..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Menu Lateral Esquerdo */}
      <div className="w-64 bg-white border-r p-4">
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
              onDragStart={(e) => handleDragStart(e, type)}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Área do Editor */}
      <div
        ref={editorRef}
        className="flex-1 relative bg-gray-100 overflow-auto"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Conexões */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from.nodeId);
            const toNode = nodes.find(n => n.id === conn.to.nodeId);
            if (!fromNode || !toNode) return null;

            let x1, y1, x2, y2;

            // Calcula pontos de início e fim baseado no lado do container
            const getConnectionPoint = (node, side) => {
              const x = node.position.x;
              const y = node.position.y;
              switch(side) {
                case 'top': return { x: x + 150, y };
                case 'right': return { x: x + 300, y: y + 75 };
                case 'bottom': return { x: x + 150, y: y + 150 };
                case 'left': return { x, y: y + 75 };
                default: return { x, y };
              }
            };

            const start = getConnectionPoint(fromNode, conn.from.side);
            const end = getConnectionPoint(toNode, conn.to.side);

            return (
              <g key={conn.id}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                <circle
                  cx={(start.x + end.x) / 2}
                  cy={(start.y + end.y) / 2}
                  r="5"
                  fill="#6366f1"
                  className="cursor-pointer"
                  onClick={() => setConnections(connections.filter(c => c.id !== conn.id))}
                />
              </g>
            );
          })}
        </svg>

        {nodes.map(node => (
          <Node key={node.id} node={node} />
        ))}
      </div>

      {/* Menu Lateral Direito */}
      <div className="w-64 bg-white border-l p-4">
        <h3 className="font-bold mb-4">Propriedades</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={selectedNode.data.title}
                onChange={(e) => {
                  setNodes(nodes.map(n =>
                    n.id === selectedNode.id
                      ? { ...n, data: { ...n.data, title: e.target.value } }
                      : n
                  ));
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <div className="p-2 bg-gray-50 rounded-md">
                {selectedNode.type}
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
