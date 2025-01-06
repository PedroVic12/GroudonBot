export interface FlowNodeData {
  label: string;
  message?: string;
  title?: string;
  description?: string;
  variableName?: string;
  [key: string]: unknown;
}

export interface FlowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: FlowNodeData;
}