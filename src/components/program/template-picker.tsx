"use client";

import type { ProgramTemplate } from "@/lib/data/program-templates";
import { cn } from "@/lib/utils";

interface TemplatePickerProps {
  templates: ProgramTemplate[];
  onSelect: (template: ProgramTemplate) => void;
}

export function TemplatePicker({ templates, onSelect }: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">Start from a Template</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pick a preset to get started, then customize it
        </p>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={cn(
              "w-full text-left rounded-lg border border-border bg-card p-4",
              "hover:border-primary/50 hover:bg-primary/5 transition-colors"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.description}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-medium bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                {template.daysPerWeek}x/wk
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
