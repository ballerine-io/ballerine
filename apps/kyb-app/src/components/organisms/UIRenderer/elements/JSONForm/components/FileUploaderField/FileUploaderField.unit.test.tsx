import { FileUploaderField } from '@/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/FileUploaderField';
import { FileRepository } from '@/utils/file-repository';
import { fireEvent, render, waitFor } from '@testing-library/react';

//@ts-ignore
window.DataTransfer = function () {};

//@ts-ignore
jest.spyOn(window, 'DataTransfer', 'get').mockImplementation(function () {
  return function () {
    // Mocking FileList
    const files = {
      length: 0,
      item: function (index: number) {
        //@ts-ignore
        return (this as Record<number, File>)[index];
      },
    };

    return {
      files,
      items: {
        add: function (file: File) {
          //@ts-ignore
          files[files.length] = file;
          files.length = files.length + 1;
        },
      },
    };
  };
});

describe('FileUploaderField', () => {
  test('render', () => {
    const { getByTestId } = render(
      <FileUploaderField
        uploadFile={() => Promise.resolve({ fileId: '123' })}
        onChange={() => {}}
        fileRepository={new FileRepository()}
      />,
    );
    getByTestId('file-uploader-field');
  });

  test('placeholder', () => {
    const testPlaceholder = 'Placeholder';

    const { getByTestId } = render(
      <FileUploaderField
        uploadFile={() => Promise.resolve({ fileId: '123' })}
        acceptFileFormats="image/png"
        placeholder={testPlaceholder}
        onChange={() => {}}
        fileRepository={new FileRepository()}
      />,
    );

    expect(getByTestId('file-uploader-field').getAttribute('placeholder')).toBe(testPlaceholder);
  });

  test('accept file formats', () => {
    const testFileFormats = 'image/jpeg, image/test, image/whatever';

    const { getByTestId } = render(
      <FileUploaderField
        uploadFile={() => Promise.resolve({ fileId: '123' })}
        acceptFileFormats={testFileFormats}
        onChange={() => {}}
        fileRepository={new FileRepository()}
      />,
    );

    expect(getByTestId('file-uploader-field').getAttribute('accept')).toBe(testFileFormats);
  });

  describe('will be disabled when', () => {
    it('isLoading', () => {
      const { getByTestId } = render(
        <FileUploaderField
          uploadFile={() => Promise.resolve({ fileId: '123' })}
          onChange={() => {}}
          fileRepository={new FileRepository()}
          isLoading={true}
        />,
      );

      expect((getByTestId('file-uploader-field') as HTMLInputElement).disabled).toBe(true);
    });

    it('disabled', () => {
      const { getByTestId } = render(
        <FileUploaderField
          uploadFile={() => Promise.resolve({ fileId: '123' })}
          onChange={() => {}}
          fileRepository={new FileRepository()}
          disabled={true}
        />,
      );

      expect((getByTestId('file-uploader-field') as HTMLInputElement).disabled).toBe(true);
    });

    it('uploading a file', async () => {
      const { getByTestId } = render(
        <FileUploaderField
          uploadFile={() => Promise.resolve({ fileId: '123' })}
          onChange={() => {}}
          fileRepository={new FileRepository()}
        />,
      );

      const input = getByTestId('file-uploader-field');

      fireEvent.change(input, {
        target: {
          files: [new File([], 'test')],
        },
      });

      await waitFor(() => {
        expect((getByTestId('file-uploader-field') as HTMLInputElement).disabled).toBe(true);
      });
    });
  });

  it('will fire onChange when user selects a file', async () => {
    const onChangeCallback = jest.fn();

    const { getByTestId } = render(
      <FileUploaderField
        uploadFile={() => Promise.resolve({ fileId: '123' })}
        onChange={onChangeCallback}
        fileRepository={new FileRepository()}
      />,
    );

    const input = getByTestId('file-uploader-field');

    fireEvent.change(input, {
      target: {
        files: [new File([], 'test')],
      },
    });

    await waitFor(() => {
      expect(onChangeCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('will fire onBlur when user change focus', async () => {
    const onChangeCallback = jest.fn();
    const onBlurCallaback = jest.fn();

    const { getByTestId } = render(
      <FileUploaderField
        uploadFile={() => Promise.resolve({ fileId: '123' })}
        onBlur={onBlurCallaback}
        onChange={onChangeCallback}
        fileRepository={new FileRepository()}
      />,
    );

    const input = getByTestId('file-uploader-field');

    fireEvent.focus(input);
    fireEvent.blur(input);

    await waitFor(() => {
      expect(onBlurCallaback).toHaveBeenCalledTimes(1);
    });
  });
});
