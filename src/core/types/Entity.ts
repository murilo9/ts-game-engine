import { v4 as uuid } from "uuid";

/**
 * Do not implement constructors! Use the onInit method instead
 */
export class Entity {
  // Entity ID, only exists when entity os inside a room
  _id: string;

  constructor() {
    this._id = uuid();
  }

  onInit() {}
  beforeRun() {}
  onRun() {}
  afterRun() {}
}
