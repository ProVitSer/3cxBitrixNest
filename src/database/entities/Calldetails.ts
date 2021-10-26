import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_calldetails_detailnum', ['detailnum'], {})
@Index('calldetails_pkey', ['idcalldetail'], { unique: true })
@Index('idx_calldetails_idcallhistory2', ['idcallhistory2'], {})
@Entity('calldetails', { schema: 'public' })
export class Calldetails {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'idcalldetail' })
  idcalldetail: number;

  @Column('integer', { name: 'idcallhistory2' })
  idcallhistory2: number;

  @Column('integer', { name: 'detailnum' })
  detailnum: number;

  @Column('integer', { name: 'parentdetailnum', nullable: true })
  parentdetailnum: number | null;

  @Column('character varying', {
    name: 'dest_num',
    nullable: true,
    length: 255,
  })
  destNum: string | null;

  @Column('integer', { name: 'specdsttype' })
  specdsttype: number;

  @Column('timestamp without time zone', { name: 'starttime' })
  starttime: Date;

  @Column('interval', { name: 'dur' })
  dur: any;

  @Column('timestamp without time zone', { name: 'answertime', nullable: true })
  answertime: Date | null;

  @Column('integer', { name: 'status' })
  status: number;

  @Column('boolean', { name: 'is_compl' })
  isCompl: boolean;

  @Column('boolean', { name: 'is_tooutside' })
  isTooutside: boolean;

  @Column('character varying', { name: 'dest_dn', nullable: true, length: 255 })
  destDn: string | null;

  @Column('character varying', {
    name: 'otherparty',
    nullable: true,
    length: 255,
  })
  otherparty: string | null;

  @Column('character varying', {
    name: 'billprefix',
    nullable: true,
    length: 255,
  })
  billprefix: string | null;

  @Column('character varying', {
    name: 'billratename',
    nullable: true,
    length: 255,
  })
  billratename: string | null;

  @Column('numeric', { name: 'billrate', nullable: true })
  billrate: string | null;

  @Column('numeric', { name: 'billcost', nullable: true })
  billcost: string | null;
}
