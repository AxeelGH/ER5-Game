export default class Event {
  constructor() {
    this.name = "BaseEvent";
    this.level = 1;
    this.progress = 0;
  }

  addProgress(amount) {
    this.progress += amount;
  }
}