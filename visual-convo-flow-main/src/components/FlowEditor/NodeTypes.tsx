import { Handle, Position } from "@xyflow/react";
import { MessageSquare, List, Clock } from "lucide-react";

const baseNodeStyles = "p-4 rounded-lg shadow-sm bg-background border min-w-[180px]";

export function MessageNode({ data }: { data: { label: string } }) {
  return (
    <div className={baseNodeStyles}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span>{data.label || "Send Message"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function ListNode({ data }: { data: { label: string } }) {
  return (
    <div className={baseNodeStyles}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <List className="h-4 w-4" />
        <span>{data.label || "Send List"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function WaitNode({ data }: { data: { label: string } }) {
  return (
    <div className={baseNodeStyles}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>{data.label || "Wait Reply"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}