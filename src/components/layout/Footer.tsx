import { Button } from "@/components/ui";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 p-6">
      <Button variant="outline" className="rounded-full" size="icon" asChild>
        <a href="https://github.com/cksrlcks" target="_blank" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
