export class User {
  user_id: number;
  name: { firstname: string; lastname: string } = {
    firstname: '',
    lastname: '',
  };
  email: string;
  role: string;
}
