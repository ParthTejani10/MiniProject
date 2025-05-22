(function () {
    'use strict';

    // Elements
    const navButtons = document.querySelectorAll('nav button[data-route]');
    const pages = document.querySelectorAll('.page');
    const form = document.getElementById('signupForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Form inputs & messages
    const usernameInput = form.username;
    const usernameHelp = document.getElementById('usernameHelp');

    const emailInput = form.email;
    const emailHelp = document.getElementById('emailHelp');

    const passwordInput = form.password;
    const passwordHelp = document.getElementById('passwordHelp');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');

    const confirmPasswordInput = form.confirmPassword;
    const confirmPasswordHelp = document.getElementById('confirmPasswordHelp');

    // Password strength colors and thresholds
    const strengthLevels = [
        { color: '#d32f2f', label: 'Very Weak', minPoints: 0 },
        { color: '#f57c00', label: 'Weak', minPoints: 2 },
        { color: '#fbc02d', label: 'Medium', minPoints: 4 },
        { color: '#388e3c', label: 'Strong', minPoints: 6 },
        { color: '#2e7d32', label: 'Very Strong', minPoints: 8 }
    ];

    // Helper functions
    function showPage(route) {
        pages.forEach(page => {
            if (page.id === route) {
                page.classList.remove('hidden');
                page.classList.add('active');
                page.setAttribute('aria-hidden', 'false');
            } else {
                page.classList.remove('active');
                page.classList.add('hidden');
                page.setAttribute('aria-hidden', 'true');
            }
        });
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-route') === route);
            btn.setAttribute('aria-current', btn.getAttribute('data-route') === route ? 'page' : 'false');
        });
    }

    function updateRoute(route) {
        if (route !== location.hash.substring(1)) {
            location.hash = route;
        } else {
            showPage(route);
        }
    }

    function validateUsername() {
        const val = usernameInput.value.trim();
        if (val.length < 3) {
            usernameHelp.textContent = 'Username must be at least 3 characters.';
            return false;
        } else if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
            usernameHelp.textContent = 'Username can only contain letters, numbers, underscore, and hyphen.';
            return false;
        } else {
            usernameHelp.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            emailHelp.textContent = 'Please enter a valid email address.';
            return false;
        } else {
            emailHelp.textContent = '';
            return true;
        }
    }

    // Password strength checker
    function calculatePasswordStrength(password) {
        let points = 0;
        if (password.length >= 8) points += 2;
        if (/[A-Z]/.test(password)) points += 2;
        if (/[a-z]/.test(password)) points += 1;
        if (/\d/.test(password)) points += 2;
        if (/[^A-Za-z0-9]/.test(password)) points += 3;
        if (password.length > 12) points += 1;
        return points;
    }

    function updatePasswordStrengthBar() {
        const pwd = passwordInput.value;
        const strength = calculatePasswordStrength(pwd);
        let level = strengthLevels[0];
        for (let i = strengthLevels.length - 1; i >= 0; i--) {
            if (strength >= strengthLevels[i].minPoints) {
                level = strengthLevels[i];
                break;
            }
        }
        passwordStrengthBar.style.width = (strength * 10) + '%';
        passwordStrengthBar.style.backgroundColor = level.color;
        passwordHelp.textContent = pwd.length > 0 ? `Password strength: ${level.label}` : '';
    }

    function validatePassword() {
        const pwd = passwordInput.value;
        const errors = [];
        if (pwd.length < 8) errors.push('Minimum 8 characters.');
        if (!/[A-Z]/.test(pwd)) errors.push('At least one uppercase letter.');
        if (!/\d/.test(pwd)) errors.push('At least one number.');
        if (!/[^A-Za-z0-9]/.test(pwd)) errors.push('At least one special character.');
        if (errors.length > 0) {
            passwordHelp.textContent = errors.join(' ');
            return false;
        }
        passwordHelp.textContent = '';
        return true;
    }

    function validateConfirmPassword() {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordHelp.textContent = 'Passwords do not match.';
            return false;
        }
        confirmPasswordHelp.textContent = '';
        return true;
    }

    function validateForm() {
        // Combine all validations to enable or disable submit
        const valid = validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword();
        submitBtn.disabled = !valid;
        return valid;
    }

    // Event listeners
    usernameInput.addEventListener('input', () => {
        validateUsername();
        validateForm();
    });

    emailInput.addEventListener('input', () => {
        validateEmail();
        validateForm();
    });

    passwordInput.addEventListener('input', () => {
        updatePasswordStrengthBar();
        validatePassword();
        validateConfirmPassword();
        validateForm();
    });

    confirmPasswordInput.addEventListener('input', () => {
        validateConfirmPassword();
        validateForm();
    });

    // Form submission
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validateForm()) {
            // Show confirmation page via routing
            updateRoute('confirmation');
            form.reset();
            passwordStrengthBar.style.width = '0%';
            passwordHelp.textContent = '';
            submitBtn.disabled = true;
        }
    });

    // Navigation buttons click
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateRoute(btn.getAttribute('data-route'));
        });
    });

    // Hash routing for direct access or back/fwd browser navigation
    window.addEventListener('hashchange', () => {
        const route = location.hash.substring(1) || 'home';
        showPage(route);
    });

    // On page load
    (function () {
        const initialRoute = location.hash.substring(1) || 'home';
        showPage(initialRoute);
    })();

    // Back to home button on confirmation page
    document.getElementById('backHome').addEventListener('click', () => {
        updateRoute('home');
    });

})();