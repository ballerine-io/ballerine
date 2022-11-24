import { useShow, useOne, useTranslate } from '@pankod/refine-core';
import { Show, Title, Text, MarkdownField } from '@pankod/refine-mantine';

import { ICategory, IPost } from 'interfaces';

export const KYBShow: React.FC = () => {
  const t = useTranslate();

  const { queryResult } = useShow<IPost>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: categoryData } = useOne<ICategory>({
    resource: 'categories',
    id: record?.category.id || '',
    queryOptions: {
      enabled: !!record?.category.id,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Title order={5}>{t('posts.fields.id')}</Title>
      <Text mt="xs">{record?.id}</Text>

      <Title mt="xs" order={5}>
        {t('posts.fields.title')}
      </Title>
      <Text mt="xs">{record?.title}</Text>

      <Title mt="xs" order={5}>
        {t('posts.fields.status.title')}
      </Title>
      <Text mt="xs">{record?.status}</Text>

      <Title mt="xs" order={5}>
        {t('posts.fields.category.title')}
      </Title>
      <Text mt="xs">{categoryData?.data?.title}</Text>

      <Title mt="xs" order={5}>
        {t('posts.fields.content')}
      </Title>
      <MarkdownField value={record?.content} />
    </Show>
  );
};
