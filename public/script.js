let token = "";
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
            loadCategories();
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
    document.getElementById('tickets').innerHTML = "Loading...";
    axios.get(API + "/ticket/my", {
        headers: { "Authorization": token }
    })
    .then(res => {
        let tix = res.data.tickets || [];
        let html = "<h2>My Tickets</h2>";
        html += tix.length ? tix.map(tt => `
  <div class="ticket">
    <b>${tt.subject}</b><br>
    ${tt.description}<br>
    Category: ${tt.category}<br>
    Status: ${tt.status}<br>
    Upvotes: <span id="up${tt._id}">${tt.upvotes}</span>
    <button onclick="upvote('${tt._id}')">⬆️</button>
    Downvotes: <span id="down${tt._id}">${tt.downvotes}</span>
    <button onclick="downvote('${tt._id}')">⬇️</button>
    <button onclick="changeStatus('${tt._id}')">Close Ticket</button>
    <button onclick="showComments('${tt._id}')">Comments</button>
    <button onclick="assignTicketPrompt('${tt._id}')">Assign</button>
<div id="comments-${tt._id}" style="margin-left:20px;"></div>
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
        if (res.data.ticket) {
            document.getElementById('subject').value = "";
            document.getElementById('description').value = "";
        }
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


window.upvote = function(id) {
  axios.post(`${API}/ticket/${id}/upvote`, {}, { headers: { Authorization: token } })
    .then(res => {
      document.getElementById('up' + id).textContent = res.data.ticket.upvotes;
    });
}
window.downvote = function(id) {
  axios.post(`${API}/ticket/${id}/downvote`, {}, { headers: { Authorization: token } })
    .then(res => {
      document.getElementById('down' + id).textContent = res.data.ticket.downvotes;
    });
}

window.showComments = function(ticketId) {
  const area = document.getElementById('comments-' + ticketId);
  axios.get(`${API}/comment/${ticketId}`, { headers: { Authorization: token } })
    .then(res => {
      let comments = (res.data.comments || []).map(cm => 
        `<div>🗨️ ${cm.text}</div>`).join("");
      comments += `
        <input id="comm-inp-${ticketId}" placeholder="Add comment" style="width:120px;">
        <button onclick="addComment('${ticketId}')">Send</button>
        <div id="comm-msg-${ticketId}" style="color: #b22222;"></div>
      `;
      area.innerHTML = comments;
    });
};

window.addComment = function(ticketId) {
  const inp = document.getElementById('comm-inp-' + ticketId);
  axios.post(`${API}/comment/${ticketId}`, 
    { text: inp.value }, 
    { headers: { Authorization: token } })
    .then(() => {
      showComments(ticketId);
    });
};

window.changeStatus = function(ticketId) {
  const newStatus = prompt("Enter new status (e.g., Open, Closed, In Progress):", "Closed");
  if (!newStatus) return;
  axios.patch(`${API}/ticket/${ticketId}/status`, 
    { status: newStatus },
    { headers: { Authorization: token } })
    .then(() => loadTickets());
}



function loadCategories() {
  axios.get(`${API}/category/all`, { headers: { Authorization: token } })
    .then(res => {
      let options = res.data.categories.map(cat =>
        `<option value="${cat.name}">${cat.name}</option>`
      ).join('');
      document.getElementById('category').innerHTML = options;
    });
}

window.assignTicketPrompt = function(ticketId) {
  const agentId = prompt("Enter agent user ID to assign this ticket:");
  if (!agentId) return;
  axios.patch(`${API}/ticket/${ticketId}/assign`, 
    { agentId: agentId },
    { headers: { Authorization: token } })
    .then(res => {
      alert("Assigned!");
      loadTickets();
    });
}

window.changeUserRole = function() {
  const uid = document.getElementById('userRoleId').value;
  const role = document.getElementById('userRoleValue').value;
  axios.patch(`${API}/ticket/user/${uid}/role`, 
    { role: role }, 
    { headers: { Authorization: token } })
    .then(res => {
      document.getElementById('roleMsg').innerText = "Role changed!";
    });
}
