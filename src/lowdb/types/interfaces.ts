export interface Departments {
  trunkNumber: string;
  timeZone: string;
  departmentId: string;
  id: string;
  callProcessing: CallProcessing;
  showUsers: Array<string>;
}
export interface Users {
  exten: string;
  id: string;
}

export enum CallProcessing {
  queue = "queue",
  group = "group",
}

export interface PlainObject {
  [key: string]: any;
}

export type BitrixTrunksInfo = {
  trunkNumber: string;
  departmentId: string;
  id: string;
  callPrecessing: string;
  showUsers: Array<string>;
};

export type BitrixUsersInfo = {
  exten: string;
  id: string;
};

export type Data = {
  departments: BitrixTrunksInfo[];
  users: BitrixUsersInfo[];
};