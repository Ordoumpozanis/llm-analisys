import {
  Dialog,
  DialogContent,
  DialogDescription,
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
};

const DialogBox = ({ trigger, content, title, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("w-11/12 lg:max-w-[600px] max-h-[400px]", className)}
      >
        <DialogHeader className="w-full p-5">
          <DialogTitle className="text-sm text-green-500">{title}</DialogTitle>
          <DialogDescription
            asChild
            className="w-full overflow-auto max-h-[380px] p-2"
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
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
