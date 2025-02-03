export class ServiceCallFallthroughException extends Error {
  constructor(className: string) {
    const message = `The call made to ${className} has fallen-through to the base service. Please ensure ${className} overrides default methods`;
    super(message);
    this.name = "ServiceCallFallThrough";
    Object.setPrototypeOf(this, ServiceCallFallthroughException.prototype);
  }
}
