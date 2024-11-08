import { Button } from '@/common/components/atoms/Button/Button';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { useCaseOptionsLogic } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useCaseOptionsLogic/useCaseOptionsLogic';
import { FileText, Link, MoreVertical } from 'lucide-react';

export const CaseOptions = () => {
  const {
    isGeneratingPDF,
    generateAndOpenPDFInNewTab,
    isCopyingCollectionFlowLink,
    copyCollectionFlowLink,
  } = useCaseOptionsLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreVertical size={23} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="w-full px-8 py-1" asChild>
          <Button
            onClick={() => generateAndOpenPDFInNewTab()}
            disabled={isGeneratingPDF}
            variant={'ghost'}
            className="justify-start"
          >
            <FileText size={18} className="mr-2" /> Open PDF Certificate
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`w-full px-8 py-1 ${isCopyingCollectionFlowLink ? 'hidden' : ''}`}
          asChild
        >
          <Button
            onClick={() => copyCollectionFlowLink()}
            disabled={isCopyingCollectionFlowLink}
            variant={'ghost'}
            className="justify-start"
          >
            <Link size={18} className="mr-2" /> Copy Collection Flow Link
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
