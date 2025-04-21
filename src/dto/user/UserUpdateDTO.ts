export class UserUpdateDTO {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
  ) {}
}
