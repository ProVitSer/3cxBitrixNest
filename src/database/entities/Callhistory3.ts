import { Column, Entity, Index } from 'typeorm';

@Index('idx_callhistory3_callid', ['callid'], { unique: true })
@Index('idx_callhistory3_from_no', ['fromNo'], {})
@Index('callhistory3_pkey', ['idcallhistory3'], { unique: true })
@Index('idx_callhistory3_starttime', ['starttime'], {})
@Index('idx_callhistory3_to_no', ['toNo'], {})
@Entity('callhistory3', { schema: 'public' })
export class Callhistory3 {
  @Column('integer', { primary: true, name: 'idcallhistory3' })
  idcallhistory3: number;

  @Column('character varying', { name: 'callid', length: 255 })
  callid: string;

  @Column('timestamp without time zone', { name: 'starttime' })
  starttime: Date;

  @Column('timestamp without time zone', { name: 'answertime', nullable: true })
  answertime: Date | null;

  @Column('timestamp without time zone', { name: 'endtime' })
  endtime: Date;

  @Column('interval', { name: 'duration' })
  duration: any;

  @Column('boolean', { name: 'is_answ' })
  isAnsw: boolean;

  @Column('boolean', { name: 'is_fail' })
  isFail: boolean;

  @Column('boolean', { name: 'is_compl' })
  isCompl: boolean;

  @Column('boolean', { name: 'is_fromoutside', nullable: true })
  isFromoutside: boolean | null;

  @Column('integer', { name: 'mediatype', nullable: true })
  mediatype: number | null;

  @Column('character varying', { name: 'from_no', nullable: true, length: 255 })
  fromNo: string | null;

  @Column('character varying', { name: 'to_no', nullable: true, length: 255 })
  toNo: string | null;

  @Column('character varying', {
    name: 'callerid',
    nullable: true,
    length: 255,
  })
  callerid: string | null;

  @Column('character varying', {
    name: 'dialednumber',
    nullable: true,
    length: 255,
  })
  dialednumber: string | null;

  @Column('character varying', {
    name: 'lastcallerid',
    nullable: true,
    length: 255,
  })
  lastcallerid: string | null;

  @Column('character varying', {
    name: 'lastdialednumber',
    nullable: true,
    length: 255,
  })
  lastdialednumber: string | null;

  @Column('character varying', {
    name: 'group_no',
    nullable: true,
    length: 255,
  })
  groupNo: string | null;

  @Column('character varying', { name: 'line_no', nullable: true, length: 255 })
  lineNo: string | null;

  @Column('numeric', { name: 'rate', nullable: true })
  rate: string | null;

  @Column('numeric', { name: 'totalcost', nullable: true })
  totalcost: string | null;

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

  @Column('integer', { name: 'grpanswdetail', nullable: true })
  grpanswdetail: number | null;

  @Column('character varying', { name: 'recfile', nullable: true, length: 511 })
  recfile: string | null;

  @Column('character varying', { name: 'callchain', nullable: true })
  callchain: string | null;

  @Column('boolean', { name: 'is_visible', default: () => 'true' })
  isVisible: boolean;

  @Column('character varying', { name: 'caller_display_name', nullable: true })
  callerDisplayName: string | null;
}
