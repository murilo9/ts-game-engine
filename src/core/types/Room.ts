import { System } from "detect-collisions";
import { Entity } from "./Entity";
import { v4 as uuid } from "uuid";
import { Collider } from "./Collider";

export class Room {
  private entities: Entity[];
  private collisionSystems: {
    [name: string]: System;
  };

  constructor(
    collisionSystems: {
      [name: string]: System;
    } = {}
  ) {
    this.entities = [];
    this.collisionSystems = collisionSystems;
    // If entity is a Collider, appends
  }

  public getEntities() {
    return this.entities;
  }

  public getCollisionSystem(name: string): System | undefined {
    return this.collisionSystems[name];
  }

  public getAllCollisionSystems(): System[] {
    return Object.values(this.collisionSystems);
  }

  appendEntities(entities: Entity[], collisionSystemName?: string) {
    entities.forEach((entity) => {
      entity._id = uuid();
      entity.onInit();
      this.entities.push(entity);
      // If entity is a collider, also inserts it into the collision system
      if (entity instanceof Collider && collisionSystemName) {
        const collisionSystem = this.collisionSystems[collisionSystemName];
        if (collisionSystem) {
          collisionSystem.insert(entity.body);
        }
      }
    });
    return this;
  }
}
