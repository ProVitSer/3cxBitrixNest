import { PlainObject } from "../ami.service";

export interface AriConfigs {
  url: string;
  user: string;
  password: string;
}

export enum AsteriskContextEventType {
  EndOutgoingCall = "outbound-hangup-handler",
  EndIncomigCall = "incoming-hangup-handler",
  EndCrmCall = "outbound-call-hangup-handler",
  StartIncomingCall = "operator-in",
}

export enum EventEmitterType {
  OutgoingCall = "OutgoingCall",
  IncomingCall = "IncomingCall",
  CrmCall = "CrmCall",
  InitIncomingCall = "InitIncomingCall",
}

export const eventTypeMap: {[status in AsteriskContextEventType]: EventEmitterType} = {
  [AsteriskContextEventType.EndOutgoingCall]: EventEmitterType.OutgoingCall,
  [AsteriskContextEventType.EndIncomigCall]: EventEmitterType.IncomingCall,
  [AsteriskContextEventType.EndCrmCall]: EventEmitterType.CrmCall,
  [AsteriskContextEventType.StartIncomingCall]:EventEmitterType.InitIncomingCall,
};

export enum DispositionStatus {
  "NO ANSWER" = "480",
  "ANSWERED" = "200",
  "BUSY" = "486",
}

export interface Event {
  EOL: string;
  variables: PlainObject;
  event: string;
  privilege: string;
  channel: string;
  channelstate: string;
  channelstatedesc: string;
  calleridnum: string;
  calleridname: string;
  connectedlinenum: string;
  connectedlinename: string;
  language: string;
  accountcode: string;
  context: string;
  exten: string;
  priority: string;
  uniqueid: string;
  linkedid: string;
  extension: string;
  application: string;
  appdata: StartIncomingCall | EndOutgoingCall | EndIncomigCall | EndCrmCall
}

export interface StartIncomingCall extends Event {
    unicueid: string;
    incomingNumber: string;
    callId: string;
}

export interface EndOutgoingCall extends Event {
    exten: string;
    unicueid: string;
    extensionNumber: string;
    billsec: string;
    disposition: DispositionStatus;
    recordingstring: string;
    startstring: string;
    endstring: string;
}

export interface EndIncomigCall extends Event {
    trunkNumber: string;
    unicueid: string;
    incomingNumber: string;
    billsec: string;
    disposition: DispositionStatus;
    recording: string;
    start: string;
    end: string;
}

export interface EndCrmCall extends Event {
    exten: string;
    unicueid: string;
    extensionNumber: string;
    bitrixCallId: string;
    billsec: string;
    disposition: DispositionStatus;
    recording: string;
    start: string;
    end: string;
}
