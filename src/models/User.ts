export class User {
    private user_id: string | null;
    private first_name: string;
    private last_name: string;
    private email: string;

    constructor(first_name: string, last_name: string, email: string, user_id?: string) {
      this.user_id = user_id || null;
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
    }

    static instantiateFromSourceData(data: any) {
      let user: User;
      try {
        if(data.hasOwnProperty('user_id')) {
          user = new User(data.first_name, data.last_name, data.email, data.user_id);
        } else {
          user = new User(data.first_name, data.last_name, data.email);
        }
        return user
      } catch (e) {
        throw new Error(JSON.stringify({code: "D001", message: "An error occurred during automated object instantiation."}));
      }
    }

    createInsertableJsonObject() {
      return {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
      }
    }

}
