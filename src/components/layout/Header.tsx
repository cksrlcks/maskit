import { ThemeSwitch } from "./ThemeSwitch";
import { Logo } from "./Logo";
import { ShareMenu } from "./ShareMenu";
import { RootMenu } from "./RootMenu";

export function Header() {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-10 flex h-16 items-center p-4">
      <div className="pointer-events-auto flex items-center gap-4">
        <RootMenu />
        <Logo />
      </div>
      <div className="pointer-events-auto ml-auto flex flex-none gap-2">
        <ShareMenu />
        <ThemeSwitch />
      </div>
    </header>
  );
}
