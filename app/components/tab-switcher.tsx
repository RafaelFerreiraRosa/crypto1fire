'use client';

import { Button } from "@/components/ui/button";

export function TabSwitcher({ targetTabValue }: { targetTabValue: string }) {
  const handleClick = () => {
    const tab = document.querySelector(`[data-value="${targetTabValue}"]`);
    if (tab) {
      (tab as HTMLElement).click();
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className="px-4 py-2 bg-primary/80 hover:bg-primary rounded text-white text-sm font-medium transition-colors"
    >
      More
    </Button>
  );
} 