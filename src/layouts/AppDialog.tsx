import { Alert } from "@/components/Alert";
import { FeatureDialog, GuideDialog, HelpDialog } from "@/components/Dialog";
import { Toaster } from "@/components/ui";

export function AppDialog() {
  return (
    <>
      <Toaster />
      <Alert />
      <HelpDialog />
      <GuideDialog />
      <FeatureDialog />
    </>
  );
}
