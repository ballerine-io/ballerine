import { useTranslate } from '@pankod/refine-core';
import { Edit, Select, TextInput, useForm, useSelect, Text } from '@pankod/refine-mantine';
import { RichTextEditor } from '@mantine/rte';

export const KYBEdit: React.FC = () => {
  const t = useTranslate();

  const {
    saveButtonProps,
    getInputProps,
    errors,
    refineCore: { queryResult },
  } = useForm({
    initialValues: {
      title: '',
      status: '',
      category: {
        id: '',
      },
      content: '',
    },
    validate: {
      title: value => (value.length < 2 ? 'Too short title' : null),
      status: value => (value.length <= 0 ? 'Status is required' : null),
      category: {
        id: value => (value.length <= 0 ? 'Category is required' : null),
      },
      content: value => (value.length < 10 ? 'Too short content' : null),
    },
  });

  const { selectProps } = useSelect({
    resource: 'categories',
    defaultValue: queryResult?.data?.data.category.id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label={t('posts.fields.title')}
          placeholder={t('posts.fields.title')}
          {...getInputProps('title')}
        />
        <Select
          mt={8}
          label={t('posts.fields.status.title')}
          placeholder="Pick one"
          {...getInputProps('status')}
          data={[
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
            { label: 'Rejected', value: 'rejected' },
          ]}
        />
        <Select
          mt={8}
          label={t('posts.fields.category.title')}
          placeholder="Pick one"
          {...getInputProps('category.id')}
          {...selectProps}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          {t('posts.fields.content')}
        </Text>
        <RichTextEditor {...getInputProps('content')} />
        {errors.content && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.content}
          </Text>
        )}
      </form>
    </Edit>
  );
};
