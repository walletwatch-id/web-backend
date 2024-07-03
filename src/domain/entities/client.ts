export class Client {
  public id: string;
  public userId: string;
  public name: string;
  public provider: string;
  public redirect: string;
  public personalAccessClient: boolean;
  public passwordClient: boolean;
  public revoked: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    userId: string,
    name: string,
    provider: string,
    redirect: string,
    personalAccessClient: boolean,
    passwordClient: boolean,
    revoked: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.provider = provider;
    this.redirect = redirect;
    this.personalAccessClient = personalAccessClient;
    this.passwordClient = passwordClient;
    this.revoked = revoked;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
