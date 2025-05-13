"use client";
import React from "react";
import { RichTextEditor } from "../shared/RichTextEditor";

// Types for the skill items
export type SkillItem = {
  name: string;
  category: string;
  yearsOfExperience?: number;
  proficiencyLevel?: number;
  description?: string;
};

// Props for the editor component
export type SkillsEditorProps = {
  // Since we handle various input types but always output a string
  value?: string | SkillItem[] | Record<string, unknown>;
  onChange?: (data: string) => void;
  [key: string]: unknown;
};

// Main component that uses a simple rich text editor
export const SkillsEditor = React.forwardRef<unknown, SkillsEditorProps>(
  (props, _ref /* eslint-disable-line @typescript-eslint/no-unused-vars */) => {
    // We just use a RichTextEditor directly instead of creating with EditorFactory
    // because skills are handled specially - they are parsed from rich text format 
    // with a specific format (category: skill1, skill2, skill3)
    
    // Ensure we have a string value
    const stringValue = React.useMemo(() => {
      if (typeof props.value === 'string') {
        return props.value;
      }
      
      // If it's not a string (e.g., an array or object), try to convert it to HTML
      if (Array.isArray(props.value)) {
        // Format skills array into category-based HTML string
        const groupedSkills: Record<string, string[]> = {};
        props.value.forEach((skill) => {
          const skillObj = skill as Partial<SkillItem>;
          const category = skillObj.category ?? 'Other';
          if (!groupedSkills[category]) {
            groupedSkills[category] = [];
          }
          if (skillObj.name) {
            groupedSkills[category].push(skillObj.name);
          }
        });
        
        return Object.entries(groupedSkills)
          .map(([category, skills]) => `<p><strong>${category}:</strong> ${skills.join(', ')}</p>`)
          .join('');
      }
      
      // For other types, attempt to convert to string
      try {
        return JSON.stringify(props.value) ?? '';
      } catch {
        return '';
      }
    }, [props.value]);
    
    return (
      <div className="space-y-4">
        <RichTextEditor
          value={stringValue}
          onChange={(content: string) => {
            if (props.onChange) {
              props.onChange(content);
            }
          }}
        />
      </div>
    );
  }
);

SkillsEditor.displayName = "SkillsEditor";
