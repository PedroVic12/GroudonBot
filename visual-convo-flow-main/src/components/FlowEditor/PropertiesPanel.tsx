import { Node } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FlowNodeData } from "@/models/FlowNode";

interface PropertiesPanelProps {
  selectedNode: Node<FlowNodeData> | null;
  onNodeChange: (nodeId: string, data: FlowNodeData) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function PropertiesPanel({
  selectedNode,
  onNodeChange,
  onDeleteNode,
}: PropertiesPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-64 border-l bg-green-50 p-4">
        <p className="text-sm text-muted-foreground">
          Selecione um nó para editar suas propriedades
        </p>
      </div>
    );
  }

  const handleNodeDataChange = (key: keyof FlowNodeData, value: string) => {
    if (selectedNode) {
      onNodeChange(selectedNode.id, {
        ...selectedNode.data,
        [key]: value,
      });
    }
  };

  const renderNodeProperties = () => {
    switch (selectedNode.type) {
      case "message":
        return (
          <div className="space-y-4">
            <div>
              <Label>Mensagem</Label>
              <Textarea
                value={selectedNode.data.message || ""}
                onChange={(e) => handleNodeDataChange("message", e.target.value)}
                placeholder="Digite sua mensagem"
              />
            </div>
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            <div>
              <Label>Título da Lista</Label>
              <Input
                value={selectedNode.data.title || ""}
                onChange={(e) => handleNodeDataChange("title", e.target.value)}
                placeholder="Título da lista"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={selectedNode.data.description || ""}
                onChange={(e) => handleNodeDataChange("description", e.target.value)}
                placeholder="Descrição da lista"
              />
            </div>
          </div>
        );
      case "wait":
        return (
          <div className="space-y-4">
            <div>
              <Label>Nome da Variável</Label>
              <Input
                value={selectedNode.data.variableName || ""}
                onChange={(e) => handleNodeDataChange("variableName", e.target.value)}
                placeholder="Nome da variável para armazenar resposta"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-64 border-l bg-green-50 p-4">
      <div className="space-y-4">
        <div>
          <Label>Nome do Nó</Label>
          <Input
            value={selectedNode.data.label || ""}
            onChange={(e) => handleNodeDataChange("label", e.target.value)}
            placeholder="Nome do nó"
          />
        </div>
        {renderNodeProperties()}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar Nó
        </Button>
      </div>
    </div>
  );
}