import { Client } from './client';
import { Scope } from './scope';
import { User } from './user';

export class AuthorizePrompt {
  public user: User;
  public client: Client;
  public scopes: Scope[];
  public authToken: string;

  public constructor(user: User, client: Client, scopes: Scope[], authToken: string) {
    this.user = user;
    this.client = client;
    this.scopes = scopes;
    this.authToken = authToken;
  }
}
