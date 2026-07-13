// Shared login/session/nav logic for the 4 NEOP demo pages.
const NEOP_USERS = {
    admin: { password: 'admin', role: 'admin', label: 'Administrator', home: 'command_portal_dashboard.html' },
    user: { password: 'user', role: 'user', label: 'Operator', home: 'dashboard.html' },
};

function neopLogin(username, password) {
    const key = (username || '').trim().toLowerCase();
    const account = NEOP_USERS[key];
    if (!account || account.password !== password) return null;
    const session = { username: key, role: account.role, label: account.label };
    localStorage.setItem('neop_session', JSON.stringify(session));
    return session;
}

function neopCurrentSession() {
    try {
        return JSON.parse(localStorage.getItem('neop_session'));
    } catch {
        return null;
    }
}

function neopLogout() {
    if (!window.confirm('Are you sure you want to log out?')) return;
    localStorage.removeItem('neop_session');
    window.location.href = 'login.html';
}

// Lightweight toast/snackbar notification, usable from any page after loading auth.js.
function neopShowToast(message, icon) {
    let container = document.getElementById('neop-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'neop-toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'display:flex;align-items:center;gap:10px;background:#001b44;color:#ffffff;padding:12px 20px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.25);font-family:Inter,sans-serif;font-size:14px;font-weight:600;opacity:0;transform:translateY(12px);transition:opacity 0.25s ease,transform 0.25s ease;pointer-events:auto;';
    toast.innerHTML = (icon ? `<span class="material-symbols-outlined" style="font-size:20px;">${icon}</span>` : '') +
        `<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// Call on every protected page; redirects to login.html if no session exists.
function neopRequireAuth() {
    const session = neopCurrentSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    const badge = document.querySelector('[data-neop-user]');
    if (badge) badge.textContent = `${session.label} (${session.username})`;
    return session;
}
