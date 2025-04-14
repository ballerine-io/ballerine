import { Button } from '@/common/components/atoms/Button/Button';
import { DropdownMenu } from '@/common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuContent } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuItem } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { DropdownMenuTrigger } from '@/common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { Edit, FileText, Link, MoreVertical } from 'lucide-react';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { useEditCollectionFlow } from './hooks/useEditCollectionFlow';
import { useGeneratePDF } from './hooks/useGeneratePDF';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCopyCollectionFlowLink } from './hooks/useCopyCollectionFlowLink';

export const CaseOptions = () => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = Boolean(customer?.config?.isDemoAccount);

  const { copyCollectionFlowLink, isCopyingCollectionFlowLink } = useCopyCollectionFlowLink();
  const { onEditCollectionFlow, isCanEditCollectionFlow, isLoading } = useEditCollectionFlow();
  const { generateAndOpenPDFInNewTab } = useGeneratePDF();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreVertical size={23} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="w-full px-8 py-1" asChild>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => generateAndOpenPDFInNewTab()}
                // disabled={isGeneratingPDF}
                disabled
                variant={'ghost'}
                className="w-full justify-start px-8 py-1 disabled:!pointer-events-auto"
              >
                <FileText size={18} className="mr-2" /> Open PDF Certificate
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="top" hidden={!isDemoAccount}>
              This feature is not available for trial accounts.
              <br />
              Talk to us to get full access.
            </TooltipContent>
          </Tooltip>
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
        <DropdownMenuItem className={`w-full px-8 py-1`} asChild>
          <Button
            onClick={onEditCollectionFlow}
            variant={'ghost'}
            className="justify-start"
            disabled={!isCanEditCollectionFlow || isLoading}
          >
            <Edit size={18} className="mr-2" /> Edit Collection Flow
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
