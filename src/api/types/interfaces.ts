
export interface OnExternalCallStart{
    USER_ID: number,
    PHONE_NUMBER: string;
    CRM_ENTITY_TYPE: string;
    CRM_ENTITY_ID: number;
    CALL_LIST_ID: number;
    LINE_NUMBER: string;
    CALL_ID: string;
    IS_MOBILE: number;
}