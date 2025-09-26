export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
}

export const getUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') return null;
  
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    return JSON.parse(storedUserInfo);
  }
  return null;
};

export const getDisplayUser = (userInfo: UserInfo | null) => {
  if (userInfo) {
    return {
      name: `${userInfo.prenom} ${userInfo.nom}`,
      role: userInfo.role || "Utilisateur",
      email: userInfo.email,
      avatar: "👨🏾‍💼"
    };
  }
  
  return {
    name: "Dr. Amadou Traoré",
    role: "Directeur des Partenariats",
    email: "user@example.com",
    avatar: "👨🏾‍💼"
  };
};
