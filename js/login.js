document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store logged in user data
        localStorage.setItem('userData', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.style.display = 'block';
    }
}); 