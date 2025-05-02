"use client";
import { useState, useEffect } from "react";
import { RichTextEditor } from "../shared/RichTextEditor";
import { DeleteButton } from "../shared/DeleteButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Configuration types
type FieldConfig = {
  type: "text" | "date" | "url" | "email" | "tel" | "checkbox" | "select" | "richtext";
  label: string;
  placeholder?: string;
  options?: string[];
  colSpan?: 1 | 2;
  dependentDisable?: {
    field: string;
    value: boolean;
  };
};

type EditorConfig<T> = {
  name: string;
  emptyState: T;
  fields: Record<keyof T, FieldConfig>;
  addButtonText: string;
  emptyMessage: string;
  singleItem?: boolean;
};

// Generic editor component factory
export function createEditor<
  T extends Record<string, string | boolean | Date | null | undefined>
>(config: EditorConfig<T>) {
  return function Editor({
    value,
    onChange,
  }: {
    value: string | T | T[];
    onChange: (data: T | T[]) => void;
  }) {
    const parseItems = (incoming: string | T | T[]): T[] => {
      try {
        if (typeof incoming !== "string") {
          const val = Array.isArray(incoming) ? incoming : [incoming];
          return config.singleItem ? [val[0]] : val;
        }
        const parsed = JSON.parse(incoming);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        return config.singleItem ? [arr[0]] : arr;
      } catch {
        return [config.emptyState];
      }
    };

    const [items, setItems] = useState<T[]>(parseItems(value));

    // 🔁 Sync with external value when it changes
    useEffect(() => {
      const newItems = parseItems(value);
      setItems(newItems);
    }, [value]);

    const emitChange = (updated: T[]) => {
      const dataToPass = config.singleItem ? updated[0] : updated;
      onChange(dataToPass);
    };

    const updateField = (index: number, field: keyof T, fieldValue: T[keyof T]) => {
      const updated = [...items];
      const item = { ...updated[index], [field]: fieldValue };

      Object.entries(config.fields).forEach(([key, fieldConfig]) => {
        if (
          fieldConfig.dependentDisable?.field === field &&
          fieldValue === fieldConfig.dependentDisable.value
        ) {
          item[key as keyof T] = "" as T[keyof T];
        }
      });

      updated[index] = item;
      setItems(updated);
      emitChange(updated);
    };

    const deleteItem = (index: number) => {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      emitChange(updated);
    };

    const addItem = () => {
      if (config.singleItem) return;
      const updated = [...items, config.emptyState];
      setItems(updated);
      emitChange(updated);
    };

    const renderField = (
      item: T,
      index: number,
      field: keyof T,
      fieldConfig: FieldConfig
    ) => {
      const isDisabled = fieldConfig.dependentDisable
        ? item[fieldConfig.dependentDisable.field] === fieldConfig.dependentDisable.value
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
              <Label htmlFor={`${String(field)}-${index}`}>{fieldConfig.label}</Label>
            </div>
          );

        case "select":
          return (
            <div className="space-y-2">
              <Label>{fieldConfig.label}</Label>
              <Select
                value={String(item[field] ?? "")}
                onValueChange={(val) => updateField(index, field, val as T[keyof T])}
                disabled={isDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={fieldConfig.placeholder || "Select"} />
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
                value={String(item[field] ?? "")}
                onChange={(val) => updateField(index, field, val as T[keyof T])}
              />
            </div>
          );

        default:
          return (
            <div className="space-y-2">
              <Label>{fieldConfig.label}</Label>
              <Input
                type={fieldConfig.type}
                value={String(item[field] ?? "")}
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

    const groupFields = (fields: Record<keyof T, FieldConfig>) => {
      const full: Array<[keyof T, FieldConfig]> = [];
      const half: Array<[keyof T, FieldConfig]> = [];

      Object.entries(fields).forEach(([key, field]) => {
        if (field.colSpan === 2) {
          full.push([key as keyof T, field]);
        } else {
          half.push([key as keyof T, field]);
        }
      });

      return { full, half };
    };

    const { full, half } = groupFields(config.fields);

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

              {full.map(([field, fieldCfg]) => (
                <div key={String(field)}>
                  {renderField(item, index, field, fieldCfg)}
                </div>
              ))}

              {half.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {half.map(([field, fieldCfg]) => (
                    <div key={String(field)}>
                      {renderField(item, index, field, fieldCfg)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {!config.singleItem && (
          <Button onClick={addItem} className="w-full">
            {config.addButtonText}
          </Button>
        )}
      </div>
    );
  };
}
