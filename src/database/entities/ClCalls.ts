import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClParticipants } from './ClParticipants';
import { ClSegments } from './ClSegments';

@Index('cl_calls_end_time_idx', ['endTime'], {})
@Index('pk_cl_calls', ['id'], { unique: true })
@Index('cl_calls_is_answered_idx', ['isAnswered'], {})
@Index('cl_calls_ringing_dur_idx', ['ringingDur'], {})
@Index('cl_calls_start_time_idx', ['startTime'], {})
@Index('cl_calls_talking_dur_idx', ['talkingDur'], {})
@Entity('cl_calls', { schema: 'public' })
export class ClCalls {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp with time zone', { name: 'start_time' })
  startTime: Date;

  @Column('timestamp with time zone', { name: 'end_time' })
  endTime: Date;

  @Column('boolean', { name: 'is_answered' })
  isAnswered: boolean;

  @Column('interval', { name: 'ringing_dur', nullable: true })
  ringingDur: any | null;

  @Column('interval', { name: 'talking_dur', nullable: true })
  talkingDur: any | null;

  @Column('interval', { name: 'q_wait_dur', nullable: true })
  qWaitDur: any | null;

  @OneToMany(() => ClParticipants, (clParticipants) => clParticipants.call)
  clParticipants: ClParticipants[];

  @OneToMany(() => ClSegments, (clSegments) => clSegments.call)
  clSegments: ClSegments[];
}
