import { ChangeEvent, FunctionComponent } from 'react';
import { Button, Pagination, ScrollArea, Select, Stack, TextInput, UnstyledButton } from '@pankod/refine-mantine';
import { Box, Center, Checkbox, Divider, Flex, Loader, Menu } from '@mantine/core';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import routerProvider from '@pankod/refine-react-router-v6';
import { SortSvg } from '../../../../atoms/SortSvg/SortSvg';
import { MagnifyingGlassSvg } from '../../../../components/atoms/MagnifyingGlassSvg/MagnifyingGlassSvg';
import { FilterSvg } from '../../../../atoms/FilterSvg/FilterSvg';
import { EState } from '../../../../mock-service-worker/users/enums';
import { toStartCase } from '../../../../utils/to-start-case/to-start-case';
import { useHandleSelectedUser, useUsersQuery } from '../../hooks';
import { SubjectListItem } from '../SubjectListItem';
import { IUser } from '../../../../mock-service-worker/users/interfaces';
import { snakeCaseToStartCaseWords } from '../../../../utils/snake-case-to-start-case-words/snake-case-to-start-case-words';
import styles from './SubjectList.module.css';

export interface ISubjectListProps {
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSortBy: (value: string | null) => void;
  handleFilter: (key: keyof IUser) => (value: Array<string>) => void;
  onPaginate: (page: number) => void;
  filter: Record<keyof IUser, Array<string>> | undefined;
  data: Array<IUser>;
  currentPage: number;
  pagesCount: number;
}

export const SubjectList: FunctionComponent<ISubjectListProps> = props => {
  const { handleSearch, handleFilter, onPaginate, handleSortBy, filter, data, currentPage, pagesCount } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { id = '' } = routerProvider.useParams();
  const { isLoading } = useUsersQuery();
  const { selectUser } = useHandleSelectedUser();
  const sortBy: Array<keyof IUser> = ['first_name', 'last_name', 'created_at'];
  const sortByOptions = sortBy.map(snakeCaseToStartCaseWords);

  return (
    <div
      style={{
        minWidth: '285px',
        maxWidth: '285px',
        flexGrow: 1,
        height: '100%',
        boxShadow: '0px 0px 39px rgba(99, 117, 165, 0.1)',
      }}
    >
      <div style={{ padding: 5, textAlign: 'center' }}>
        <Box sx={{ padding: 10 }}>
          <TextInput
            onChange={handleSearch}
            icon={
              <MagnifyingGlassSvg
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                }}
              />
            }
            styles={{
              icon: {
                paddingInlineStart: '1rem',
              },
              input: {
                borderRadius: '44px',
                paddingBlock: '1.4rem',
              },
            }}
            placeholder="Search by user info"
          />
        </Box>
        <Flex
          style={{
            padding: '5px 20px 0px 20px',
            justifyContent: 'space-between',
          }}
        >
          <Menu closeOnItemClick={false} position={'top-start'}>
            <Menu.Target>
              <Button
                variant={'default'}
                leftIcon={
                  <FilterSvg
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                    }}
                  />
                }
                sx={{
                  lineHeight: '1.296rem',
                  color: '#4D4D4D',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  border: 'none',
                }}
              >
                Filter
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Checkbox.Group
                  label={'User state'}
                  // @ts-ignore
                  value={filter?.state}
                  onChange={handleFilter('state')}
                >
                  {Object.values(EState).map(state => (
                    <Checkbox key={`${state}-filter`} label={toStartCase(state)} value={state} />
                  ))}
                </Checkbox.Group>
              </Menu.Item>
              <Menu.Item>
                <Checkbox.Group
                  label={'User type'}
                  // @ts-ignore
                  value={filter?.enduser_type}
                  onChange={handleFilter('enduser_type')}
                >
                  <Checkbox label={'Individual'} value={'individual'} />
                  <Checkbox label={'Business'} value={'business'} />
                </Checkbox.Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Flex sx={{ maxWidth: '18ch' }}>
            {/*<Button*/}
            {/*  variant={'default'}*/}
            {/*  sx={{*/}
            {/*    fontSize: '0.75rem',*/}
            {/*    color: '#4D4D4D',*/}
            {/*    fontWeight: 400,*/}
            {/*    lineHeight: '20.74px',*/}
            {/*    border: 'none',*/}
            {/*  }}*/}
            {/*  leftIcon={<SortSvg />}*/}
            {/*  onClick={onSortDir}*/}
            {/*>*/}
            {/*  Sort*/}
            {/*</Button>*/}
            <Select
              icon={<SortSvg />}
              placeholder={'Sort by'}
              onChange={handleSortBy}
              data={sortByOptions}
              styles={{
                root: {
                  marginTop: '0.45rem',
                  maxWidth: '11ch',
                },
                input: {
                  fontSize: '0.7rem',
                  borderRadius: '44px',
                  height: '1.5rem',
                  minHeight: 'unset',
                  paddingRight: '1rem',
                },
                withIcon: {
                  paddingLeft: '1.3rem',
                },
                item: {
                  fontSize: '0.7rem',
                },
                icon: {
                  marginInlineStart: '0.5rem',
                  justifyContent: 'start',
                },
              }}
            />
          </Flex>
        </Flex>
      </div>
      <Divider />
      <ScrollArea sx={{ height: 'calc(100vh - 168px)' }}>
        <Stack spacing={0}>
          {isLoading && (
            <Center style={{ padding: 10 }}>
              <Loader color="blue" size="md"></Loader>
            </Center>
          )}
          <TransitionGroup component="div">
            {data?.map(item => {
              return (
                <CSSTransition key={item.id} timeout={700} classNames={{ exitActive: styles.item }}>
                  <>
                    <UnstyledButton sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={selectUser(item.id)}>
                      <Box
                        sx={{
                          padding: 10,
                          transition: 'background-color 0.2s ease',
                          backgroundColor: id === item.id ? 'rgba(63, 119, 255, 0.1)' : '#fff',
                          '&:hover': {
                            backgroundColor: 'rgba(63, 119, 255, 0.1)',
                          },
                        }}
                      >
                        <SubjectListItem itemData={item} operator={item.assigned_to} />
                      </Box>
                    </UnstyledButton>
                    <Divider></Divider>
                  </>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </Stack>
      </ScrollArea>
      {!isLoading && (
        <Pagination
          style={{ paddingTop: 8 }}
          color="blue"
          position="center"
          total={pagesCount}
          page={currentPage}
          onChange={onPaginate}
        />
      )}
    </div>
  );
};
