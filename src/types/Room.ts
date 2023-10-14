import { Entity } from "./Entity";
import { v4 as uuid } from "uuid";

export class Room {
  constructor(private entities: Entity[]) {}

  public getEntities() {
    return this.entities;
  }

  appendEntity(entity: Entity) {
    entity._id = uuid();
    entity.onInit();
  }
}
