import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function FloatingActionButton() {
  const startChatbot = () => {
    // Implement chatbot start logic here
    console.log("Starting chatbot...");
  };

  return (
    <Button
      className="fixed bottom-4 right-4 rounded-full p-4"
      onClick={startChatbot}
    >
      <Play className="mr-2 h-4 w-4" />
      Iniciar Chatbot
    </Button>
  );
}