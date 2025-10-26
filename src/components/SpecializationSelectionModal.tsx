import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { technicalCategories } from "@/data/evaluationTemplates";

interface SpecializationSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectSpecialization: (categoryId: string, specializationId: string) => void;
  alreadySelected: string[]; // Array of specialization IDs
}

export default function SpecializationSelectionModal({
  isOpen,
  onOpenChange,
  onSelectSpecialization,
  alreadySelected,
}: SpecializationSelectionModalProps) {
  
  const handleSelect = (categoryId: string, specializationId: string) => {
    onSelectSpecialization(categoryId, specializationId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Avaliação Técnica</DialogTitle>
          <DialogDescription>
            Selecione uma especialização para avaliar. As especializações já adicionadas estão desabilitadas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {technicalCategories.map(category => (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    {category.especializacoes.map(spec => {
                      const isSelected = alreadySelected.includes(spec.id);
                      return (
                        <Button
                          key={spec.id}
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          disabled={isSelected}
                          onClick={() => handleSelect(category.id, spec.id)}
                        >
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                          {spec.name}
                        </Button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}