import { handleIndividualVerificationDocuments } from './index';
import axios from 'axios';
import fs from 'fs';
import * as tmp from 'tmp';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';

jest.mock('axios');
jest.mock('fs');
jest.mock('tmp');
jest.mock('@/common/get-file-metadata/get-file-metadata');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedTmp = tmp as jest.Mocked<any>;
const mockedGetFileMetadata = getFileMetadata as jest.MockedFunction<typeof getFileMetadata>;

describe('handleIndividualVerificationDocuments #unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedTmp.fileSync.mockReturnValue({ name: '/tmp/test-file' });
    mockedGetFileMetadata.mockResolvedValue({ mimeType: 'image/jpeg', extension: 'jpg' });
  });

  const kycDocument = {
    type: { value: 'ID_CARD' },
    issueNumber: { value: '123' },
    validUntil: { value: '2030-01-01' },
    validFrom: { value: '2020-01-01' },
    firstIssue: { value: '2020-01-01' },
    country: { value: 'SL' },
    city: { value: 'Freetown' },
  };

  const person = {
    idNumber: { value: 'ABC123456' },
  };

  it('should handle base64 image content', async () => {
    const kycDocumentImages = [
      { context: 'document-front', content: 'data:image/jpeg;base64,YmFzZTY0ZGF0YQ==' },
    ];

    const result = await handleIndividualVerificationDocuments({
      kycDocument: kycDocument as any,
      kycDocumentImages,
      person,
    });

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith('/tmp/test-file.jpg', expect.any(Buffer));
    expect(result.documents[0]!.pages[0]!.uri).toBe('file:///tmp/test-file.jpg');
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('should handle image URL content with SSRF protections', async () => {
    const imageUrl = 'https://example.com/image.jpg';
    const kycDocumentImages = [{ context: 'document-front', content: imageUrl }];
    mockedAxios.get.mockResolvedValue({
      data: Buffer.from('remote-data'),
    } as any);

    const result = await handleIndividualVerificationDocuments({
      kycDocument: kycDocument as any,
      kycDocumentImages,
      person,
    });

    // Verify axios called with timeout + size constraints
    expect(mockedAxios.get).toHaveBeenCalledWith(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15_000,
      maxContentLength: 25 * 1024 * 1024,
      maxRedirects: 3,
    });
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      '/tmp/test-file.jpg',
      Buffer.from('remote-data'),
    );
    expect(result.documents[0]!.pages[0]!.uri).toBe('file:///tmp/test-file.jpg');
  });

  it('should throw error if URL fetch fails', async () => {
    const imageUrl = 'https://example.com/fail.jpg';
    const kycDocumentImages = [{ context: 'document-front', content: imageUrl }];
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(
      handleIndividualVerificationDocuments({
        kycDocument: kycDocument as any,
        kycDocumentImages,
        person,
      }),
    ).rejects.toThrow('Network error');
  });

  describe('SSRF protection', () => {
    const testSsrfBlock = async (url: string, expectedError: string) => {
      const kycDocumentImages = [{ context: 'document-front', content: url }];

      await expect(
        handleIndividualVerificationDocuments({
          kycDocument: kycDocument as any,
          kycDocumentImages,
          person,
        }),
      ).rejects.toThrow(expectedError);

      // axios should never be called for blocked URLs
      expect(mockedAxios.get).not.toHaveBeenCalled();
    };

    it('should reject localhost URLs', async () => {
      await testSsrfBlock(
        'http://localhost:8080/admin',
        'URL points to a private or internal address',
      );
    });

    it('should reject 127.x.x.x loopback addresses', async () => {
      await testSsrfBlock(
        'http://127.0.0.1:3000/secret',
        'URL points to a private or internal address',
      );
    });

    it('should reject 10.x.x.x private addresses', async () => {
      await testSsrfBlock(
        'http://10.0.0.5/internal-api',
        'URL points to a private or internal address',
      );
    });

    it('should reject 192.168.x.x private addresses', async () => {
      await testSsrfBlock(
        'http://192.168.1.1/admin',
        'URL points to a private or internal address',
      );
    });

    it('should reject 169.254.x.x link-local (cloud metadata) addresses', async () => {
      await testSsrfBlock(
        'http://169.254.169.254/latest/meta-data',
        'URL points to a private or internal address',
      );
    });

    it('should reject GCP metadata endpoint', async () => {
      await testSsrfBlock(
        'http://metadata.google.internal/computeMetadata/v1/',
        'URL points to a private or internal address',
      );
    });

    it('should not fetch non-http URLs (treated as base64)', async () => {
      // ftp:// doesn't start with 'http', so it goes through the base64 path
      const kycDocumentImages = [
        { context: 'document-front', content: 'ftp://evil.com/malware.bin' },
      ];

      const result = await handleIndividualVerificationDocuments({
        kycDocument: kycDocument as any,
        kycDocumentImages,
        person,
      });

      // Should NOT be fetched via axios
      expect(mockedAxios.get).not.toHaveBeenCalled();
      // Should be processed as base64 (will produce garbage, but no SSRF risk)
      expect(result.documents[0]!.pages[0]!.uri).toContain('file:///tmp/test-file');
    });
  });

  it('should invoke cleanupTempFiles successfully', async () => {
    const kycDocumentImages = [{ context: 'document-front', content: 'YmFzZTY0ZGF0YQ==' }];
    mockedFs.existsSync.mockReturnValue(true);

    const result = await handleIndividualVerificationDocuments({
      kycDocument: kycDocument as any,
      kycDocumentImages,
      person,
    });

    result.cleanupTempFiles();
    expect(mockedFs.existsSync).toHaveBeenCalledWith('/tmp/test-file.jpg');
    expect(mockedFs.unlinkSync).toHaveBeenCalledWith('/tmp/test-file.jpg');
  });
});
