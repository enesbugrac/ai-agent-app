"use client";

import Thread from "@/components/thread/Thread";
import { useEffect } from "react";

export default function ThreadPage() {
  console.log("Thread page");
  useEffect(() => {
    return () => {
      console.log("unmounting")
    }
  }, [])

  return <Thread />;
}
