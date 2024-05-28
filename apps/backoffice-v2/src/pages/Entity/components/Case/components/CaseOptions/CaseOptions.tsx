import { Button } from '@/common/components/atoms/Button/Button';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { useCaseOptionsLogic } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/useCaseOptionsLogic';

export const CaseOptions = () => {
  const { isGeneratingPDF, generateAndOpenPDFInNewTab } = useCaseOptionsLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="px-8 py-1"
          onClick={generateAndOpenPDFInNewTab}
          disabled={isGeneratingPDF}
        >
          Download PDF Certificate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
