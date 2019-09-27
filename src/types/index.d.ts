export interface UserWithRoles extends Omit<firebase.User, 'password'> {
    roles: { [key: string]: string };
}
