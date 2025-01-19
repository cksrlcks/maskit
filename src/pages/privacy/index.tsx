import { Logo } from "@/components/layer";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Section = {
  heading?: string;
  content?: string;
  list?: string[];
  contact?: string;
};

export default function PrivacyPage() {
  const { t } = useTranslation();
  const privacy = Object.values(t("privacy.sections", { returnObjects: true })) as Section[];

  return (
    <div className="p-4">
      <header className="sticky top-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">메뉴</span>
          </Link>
        </Button>
      </header>
      <div className="mx-auto max-w-2xl break-keep tracking-normal">
        <div className="mx-auto mb-9 w-[82px]">
          <Logo />
        </div>
        <div className="mb-10 border-b border-slate-100 pb-10">
          <h2 className="text- mb-2 text-xl font-semibold">{t("privacy.title")}</h2>
          <div className="text-sm text-muted-foreground">{t("privacy.last_updated")}</div>
        </div>
        {privacy.map((item, index) => (
          <Section key={index}>
            {item.heading && <Heading3>{item.heading}</Heading3>}

            {item.content && <Paragraph>{item.content}</Paragraph>}
            {item.list && (
              <List>
                {item.list?.map((item, itemIndex) => <ListItem key={itemIndex}>{item}</ListItem>)}
              </List>
            )}
            {item.contact && <div className="font-semibold text-blue-500">{item.contact}</div>}
          </Section>
        ))}
      </div>
    </div>
  );
}

function Section({ children }: PropsWithChildren) {
  return <section className="mb-10 space-y-3">{children}</section>;
}

function Heading3({ children }: PropsWithChildren) {
  return <h3 className="mb-3 text-lg font-semibold">{children}</h3>;
}

function Paragraph({ children }: PropsWithChildren) {
  return <p className="text-md">{children}</p>;
}

function List({ children }: PropsWithChildren) {
  return <ul className="text-md list-inside list-disc space-y-3">{children}</ul>;
}

function ListItem({ children }: PropsWithChildren) {
  return <li className="">{children}</li>;
}
