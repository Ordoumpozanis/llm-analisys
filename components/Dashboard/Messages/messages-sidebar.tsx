/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MessagesType } from "@/types/chatResults";
import { appIcons } from "@/setup/app-icons";
import { cn } from "@/lib/utils";

type MessagesSidebarProps = {
  className?: string;
  messages: MessagesType[];
  onMessageClick?: (message: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export function MessagesSidebar({
  className,
  messages,
  onMessageClick,
  ...props
}: MessagesSidebarProps) {
  const [activeMessage, setActiveMessage] = useState<number>(-100);

  const flattenedMessages = useMemo(
    () => messages.flatMap((message) => [message.user, ...message.response]),
    [messages]
  );

  const handleClick = useCallback(
    // eslint-disable-line @typescript-eslint/no-explicit-any
    (index: number, content: any) => {
      setActiveMessage(index);

      const selectedMessage =
        messages.find((message: any) => message.user?.id === content.id) ||
        null; // eslint-disable-line @typescript-eslint/no-explicit-any

      onMessageClick?.(selectedMessage);
    },
    [messages, onMessageClick]
  );

  return (
    <Sidebar {...props} className={`h-full ${className}`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="overflow-y-auto h-[calc(100vh-100px)] space-y-2 p-2">
              {flattenedMessages.map((content: any, index: number) => {
                // eslint-disable-line @typescript-eslint/no-explicit-any
                if (
                  typeof content === "object" &&
                  content.author?.role === "user"
                ) {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer flex justify-start items-center gap-2",
                        activeMessage === index && "border-2 border-green-500"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(index, content);
                      }}
                    >
                      <appIcons.user className="text-green-500" />
                      <p className="text-xs">
                        <span className="capitalize">
                          {content.content?.parts?.[0].slice(0, 1)}
                        </span>
                        {content.content?.parts?.[0].slice(1, 25)} ...{" "}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
