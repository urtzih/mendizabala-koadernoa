import { useState } from 'react'

interface RoleSelectorProps {
  roles: string[]
  onSelect: (role: string) => void
}

export function RoleSelector({ roles, onSelect }: RoleSelectorProps) {
  const [selected, setSelected] = useState(roles[0] || '')

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelected(e.target.value)
    onSelect(e.target.value)
  }

  return (
    <div className="form-group">
      <label>Selecciona un rol</label>
      <select value={selected} onChange={handleChange}>
        {roles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  )
}
