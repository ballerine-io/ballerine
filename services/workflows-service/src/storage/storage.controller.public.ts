import * as common from '@nestjs/common';
import { Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { unlink } from 'fs/promises';

import { Public } from '@/common/decorators/public.decorator';
import { StorageService } from './storage.service';
import { getFileLinkSigningSecret, verifyFileLinkSignature } from './public-file-link';

@Public()
@common.Controller('public/files')
export class StorageControllerPublic {
  constructor(protected readonly service: StorageService) {}

  /**
   * Public, signed link to stream a stored file.
   *
   * This is used for service-to-service document verification where Unified API needs
   * to fetch the user's uploaded document image over HTTPS, but we do not want to expose
   * the underlying object storage directly.
   */
  @common.Get('/:id/content')
  async fetchPublicFileContent(
    @Param('id') id: string,
    @Query('projectId') projectId: string,
    @Query('expires') expiresRaw: string,
    @Query('sig') sig: string,
    @Res() res: Response,
  ) {
    if (!projectId || !expiresRaw || !sig) {
      throw new common.ForbiddenException('Missing signature parameters');
    }

    const expires = Number(expiresRaw);

    if (!Number.isFinite(expires)) {
      throw new common.ForbiddenException('Invalid expires parameter');
    }

    const secret = getFileLinkSigningSecret();

    if (!secret) {
      throw new common.InternalServerErrorException(
        'Server is missing FILE_LINK_SIGNING_SECRET/HASHING_KEY_SECRET/SESSION_SECRET',
      );
    }

    const isValid = verifyFileLinkSignature({
      fileId: id,
      projectId,
      expires,
      sig,
      secret,
    });

    if (!isValid) {
      throw new common.ForbiddenException('Invalid or expired signature');
    }

    const { mimeType, filePath } = await this.service.fetchFileContent({
      id,
      projectIds: [projectId],
    });

    res.set('Content-Type', mimeType || 'application/octet-stream');
    // Avoid caching identity docs on intermediaries.
    res.set('Cache-Control', 'private, max-age=0, no-store');

    // Best-effort cleanup of tmp downloads (e.g., from GCS) after the response completes.
    res.on('finish', () => {
      if (filePath) {
        void unlink(filePath).catch(() => undefined);
      }
    });

    return res.sendFile(filePath!);
  }
}
