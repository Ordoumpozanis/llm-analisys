import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  trigger: React.ReactNode;
  title: string;
  content: React.ReactNode;
  className?: string;
};

const SheetBox = ({ trigger, title, content, className, ...props }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className={cn("h-[600px] overflow-hidden!", className)}
        {...props}
      >
        <SheetHeader className="h-full">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription asChild className="w-full h-full overflow-hidden">
            <ScrollArea className="w-full h-full">{content}</ScrollArea>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SheetBox;
