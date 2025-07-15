
const DB_URL = 'https://edarattalaba-default-rtdb.firebaseio.com';

const tbody = document.querySelector('#studentsTable tbody');
const modal = document.getElementById('modal');
const form  = document.querySelector('.modal-box form');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancel');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

let editMode=false;
let studentKeys=[];

function showToast(msg){
  toastMsg.textContent=msg;
  toast.classList.remove('hidden');
  setTimeout(()=>toast.classList.add('hidden'),2000);
}

function fetchStudents(){
  fetch(DB_URL+'/students.json')
    .then(r=>r.json())
    .then(data=>{
      tbody.innerHTML='';
      studentKeys=[];
      if(!data) return;
      Object.entries(data).forEach(([key,s],idx)=>{
        studentKeys.push(key);
        tbody.insertAdjacentHTML('beforeend',`
          <tr>
            <td>${idx+1}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.phone}</td>
            <td>${s.class}</td>
            <td>${s.grade}%</td>
            <td>
              <span class="badge ${s.status==='نشط'?'badge-success':s.status==='موقوف'?'badge-error':'badge-warning'}">${s.status}</span>
            </td>
            <td>
              <button onclick="editStudent(${idx})" class="btn btn-xs btn-info">تعديل</button>
              <button onclick="deleteStudent(${idx})" class="btn btn-xs btn-error">حذف</button>
            </td>
          </tr>`);
      });
    });
}

addBtn.addEventListener('click',()=>{
  form.reset(); editMode=false; modalTitle.textContent='إضافة طالب';
  modal.showModal();
});
cancelBtn.addEventListener('click',()=>modal.close());

form.addEventListener('submit',e=>{
  e.preventDefault();
  const student={
    name:form.name.value,email:form.email.value,phone:form.phone.value,
    class:form.class.value,grade:form.grade.value,status:form.status.value
  };
  if(editMode){
    const key=studentKeys[form.studentId.value];
    fetch(DB_URL+'/students/'+key+'.json',{method:'PUT',body:JSON.stringify(student)})
      .then(()=>{modal.close();fetchStudents();showToast('تم التعديل');});
  }else{
    fetch(DB_URL+'/students.json',{method:'POST',body:JSON.stringify(student)})
      .then(()=>{modal.close();fetchStudents();showToast('تمت الإضافة');});
  }
});

function editStudent(i){
  const key=studentKeys[i];
  fetch(DB_URL+'/students/'+key+'.json')
    .then(r=>r.json())
    .then(s=>{
      editMode=true; modalTitle.textContent='تعديل طالب';
      form.studentId.value=i;
      form.name.value=s.name;
      form.email.value=s.email;
      form.phone.value=s.phone;
      form.class.value=s.class;
      form.grade.value=s.grade;
      form.status.value=s.status;
      modal.showModal();
    });
}

function deleteStudent(i){
  if(!confirm('حذف الطالب؟')) return;
  const key=studentKeys[i];
  fetch(DB_URL+'/students/'+key+'.json',{method:'DELETE'})
    .then(()=>{fetchStudents();showToast('تم الحذف');});
}

// search
document.getElementById('search').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  [...tbody.children].forEach(tr=>{
    tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none';
  });
});

// theme toggle
const themeBtn=document.getElementById('toggleTheme');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'cupcake');
  themeBtn.checked=t==='light';
  localStorage.setItem('theme',t);
}
themeBtn.addEventListener('change',()=>applyTheme(themeBtn.checked?'light':'dark'));
applyTheme(localStorage.getItem('theme')||'dark');

fetchStudents();
