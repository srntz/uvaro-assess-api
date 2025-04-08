export class InvalidModelConstructionException extends Error {
  constructor(className: string) {
    const message = `${className} construction failed. Please make sure the constructor argument contains all required fields.`;
    super(message);
    this.name = "InvalidModelConstruction";
    Object.setPrototypeOf(this, InvalidModelConstructionException.prototype);
  }
}
