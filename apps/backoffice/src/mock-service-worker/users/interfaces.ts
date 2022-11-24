import { EState } from './enums';

export interface IUser {
  id: string;
  client_id: string;
  correlation_id: string;
  created_by: string | null;
  updated_by: string | null;
  json_data: Record<PropertyKey, any>;
  created_at: string;
  updated_at: string;
  additional_info: Record<PropertyKey, any>;
  first_name: string;
  middle_name: string;
  last_name: string;
  enduser_type: string;
  state_reason: string | null;
  email: string;
  phone: string;
  state: EState;
  latest_verification_id: string | null;
  date_of_birth: string;
  place_of_birth: string;
  assigned_to: string;
  sex: 'male' | 'female' | 'other';
  // For mocking purposes only
  passport: {
    type: string;
    authority: string;
    place_of_issue: string;
    date_of_issue: string;
    expires: string;
  };
  check_results: {
    final_result: EState;
    scanned_by: string;
    aml_check: EState;
    id_check: EState;
    selfie_check: EState;
  };
  // Array of images
  documents: Array<{
    url: string;
    // i.e 'passport', 'facefront'
    doctype: string;
  }>;
}
