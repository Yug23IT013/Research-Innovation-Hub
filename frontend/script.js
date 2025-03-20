document.addEventListener("DOMContentLoaded", function () {
    
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;
            const messageElement = document.getElementById("registerMessage");

            try {
                messageElement.innerText = "Registering...";
                const response = await fetch("http://localhost:5001/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                messageElement.innerText = data.message;
                messageElement.style.color = "green";
                setTimeout(() => window.location.href = "login.html", 2000);
            } catch (error) {
                console.error("Registration error:", error);
                messageElement.innerText = error.message || "Registration failed. Please try again.";
                messageElement.style.color = "red";
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const messageElement = document.getElementById("loginMessage");

            try {
                messageElement.innerText = "Logging in...";
                const response = await fetch("http://localhost:5001/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Login failed");
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.name);
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Login error:", error);
                messageElement.innerText = error.message || "Login failed. Please try again.";
                messageElement.style.color = "red";
            }
        });
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }

    // Only run dashboard initialization if we're on the dashboard page
    const isDashboardPage = window.location.pathname.includes("dashboard");
    if (isDashboardPage) {
        initializeDashboard();
    }
});

async function initializeDashboard() {
    // Display logged-in username
    const username = localStorage.getItem("username");
    if (username) {
        document.getElementById("username").innerText = username;
    } else {
        window.location.href = "login.html"; // Redirect to login if user not authenticated
        return;
    }

    try {
        // Fetch dashboard data from backend
        const response = await fetch("http://localhost:5001/api/dashboard", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load data");
        }

        // Populate Research Projects
        const researchList = document.getElementById("research-list");
        if (researchList) {
            researchList.innerHTML = ""; // Clear old content
            data.researchProjects.forEach(project => {
                const li = document.createElement("li");
                li.textContent = `${project.title} - ${project.description}`;
                researchList.appendChild(li);
            });
        }

        // Populate Startups
        const startupList = document.getElementById("startup-list");
        if (startupList) {
            startupList.innerHTML = ""; // Clear old content
            data.startups.forEach(startup => {
                const li = document.createElement("li");
                li.textContent = `${startup.name} (${startup.industry}) - Funding: ${startup.funding}`;
                startupList.appendChild(li);
            });
        }

        // Populate Intellectual Property
        const iprList = document.getElementById("ipr-list");
        if (iprList) {
            iprList.innerHTML = ""; // Clear old content
            data.iprRecords.forEach(ipr => {
                const li = document.createElement("li");
                li.textContent = `${ipr.title} - Status: ${ipr.status}`;
                iprList.appendChild(li);
            });
        }

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }
}
