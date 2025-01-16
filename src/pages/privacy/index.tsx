import { Logo } from "@/components/layer";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
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
          <h2 className="text- mb-2 text-xl font-semibold">개인정보처리방침</h2>
          <div className="text-sm text-muted-foreground">최종 수정일: 2024년 1월 16일</div>
        </div>
        <Paragraph></Paragraph>
        <Section>
          <Heading3>개인정보 수집 및 이용 당사는 서비스 제공</Heading3>
          <Paragraph>Maskit은 서비스 제공 과정에서 어떠한 개인정보도 수집하지 않습니다.</Paragraph>
        </Section>
        <Section>
          <Heading3>이미지 처리 방침</Heading3>
          <Paragraph>Maskit은 다음과 같이 이미지를 처리하고 있습니다.</Paragraph>
          <List>
            <ListItem>
              모든 이미지 편집 작업은 사용자의 웹 브라우저 내에서 로컬로 처리됩니다.
            </ListItem>
            <ListItem>편집되는 이미지는 어떠한 경우에도 외부 서버로 전송되지 않습니다. </ListItem>
            <ListItem>
              이미지 데이터는 사용자의기기에서만 처리되며, 편집 세션이 종료되면 자동으로 삭제됩니다.
            </ListItem>
          </List>
        </Section>
        <Section>
          <Heading3>보안</Heading3>
          <Paragraph>
            Maskit은 사용자의 프라이버시를 중요하게 생각하며, 이에 따라 다음과 같은 보안 조치를
            실시하고 있습니다:
          </Paragraph>
          <List>
            <ListItem>모든 이미지 처리는 클라이언트 사이드(브라우저) 에서만 이루어집니다.</ListItem>
            <ListItem>어떠한 사용자 데이터도 서버에 저장되지 않습니다.</ListItem>
          </List>
        </Section>
        <Section>
          <Heading3>개인정보처리방침 변경</Heading3>
          <Paragraph>
            본 개인정보처리방침은 법률이나 서비스의 변경사항을 반영하기 위해 수정될 수 있습니다.
            개인정보처리방침이 변경되는 경우, 웹사이트를 통해 공지하겠습니다.
          </Paragraph>
        </Section>
        <Section>
          <Heading3>문의사항</Heading3>
          <Paragraph>
            개인정보처리방침에 대한 문의사항이 있으신 경우, 아래의 이메일로 문의해 주시기 바랍니다.
          </Paragraph>
          <div className="font-semibold text-blue-500"> maskit.master@gmail.com</div>
        </Section>
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
