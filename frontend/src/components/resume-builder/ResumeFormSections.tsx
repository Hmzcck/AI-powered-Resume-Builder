"use client";
import { useResumeStore } from "@/stores/resume-store";
import { resumeService } from "@/services/resume-service";
import { useUIStore } from "@/stores/ui-store";
import { RichTextEditor } from "@/components/resume-builder/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripVertical, Plus, Minus, Wand2 } from "lucide-react";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { Section } from "@/types/resume/sections";
import { ProjectsEditor } from "./editors/ProjectsEditor";
import { CertificationsEditor } from "./editors/CertificationsEditor";
import { LanguagesEditor } from "./editors/LanguagesEditor";
import { AwardsEditor } from "./editors/AwardsEditor";
import { PublicationsEditor } from "./editors/PublicationsEditor";
import { ReferencesEditor } from "./editors/ReferencesEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSectionProps {
  section: Section;
  sections: Section[];
  updateSection: (sectionId: string, content: string) => void;
  updateSectionHeader: (sectionId: string, header: string) => void;
}

async function handleAIBuild(
  sectionId: string,
  header: string,
  sections: Section[],
  updateSection: (sectionId: string, content: string) => void
) {
  // Filter out personal section and combine all other sections
  const resumeContent = sections
    .filter((section) => section.type !== "personal")
    .map((section) => `${section.header}:\n${section.content}`)
    .join("\n\n");

  const data = await resumeService.GenerateResumeSection(header, resumeContent);
  updateSection(sectionId, data.section.content);
}

function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <Skeleton className="h-full w-full animate-pulse" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="flex-1 h-8" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

function SortableSection({
  section,
  sections,
  updateSection,
  updateSectionHeader,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const { minimizedSections, toggleSectionMinimized } = useUIStore();
  const isMinimized = minimizedSections.has(section.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  if (section.isLoading) {
    return <SectionSkeleton />;
  }

  const renderEditor = () => {
    switch (section.type) {
      case "personal":
        return (
          <PersonalInfoEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "education":
        return (
          <EducationEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "certifications":
        return (
          <CertificationsEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "languages":
        return (
          <LanguagesEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "awards":
        return (
          <AwardsEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "publications":
        return (
          <PublicationsEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      case "references":
        return (
          <ReferencesEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
      default:
        return (
          <RichTextEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, content)}
          />
        );
    }
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <Collapsible
        open={!isMinimized}
        onOpenChange={() => toggleSectionMinimized(section.id)}
      >
        <CardHeader className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2 flex-shrink-0">
              <div
                {...attributes}
                {...listeners}
                className="cursor-move p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              >
                <GripVertical className="h-4 w-4" />
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isMinimized ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <Input
              type="text"
              value={section.header || ""}
              onChange={(e) => updateSectionHeader(section.id, e.target.value)}
              placeholder="Section Title"
              className="text-xl font-bold border-none h-auto py-1 min-w-[150px] flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() =>
                      handleAIBuild(
                        section.id,
                        section.header,
                        sections,
                        updateSection
                      )
                    }
                    className="gap-2 whitespace-nowrap"
                    variant="default"
                    size="sm"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>Build with AI</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate section content using AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">{renderEditor()}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function ResumeFormSections() {
  const {
    sections,
    updateSection,
    updateSectionHeader,
    reorderSections,
    isLoading,
  } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id
      );
      const newIndex = sections.findIndex((section) => section.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <>
      {isLoading && <LoadingBar />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                sections={sections}
                updateSection={updateSection}
                updateSectionHeader={updateSectionHeader}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
