export class User {
  public id: string;
  public name: string;
  public email: string;
  public emailVerifiedAt: string;
  public picture: string;
  public role: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    email: string,
    emailVerifiedAt: string,
    picture: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.emailVerifiedAt = emailVerifiedAt;
    this.picture = picture;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
