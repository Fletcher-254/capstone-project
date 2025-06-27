const apiBase = 'https://reqres.in/api/users';
const employeeList = document.getElementById('employeeList');
const totalCount = document.getElementById('totalCount');

document.getElementById('employeeForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const role = document.getElementById('roleInput').value;
  if (!name || !role) return;
  
  const response = await fetch(apiBase, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, job: role })
  });
  const resData = await response.json();
  fetchEmployees();
});

async function fetchEmployees() {
  const res = await fetch(`${apiBase}?per_page=12`);
  const data = await res.json();
  const employees = data.data;
  
  employeeList.innerHTML = '';
  employees.forEach(emp => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${emp.avatar}" alt="" />
      <div class="employee-info">
        <strong>${emp.first_name} ${emp.last_name}</strong><br>
        Role: ${emp.job || '--'}
      </div>
      <div class="actions">
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
    employeeList.appendChild(li);
  });
  
  totalCount.textContent = `Total Employees: ${employees.length}`;
}

async function deleteEmployee(id) {
  await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  fetchEmployees();
}

window.onload = fetchEmployees;
