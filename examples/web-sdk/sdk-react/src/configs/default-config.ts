import {FlowsInitOptions} from "@ballerine/web-sdk/dist/types/BallerineSDK";

export const defaultConfig: FlowsInitOptions = {
  endUserInfo: { id: 'test-id' },
  uiConfig: {
    general: {
      colors: {
        primary: "#000",
      }
    },
    flows: {
      'my-kyc-flow': {
        steps: [
          {
            name: "welcome",
            id: "welcome",
          },
          {
            name: "document-selection",
            id: "document-selection",
            documentOptions: [
              {type: "drivers_license", kind: "drivers_license"},
              {type: "passport", kind: "passport"},
              {type: "id_card", kind: "id_card"},
              {type: "voter_id", kind: "voter_id"},
            ],
          },
          { name: "document-photo",
            id: "document-photo",
          },
          {
            name: "check-document",
            id: "check-document",
          },
          {
            name: "document-photo-back-start",
            id: "document-photo-back-start",
          },
          {
            name: "document-photo-back",
            id: "document-photo-back",
          },
          {
            name: "check-document-photo-back",
            id: "check-document-photo-back",
          },
          {
            name: "selfie-start",
            id: "selfie-start",
          },
          {
            name: "selfie",
            id: "selfie",
          },
          {
            name: "check-selfie",
            id: "check-selfie",
          },
          {
            name: "loading",
            id: "loading",
          },
          {
            name: "final",
            id: "final",
          },
        ],
      }
    },
  },
}
