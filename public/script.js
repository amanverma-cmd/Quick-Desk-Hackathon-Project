let token = "";
// Change to your backend API if needed
const API = "http://localhost:3000";

function showCreate(show) {
    document.getElementById('createForm').style.display = show ? "" : "none";
}

function setLoggedIn(isLogged) {
    document.getElementById('authSection').style.display = isLogged ? "none" : "";
    document.getElementById('userPanel').style.display = isLogged ? "" : "none";
    document.getElementById('tickets').style.display = isLogged ? "" : "none";
    if (!isLogged) token = "";
}

window.register = function() {
    axios.post(API + "/user/register", {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPwd').value
    })
    .then(res => {
        document.getElementById('regMsg').innerText = res.data.message || "Registered!";
    })
    .catch(() => {
        document.getElementById('regMsg').innerText = "Registration failed";
    });
}

window.login = function() {
    axios.post(API + "/user/login", {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPwd').value
    })
    .then(res => {
        if(res.data.token) {
            token = res.data.token;
            setLoggedIn(true);
            document.getElementById('loginMsg').innerText = "Login success!";
        } else {
            document.getElementById('loginMsg').innerText = res.data.message || "Login failed";
        }
    })
    .catch(() => {
        document.getElementById('loginMsg').innerText = "Login failed";
    });
}

window.loadTickets = function() {
    if(!token) return;
    axios.get(API + "/ticket/my", {
        headers: { "Authorization": token }
    })
    .then(res => {
        let tix = res.data.tickets || [];
        let html = "<h2>My Tickets</h2>";
        html += tix.length ? tix.map(tt=>`
        <div class="ticket">
            <b>${tt.subject}</b><br>
            ${tt.description}<br>
            Status: ${tt.status}<br>
            Category: ${tt.category}
        </div>
        `).join("") : "No tickets yet.";
        document.getElementById('tickets').innerHTML = html;
    });
}

window.createTicket = function() {
    if(!token) return;
    axios.post(API + "/ticket/create", {
        subject: document.getElementById('subject').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    }, {
        headers: { "Authorization": token }
    })
    .then(res => {
        document.getElementById('createMsg').innerText = res.data.ticket ? "Ticket created" : (res.data.message || "Error");
        showCreate(false);
        loadTickets();
    })
    .catch(() => {
        document.getElementById('createMsg').innerText = "Error creating ticket";
    });
}

window.logout = function() {
    setLoggedIn(false);
    document.getElementById('tickets').innerHTML = "";
}
