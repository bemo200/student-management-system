// 👈 استبدل الرابط أدناه برابط قاعدة بيانات Firebase الخاصة بك
const DB_URL = 'https://YOUR_PROJECT.firebaseio.com';

const tbody = document.querySelector('#studentsTable tbody');
const modal = document.getElementById('modal');
const form  = document.getElementById('studentForm');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancel');
const modalTitle = document.getElementById('modalTitle');
let editMode   = false;
let studentKeys = [];

function fetchStudents(){
  fetch(DB_URL + '/students.json')
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = '';
      studentKeys = [];
      if(!data) return;
      Object.entries(data).forEach(([key, s], idx)=>{
        studentKeys.push(key);
        tbody.insertAdjacentHTML('beforeend', `
          <tr>
            <td class="px-3 py-2">${idx+1}</td>
            <td class="px-3 py-2">${s.name}</td>
            <td class="px-3 py-2">${s.email}</td>
            <td class="px-3 py-2">${s.phone}</td>
            <td class="px-3 py-2">${s.class}</td>
            <td class="px-3 py-2">${s.grade}%</td>
            <td class="px-3 py-2">
              <span class="px-2 py-1 rounded ${s.status==='نشط'?'bg-green-600':s.status==='موقوف'?'bg-red-600':'bg-yellow-600'}">${s.status}</span>
            </td>
            <td class="px-3 py-2">
              <button onclick="editStudent(${idx})"   class="text-emerald-400">✏️</button>
              <button onclick="deleteStudent(${idx})" class="text-red-500">🗑️</button>
            </td>
          </tr>`);
      });
    });
}

function openModal(){ modal.classList.remove('hidden'); }
function closeModal(){ modal.classList.add('hidden'); form.reset(); editMode=false; }

addBtn.addEventListener('click', ()=>{ openModal(); modalTitle.textContent='إضافة طالب'; });
cancelBtn.addEventListener('click', closeModal);

form.addEventListener('submit', e=>{
  e.preventDefault();
  const student = {
    name  : form.name.value,
    email : form.email.value,
    phone : form.phone.value,
    class : form.class.value,
    grade : form.grade.value,
    status: form.status.value
  };
  if(editMode){
    const key = studentKeys[form.studentId.value];
    fetch(`${DB_URL}/students/${key}.json`, {method:'PUT', body:JSON.stringify(student)})
      .then(()=>{closeModal(); fetchStudents();});
  }else{
    fetch(`${DB_URL}/students.json`, {method:'POST', body:JSON.stringify(student)})
      .then(()=>{closeModal(); fetchStudents();});
  }
});

function editStudent(i){
  const key = studentKeys[i];
  fetch(`${DB_URL}/students/${key}.json`)
    .then(r=>r.json())
    .then(s=>{
      openModal(); modalTitle.textContent='تعديل طالب'; editMode=true;
      form.studentId.value=i;
      Object.assign(form,{
        name:{value:s.name},email:{value:s.email},phone:{value:s.phone},
        class:{value:s.class},grade:{value:s.grade}});
      form.status.value=s.status;
    });
}

function deleteStudent(i){
  if(!confirm('حذف الطالب نهائيًا؟')) return;
  const key = studentKeys[i];
  fetch(`${DB_URL}/students/${key}.json`, {method:'DELETE'})
    .then(()=>fetchStudents());
}

document.getElementById('search').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  [...tbody.children].forEach(tr=>{
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

fetchStudents();


// تغيير الثيم (فاتح/داكن)
const themeBtn = document.getElementById('toggleTheme');
function applyTheme(theme){
  document.body.classList.toggle('bg-slate-900', theme === 'dark');
  document.body.classList.toggle('bg-white', theme === 'light');
  document.body.classList.toggle('text-white', theme === 'dark');
  document.body.classList.toggle('text-black', theme === 'light');
  themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

themeBtn?.addEventListener('click', ()=>{
  const current = localStorage.getItem('theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

window.addEventListener('load', ()=>{
  applyTheme(localStorage.getItem('theme') || 'dark');
});
