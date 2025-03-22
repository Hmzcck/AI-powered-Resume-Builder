import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  onClick: () => void;
  title?: string;
}

export function DeleteButton({ onClick, title = "Delete" }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="destructive"
      size="sm"
      title={title}
    >
      {title}
    </Button>
  );
}
