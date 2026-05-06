export enum UserRole {
  ADMIN = 0,
  STAFF = 1,
  USER = 2,
}

export const getRoleWeight = (role: number | undefined): number => {
  if (role === undefined || role === null) return 2;
  
  const actualRole = Array.isArray(role) ? role[0] : role;
  
  if (actualRole === 0 || actualRole === '0') return UserRole.ADMIN;
  if (actualRole === 1 || actualRole === '1') return UserRole.STAFF;
  if (actualRole === 2 || actualRole === '2') return UserRole.USER;
  
  const normalized = String(actualRole).toLowerCase().trim();
  switch (normalized) {
    case 'admin': return UserRole.ADMIN;
    case 'staff': return UserRole.STAFF;
    case 'user': return UserRole.USER;
    default: return UserRole.USER;
  }
};

export const isAdmin = (role: number | undefined) => getRoleWeight(role) === UserRole.ADMIN;
export const isStaff = (role: number | undefined) => getRoleWeight(role) <= UserRole.STAFF;
