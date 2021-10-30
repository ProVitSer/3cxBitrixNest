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

export interface BitirxUserGet{
    ID: string;
    ACTIVE: boolean,
    EMAIL: string;
    NAME: string;
    LAST_NAME: string;
    SECOND_NAME: string;
    PERSONAL_GENDER: string;
    PERSONAL_PROFESSION:string;
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
  CrmGet = "crm.activity.get",
  CrmDelete = "crm.activity.delete",
  CrmUpdate = "crm.activity.update",
  CrmAdd = "crm.activity.add",
}

export enum ActiveUser{
  active = "true",
  inactive = "false"
}