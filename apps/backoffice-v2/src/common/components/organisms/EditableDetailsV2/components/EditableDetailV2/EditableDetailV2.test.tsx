import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { EditableDetailV2 } from './EditableDetailV2';
import { Form } from '@/common/components/organisms/Form/Form';
import { useForm } from 'react-hook-form';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import dayjs from 'dayjs';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';

afterEach(() => {
  cleanup();
});

describe.skip('EditableDetailV2', () => {
  describe('datetime', () => {
    describe('when isEditable is false', () => {
      it('renders ISO dates', () => {
        // Arrange
        const fieldName = 'isoDate';
        const fieldValue = '1864-01-12T12:34:56Z';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={false}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        datetime: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByRole('textbox');

        // Assert
        expect(element).toHaveAttribute('aria-readonly', 'true');
        expect(element).toHaveTextContent(dayjs(fieldValue).local().format('DD/MM/YYYY HH:mm'));
      });

      it('renders a format of YYYY-MM-DD HH:mm:ss', () => {
        // Arrange
        const fieldName = 'customFormat';
        const fieldValue = '1864-01-12 12:34:56';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={false}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        datetime: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByRole('textbox');

        // Assert
        expect(element).toHaveAttribute('aria-readonly', 'true');
        expect(element).toHaveTextContent(dayjs(fieldValue).local().format('DD/MM/YYYY HH:mm'));
      });
    });

    describe('when isEditable is true', () => {
      it('renders ISO dates', () => {
        // Arrange
        const fieldName = 'isoDate';
        const fieldValue = '1864-01-12T12:34:56Z';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={true}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        datetime: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByLabelText(fieldName);

        // Assert
        expect(element).toHaveAttribute('type', 'datetime-local');
        expect(element).toHaveValue(dayjs(fieldValue).local().format('YYYY-MM-DDTHH:mm:ss.000'));
      });

      it('renders a format of YYYY-MM-DD HH:mm:ss', () => {
        // Arrange
        const fieldName = 'customFormat';
        const fieldValue = '1864-01-12 12:34:56';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={true}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        datetime: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByLabelText(fieldName);

        // Assert
        expect(element).toHaveAttribute('type', 'datetime-local');
        expect(element).toHaveValue(dayjs(fieldValue).local().format('YYYY-MM-DDTHH:mm:ss.000'));
      });
    });
  });

  describe('date', () => {
    describe('when isEditable is false', () => {
      it('renders YYYY-DD-MM dates', () => {
        // Arrange
        const fieldName = 'date';
        const fieldValue = '1864-01-12';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={false}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        date: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByRole('textbox');

        // Assert
        expect(element).toHaveAttribute('aria-readonly', 'true');
        expect(element).toHaveTextContent(dayjs(fieldValue).local().format('DD/MM/YYYY'));
      });
    });

    describe('when isEditable is true', () => {
      it('renders YYYY-DD-MM dates', () => {
        // Arrange
        const fieldName = 'date';
        const fieldValue = '1864-01-12';
        const WithSetup = () => {
          const form = useForm({
            defaultValues: {
              [fieldName]: fieldValue,
            },
          });

          return (
            <Form {...form}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <EditableDetailV2
                      name={field.name}
                      type={undefined}
                      format={undefined}
                      isEditable={true}
                      value={fieldValue}
                      formValue={field.value}
                      onInputChange={form.setValue}
                      onOptionChange={field.onChange}
                      parse={{
                        date: true,
                      }}
                    />
                  </FormItem>
                )}
                name={fieldName}
              />
            </Form>
          );
        };

        render(<WithSetup />);

        // Act
        const element = screen.getByLabelText(fieldName);

        // Assert
        expect(element).toHaveAttribute('type', 'date');
        expect(element).toHaveValue(dayjs(fieldValue).local().format('YYYY-MM-DD'));
      });
    });
  });
});
