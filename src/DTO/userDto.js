class userDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.lastName = user.lastName;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
  }
}

export default userDTO;
