import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/page-header";
import { Database, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import dayjs from "dayjs";

interface Bucket {
  name: string;
  creation_date: Date;
}

export function BucketsView() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  useEffect(() => {
    async function getBuckets() {
      const { data: buckets }: { data: Bucket[] } = await invoke(
        "list_buckets"
      );
      setBuckets(buckets);
    }
    getBuckets();
  }, []);
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
            Create bucket
          </Button>
        </PageHeaderActions>
      </PageHeader>
      {buckets.length === 0 ? (
        <div className="h-[80vh] flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no buckets created
            </h3>
            <p className="text-sm text-muted-foreground">
              Go to{" "}
              <a
                className="underline"
                target="_blank"
                href="https://dash.cloudflare.com/?to=/:account/r2/overview"
              >
                Cloudflare R2
              </a>{" "}
              and create a bucket.
            </p>
            <Button size="sm" className="mt-4">
              <Plus className="size-4" />
              Create bucket
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {buckets.map((bucket) => {
            // console.log(format(new Date(), "yyyy-MM-dd"));
            return (
              <Card
                className="hover:bg-secondary transition-colors "
                key={bucket.name}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex text-lg items-center gap-2">
                    <Database className="size-8" />
                    {bucket.name}
                  </CardTitle>
                </CardHeader>
                {/* <CardFooter>{format(created_at, "yyyy-MM-dd")}</CardFooter> */}
                <CardFooter className="flex items-center pb-3 justify-end text-muted-foreground px-4">
                  {dayjs(bucket.creation_date).format("YYYY-MM-DD")}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
