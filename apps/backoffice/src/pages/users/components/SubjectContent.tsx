import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { CanAccess, useTranslate } from '@pankod/refine-core';
import { Box, Button, Divider, Group, HoverCard, Skeleton, Stack, Title } from '@pankod/refine-mantine';
import { ActionIcon, Center, Flex, Kbd, Loader, Transition } from '@mantine/core';
import { DetailsGrid } from '../../../molecules/DetailsGrid/DetailsGrid';
import { WarningAlert } from '../../../components/atoms/WarningAlert/WarningAlert';
import { DataField } from '../../../components/molecules/DataField/DataField';
import { ImageViewer } from '../../../components/organisms/ImageViewer/ImageViewer';
import { MagnifyingGlassButton } from '../../../components/atoms/MagnifyingGlassButton/MagnifyingGlassButton';
import routerProvider from '@pankod/refine-react-router-v6';
import { EState } from '../../../mock-service-worker/users/enums';
import dayjs from 'dayjs';
import * as faceapi from 'face-api.js';
import { createWorker } from 'tesseract.js';
import { BallerineImage } from '../../../components/atoms/BallerineImage/BallerineImage';
import {
  useApproveUserMutation,
  useHandleSelectedUser,
  useMockData,
  useRejectUserMutation,
  useSelectedUserQuery,
  useUserQuery,
} from '../hooks';
import { IconDotsVertical } from '@tabler/icons';
import { formatDate, isValidDate } from 'utils';
import { OcrToggle } from './OcrToggle';

const worker = createWorker();
const ocrInitPromise = async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
};
// For the fromNow method.
dayjs.extend(relativeTime);
// @ts-ignore
const faceapiInitPromise = faceapi.loadFaceRecognitionModel('/models');

export interface ISubjectContentProps {
  nextId: string;
}

export const SubjectContent: FunctionComponent<ISubjectContentProps> = ({ nextId }) => {
  const t = useTranslate();
  const [faceSimilarity, setFaceSimilarity] = React.useState(0);
  const [contentMounted, setContentMounted] = React.useState(false);
  const [ocrText, setOcrText] = React.useState<string>('');
  const { selectUser } = useHandleSelectedUser();
  const { data: selectedUser, isLoading: isLoadingSelectedUser } = useSelectedUserQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { id = '' } = routerProvider.useParams() as { id: string };
  const { isFetching, isLoading } = useUserQuery(id);
  const { personalDetails, passportDetails, checkResults, images } = useMockData();
  const selfieRef = useRef<HTMLImageElement | null>(null);
  const docFaceRef = useRef<HTMLImageElement | null>(null);
  // For OCR.
  const licenseFront = images?.find(({ docType }) => docType === 'license front')?.url;
  const { mutateAsync: mutateAsyncReject, isLoading: isLoadingRejectUserMutation } = useRejectUserMutation();
  const { mutateAsync: mutateAsyncApprove, isLoading: isLoadingApproveUserMutation } = useApproveUserMutation();
  const onRejectUser = async () => {
    return await mutateAsyncReject(
      {
        resource: 'users',
        id: selectedUser?.data?.id ?? '',
        values: {
          state: EState.REJECTED,
          first_name: personalDetails.firstName,
          last_name: personalDetails.lastName,
        },
      },
      {
        onSuccess() {
          if (!nextId) return;

          selectUser(nextId)();
        },
      },
    );
  };
  const onApproveUser = async () => {
    return await mutateAsyncApprove(
      {
        resource: 'users',
        id: selectedUser?.data?.id ?? '',
        values: {
          state: EState.APPROVED,
          first_name: personalDetails.firstName,
          last_name: personalDetails.lastName,
        },
      },
      {
        onSuccess() {
          if (!nextId) return;

          selectUser(nextId)();
        },
      },
    );
  };

  useEffect(() => {
    void (async () => {
      console.log('calculating face similarity');

      try {
        await faceapiInitPromise;

        if (!selfieRef.current || !docFaceRef.current) return;

        const [selfieDesc, documentFacePhotoDesc] = await Promise.all([
          faceapi.computeFaceDescriptor(selfieRef.current),
          faceapi.computeFaceDescriptor(docFaceRef.current),
        ]);

        console.log('face similarity calculated', documentFacePhotoDesc, selfieDesc);

        let distance = faceapi.utils.round(
          // @ts-ignore
          faceapi.euclideanDistance(documentFacePhotoDesc, selfieDesc),
        );

        distance = Math.round((1 - distance) * 100 * 1.5);
        distance = distance > 100 ? 100 : distance;
        console.log('distance', distance);
        setFaceSimilarity(distance);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selfieRef.current, docFaceRef.current, selectedUser?.data?.id]);

  useEffect(() => {
    void (async () => {
      console.log('OCR calculation');
      await ocrInitPromise();

      if (!images[0]?.url) return;

      const { data } = await worker.recognize(images[0].url);
      setOcrText(data.text);
    })();
  }, [images[0]?.url]);

  useEffect(() => {
    setContentMounted(!isFetching);
  }, [isFetching]);

  if (!id) return null;
  const shiftRight = {
    in: { opacity: 1, transform: 'translateX(0)' },
    out: { opacity: 0, transform: 'translateX(-50px)' },
    transitionProperty: 'transform, opacity',
  };
  const shiftTop = {
    in: { opacity: 1, transform: 'translateY(0)' },
    out: { opacity: 0, transform: 'translateY(50px)' },
    transitionProperty: 'transform, opacity',
  };
  return (
    <div
      style={{
        flexGrow: 1,
        height: '100%',
        boxShadow: '0px 4px 39px rgba(99, 117, 165, 0.1)',
        padding: '10px',
      }}
    >
      <Group style={{ padding: 10 }} position="apart">
        <Title order={2} sx={{ fontSize: '2rem', marginInlineStart: '2.4rem' }}>
          {isLoadingSelectedUser ? (
            <Skeleton
              sx={{
                height: '2.5rem',
                width: '13ch',
              }}
            />
          ) : (
            <Transition mounted={!isFetching} transition={shiftRight} duration={200} timingFunction="ease">
              {transitionStyles => <div style={transitionStyles}>{selectedUser?.data?.fullName}</div>}
            </Transition>
          )}
        </Title>
        <Group grow>
          <HoverCard shadow="md">
            <HoverCard.Target>
              <Button
                style={{ maxWidth: '170px', minWidth: '170px' }}
                variant="light"
                color="red"
                onClick={onRejectUser}
                loading={isLoadingRejectUserMutation}
              >
                Reject
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Kbd>Ctrl</Kbd>
                <span style={{ margin: '0 5px' }}>+</span>
                <Kbd>J</Kbd>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>
          <HoverCard shadow="md">
            <HoverCard.Target>
              <Button
                style={{ maxWidth: '170px', minWidth: '170px' }}
                variant="light"
                color="green"
                onClick={onApproveUser}
                loading={isLoadingApproveUserMutation}
              >
                Approve
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Kbd>Ctrl</Kbd>
                <span style={{ margin: '0 5px' }}>+</span>
                <Kbd>A</Kbd>
              </div>
            </HoverCard.Dropdown>
          </HoverCard>

          <ActionIcon style={{ maxWidth: '25px', minHeight: '35px' }} variant="light" color="gray">
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Group>
      </Group>
      {isFetching && (
        <Center style={{ padding: 50 }}>
          <Loader color="blue" size="md"></Loader>
        </Center>
      )}
      {!isFetching && (
        <Transition mounted={contentMounted} transition={shiftTop} duration={200} timingFunction="ease">
          {transitionStyles => (
            <Group grow style={{ flex: 1, height: '100%', ...transitionStyles }}>
              <Stack
                style={{
                  height: '100%',
                  padding: '3.125rem',
                }}
              >
                <Flex sx={{ columnGap: '1.5rem' }}>
                  <BallerineImage
                    ref={selfieRef}
                    alt={'User avatar 1'}
                    width={114}
                    height={143}
                    src={images?.find(({ docType }) => docType === 'Selfie')?.url ?? ''}
                  />
                  <BallerineImage
                    ref={docFaceRef}
                    alt={'User avatar 2'}
                    width={114}
                    height={143}
                    src={images?.find(({ docType }) => docType === 'ID Document (Face)')?.url ?? ''}
                  />
                </Flex>
                <Group style={{ marginTop: '1.5rem' }} position="left" spacing="xl">
                  <DataField
                    title={'Face Similarity'}
                    text={`${faceSimilarity}%`}
                    textProps={{ color: faceSimilarity > 80 ? 'green' : 'red' }}
                    sx={{
                      textTransform: 'capitalize',
                      color: faceSimilarity > 80 ? 'green' : 'red',
                      textColor: faceSimilarity > 60 ? 'green' : 'red',
                    }}
                  />
                  <DataField
                    title={'Image Quality'}
                    text={'OK'}
                    sx={{
                      textTransform: 'capitalize',
                      color: 'green',
                      textColor: 'green',
                    }}
                  />
                </Group>

                <DetailsGrid
                  title={'Personal info'}
                  data={personalDetails}
                  Footer={
                    <WarningAlert>
                      <Flex
                        sx={{
                          justifyContent: 'space-between',
                          color: '#4D4D4D',
                        }}
                      >
                        OCR & Given details mismatch
                        <Button
                          variant={'outline'}
                          sx={{
                            height: 'unset',
                            color: '#3F77FF',
                            border: 'none',
                            fontWeight: 400,
                            fontSize: '0.875rem',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Resolve
                        </Button>
                      </Flex>
                    </WarningAlert>
                  }
                >
                  {({ text, title, ...rest }) => {
                    const value = isValidDate(text) ? formatDate(new Date(text)) : text;

                    return (
                      <DataField
                        title={title}
                        text={value}
                        sx={{
                          textTransform: 'capitalize',
                        }}
                        {...rest}
                      />
                    );
                  }}
                </DetailsGrid>
                <DetailsGrid title={'Passport info'} data={passportDetails}>
                  {({ text, title, ...rest }) => {
                    const value = isValidDate(text) ? formatDate(new Date(text)) : text;

                    return (
                      <DataField
                        title={title}
                        text={value}
                        sx={{
                          textTransform: 'capitalize',
                        }}
                        {...rest}
                      />
                    );
                  }}
                </DetailsGrid>
                <DetailsGrid
                  title={'Check results'}
                  data={checkResults}
                  Header={
                    <Button
                      variant={'outline'}
                      sx={{
                        color: '#3F77FF',
                        border: 'none',
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        height: 'unset',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      View full report
                    </Button>
                  }
                >
                  {({ text, title, ...rest }) => {
                    const color = (() => {
                      if (text === EState.APPROVED) {
                        return '#1ED400';
                      }

                      if (text === EState.REJECTED) {
                        return '#D40000FF';
                      }

                      return '';
                    })();

                    return (
                      <DataField
                        title={title.replace(/aml/i, 'AML')}
                        text={text}
                        textProps={{
                          sx: {
                            color,
                            textTransform: 'capitalize',
                          },
                        }}
                        {...rest}
                      />
                    );
                  }}
                </DetailsGrid>
              </Stack>
              <Stack
                style={{
                  height: '100%',
                  padding: '3.125rem',
                }}
              >
                <CanAccess resource={'image-viewer'} action={'show'}>
                  <ImageViewer>
                    <ImageViewer.ZoomModal />
                    <ImageViewer.SelectedImage
                      initialImage={isLoading || !images?.[0]?.url ? '' : images[0].url}
                      ZoomButton={props => (
                        <MagnifyingGlassButton
                          {...props}
                          sx={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                          }}
                        />
                      )}
                    />
                    <ImageViewer.ImageList>
                      {!isLoading &&
                        images?.map(({ url, docType }) => (
                          <ImageViewer.ImageItem
                            key={`${url}${docType}`}
                            src={url}
                            caption={docType}
                            alt={docType}
                            buttonProps={{
                              sx: {
                                textTransform: 'capitalize',
                              },
                            }}
                          />
                        ))}
                    </ImageViewer.ImageList>
                  </ImageViewer>
                  <OcrToggle ocrText={ocrText} />
                </CanAccess>
              </Stack>
            </Group>
          )}
        </Transition>
      )}
    </div>
  );
};
