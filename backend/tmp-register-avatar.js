const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

(async () => {
  try {
    const form = new FormData();
    form.append('name', 'Test Avatar User');
    form.append('email', 'test-avatar-user@example.com');
    form.append('password', 'Test@1234');
    form.append('confirmPassword', 'Test@1234');
    form.append('avatar', fs.createReadStream(path.resolve(__dirname, '..', 'frontend', 'src', 'assets', 'hero.png')));

    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    console.log('status', res.status);
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
