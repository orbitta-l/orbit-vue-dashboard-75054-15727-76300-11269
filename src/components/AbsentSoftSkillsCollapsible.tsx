import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompetencyChipDisplayData } from "@/pages/Compare";

interface AbsentSoftSkillsCollapsibleProps {
  absentSoftSkillChips: CompetencyChipDisplayData[];
  isSoftSkillsAbsentCollapsed: boolean;
  setIsSoftSkillsAbsentCollapsed: (collapsed: boolean) => void;
  selectedSoftSkills: string[];
  handleToggleSoftSkill: (skillName: string) => void;
}

export const AbsentSoftSkillsCollapsible: React.FC<AbsentSoftSkillsCollapsibleProps> = ({
  absentSoftSkillChips,
  isSoftSkillsAbsentCollapsed,
  setIsSoftSkillsAbsentCollapsed,
  selectedSoftSkills,
  handleToggleSoftSkill,
}) => {
  if (absentSoftSkillChips.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isSoftSkillsAbsentCollapsed} onOpenChange={setIsSoftSkillsAbsentCollapsed} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-sm font-medium text-muted-foreground hover:text-foreground">
          Competências Ausentes
          {isSoftSkillsAbsentCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-2 pt-2">
          {absentSoftSkillChips.map(skill => (
            <Button
              key={skill.name}
              onClick={() => handleToggleSoftSkill(skill.name)}
              className={cn(
                "h-7 px-2.5 text-xs", // Smaller size
                selectedSoftSkills.includes(skill.name)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" // Selected
                  : "border-muted-foreground/30 text-muted-foreground bg-muted/10 hover:bg-muted/20" // Absent, unselected
              )}
            >
              {skill.name}
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};