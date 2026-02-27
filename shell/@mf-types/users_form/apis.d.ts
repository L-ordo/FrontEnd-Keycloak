
    export type RemoteKeys = 'users_form/UserForm';
    type PackageType<T> = T extends 'users_form/UserForm' ? typeof import('users_form/UserForm') :any;