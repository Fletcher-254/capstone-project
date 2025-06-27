const roleRates = {
  engineer: 5000,
  supervisor: 3000,
  siteagent: 2500,
  driver: 1000,
  casual: 900,
};

document.getElementById("employeeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addEmployee();
});

function fetchEmployees() {
  fetch("http://localhost:3000/employees")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("employeeList");
      const totalPayDisplay = document.getElementById("totalPay");
      list.innerHTML = "";
      let totalPayroll = 0;

      data.forEach(emp => {
        const dailyRate = roleRates[emp.role.toLowerCase()] || 0;
        const totalPay = emp.daysWorked * dailyRate;
        totalPayroll += totalPay;

        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${emp.name}</strong><br>
          Role: ${emp.role}<br>
          ID Number: ${emp.idNumber}<br>
          Phone: ${emp.phone}<br>
          Days Worked: ${emp.daysWorked}<br>
          <span class="salary">Total Pay: KES ${totalPay}</span>
          <div class="actions">
            <button class="delete" onclick="deleteEmployee('${emp.id}')">Delete</button>

          </div>
        `;
        list.appendChild(li);
      });

      totalPayDisplay.textContent = `Total Payroll: KES ${totalPayroll}`;
    });
}

function addEmployee() {
  const name = document.getElementById("nameInput").value.trim();
  const role = document.getElementById("roleInput").value;
  const idNumber = document.getElementById("idNumberInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const daysWorked = parseInt(document.getElementById("daysInput").value);

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    alert("Name must only contain letters.");
    return;
  }

  if (!name || !role || !idNumber || !phone || isNaN(daysWorked)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      role,
      idNumber,
      phone,
      daysWorked,
    }),
  }).then(() => {
    document.getElementById("employeeForm").reset();
    fetchEmployees();
  });
}

function deleteEmployee(id) {
  fetch(`http://localhost:3000/employees/${id}`, {
    method: "DELETE",
  })
    .then(() => fetchEmployees())
    .catch(error => console.error("Delete failed:", error));
}

window.onload = fetchEmployees;
