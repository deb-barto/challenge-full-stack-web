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

export const useStudentsStore = defineStore('students', {
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
    async fetch(page = 1, limit = this.limit, search?: string) {
      this.loading = true
      console.debug('[studentsStore] fetching students', { page, limit, search })
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
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
  },
})

