import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

type Props = {
  trigger: React.ReactNode;
  title: string;
  className?: string;
  children: React.ReactNode; // Explicitly include children
};

const DialogBoxElements: React.FC<Props> = ({
  trigger,
  title,
  children,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("w-11/12 lg:max-w-[600px] max-h-[400px]", className)}
      >
        <DialogHeader className="p-5">
          <DialogTitle className="text-sm text-green-500">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-4">{children}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBoxElements;
