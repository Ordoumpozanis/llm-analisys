import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Props = {
  trigger: React.ReactNode;
  content: string;
  title: string;
  className?: string;
  footerCOntent?: React.ReactNode;
};

const DialogBox = ({
  trigger,
  content,
  title,
  className,
  footerCOntent,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("w-11/12 lg:w-[600px] max-h-[600px]", className)}
      >
        <DialogHeader className="w-full p-5">
          <DialogTitle className="text-sm text-green-500">{title}</DialogTitle>
          <DialogDescription
            asChild
            className="w-full overflow-auto h-full p-2  max-h-[350px]"
          >
            <ScrollArea className="w-full">
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                className="markdown-container"
              >
                {content}
              </ReactMarkdown>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
        {footerCOntent && (
          <DialogFooter className="w-full h-[30px] flex justify-end items-center gap-2">
            {footerCOntent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
