// Script para probar el login rápido por código en local
// Ejecutar con: node test-login-codes.js


import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/verify-otp';
const TEST_EMAIL = 'test@mendizabala.eus';
const codes = [
  { code: process.env.LOGIN_CODE_ADMIN || '111111', role: 'admin' },
  { code: process.env.LOGIN_CODE_TEACHER || '222222', role: 'teacher' },
  { code: process.env.LOGIN_CODE_COMPANY || '333333', role: 'company' },
];

(async () => {
  for (const { code, role } of codes) {
    try {
      const res = await axios.post(API_URL, { email: TEST_EMAIL, otp: code });
      console.log(`\n[${role}]`);
      console.log('Status:', res.status);
      console.log('Response:', res.data);
    } catch (err) {
      console.error(`\n[${role}] Error:`, err.response?.data || err.message);
    }
  }
})();
