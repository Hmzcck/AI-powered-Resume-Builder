"use client";
import { useState } from "react";
import { RichTextEditor } from "../shared/RichTextEditor";
import { DeleteButton } from "../shared/DeleteButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Configuration types
type FieldConfig = {
  type:
    | "text"
    | "date"
    | "url"
    | "email"
    | "tel"
    | "checkbox"
    | "select"
    | "richtext";
  label: string;
  placeholder?: string;
  options?: string[]; // For select fields
  colSpan?: 1 | 2; // For grid layout
  dependentDisable?: {
    // For fields that should be disabled based on another field
    field: string;
    value: boolean;
  };
};

type EditorConfig<T> = {
  name: string; // e.g., 'award', 'certification'
  emptyState: T;
  fields: Record<keyof T, FieldConfig>;
  addButtonText: string;
  emptyMessage: string;
  singleItem?: boolean; // If true, only one item is allowed
};

// Generic editor component factory
export function createEditor<T extends Record<string, string | boolean>>(
  config: EditorConfig<T>
) {
  return function Editor({
    value,
    onChange,
  }: {
    value: string;
    onChange: (content: string) => void;
  }) {
    // Parse initial state
    const initialItems: T[] = (() => {
      try {
        const parsed = JSON.parse(value);
        if (config.singleItem) {
          return [parsed];
        }
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [config.emptyState];
      }
    })();

    const [items, setItems] = useState<T[]>(initialItems);

    const deleteItem = (indexToDelete: number) => {
      const updatedItems = items.filter((_, index) => index !== indexToDelete);
      setItems(updatedItems);
      onChange(
        JSON.stringify(config.singleItem ? updatedItems[0] : updatedItems)
      );
    };

    const updateField = (index: number, field: keyof T, value: T[keyof T]) => {
      const updatedItems = items.map((item, i) => {
        if (i !== index) return item;

        const newItem = { ...item };
        newItem[field] = value;

        // If this is a checkbox that controls other fields
        Object.entries(config.fields).forEach(([key, fieldConfig]) => {
          if (
            fieldConfig.dependentDisable?.field === field &&
            value === fieldConfig.dependentDisable.value
          ) {
            newItem[key as keyof T] = "" as T[keyof T];
          }
        });

        return newItem;
      });

      setItems(updatedItems);
      onChange(
        JSON.stringify(config.singleItem ? updatedItems[0] : updatedItems)
      );
    };

    const addNewItem = () => {
      if (config.singleItem) return;

      const updatedItems = [...items, config.emptyState];
      setItems(updatedItems);
      onChange(JSON.stringify(updatedItems));
    };

    const renderField = (
      item: T,
      index: number,
      field: keyof T,
      fieldConfig: FieldConfig
    ) => {
      const isDisabled = fieldConfig.dependentDisable
        ? item[fieldConfig.dependentDisable.field] ===
          fieldConfig.dependentDisable.value
        : false;

      switch (fieldConfig.type) {
        case "checkbox":
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${String(field)}-${index}`}
                checked={Boolean(item[field])}
                onCheckedChange={(checked) =>
                  updateField(index, field, checked as T[keyof T])
                }
                disabled={isDisabled}
              />
              <Label
                htmlFor={`${String(field)}-${index}`}
              >
                {fieldConfig.label}
              </Label>
            </div>
          );

        case "select":
          return (
            <div className="space-y-2">
              <Label>{fieldConfig.label}</Label>
              <Select
                value={String(item[field])}
                onValueChange={(value) =>
                  updateField(index, field, value as T[keyof T])
                }
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={fieldConfig.placeholder ||
                    `Select ${fieldConfig.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {fieldConfig.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );

        case "richtext":
          return (
            <div className="space-y-2">
              <Label>{fieldConfig.label}</Label>
              <RichTextEditor
                value={String(item[field])}
                onChange={(value) =>
                  updateField(index, field, value as T[keyof T])
                }
              />
            </div>
          );

        default:
          return (
            <div className="space-y-2">
              <Label>{fieldConfig.label}</Label>
              <Input
                type={fieldConfig.type}
                value={String(item[field])}
                onChange={(e) =>
                  updateField(index, field, e.target.value as T[keyof T])
                }
                placeholder={fieldConfig.placeholder}
                disabled={isDisabled}
              />
            </div>
          );
      }
    };

    // Group fields by col span
    const groupFields = (fields: Record<keyof T, FieldConfig>) => {
      const fullWidth: Array<[keyof T, FieldConfig]> = [];
      const halfWidth: Array<[keyof T, FieldConfig]> = [];

      Object.entries(fields).forEach(([key, config]) => {
        if (config.colSpan === 2) {
          fullWidth.push([key as keyof T, config]);
        } else {
          halfWidth.push([key as keyof T, config]);
        }
      });

      return { fullWidth, halfWidth };
    };

    const { fullWidth, halfWidth } = groupFields(config.fields);

    return (
      <div className="space-y-8">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {config.emptyMessage}
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="relative space-y-4 pb-8 border-b border-gray-200 last:border-b-0"
            >
              {!config.singleItem && (
                <div className="flex justify-end mb-4">
                  <DeleteButton
                    onClick={() => deleteItem(index)}
                    title={`Delete ${config.name}`}
                  />
                </div>
              )}

              {/* Full width fields */}
              {fullWidth.map(([field, fieldConfig]) => (
                <div key={String(field)}>
                  {renderField(item, index, field, fieldConfig)}
                </div>
              ))}

              {/* Half width fields */}
              {halfWidth.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {halfWidth.map(([field, fieldConfig]) => (
                    <div key={String(field)}>
                      {renderField(item, index, field, fieldConfig)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {!config.singleItem && (
          <Button
            onClick={addNewItem}
            className="w-full"
          >
            {config.addButtonText}
          </Button>
        )}
      </div>
    );
  };
}
