export class Customer {
  customer_id: number;
  name: { firstname: string; lastname: string } = {
    firstname: '',
    lastname: '',
  };
  address: string;
}
