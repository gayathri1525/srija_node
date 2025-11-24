
function validateLogin(username, password) {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      if (username === 'user' && password === 'pass') {
        resolve({ userId: 101, email: 'sri@example.com' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 100);
  });
}

module.exports = { validateLogin };
