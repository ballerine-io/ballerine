import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class RunFlow {
  readonly baseUrl = '/';
  regex: RegExp;

  constructor(
    readonly page: Page,
    readonly flow: 'idCard' | 'driversLicense' | 'passport' | 'voterId',
    readonly isKyb = false,
  ) {
    this.regex = (() => {
      switch (this.flow) {
        case 'idCard':
          return /^id\scard$/i;
        case 'driversLicense':
          return /^drivers\slicense$/i;
        case 'passport':
          return /^passport$/i;
        case 'voterId':
          return /^voter\sid$/i;
        default:
          throw new Error(`Unknown flow: ${JSON.stringify(this.flow, null, 2)}`);
      }
    })();
  }

  // Could receive the skip conditions as arguments in the future
  get skipSelfie() {
    return [this.isKyb].some(Boolean);
  }

  get skipDocumentBackSide() {
    return [!this.isKyb && this.flow === 'passport'].some(Boolean);
  }

  get skipConfirmPicture() {
    return [this.isKyb].some(Boolean);
  }

  get takePicture() {
    return this.page.locator('button[aria-label="take picture"]').first();
  }

  get confirmPicture() {
    if (this.skipConfirmPicture) return;

    return this.page.getByRole('button', { name: /looks\sgood/i }).first();
  }

  async kyb() {
    if (!this.isKyb) return;

    const title = this.page
      .getByRole('heading', {
        name: /business\sregistration/i,
      })
      .first();

    await expect(title).toBeVisible();

    // Step 1
    let openCamera = this.page.getByRole('button', { name: /take\sa\spicture/i }).first();

    await openCamera.click();

    await this.takePicture.click();

    // Step 2
    openCamera = this.page.getByRole('button', { name: /take\sa\spicture/i }).first();

    await openCamera.click();

    await this.takePicture.click();

    // Step 3
    openCamera = this.page.getByRole('button', { name: /take\sa\spicture/i }).first();

    await openCamera.click();

    await this.takePicture.click();
  }

  async takeSelfie() {
    if (this.skipSelfie) return;

    const selfie = this.page.getByRole('button', { name: /take\sa\sselfie/i }).first();

    await selfie.click();

    await this.takePicture.click();
    await this.confirmPicture?.click();
  }

  async takeDocumentBackSide() {
    if (this.skipDocumentBackSide) return;

    const idBackSide = this.page
      .getByRole('button', {
        name: /take\sphoto/i,
      })
      .first();

    await idBackSide.click();

    await this.takePicture.click();
    await this.confirmPicture?.click();
  }

  async start() {
    // The page should not be empty
    const button = this.page.getByRole('button', { name: /choose\sdocument\stype/i }).first();

    // The page should be interactive
    await button.click();

    // Run KYB specific steps if this.isKyb is true
    await this.kyb();

    const title = this.page
      .getByRole('heading', {
        name: /upload\sid/i,
      })
      .first();

    await expect(title).toBeVisible();

    // Step 1

    // Pick the document type
    const documentOption = this.page.getByText(this.regex).first();
    await documentOption.click();

    // Take a picture, and press looks good if not a KYB flow
    await this.takePicture?.click();
    await this.confirmPicture?.click();

    await this.takeDocumentBackSide();

    // Step 3

    // Take a selfie if not a KYB flow
    await this.takeSelfie();

    // Final step - wait for result
    const success = this.page.getByRole('heading', { name: /success/i }).first();

    await expect(success).toBeVisible();
  }
}
