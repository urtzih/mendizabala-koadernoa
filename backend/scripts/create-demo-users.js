// Script para crear usuarios demo en la API Mendizabala
import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/auth/register';

const users = [
  {
    email: 'admin@mendizabala.eus',
    password: 'admin123',
    name: 'Admin Demo',
    roles: ['admin']
  },
  {
    email: 'teacher@mendizabala.eus',
    password: 'teacher123',
    name: 'Teacher Demo',
    roles: ['teacher']
  },
  {
    email: 'company@mendizabala.eus',
    password: 'company123',
    name: 'Company Demo',
    roles: ['company']
  },
  {
    email: 'multi@mendizabala.eus',
    password: 'multi123',
    name: 'Multi Rol',
    roles: ['admin', 'teacher', 'company']
  }
];

(async () => {
  for (const user of users) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✔ Usuario creado: ${user.email}`);
      } else {
        console.log(`✖ No se pudo crear ${user.email}:`, data.error);
      }
    } catch (e) {
      console.error(`✖ Error creando ${user.email}:`, e.message);
    }
  }
})();
