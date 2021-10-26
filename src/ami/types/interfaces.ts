export interface AriConfigs {
    url: string;
    user: string;
    password: string;
}


export enum AsteriskContextEventType {
    EndOutgoingCall = 'handlerOutgoingCall',
    EndIncomigCall = 'handlerIncomingCall',
    EndCrmCall = 'handlerCrmCall',
    StartIncomingCall = 'incomingCall',
}

export enum EventEmitterType {
    OutgoingCall = 'OutgoingCall',
    IncomingCall = 'IncomingCall',
    CrmCall = 'CrmCall',
    InitIncomingCall = 'InitIncomingCall',
}

export const eventTypeMap: { [status in AsteriskContextEventType]: EventEmitterType } = {
    [AsteriskContextEventType.EndOutgoingCall]: EventEmitterType.OutgoingCall,
    [AsteriskContextEventType.EndIncomigCall]: EventEmitterType.IncomingCall,
    [AsteriskContextEventType.EndCrmCall]: EventEmitterType.CrmCall,
    [AsteriskContextEventType.StartIncomingCall]: EventEmitterType.InitIncomingCall,

  }