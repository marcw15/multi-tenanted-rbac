export const ALL_PERMISSIONS = [
    //users
    'users:roles:write', // allow to add role to a user
    'users:roles:delete',// allow to delete role from a user

    // roles
    "roles:write",

    //posts
    'posts:write',
    'posts:read',
    'post:delete',
    'post:edit-own'
] as const; // as const make the list readonly

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permisson) => {
    
    acc[permisson] = permisson;

    return acc;
}, {}as Record<(typeof ALL_PERMISSIONS[number]), (typeof ALL_PERMISSIONS[number])>);

export const USER_ROLE_PERMISSIONS = [
    PERMISSIONS["posts:write"],
    PERMISSIONS["posts:read"],
];

export const SYTSEM_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    APPLICATION_USER: "APPLICATION_USER",
}