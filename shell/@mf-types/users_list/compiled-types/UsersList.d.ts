export type KCUser = {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    enabled?: boolean;
};
type Props = {
    token: string;
    refreshKey?: number;
    api: {
        listUsers: (token: string) => Promise<KCUser[]>;
        deleteUser: (token: string, userId: string) => Promise<void>;
    };
};
export default function UsersList({ token, api, refreshKey }: Props): import("react/jsx-runtime").JSX.Element;
export {};
