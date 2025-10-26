import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { TechnicalCategory, TechnicalSpecialization } from '@/data/evaluationTemplates';

interface TechnicalEvaluationBlockProps {
  id: number;
  availableCategories: TechnicalCategory[];
  onScoresChange: (blockId: number, categoryId: string, scores: Record<string, number>) => void;
  onRemove: (blockId: number) => void;
  onCategoryChange: (blockId: number, newCategoryId: string | null) => void;
}

export default function TechnicalEvaluationBlock({ id, availableCategories, onScoresChange, onRemove, onCategoryChange }: TechnicalEvaluationBlockProps) {
  const [selectedCategory, setSelectedCategory] = useState<TechnicalCategory | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleCategorySelect = (categoryId: string) => {
    const category = availableCategories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setScores({}); // Reset scores when category changes
    onCategoryChange(id, categoryId);
  };

  const handleScoreChange = (competencyId: string, value: number) => {
    const newScores = { ...scores, [competencyId]: value };
    setScores(newScores);
    if (selectedCategory) {
      onScoresChange(id, selectedCategory.id, newScores);
    }
  };

  return (
    <Card className="bg-muted/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Select onValueChange={handleCategorySelect} disabled={!!selectedCategory}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecione uma Categoria Técnica" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => onRemove(id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        {selectedCategory && (
          <Accordion type="multiple" className="w-full">
            {selectedCategory.especializacoes.map(spec => (
              <AccordionItem value={spec.id} key={spec.id}>
                <AccordionTrigger>{spec.name}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {spec.competencias.map(comp => (
                    <div key={comp.id}>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`${id}-${comp.id}`}>{comp.name}</Label>
                        <Badge variant="outline">{scores[comp.id] || "N/A"}</Badge>
                      </div>
                      <Slider
                        id={`${id}-${comp.id}`}
                        min={1}
                        max={4}
                        step={0.5}
                        value={[scores[comp.id] || 1]}
                        onValueChange={([val]) => handleScoreChange(comp.id, val)}
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}