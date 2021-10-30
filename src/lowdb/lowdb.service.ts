import { Injectable } from "@nestjs/common";
import { LoggerService } from "@app/logger/logger.service";
import { ConfigService } from "@nestjs/config";
import * as path from "path";
import * as lowdb from "lowdb";
import * as FileAsync from "lowdb/adapters/FileAsync";
import { Departments, PlainObject, Users } from "./types/interfaces";
const dirPath = path.join(__dirname, "../../src/config");

@Injectable()
export class LowdbService {
  private collection = { departments: [], users: [] };
  private db: lowdb.LowdbAsync<any>;

  constructor(
    private readonly configService: ConfigService,
    private readonly log: LoggerService
  ) {
    this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    this.log.info(`Init Lowdb DB`);
    const adapter = new FileAsync(`${dirPath}/db.json`);
    this.db = await lowdb(adapter);
    await this.db.read();
  }

  async insert(
    newData: PlainObject,
    collection: string = "departments"
  ): Promise<any> {
    try {
      this.log.info(
        `Добавляем в базу ${collection}, ${JSON.stringify(newData)}`
      );

      let data = await this.db.get(collection).value();
      data.push(newData);
      return await this.db.set(collection, data).write();
    } catch (e) {
      this.log.error(`LowDB insert error: ${e}`);
    }
  }

  async deleteTrunkInfo( id: string,collection: string = "departments"): Promise<any> {
    try {
      this.log.info(
        `Удаляем  ${id} из коллекции ${collection}`
      );

      let values = await this.db.get(collection).value();
      values = values.filter((val) => val.trunkNumber !== id);
      return await this.db.set(collection, values).write();
    } catch (e) {
      this.log.error(`LowDB delete error: ${e}`);
    }
  }

  async unsetCollection(collection: string = "users"): Promise<any> {
    try {
      this.log.info(
        `Обнуляем коллекцию ${collection}`
      );

      await this.db.unset(collection).write();
      return await this.db.set(collection,[]).write();
    } catch (e) {
      this.log.error(`LowDB deleteCollection error: ${e}`);
    }
  }

  async findById(id: string, collection: string = 'users'): Promise<any> {
    try{
      this.log.info(
        `Производим поиск ${id} в  ${collection}`
      );

      const values: Array<any> = await this.findAll(collection);
      const valueFound = values.find(obj => obj.id === id)
      return valueFound;

    }catch(e){
      this.log.error(`LowDB findById error: ${e}`);
    }
  }

  async findAll(collection: string): Promise<Departments[] | Users[]> {
    try{
      return await this.db.get(collection).value()
    } catch(e){
      this.log.error(`LowDB findAll error: ${e}`);
    }

  }

  async findDeprtmentByCallId(callId: string, collection: string = 'departments'): Promise<Departments | Users> {
    try{
      this.log.info(
        `Производим поиск ${callId} в  ${collection}`
      );

      const values: Array<any> = await this.findAll(collection);
      const valueFound = values.find(obj => obj.trunkNumber === callId)
      return valueFound;

    }catch(e){
      this.log.error(`LowDB findById error: ${e}`);
    }
  }

  async getBitrixIdByExten(exten: string, collection: string = 'users'){
    try{
      this.log.info(
        `Производим поиск ${exten} в ${collection}`
      );

    const values: Array<any> = await this.findAll(collection);
    const valueFound = values.find(obj => obj.exten === exten)
    return valueFound;
    }catch(e){
      this.log.error(`LowDB getBitrixIdByExten error: ${e}`);
    }
  }
}
