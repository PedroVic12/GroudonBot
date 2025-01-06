import { Button } from "@/components/ui/button";
import { MessageSquare, List, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTypes = [
  {
    type: "message",
    label: "Send Message",
    icon: MessageSquare,
    bgColor: "bg-blue-100 hover:bg-blue-200",
  },
  {
    type: "list",
    label: "Send List",
    icon: List,
    bgColor: "bg-purple-100 hover:bg-purple-200",
  },
  {
    type: "wait",
    label: "Wait Reply",
    icon: Clock,
    bgColor: "bg-orange-100 hover:bg-orange-200",
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r bg-background p-4">
      <h2 className="mb-4 text-lg font-semibold">Flow Nodes</h2>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className={cn(
              "flex cursor-grab items-center gap-2 rounded-lg border p-3",
              node.bgColor,
              "hover:border-primary/50"
            )}
          >
            <node.icon className="h-5 w-5" />
            <span>{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}