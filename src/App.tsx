import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Loader2 } from "lucide-react";
import { useConfig } from "./components/config-provider";
import { S3Client } from "./lib/buckets";

export const onboardingSchema = z.object({
  cloudflare_account_id: z.string().min(1),
  cloudflare_access_key_id: z.string().min(1),
  cloudflare_secret_access_key: z.string().min(1),
});
export type OnboardingSchema = z.infer<typeof onboardingSchema>;

function App() {
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cloudflare_access_key_id: "",
      cloudflare_account_id: "",
      cloudflare_secret_access_key: "",
    },
    mode: "all",
  });
  const { config, setConfig } = useConfig();

  async function onSubmit(data: OnboardingSchema) {
    const client = new S3Client(
      data.cloudflare_access_key_id,
      data.cloudflare_secret_access_key
    );
    const info = await client.s3_fetch(
      `https://${data.cloudflare_account_id}.r2.cloudflarestorage.com`
    );
    console.log(info);
    // setConfig(data);
  }
  return (
    <>
      {!config ? (
        <div className="flex items-center justify-center min-h-screen w-full">
          <Card className="transition-[height] max-h-fit min-w-96 animate-in zoom-in-95 duration-500">
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Configure all fields to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  autoComplete="off"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-y-3 pb-2"
                >
                  <FormField
                    control={form.control}
                    name="cloudflare_account_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cloudflare Account ID</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="abcdefghijk123456789"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cloudflare_access_key_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>R2 Access Key ID</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="off"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cloudflare_secret_access_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>R2 Secret Access Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="off"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Get started
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 items-center justify-center flex-1">
          <Button>Click me</Button>
          <Button variant="ghost" onClick={() => setConfig(null)}>
            Clear configuration
          </Button>
        </div>
      )}
    </>
  );
}

export default App;
