import React from "react";
import {clipboard} from "@/modules/client/clipboard";

export const useClipboardCopy = (resetTimeout = 1000) => {
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<NodeJS.Timeout>();

  const copyText = async (text: string) => {
    const copied = await clipboard.copyText(text);
    if (copied) {
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), resetTimeout);
    }
  };

  return {copyText, copied};
};
