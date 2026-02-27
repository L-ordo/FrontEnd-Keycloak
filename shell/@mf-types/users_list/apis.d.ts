
    export type RemoteKeys = 'users_list/UsersList';
    type PackageType<T> = T extends 'users_list/UsersList' ? typeof import('users_list/UsersList') :any;