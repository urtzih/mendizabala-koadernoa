export type Status = 'green' | 'orange' | 'red'

export interface Teacher {
  id: string
  name: string
  email: string
  substituteName?: string | null
}

export interface Company {
  id: string
  name: string
  location?: string | null
  contactPerson?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  assignedTeacherId?: string | null
  status: Status
  demandDual1?: number | null
  demandDualGeneral?: number | null
  demandDualIntensive?: number | null
}
