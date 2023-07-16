const a = {
  transientData: {
    documents: [
      { type: 'regestration_certificate', pages: {} },
      { type: 'ID', pages: {}, individualId: '6376004c8836399ab7f84f24' },
      { type: 'selfie', pages: {}, individualId: '6376004c8836399ab7f84f24' },
    ],
  },
  dbSnapshot: {
    snapshotTimestmap: '2021-07-05T17:31:19.000Z',
    entity: {
      id: '6376004c8836399ab7f84f24',
      data: {
        lastName: 'BASSANA',
        firstName: 'Placid',
        individuals: [
          { type: 'UBO', id: '' }, // id = uuid
          { type: 'DubiO', id: '' }, // id = uuid
          { type: 'contract person', id: '' },
        ],
        docuemnts: [
          {
            type: 'payslip',
            pages: ['ae68bc01-2c3d-453b-9422-068dea2fee43'],
          },
        ],
      },
      type: 'business',
    },
  },
  runtimeData: {
    // enirchmentdata
    // api plugin results
  },
  entity: {
    id: '6376004c8836399ab7f84f24',
    data: {
      lastName: 'BASSANA',
      firstName: 'Placid',
      individuals: [
        { type: 'UBO', id: '' }, // id = uuid
        { type: 'contract person', id: '' },
      ],
      docuemnts: [...docIds],
    },
    type: 'business',
  },
  entities: [],
  documents: [
    {
      id: 'ae68bc01-2c3d-453b-9422-068dea2fee43',
      type: 'payslip',
      pages: [
        {
          uri: 'https://ghana-prod-document-labeling-job-input.s3.amazonaws.com/labeling-job/6376004c8836399ab7f84f24/POE/1688578279/0.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAYNTFHXL7OJR64FV2%2F20230705%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230705T173119Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJIMEYCIQDSJT%2F1IMNDw7qBVGhB60NwWUandUv1UjHnNeCnyqbwMQIhAKrpqpAJWaglOUmzOyNqoTuzmvjIdbftk9p7WDDhWnLsKrsFCDIQARoMNTc4OTU5MTYyMTEwIgwp3VVOrHgHHSWTOB8qmAW9HnCi55N93FxLTVaxaZuy3wW%2Bue%2FadtE9CFPetuv9ePvZxBcPcmXtqj1Do4EUYIi6CiLhp%2BqYpMO5nau3pR%2BJ42EgWFq0PDGQMy5kyHRvMOlpo1IBvIsOAhNcfFLVhK6lfrQyCMwSBb9Z%2Fayd5SOFN0WLRvA%2FOjjIcLV%2Fm5Rw%2B9TKb77sY9%2FFpwc%2BPP8qbcY59UAxQLsOKsXHzeYvRT6mTg0CDUEOYMOmoL3XJ80CguYSMI2iU4J5FiI1SH7evQ87ZytIinGRZFTjVM9noDK9fE9xGMH%2F5fQh81HlwphhLBrQCht2%2F6qebRGkfvvwzpuj0PjlJ7WE3l1Mv%2Bg%2FZcKOsY%2BDKNC3iQ5W3%2BFoDVCTRTeyt4R4YZtWnTSrJctSEVJWx8vGGA90PNZg7Ato9h8%2BCvHfrHePYZLM771ojO9eIai7hqS9VDxGvGOy91V2tC9SQjoBwKgRZ5zeqzC1z6qxOPZvG1NZaDFqNIaW5ATQ0teUd95HNDT8k9hS8jrnUb1mrVNdCrv%2Bakcf4fdaMngD5f4pPWh1yyjFyn5yITdWxVuX4gUDPRQU%2FT08Q8F7wTg27H2Rz6oupmoMQeysc2Fmp%2FHCccn%2FFhNCpe3MAMcM3LAmPrPhddFTjOmpUCFExtaeVgV6zzJceDTwGZ8%2FSeLf0OpuIRWZnqV5y9VpgPHPwO43bCTFcqrAr9Jiy4nML66JTsvIcfAgTlPSwA1CjsVUThjoAnG74qSv79Pvu%2FfNWD1%2F9z5BvnflROL%2FDsP%2BO28P5z0%2BGTGV5R1OnkOrbzlMdWsmO97%2BMALAcP9IcWghlbjHKislBpdMbRzUo0VJScfJsaXs3NCsjqUDOEwgkAXh7F3KLz%2FZzApIrjC3D%2Fus9SfD7nmnXFC%2BMI%2FLlqUGOrAB7BwnIVwJKviYZIAXj9T8QtmODVvpllOBl2YOhDm9sbFrmJlnEH%2FpH%2BIfoSM%2Bfgyhy2bhIoKndN2K3cBYppSQSferNFyXdl9fXuh0YnDDbXMho8PvtHHnhfxydTKU%2BvmmfT2D%2FIOCPmr10fWVfTtivaIyBS%2BfIcrYE0Rx1Uu9ou8w1ZMu9guX9k728BSeqpgjP8OpeZ30iEsVg65XKnyacTPonc%2B7%2FSZ3I3v7Is6EG68%3D&X-Amz-Signature=87e798c5b1a60b6f5f51df646b8cb1ad7b4c8c6cbdab9596cc325c9c7510e37d',
          type: 'pdf',
          metadata: {},
          provider: 'http',
          ballerineFileId: 'cljpzws35000f7s2cx99mridg',
        },
      ],
      issuer: {
        country: 'GH',
      },
      version: 1,
      category: 'proof_of_employment',
      decision: {
        status: 'approved',
        revisionReason: '',
        rejectionReason: '',
      },
      properties: {
        position: 'Assistant Immigration Control Officer',
        issuingDate: '2023-06-01',
        employeeName: 'Ghana Immigration Service',
      },
    },
  ],
};

// UBO
