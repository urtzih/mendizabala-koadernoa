/**
 * Cliente API para Mendizabala Backend
 * Reemplaza Supabase por API REST custom
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface RequestOptions {
  headers?: Record<string, string>
  [key: string]: any
}

class ApiClient {
  token: string | null

  constructor() {
    this.token = localStorage.getItem('token')
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem('token', token)
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem('token')
  }

  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${API_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      this.clearToken()
      window.location.href = '/login'
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error en la solicitud')
    }

    return data
  }

  // ========== AUTH ==========
  async requestOTP(email: string): Promise<any> {
    return this.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    const data = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  async getMe(): Promise<any> {
    return this.request('/auth/me')
  }

  // ========== TEACHERS ==========
  async getTeachers(): Promise<any> {
    return this.request('/teachers')
  }

  async createTeacher(data: any): Promise<any> {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTeacher(id: string, data: any): Promise<any> {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTeacher(id: string): Promise<any> {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    })
  }

  // ========== COMPANIES ==========
  async getCompanies(): Promise<any> {
    return this.request('/companies')
  }

  async createCompany(data: any): Promise<any> {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCompany(id: string, data: any): Promise<any> {
    return this.request(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCompany(id: string): Promise<any> {
    return this.request(`/companies/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
