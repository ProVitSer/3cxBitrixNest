import { DispositionStatus } from "@app/ami/types/interfaces";

export interface OnExternalCallStart {
  USER_ID: number;
  PHONE_NUMBER: string;
  CRM_ENTITY_TYPE: string;
  CRM_ENTITY_ID: number;
  CALL_LIST_ID: number;
  LINE_NUMBER: string;
  CALL_ID: string;
  IS_MOBILE: number;
}

export interface BitirxUserGet {
  ID: string;
  ACTIVE: boolean;
  EMAIL: string;
  NAME: string;
  LAST_NAME: string;
  SECOND_NAME: string;
  PERSONAL_GENDER: string;
  PERSONAL_PROFESSION: string;
  PERSONAL_WWW: string;
  PERSONAL_BIRTHDAY: string;
  PERSONAL_PHOTO: string | null;
  PERSONAL_ICQ: string;
  PERSONAL_PHONE: string;
  PERSONAL_FAX: string;
  PERSONAL_MOBILE: string;
  PERSONAL_PAGER: string;
  PERSONAL_STREET: string;
  PERSONAL_CITY: string;
  PERSONAL_STATE: string;
  PERSONAL_ZIP: string;
  PERSONAL_COUNTRY: string;
  WORK_COMPANY: string;
  WORK_POSITION: string;
  WORK_PHONE: string;
  UF_DEPARTMENT: Array<number>;
  UF_INTERESTS: string | null;
  UF_SKILLS: string | null;
  UF_WEB_SITES: string | null;
  UF_XING: string | null;
  UF_LINKEDIN: string | null;
  UF_FACEBOOK: string | null;
  UF_TWITTER: string | null;
  UF_SKYPE: string | null;
  UF_DISTRICT: string | null;
  UF_PHONE_INNER: string;
  USER_TYPE: string;
}

export interface BitrixRegisterCallRequest {
  USER_PHONE_INNER?: string;
  USER_ID: number | string;
  PHONE_NUMBER: string;
  CALL_START_DATE?: string;
  CRM_CREATE?: number;
  CRM_SOURCE?: string;
  CRM_ENTITY_TYPE?: number;
  SHOW?: Show;
  CALL_LIST_ID?: number;
  LINE_NUMBER?: string;
  TYPE: BitrixCallType;
}

export interface BitrixRegisterCallResponse {
  CALL_ID: string;
  CRM_CREATED_LEAD: number;
  CRM_ENTITY_ID: number;
  CRM_ENTITY_TYPE: string;
  CRM_CREATED_ENTITIES: Array<string>;
  LEAD_CREATION_ERROR: string;
}

export interface ExternalCallShow {
  CALL_ID: string;
  USER_ID: number | Array<string>;
}

export interface ExternalCallHide {
  CALL_ID: string;
  USER_ID: number | Array<string>;
}

export interface BitrixExternalCallFinishRequest {
  CALL_ID: string;
  USER_ID: number;
  DURATION: number;
  COST_CURRENCY?: string;
  STATUS_CODE?: DispositionStatus;
  FAILED_REASON?: string;
  RECORD_URL?: string;
  VOTE?: number;
  TYPE?: BitrixCallType;
  ADD_TO_CHAT?: number;
}


export interface GetActivity{
  ID: string;
  fields?:{}
}


export enum BitrixMetod {
  ExternalCallRegister = "telephony.externalcall.register.json",
  ExternalCallFinish = "telephony.externalcall.finish",
  ExternalCallSearch = "telephony.externalCall.searchCrmEntities",
  ExternalCallShow = "telephony.externalcall.show",
  ExternalCallHide = "telephony.externalcall.hide",
  TaskAdd = "tasks.task.add",
  TaskGet = "tasks.task.get",
  TaskUpdate = "tasks.task.update",
  UserGet = "user.get",
  CrmActivityGet = "crm.activity.get",
  CrmActivityDelete = "crm.activity.delete",
  CrmActivitUypdate = "crm.activity.update",
  CrmActivityAdd = "crm.activity.add",
}

export enum ActiveUser {
  active = "true",
  inactive = "false",
}

export enum BitrixCallType {
  incoming = 2,
  outgoing = 1,
  incomingRedirect = 3,
  callback = 4,
}

export enum CreateTaskType {
  YES = "true",
  NO = "false",
}

export enum CreateIncomingLead {
  YES = 0,
  NO = 1,
}

export enum CreateOutgoingLead {
  YES = 0,
  NO = 1,
}

export enum Show {
  YES = 0,
  NO = 1,
}
