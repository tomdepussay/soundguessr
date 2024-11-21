interface User {
    id: number;
    username: string;
    email: string;
    profileId: number;
    picture: string;
    permissions: string[];
}

export default User;