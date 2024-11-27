interface User {
    id: number;
    username: string;
    email: string;
    roleId: number;
    picture: string;
    permissions: string[];
}

export default User;