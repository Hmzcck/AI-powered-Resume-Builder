"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUIStore } from "@/stores/ui-store";
import { AIBuildTab, AIScoreTab, AIPreviewTab, AITargetTab } from "./tabs";
import { type AITab } from "@/types/ui";
import { Wand2, Calculator, Eye, Briefcase } from "lucide-react";

export const AIPanel = () => {
  const { aiTab, setAITab } = useUIStore();

  return (
    <div className="flex flex-col h-full">
      <Tabs 
        value={aiTab} 
        onValueChange={(value: string) => setAITab(value as AITab)} 
        className="flex-1 space-y-6"
      >
        <div className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-11">
            <TabsTrigger value="build" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Build with AI
            </TabsTrigger>
            <TabsTrigger value="score" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculate Score
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="target" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Target Jobs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="build" className="h-[calc(100%-4rem)] data-[state=active]:h-[calc(100%-4rem)]">
          <AIBuildTab />
        </TabsContent>
        
        <TabsContent value="score" className="h-[calc(100%-4rem)] data-[state=active]:h-[calc(100%-4rem)]">
          <AIScoreTab />
        </TabsContent>
        
        <TabsContent value="preview" className="h-[calc(100%-4rem)] data-[state=active]:h-[calc(100%-4rem)]">
          <AIPreviewTab />
        </TabsContent>
        
        <TabsContent value="target" className="h-[calc(100%-4rem)] data-[state=active]:h-[calc(100%-4rem)]">
          <AITargetTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
