import { FileUploaderField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { FileRepository } from '@app/utils/file-repository';
import '@ballerine/ui/dist/style.css';

const repo = new FileRepository();
repo.registerFile('test', new File([], 'test.file'));

export const App = () => {
  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(),
    useFlowContextQuery(),
  ] as const;

  return (
    // <Sentry.ErrorBoundary>
    //   <AppLoadingContainer dependencies={dependancyQueries}>
    //     <CustomerProvider
    //       loadingPlaceholder={<LoadingScreen />}
    //       fallback={CustomerProviderFallback}
    //     >
    //       <RouterProvider router={router} />
    //     </CustomerProvider>
    //   </AppLoadingContainer>
    // </Sentry.ErrorBoundary>
    <FileUploaderField
      onChange={() => {}}
      uploadFile={() => Promise.resolve({ fileId: 'test' })}
      fileId={'test'}
      placeholder="123"
      acceptFileFormats="test123"
      fileRepository={repo}
    />
  );
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};
