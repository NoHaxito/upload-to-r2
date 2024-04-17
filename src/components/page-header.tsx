import Balance from "react-wrap-balancer";

import { cn } from "@/lib/utils";
import { pickChildren } from "@/lib/children";

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [childrenWithoutActions, actions] = pickChildren(
    children,
    PageHeaderActions
  );
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full gap-x-2",
        className
      )}
      {...props}
    >
      <div className="">{childrenWithoutActions}</div>
      {actions}
    </div>
  );
}

function PageHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("text-lg font-bold tracking-tight md:text-2xl", className)}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balance
      className={cn("text-xs text-muted-foreground sm:text-sm", className)}
      {...props}
    />
  );
}

function PageHeaderActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center space-x-4", className)}
      {...props}
    />
  );
}

export {
  PageHeader,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
};
