import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/page-header";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export function BucketsView() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Buckets</PageHeaderTitle>
        <PageHeaderDescription>
          Select a bucket from here to upload files.
        </PageHeaderDescription>
        <PageHeaderActions>
          <Button size="sm">
            <Plus className="size-4" />
            New bucket
          </Button>
        </PageHeaderActions>
      </PageHeader>
    </>
  );
}
