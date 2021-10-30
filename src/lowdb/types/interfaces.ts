export interface Departments {
  trunkNumber: string;
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
