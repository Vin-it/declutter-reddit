import { Model } from 'objection';

class User extends Model {
  id!: number;

  refresh_token!: string;

  access_token!: string;

  expires_on!: Date | string;

  isImported!: boolean;

  username!: string;

  static get tableName() {
    return 'users';
  }
}

export default User;
