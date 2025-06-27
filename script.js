const roleRates = {
  engineer: 5000,
  casual: 900,
  driver: 1000,
  "site agent": 2500,
  supervisor: 3000
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
          <strong>${emp.name}</strong> (${emp.role})<br>
          ID: ${emp.idNumber}<br>
          Phone: ${emp.phone}<br>
          Days Worked: ${emp.daysWorked}<br>
          <span class="salary">Total Pay: KES ${totalPay}</span><br>
          <button class="delete" onclick="deleteEmployee(${emp.id})">Delete</button>
        `;
        list.appendChild(li);
      });

      totalPayDisplay.textContent = `Total Payroll: KES ${totalPayroll}`;
    });
}

function addEmployee() {
  const name = document.getElementById("nameInput").value.trim();
  const idNumber = document.getElementById("idInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const role = document.getElementById("roleInput").value;
  const days = parseInt(document.getElementById("daysInput").value);

  if (!name || isNaN(days) || !role || !idNumber || !phone || /\d/.test(name)) {
    alert("Please enter valid details. Name must contain only letters.");
    return;
  }

  fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      idNumber,
      phone,
      role,
      daysWorked: days
    })
  })
  .then(() => {
    document.getElementById("employeeForm").reset();
    fetchEmployees();
  });
}

function deleteEmployee(id) {
  fetch(`http://localhost:3000/employees/${id}`, {
    method: "DELETE",
  })
  .then(() => fetchEmployees());
}

window.onload = fetchEmployees;
