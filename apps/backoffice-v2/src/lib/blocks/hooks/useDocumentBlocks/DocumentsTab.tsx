import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';
import { Badge } from '../../components/BadgeCell/BadgeCell';
import { Block } from '../../components/BlockCell/BlockCell';
import { Container } from '../../components/ContainerCell/ContainerCell';
import { Heading } from '../../components/HeadingCell/HeadingCell';
import { Details } from '../../components/DetailsCell/DetailsCell';
import { MultiDocuments } from '../../components/MultiDocumentsCell/MultiDocumentsCell';

export const Document = () => {
  return (
    <Block props={{ content: { className: 'grid-cols-2' } }}>
      <Container id="header">
        <Heading>Documents</Heading>
        <Container>
          <Badge>Documents</Badge>
          <Dialog
            trigger={
              <MotionButton
                // {...motionButtonProps}
                animate={
                  {
                    // ...motionButtonProps.animate,
                    // opacity: !canApprove ? 0.5 : motionButtonProps.animate.opacity,
                  }
                }
                // disabled={!canApprove}
                size={'wide'}
                variant={'success'}
                className={'enabled:bg-success enabled:hover:bg-success/90'}
              >
                Approve
              </MotionButton>
            }
          />
        </Container>
      </Container>
      <Container>
        <Details
          title={'Documents'}
          data={[
            {
              title: 'Document 1',
              value: 'Document 1',
            },
          ]}
          config={{}}
          id={'documents'}
          workflowId={'123'}
          directorId={'123'}
          documents={[]}
          onSubmit={() => {}}
          isSaveDisabled={false}
          contextUpdateMethod={'base'}
          isDocumentsV2={false}
          hideSeparator={false}
        />
      </Container>
      <MultiDocuments
        data={[]}
        isDocumentEditable={false}
        isLoading={false}
        onOcrPressed={() => {}}
        isLoadingOCR={false}
      />
    </Block>
  );
};

export const Documents = () => {
  const documents = [1, 2, 3];

  return (
    <>
      {documents.map(document => (
        <Document key={document} />
      ))}
    </>
  );
};

export const DocumentsTab = () => {
  return <Documents />;
};
