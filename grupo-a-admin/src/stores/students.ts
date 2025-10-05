import { defineStore } from 'pinia'
import { http } from '../services/http'
import type { StudentsPage, CreateStudentDTO, Student } from '../types/students'

type State = {
  items: StudentsPage['data']
  current?: Student | null
  total: number
  page: number
  pages: number
  limit: number
  loading: boolean
}

type Actions = {
  fetch(page?: number, limit?: number, search?: string): Promise<void>
  fetchById(id: string): Promise<Student>
  create(payload: CreateStudentDTO): Promise<Student>
  update(id: string, payload: Partial<Pick<Student, 'name' | 'email'>>): Promise<Student>
  remove(id: string): Promise<void>
  checkNameExists(name: string, ignoreId?: string): Promise<boolean>
  checkEmailExists(email: string, ignoreId?: string): Promise<boolean>
}

export const useStudentsStore = defineStore<'students', State, Record<string, never>, Actions>('students', {
  state: (): State => ({
    items: [],
    current: null,
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
    loading: false,
  }),
  actions: {
    async fetch(page?: number, limit?: number, search?: string) {
      this.loading = true
      const resolvedPage = page ?? 1
      const resolvedLimit = limit ?? this.limit
      console.debug('[studentsStore] fetching students', { page: resolvedPage, limit: resolvedLimit, search })
      try {
        const params = new URLSearchParams({ page: String(resolvedPage), limit: String(resolvedLimit) })
        if (search) params.set('search', search)
        const { data } = await http.get<StudentsPage>(`/admin/students?${params.toString()}`)
        this.items = data.data
        this.total = data.meta.total
        this.page = data.meta.page
        this.pages = data.meta.pages
        this.limit = data.meta.limit
        console.debug('[studentsStore] fetch success', { total: this.total, pages: this.pages })
      } catch (error) {
        console.error('[studentsStore] fetch error', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchById(id: string) {
      this.loading = true
      console.debug('[studentsStore] fetching student detail', { id })
      try {
        const { data } = await http.get<Student>(`/admin/students/${id}`)
        this.current = data
        return data
      } catch (error) {
        console.error('[studentsStore] fetch detail error', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async create(payload: CreateStudentDTO) {
      console.debug('[studentsStore] creating student', payload)
      try {
        const { data } = await http.post<Student>('/admin/students', payload)
        console.debug('[studentsStore] create success', data)
        await this.fetch(this.page, this.limit)
        return data
      } catch (error) {
        console.error('[studentsStore] create error', error)
        throw error
      }
    },
    async update(id: string, payload: Partial<Pick<Student, 'name' | 'email'>>) {
      console.debug('[studentsStore] updating student', { id, payload })
      try {
        const { data } = await http.patch<Student>(`/admin/students/${id}`, payload)
        console.debug('[studentsStore] update success', data)
        this.current = data
        await this.fetch(this.page, this.limit)
        return data
      } catch (error) {
        console.error('[studentsStore] update error', error)
        throw error
      }
    },
    async remove(id: string) {
      console.debug('[studentsStore] deleting student', { id })
      try {
        await http.delete(`/admin/students/${id}`)
        console.debug('[studentsStore] delete success')
        await this.fetch(this.page, this.limit)
        if (this.current?.id === id) this.current = null
      } catch (error) {
        console.error('[studentsStore] delete error', error)
        throw error
      }
    },
    async checkNameExists(name: string, ignoreId?: string) {
      const value = name.trim()
      if (!value) return false
      console.debug('[studentsStore] checking name uniqueness', { value, ignoreId })
      try {
        const params = new URLSearchParams({ name: value })
        if (ignoreId) params.set('ignoreId', ignoreId)
        const { data } = await http.get<{ exists: boolean }>(`/admin/students/check-name?${params.toString()}`)
        return data.exists
      } catch (error) {
        console.error('[studentsStore] check name error', error)
        throw error
      }
    },
    async checkEmailExists(email: string, ignoreId?: string) {
      const value = email.trim()
      if (!value) return false
      console.debug('[studentsStore] checking email uniqueness', { value, ignoreId })
      try {
        const params = new URLSearchParams({ email: value })
        if (ignoreId) params.set('ignoreId', ignoreId)
        const { data } = await http.get<{ exists: boolean }>(`/admin/students/check-email?${params.toString()}`)
        return data.exists
      } catch (error) {
        console.error('[studentsStore] check email error', error)
        throw error
      }
    },
  },
})

