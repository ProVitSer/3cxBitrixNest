import { ApiService } from "@app/api/api.service";
import { BitirxUserGet } from "@app/api/types/interfaces";
import { LoggerService } from "@app/logger/logger.service";
import { LowdbService } from "@app/lowdb/lowdb.service";
import { Departments } from "@app/lowdb/types/interfaces";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
let startPage = 0;
const nextFiftyPage = 50;

@Injectable()
export class SyncDataService implements OnApplicationBootstrap {
  constructor(
    private readonly logger: LoggerService,
    private readonly lowdb: LowdbService,
    private readonly apiService: ApiService
  ) {}

  onApplicationBootstrap() {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async syncBitrixInfo() {
    if (+process.env.NODE_APP_INSTANCE == 1) {
    const getAllDepartmets = (await this.lowdb.findAll(
      "departments"
    )) as Departments[];

    Promise.all(
      getAllDepartmets.map(async (department: Departments) => {
        await this.updateDepartmentsResponsibleId(department);
      })
    );

    await this.removeCollection('users');
    await this.updateUsersInfo(startPage);
    }
  }
  

  async updateUsersInfo(startPage: number): Promise<any>{
    const response = await this.apiService.getActiveUsers(startPage);
    const newUsersArray : BitirxUserGet[] = response.result
    const next = response.next;

    Promise.all(newUsersArray.map(async (user:BitirxUserGet) => {
        await this.insertNewUsersInDb(user);
    }));

    (response.next)? this.updateUsersInfo(startPage + nextFiftyPage) : this.logger.info(`Выгрузка пользователей закончилась на странице ${startPage}`)
  }

  async insertNewUsersInDb(user:BitirxUserGet): Promise<any>{
    if(user.UF_PHONE_INNER != null){
      const userInfo = {
        exten:user.UF_PHONE_INNER,
        id: user.ID
      }
      await this.lowdb.insert(userInfo,'users');
    }
  }

  async updateDepartmentsResponsibleId(department: Departments): Promise<any> {
    const responsibleId = await this.getDepartmentInfo(department.departmentId);

    if (responsibleId.length != 0) {
      await this.lowdb.deleteTrunkInfo(department.trunkNumber, "departments");
      const data = this.getData(String(responsibleId), department);
      return await this.lowdb.insert(data, "departments");
    }
  }

  getData(id: string, departments: Departments): Departments {
    return {
      trunkNumber: departments.trunkNumber,
      departmentId: departments.departmentId,
      id: id,
      callProcessing: departments.callProcessing,
      showUsers: departments.showUsers,
    };
  }

  async getDepartmentInfo(id: string): Promise<any> {
    return await this.apiService.getUserIdDepartment(id);
  }
  async removeCollection(collection: string): Promise<any> {
    return await this.lowdb.unsetCollection(collection);
  }
}
