import { Button } from "@/components/ui";
import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <>
      <div className="pointer-events-auto absolute bottom-0 left-0">
        <Button variant="outline" className="hidden rounded-full md:flex" size="icon" asChild>
          <a href="https://github.com/cksrlcks" target="_blank" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <div className="pointer-events-auto absolute bottom-0 left-1/2 hidden -translate-x-1/2 md:block">
        <Link
          to="/privacy"
          className="text-xs leading-9 tracking-tight text-muted-foreground hover:text-foreground"
        >
          {t("footer.privacy")}
        </Link>
      </div>
    </>
  );
}
