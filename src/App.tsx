import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Loader2, Moon, Sun } from "lucide-react";
import { useConfig } from "./components/config-provider";
import { invoke } from "@tauri-apps/api/tauri";
import { useTheme } from "./components/theme-provider";
import { toast } from "sonner";

export const onboardingSchema = z.object({
  account_id: z.string().min(1),
  access_key_id: z.string().min(1),
  secret_access_key: z.string().min(1),
});
export type OnboardingSchema = z.infer<typeof onboardingSchema>;

function App() {
  const { theme, setTheme } = useTheme();
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      access_key_id: "a2b9380d956ecbc7d56ebfcbd1733a45",
      account_id: "fe1917b0950cdb788d0db863c3ab4e3c",
      secret_access_key:
        "91ed159808bc8d7f3818fc9ab25eacf0c167f9b69247f559d385d29e1604a74e",
    },
    mode: "all",
  });
  const { config, setConfig } = useConfig();

  async function onSubmit(data: OnboardingSchema) {
    invoke("init_client", {
      accountId: data.account_id,
      accessKeyId: data.access_key_id,
      secretAccessKey: data.secret_access_key,
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.message) {
          setConfig(data);
          toast.success(res.message, {
            description: "Now you can start uploading files.",
          });
        }
      })
      .catch((e) => console.error(e));
  }
  return (
    <>
      <div className="fixed top-5 right-5">
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          size="icon"
        >
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </div>
      {!config ? (
        <div className="py-4 flex items-center justify-center min-h-screen w-full">
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
                    name="account_id"
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
                    name="access_key_id"
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
                    name="secret_access_key"
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
