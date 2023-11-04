document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const successMessage = document.getElementById('success-message');
  const bigRedButton = document.getElementById('big-red-button');

  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = signUpForm.querySelector('[name="username"]').value;
    const email = signUpForm.querySelector('[name="email"]').value;
    const password = signUpForm.querySelector('[name="password"]').value;
    
    // Call the signUp function to make a POST request
    await signUp(username, email, password);
  });
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('[name="email"]').value;
    const password = loginForm.querySelector('[name="password"]').value;
    
    // Call the logIn function to make a POST request
    await logIn(email, password);
  });

  // Function to handle signup
  const signUp = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 200) {
        // Update the success message
        successMessage.innerText = 'Signup successful!';

      } else {
        const data = await response.json();
        console.error('Signup error:', data.error);
        // Display an error message to the user if signup fails.
        successMessage.innerText = 'Signup failed! The user may already exist.';
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  // Function to handle login
  const logIn = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        // Update the success message
        successMessage.innerText = 'Login successful!';
      } else {
        const data = await response.json();
        console.error('Login error:', data.error);
        // Display an error message to the user if login fails.
        successMessage.innerText = 'Login failed! Please check your credentials and try again.';
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

    bigRedButton.addEventListener('click', async (e) => {
    e.preventDefault();
    window.location.href = "https://leekspin.com/";
    });
  

});
