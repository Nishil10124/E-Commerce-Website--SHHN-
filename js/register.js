document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('error-message');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Get existing users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        errorMessage.textContent = 'Email already registered';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Add new user
    users.push({
        name,
        email,
        password
    });
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store logged in user data
    localStorage.setItem('userData', JSON.stringify({
        name,
        email
    }));
    
    // Redirect to home page
    window.location.href = 'index.html';
}); 