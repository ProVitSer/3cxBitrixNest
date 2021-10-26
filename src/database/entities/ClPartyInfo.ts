import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClParticipants } from './ClParticipants';

@Index('cl_party_info_dn_idx', ['dn'], {})
@Index('cl_party_info_dn_class_idx', ['dnClass'], {})
@Index('cl_party_info_dn_type_idx', ['dnType'], {})
@Index('pk_party_info', ['id'], { unique: true })
@Entity('cl_party_info', { schema: 'public' })
export class ClPartyInfo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'dn_type', nullable: true })
  dnType: number | null;

  @Column('character varying', { name: 'dn', nullable: true, length: 255 })
  dn: string | null;

  @Column('character varying', {
    name: 'caller_number',
    nullable: true,
    length: 255,
  })
  callerNumber: string | null;

  @Column('character varying', {
    name: 'display_name',
    nullable: true,
    length: 255,
  })
  displayName: string | null;

  @Column('integer', { name: 'dn_class', default: () => '0' })
  dnClass: number;

  @Column('character varying', {
    name: 'firstlastname',
    nullable: true,
    length: 255,
  })
  firstlastname: string | null;

  @Column('character varying', {
    name: 'did_number',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  didNumber: string | null;

  @OneToMany(() => ClParticipants, (clParticipants) => clParticipants.info)
  clParticipants: ClParticipants[];
}
