/*
 * This file contains the contract of the API we share between the Visualizer and the Studio
 * The file should exist in both projects and be identical.
 */

export interface LoggedInUser {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface SourceFile {
  id: string;
  updatedAt: Date;
  text: string;
  youHaveLiked: boolean;
  likesCount: number;
  project: {
    id: string;
    name: string;
    owner: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
  };
}
