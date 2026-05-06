export enum UserRole {
  GUEST = -1,
  USER = 0,
  STAFF = 1,
  ADMIN = 2,
}

export const getRoleWeight = (role: string | number | undefined): number => {
  if (role === undefined) return UserRole.GUEST;
  if (typeof role === 'number') return role;
  
  const normalized = String(role).toLowerCase();
  switch (normalized) {
    case 'admin': return UserRole.ADMIN;
    case 'staff': return UserRole.STAFF;
    case 'user': return UserRole.USER;
    default: return UserRole.USER; // Default to user if unknown string
  }
};

export const isAdmin = (role: string | number | undefined) => getRoleWeight(role) >= UserRole.ADMIN;
export const isStaff = (role: string | number | undefined) => getRoleWeight(role) >= UserRole.STAFF;
