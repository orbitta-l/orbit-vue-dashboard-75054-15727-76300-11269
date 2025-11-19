import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { technicalTemplate } from "@/data/evaluationTemplates";

type Mode = 'all' | 'soft' | 'tech';

interface ComparisonFiltersProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, isSelected: boolean) => void;
}

const techCategories = technicalTemplate.map(category => ({
  id: category.id_categoria,
  name: category.nome_categoria,
}));

export const ComparisonFilters: React.FC<ComparisonFiltersProps> = ({
  mode,
  onModeChange,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Análise</CardTitle>
        <CardDescription>Selecione o que deseja comparar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-semibold text-foreground mb-3 block">Modo de Visualização</Label>
          <Tabs value={mode} onValueChange={(value) => onModeChange(value as Mode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
              <TabsTrigger value="tech">Técnicas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {mode === 'tech' && (
          <div>
            <Label className="font-semibold text-foreground mb-3 block">Categorias Técnicas</Label>
            <div className="space-y-3">
              {techCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => onCategoryChange(category.id, !!checked)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};