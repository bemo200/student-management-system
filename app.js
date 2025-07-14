
const API_URL = 'http://localhost:3001/students';
const tbody = document.querySelector('#studentsTable tbody');
const modal = document.getElementById('modal');
const form = document.getElementById('studentForm');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancel');
const modalTitle = document.getElementById('modalTitle');
let editMode = false;

function fetchStudents(){
  fetch(API_URL)
    .then(res=>res.json())
    .then(data=>{
      tbody.innerHTML='';
      data.forEach((student,idx)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-3 py-2">${idx+1}</td>
          <td class="px-3 py-2">${student.code}</td>
          <td class="px-3 py-2">${student.name}</td>
          <td class="px-3 py-2">${student.email}</td>
          <td class="px-3 py-2">${student.phone}</td>
          <td class="px-3 py-2">${student.class}</td>
          <td class="px-3 py-2">${student.grade}%</td>
          <td class="px-3 py-2">${student.gender}</td>
          <td class="px-3 py-2">
            <span class="px-2 py-1 rounded ${student.status==='نشط'?'bg-green-600':student.status==='موقوف'?'bg-red-600':'bg-yellow-600'}">
              ${student.status}
            </span>
          </td>
          <td class="px-3 py-2">${student.created_at}</td>
          <td class="px-3 py-2">
            <button onclick="editStudent(${student.id})" class="text-emerald-400">✏️</button>
            <button onclick="deleteStudent(${student.id})" class="text-red-500">🗑️</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function openModal(){
  modal.classList.remove('hidden');
}

function closeModal(){
  modal.classList.add('hidden');
  form.reset();
  editMode=false;
}

addBtn.addEventListener('click', ()=>{openModal(); modalTitle.textContent='إضافة طالب';});

cancelBtn.addEventListener('click', closeModal);

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const student = {
    code: form.code.value,
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    class: form.class.value,
    grade: form.grade.value,
    gender: form.gender.value,
    status: form.status.value
  };

  if(editMode){
    fetch(API_URL+'/'+form.studentId.value, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(student)
    }).then(()=>{closeModal(); fetchStudents();});
  }else{
    fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(student)
    }).then(()=>{closeModal(); fetchStudents();});
  }
});

function editStudent(id){
  fetch(API_URL+'/'+id)
    .then(res=>res.json())
    .then(student=>{
      openModal();
      modalTitle.textContent='تعديل طالب';
      editMode=true;
      form.studentId.value=id;
      form.code.value=student.code;
      form.name.value=student.name;
      form.email.value=student.email;
      form.phone.value=student.phone;
      form.class.value=student.class;
      form.grade.value=student.grade;
      form.gender.value=student.gender;
      form.status.value=student.status;
    });
}

function deleteStudent(id){
  if(confirm('هل أنت متأكد من الحذف؟')){
    fetch(API_URL+'/'+id,{method:'DELETE'}).then(()=>fetchStudents());
  }
}

// search filter
document.getElementById('search').addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  Array.from(tbody.children).forEach(row=>{
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

fetchStudents();
