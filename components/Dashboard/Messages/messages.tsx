import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MessagesSidebar } from "@/components/Dashboard/Messages/messages-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CommunicationFlow from "@/components/Dashboard/Messages/ReactFlow/CommunicationFlow";
import { cn } from "@/lib/utils";
type Props = {
  messages: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
};

export function Chatmessages({ messages, className, ...props }: Props) {
  const [activeMessage, setActiveMessage] = useState<any | null>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <div className={cn("w-full h-full ", className)} {...props}>
      <SidebarProvider>
        <MessagesSidebar
          messages={messages}
          onMessageClick={setActiveMessage}
        />
        <SidebarInset>
          <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {activeMessage && <CommunicationFlow message={activeMessage} />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Chatmessages;
