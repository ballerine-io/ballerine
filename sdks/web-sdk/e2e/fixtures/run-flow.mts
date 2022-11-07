import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class RunFlow {
  readonly baseUrl = "http://localhost:3000/";
  regex: RegExp;

  constructor(readonly page: Page, readonly flow: "idCard" | "driversLicense" | "passport" | "voterId", readonly isKyb = false) {
    this.regex = (() => {
      switch (this.flow) {
        case "idCard":
          return /^id\scard$/i;
        case "driversLicense":
          return /^drivers\slicense$/i;
        case "passport":
          return /^passport$/i;
        case "voterId":
          return /^voter\sid$/i;
        default:
          throw new Error(`Unknown flow: ${JSON.stringify(this.flow, null, 2)}`);
      }
    })();
  }

  get takePicture() {
    return this.page.locator("button[aria-label=\"take picture\"]").first();
  }

  get confirmPicture() {
    return this.page.getByRole("button", { name: /looks\sgood/i }).first();
  }

  async kyb() {
    const title = this.page.getByRole("heading", {
      name: /business\sregistration/i
    });

    await expect(title).toBeVisible();

    // Step 1
    let openCamera = this.page.getByRole("button", { name: /take\sa\spicture/i });

    await openCamera.click();

    await this.takePicture.click();

    // Step 2
    openCamera = this.page.getByRole("button", { name: /take\sa\spicture/i });

    await openCamera.click();

    await this.takePicture.click();

    // Step 3
    openCamera = this.page.getByRole("button", { name: /take\sa\spicture/i });

    await openCamera.click();

    await this.takePicture.click();
  }

  async start() {
    // The page should load
    await this.page.goto(`${this.baseUrl}${this.isKyb ? "kyb" : ""}`);

    // The page should not be empty
    const button = this.page.getByRole("button", { name: /choose\sdocument\stype/i });

    // The page should be interactive
    await button.click();

    if (this.isKyb) {
      await this.kyb();
    }

    const title = this.page.getByRole("heading", {
      name: /upload\sid/i
    });

    await expect(title).toBeVisible();

    // Step 1
    const documentOption = this.page.getByText(this.regex);

    await documentOption.click();

    await this.takePicture.click();

    if (!this.isKyb) {
      await this.confirmPicture.click();
    }

    // Step 2
    if (this.flow !== "passport") {
      const idBackSide = this.page.getByRole("button", {
        name: /take\sphoto/i
      });

      await idBackSide.click();

      await this.takePicture.click();
    }

    if (this.flow === "passport" || !this.isKyb) {

      if (this.flow !== "passport") {
        await this.confirmPicture.click();
      }

      // Step 3
      const selfie = this.page.getByRole("button", { name: /take\sa\sselfie/i });

      await selfie.click();

      await this.takePicture.click();

      await this.confirmPicture.click();
    }

    // Final step - wait for result
    const success = this.page.getByRole("heading", { name: /success/i });

    await expect(success).toBeVisible();
  }
}
