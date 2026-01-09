export default class UserInsertDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email?.toLowerCase();
    this.password = user.password; 
    this.role = 'user'; 
    this.cart = user.cart || null;
  }
}