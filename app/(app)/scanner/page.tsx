"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { DataModeSwitch } from "@/components/ui/DataModeSwitch";
import { ScanForm } from "@/components/scan/ScanForm";

export default function ScannerPage() {
  return (
    <PageContainer
      title="Repo Scanner"
      description="Scan a GitHub repository for leaked secrets"
      actions={<DataModeSwitch />}
    >
      <ScanForm />
    </PageContainer>
  );
}
