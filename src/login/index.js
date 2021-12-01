const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const login = () => {
  const name = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log('name: ', name);
  console.log('password: ', password);
  const filePath = path.join(process.cwd(), 'JSON', 'Users.json');
  const text = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
  console.log('text: ', text);
  for (let i = 0; i < text.length; i++){
    if (text[i].name === name && text[i].password === password){
      ipcRenderer.send('successful login', i);
      break;
    }
  }
}

const signUp = () => {
  let name = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let amITeacher = document.getElementById('amITeacher').checked;
  console.log('name: ', name);
  console.log('password: ', password);
  console.log('amITeacher: ', amITeacher);
  const filePath = path.join(process.cwd(), 'JSON', 'Users.json');
  const text = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
  console.log('text: ', text);
  if(!amITeacher){
    let group = document.getElementById('group').value;
    console.log('group: ', group);
    text.push(
      {
          name,
          password,
          amITeacher,
          group
      });
  } else {
    text.push(
      {
          name,
          password,
          amITeacher
      });
  }
  fs.writeFile(filePath, JSON.stringify(text, null, 2), function (err) {
    if (err) throw err;
    console.log('User added!');
  });
  back();
}

const checkBoxTeacher = () => {
  let amITeacher = document.getElementById('amITeacher').checked;
  if(!amITeacher) {
    document.getElementById('groupDiv').innerHTML = `<input id="group" type="text" class="myInput" placeholder="Группа" title="Группа" />`
  } else {
    document.getElementById('groupDiv').innerHTML = ``
  }
}

const registration = () => {
  document.getElementsByClassName('mainContainer')[0].innerHTML = `
  <h1>Sign Up</h1>
  <input id="username" type="text" class="myInput" placeholder="Ім'я" title="Ім'я" />
  <input id="password" type="text" class="myInput" placeholder="Пароль" title="Пароль" />
  <div id="amITeacherDiv">
    <input type="checkbox" id="amITeacher" name="amITeacher" checked >
    <label for="amITeacher">Я вчитель</label>
  </div>
  <div id="groupDiv"></div>
  <div>
    <button id="backButton">Back</button>
    <button id="signUpButton">Sign Up</button>
  </div>
  `
  
document.getElementById('backButton').addEventListener('click', back);
document.getElementById('signUpButton').addEventListener('click', signUp);
document.getElementById('amITeacher').addEventListener('change', checkBoxTeacher);
}

const back = () => {
  document.getElementsByClassName('mainContainer')[0].innerHTML = `
  <h1>Sign In</h1>
  <input id="username" type="text" class="myInput" placeholder="Ім'я" title="Type in name" />
  <input id="password" type="text" class="myInput" placeholder="Пароль" title="Type in password" />
  <div>
    <button id="loginButton">Login</button>
    <button id="registrationButton">Registration</button>
  </div>
  `

  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('registrationButton').addEventListener('click', registration);
}

document.getElementById('loginButton').addEventListener('click', login);
document.getElementById('registrationButton').addEventListener('click', registration);
