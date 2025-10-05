export type Student = {
  id: string
  name: string
  academicRecord: string
  cpf: string
  email?: string | null
  classGroup?: string | null
  createdAt: string
  enrollments: Array<{
    course: {
      id: string
      name: string
      status: string
    }
  }>
}

export type StudentsPage = {
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
  data: Student[]
}

export type CreateStudentDTO = {
  name: string
  cpf: string
  email?: string
  classGroup?: string
  courseIds?: string[]
}

