import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicalCategory } from "@/data/evaluationTemplates";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  availableCategories: TechnicalCategory[];
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySelectionModal({
  isOpen,
  onOpenChange,
  availableCategories,
  onSelectCategory,
}: CategorySelectionModalProps) {
  
  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecione uma Categoria Técnica</DialogTitle>
          <DialogDescription>
            Escolha uma categoria do catálogo para adicionar à avaliação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {availableCategories.map(category => (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => handleSelect(category.id)}
            >
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-muted-foreground list-disc pl-4">
                  {category.especializacoes.slice(0, 2).map(spec => (
                    <li key={spec.id}>{spec.name}</li>
                  ))}
                  {category.especializacoes.length > 2 && <li>e mais...</li>}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}