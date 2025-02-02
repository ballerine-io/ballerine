// import { ConfigService } from '@nestjs/config';
// import { mock } from 'jest-mock-extended';
// import { FileService } from './file.service';
// import { IStreamableFileProvider, TRemoteFileConfig } from '@/providers/file/types';
// import { JwtStrategy } from '@/auth/jwt/jwt.strategy';
// import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
// import { TEST_USER } from '@/auth/tests/constants';
// import { Readable } from 'stream';
// import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
// import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
// import { WorkflowService } from '@/workflow/workflow.service';
//
// describe('#FileService logic', () => {
//   const fileService = mock<FileService>({});
//   const fullyStreamSupportedService = mock<AwsS3FileService>({});
//   const downloadSupportedService = mock<HttpFileService>({});
//   const notSupportedService = mock<LocalFileService>({});
//
//   const remoteConfig = mock<TRemoteFileConfig>({});
//   const fileStream = mock<Readable>({});
//   beforeAll(() => {
//
//
//   describe("#copyFileFromSourceToSource", () => {
//
//     describe("When both file providers are support stream", () => {
//       it('requests upload file via stream', () => {
//         expect(fileService.copyThruStream).toBeCalledWith(fileService, fullyStreamSupportedService)
//
//         const mockStreamableProvider = {fullyStreamSupportedService};
//         const mockConfig = { /* Mock implementation of TRemoteFileConfig */ };
//         jest.spyOn(fileService, 'isBothServicesSupportStream').mockReturnValue(true);
//         const mockCopyThruStream = jest.spyOn(fileService, 'copyThruStream').mockResolvedValue(undefined);
//
//       });
//   })
//
//     describe("when only one supports full stream", () => {
//
//       describe("when sourceServiceProvider supports download and targetServiceProvider supports full ", () => {
//         it('requests upload file via stream', () => {
//           expect(fileService.copyThruStream).toBeCalledWith(fileService, fullyStreamSupportedService)
//           // fileService.copyThruStream.wasCalled
//           // expect(fileService.copyThruStream).toBeCalled()
//           // fileService.copyFileFromSourceToSource(fullyStreamSupportedService, fullyStreamSupportedService)
//         });
//       })
//       describe("when sourceServiceProvider supports full targetServiceProvider only download", () => {
//         it('requests upload file via stream', () => {
//           expect(fileService.copyThruStream).toBeCalledWith(fileService, fullyStreamSupportedService)
//           // fileService.copyThruStream.wasCalled
//           // expect(fileService.copyThruStream).toBeCalled()
//           // fileService.copyFileFromSourceToSource(fullyStreamSupportedService, fullyStreamSupportedService)
//         });
//       })
//     })
//
// });
//
// describe("When file providerse allows stream"() => {
//
//   it('should return value from env', async () => {
//
//   });
// });
//
// describe("When both file providers disallow stream"() => {
//
//   it('should return value from env', async () => {
//
//   });
// })
// })
// });
