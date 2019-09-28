export interface UserWithRoles extends Omit<firebase.User, 'password'> {
    roles: { [key: string]: string };
}

export interface Student {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    billing?: {
        companyName: string;
        companyAddress: string;
        companyRegNumber: string;
    };
}

export interface Config {
    invoice: {
        defaultAmount: number;
        lastId: number;
    };
}
