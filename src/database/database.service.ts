import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { CallcentQueuecalls } from "./entities/CallcentQueuecalls";
import { ClCalls } from "./entities/ClCalls";
import { ClParticipants } from "./entities/ClParticipants";
import { ClPartyInfo } from "./entities/ClPartyInfo";
import { ClSegments } from "./entities/ClSegments";
import { CallInfo } from "./types/interfaces";

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(ClParticipants)
    private callParticipants: Repository<ClParticipants>,
    @InjectRepository(ClPartyInfo)
    private callPartyInfo: Repository<ClPartyInfo>,
    @InjectRepository(ClSegments)
    private callSegments: Repository<ClSegments>,
    @InjectRepository(ClCalls)
    private calls: Repository<ClCalls>,
    @InjectRepository(CallcentQueuecalls)
    private queue: Repository<CallcentQueuecalls>
  ) {}

  async getCallInfo(incomingNumber: string): Promise<CallInfo> {
    const { id } = await this.callPartyInfo
      .createQueryBuilder("cl_party_info")
      .select("cl_party_info.id")
      .where("cl_party_info.caller_number like :number", {
        number: incomingNumber,
      })
      .orderBy("cl_party_info.id", "DESC")
      .getOne();

    const { callId } = await this.callParticipants
      .createQueryBuilder("cl_participants")
      .select("cl_participants.callId")
      .where("cl_participants.info_id = :id", { id: id })
      .getOne();

    const { infoId } = await this.callParticipants
      .createQueryBuilder("cl_participants")
      .select("cl_participants.infoId")
      .where("cl_participants.call_id = :id", { id: callId })
      .getOne();

    const { startTime, talkingDur, isAnswered } = await this.calls
      .createQueryBuilder("cl_calls")
      .select([
        "cl_calls.startTime",
        "cl_calls.talkingDur",
        "cl_calls.isAnswered",
      ])
      .where("cl_calls.id = :id", { id: callId })
      .getOne();

    return { id, callId, infoId, startTime, talkingDur, isAnswered };
  }

  async get3CXQueueCallInfo(
    incomingNumber: string
  ): Promise<CallcentQueuecalls> {
    return await this.queue
      .createQueryBuilder("callcent_queuecalls")
      .select("callcent_queuecalls.toDialednum")
      .where("callcent_queuecalls.fromUserpart like :number", {
        number: incomingNumber,
      })
      .orderBy("callcent_queuecalls.idcallcentQueuecalls", "DESC")
      .getOne();
  }

  async getLastUserRing(infoId: number): Promise<ClPartyInfo> {
    return await this.callPartyInfo
      .createQueryBuilder("cl_party_info")
      .select("cl_party_info.dn")
      .where("cl_party_info.id = :id", { id: infoId })
      .getOne();
  }
}
