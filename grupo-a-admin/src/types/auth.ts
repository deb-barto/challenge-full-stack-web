export type AdminProfile = {
  id: string
  username: string
  email: string
  createdAt: string
}

export type SessionDTO = {
  access: string
  refresh: string
  admin: AdminProfile
}

export type LoginDTO = {
  username: string
  password: string
}

