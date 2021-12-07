const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const tasks = [
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 0,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  },
  {
    attempts: 3,
    score: 0
  }
];

const setUserCreated = (info) => {
  document.getElementById('userCreated').innerText = info;
}

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
  let isUserCreated = false;
  for (let i = 0; i < text.length; i++){
    if (text[i].name === name){
      isUserCreated = true;
      break;
    }
  }
  if(isUserCreated){
    setUserCreated('Пользователь с таким именем существует!');
  } else{
    if(!amITeacher){
      let group = document.getElementById('group').value;
      console.log('group: ', group);
      text.push(
        {
            name,
            password,
            amITeacher,
            group,
            tasks
        });
    } else {
      text.push(
        {
            name,
            password,
            amITeacher,
            tasks
        });
    }
    fs.writeFile(filePath, JSON.stringify(text, null, 2), function (err) {
      if (err) throw err;
      console.log('User added!');
    });
    back();
  }
}

const checkBoxTeacher = () => {
  let amITeacher = document.getElementById('amITeacher').checked;
  if(!amITeacher) {
    document.getElementById('groupDiv').style.display = 'block';
  } else {
    document.getElementById('groupDiv').style.display = 'none';
  }
}

const registration = () => {
  document.getElementsByClassName('mainContainer')[0].innerHTML = `
  <h1>Регистрация</h1>
  <input id="username" type="text" class="myInput" placeholder="Имя" title="Имя" />
  <input id="password" type="text" class="myInput" placeholder="Пароль" title="Пароль" />
  <input style="display: none" id="groupDiv" id="password" type="text" class="myInput" placeholder="Група" title="Група"></input>
  <div id="amITeacherDiv">
    <input type="checkbox" id="amITeacher" name="amITeacher" checked >
    <label for="amITeacher">Я учитель</label>
  </div>
  <div class="btn-container">
    <button class="btn" id="backButton">Вход</button>
    <button class="btn" id="signUpButton">Зарегистрироваться</button>
  </div>
  <div id="userCreated"></div>
  `
  
document.getElementById('backButton').addEventListener('click', back);
document.getElementById('signUpButton').addEventListener('click', signUp);
document.getElementById('amITeacher').addEventListener('change', checkBoxTeacher);
}

const back = () => {
  document.getElementsByClassName('mainContainer')[0].innerHTML = `
  <h1>Вход</h1>
  <input id="username" type="text" class="myInput" placeholder="Имя" title="Имя" />
  <input id="password" type="text" class="myInput" placeholder="Пароль" title="Пароль" />
  <div class="btn-container">
    <button class="btn" id="loginButton">Войти</button>
    <button class="btn" id="registrationButton">Регистрация</button>
  </div>
  `

  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('registrationButton').addEventListener('click', registration);
}

document.getElementById('loginButton').addEventListener('click', login);
document.getElementById('registrationButton').addEventListener('click', registration);
