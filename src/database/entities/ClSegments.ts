import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClParticipants } from './ClParticipants';
import { ClCalls } from './ClCalls';

@Index('cl_segments_action_party_id_idx', ['actionPartyId'], {})
@Index('cl_segments_call_id_idx', ['callId'], {})
@Index('cl_segments_dst_part_id_idx', ['dstPartId'], {})
@Index('cl_segments_end_time_idx', ['endTime'], {})
@Index('pk_cl_segments', ['id'], { unique: true })
@Index('cl_segments_src_part_id_idx', ['srcPartId'], {})
@Index('cl_segments_start_time_idx', ['startTime'], {})
@Entity('cl_segments', { schema: 'public' })
export class ClSegments {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'call_id' })
  callId: number;

  @Column('integer', { name: 'seq_order' })
  seqOrder: number;

  @Column('integer', { name: 'seq_group' })
  seqGroup: number;

  @Column('integer', { name: 'src_part_id' })
  srcPartId: number;

  @Column('integer', { name: 'dst_part_id' })
  dstPartId: number;

  @Column('timestamp with time zone', { name: 'start_time' })
  startTime: Date;

  @Column('timestamp with time zone', { name: 'end_time' })
  endTime: Date;

  @Column('integer', { name: 'type' })
  type: number;

  @Column('integer', { name: 'action_id' })
  actionId: number;

  @Column('integer', { name: 'action_party_id', nullable: true })
  actionPartyId: number | null;

  @ManyToOne(
    () => ClParticipants,
    (clParticipants) => clParticipants.clSegments,
  )
  @JoinColumn([{ name: 'action_party_id', referencedColumnName: 'id' }])
  actionParty: ClParticipants;

  @ManyToOne(() => ClCalls, (clCalls) => clCalls.clSegments)
  @JoinColumn([{ name: 'call_id', referencedColumnName: 'id' }])
  call: ClCalls;

  @ManyToOne(
    () => ClParticipants,
    (clParticipants) => clParticipants.clSegments2,
  )
  @JoinColumn([{ name: 'dst_part_id', referencedColumnName: 'id' }])
  dstPart: ClParticipants;

  @ManyToOne(
    () => ClParticipants,
    (clParticipants) => clParticipants.clSegments3,
  )
  @JoinColumn([{ name: 'src_part_id', referencedColumnName: 'id' }])
  srcPart: ClParticipants;
}
