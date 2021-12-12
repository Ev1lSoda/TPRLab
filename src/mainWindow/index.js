const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const filePathTheme = path.join(process.cwd(), 'JSON', 'Info.json');
let themeText = JSON.parse(fs.readFileSync(filePathTheme, { encoding: 'utf-8' }));

const filePathTasks = path.join(process.cwd(), 'JSON', 'Tasks.json');
let tasksText = JSON.parse(fs.readFileSync(filePathTasks, { encoding: 'utf-8' }));

const filePathUsers = path.join(process.cwd(), 'JSON', 'Users.json');
let users = JSON.parse(fs.readFileSync(filePathUsers, { encoding: 'utf-8' }));

let userIndex = null;
let taskIndex = 0;

const showStats = () => {
  document.getElementById('stats-container').style.display = 'flex';
  console.log('showStats-taskIndex: ', taskIndex);
  console.log(users[userIndex].tasks[taskIndex]);
  let totalScore = 0;
  for (let i = 0; i < users[userIndex].tasks.length; i++){
    totalScore += users[userIndex].tasks[i].score;
  }
  document.getElementById('stats_attempts').innerText = `Количество попыткок: ${users[userIndex].tasks[taskIndex].attempts}`;
  document.getElementById('stats_score').innerText = `Ваш бал: ${totalScore}\/9`;
}

const badEnd = () => {
  users[userIndex].tasks[taskIndex].attempts -= 1;
  document.getElementById(`checkbtn${taskIndex}div`).style.display = 'none';
  document.getElementById(`taskBody${taskIndex}`).innerHTML = tasksText[taskIndex].answers.wrong;
  fs.writeFile(filePathUsers, JSON.stringify(users, null, 2), function (err) {
    if (err) throw err;
  });
  showStats();
}

const goodEnd = () => {
  users[userIndex].tasks[taskIndex].attempts--;
  users[userIndex].tasks[taskIndex].score = 1;
  document.getElementById(`checkbtn${taskIndex}div`).style.display = 'none';
  document.getElementById(`taskBody${taskIndex}`).innerHTML = tasksText[taskIndex].answers.right;
  fs.writeFile(filePathUsers, JSON.stringify(users, null, 2), function (err) {
    if (err) throw err;
  });
  showStats();
}

const checkAnswersOne = () => {
  const answers = document.getElementsByClassName('input-answer');
  for (let i = 0; i < answers.length; i++){
    if (answers[i].value != tasksText[taskIndex].questions[i].answer) {
      badEnd();
      return null;
    }
  }
  goodEnd();
}

const startTask = () => {
  console.log("START TASK INDEX: ", taskIndex);
  const myDocument = document;
  document.getElementById(`taskbtn${taskIndex}div`).style.display = 'none';
  document.getElementById(`taskBody${taskIndex}`).style.display = 'block';
  document.getElementById(`checkbtn${taskIndex}div`).style.display = 'block';
  // document.getElementById(`taskBody${taskIndex}`).innerText = JSON.stringify(tasksText[taskIndex], null, 2);
  let taskBody = ``;
  if (tasksText[taskIndex].title === 'Тест № 6') {
    taskBody += `
      <p>${tasksText[taskIndex].questions[0].question}</p>
      <input type="checkbox" id="input-answer" name="answer" />
      <label for="answer">Да</label>
      `;
    document.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
    myDocument.getElementById(`checkbtn${taskIndex}`).addEventListener('click', () => {
      if(myDocument.getElementById('input-answer').checked){
        goodEnd();
      } else {
        badEnd;
      }
    });
  }
  else if(tasksText[taskIndex].taskType === 1) {
    myDocument.getElementById(`checkbtn${taskIndex}`).addEventListener('click', checkAnswersOne);
    console.log('tasksText[taskIndex].questions: ', tasksText[taskIndex].questions);
    for (let i = 0; i < tasksText[taskIndex].questions.length; i++){
      taskBody += `
      <p>${tasksText[taskIndex].questions[i].question}</p>
      <input class="input-answer" />
      `;
    }
    document.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
  } else if(tasksText[taskIndex].taskType === 2) {
    myDocument.getElementById(`checkbtn${taskIndex}div`).style.display = 'none';
    taskBody += `
    <p>Колчество состояний природы 2.</p>
    <p>Введите количество виборов: </p>
    <input class="input-answer" />
    <div style='margin-top:30px;width:100%' class="btn__container"><button class="task__btn" id="getKV">Подтвердить</button></div>
    `;
    myDocument.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
    myDocument.getElementById(`getKV`).addEventListener('click', () => {
    const KV = document.getElementsByClassName('input-answer')[0].value;
      if (KV > 0){
          taskBody = '<p>Введите Матрицу позености: </p>';
          for(let i = 0; i < KV; i++){
            taskBody += '<p> ';
            for(let f = 0; f < 2; f++){
              taskBody += `
              <input class="input-answer" />
              `;
            }
            taskBody += ' </p>';
          }
          taskBody += `<div style='margin-top:30px;width:100%' class="btn__container"><button class="task__btn" id="getMP">Подтвердить</button></div>`;
          myDocument.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
          myDocument.getElementById(`getMP`).addEventListener('click', () => {
            const MP = document.getElementsByClassName('input-answer');
            let biggestValue = 0;
            let myMatrix = [];
            for (let i = 0; i < MP.length; i++){
              // console.log(i, 'MP_value: ', MP[i].value);
              if(isNaN(Number(MP[i].value))) badEnd();
              if(MP[i].value > biggestValue) biggestValue = MP[i].value;
            }
            for (let i = 0; i < MP.length; i++){
              myMatrix[i] = biggestValue - MP[i].value;
            }
            taskBody = '<p>Введите Матрицу потерь: </p>';
            for(let i = 0; i < KV; i++){
              taskBody += '<p> ';
              for(let f = 0; f < 2; f++){
                taskBody += `
                <input class="input-answer" />
                `;
              }
              taskBody += ' </p>';
            }
            taskBody += `<div style='margin-top:30px;width:100%' class="btn__container"><button class="task__btn" id="getMP2">Подтвердить</button></div>`;
            myDocument.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
            myDocument.getElementById(`getMP2`).addEventListener('click', () => {
              const MP2 = document.getElementsByClassName('input-answer');
              for (let i = 0; i < MP2.length; i++){
              console.log('MP[i].value: ', MP2[i].value);
              console.log('myMatrix[i]: ', myMatrix[i]);
              console.log('typeof(MP[i].value): ', typeof(MP[i].value));

                if(isNaN(Number(MP2[i].value)) || MP2[i].value != myMatrix[i]) {
                  badEnd();
                  return null;
                }
              }
              goodEnd();
            });
          });
      } else badEnd();
    });
  }
  // myDocument.getElementById(`taskBody${taskIndex}`).innerHTML = taskBody;
}

const createThemes = () => {
  document.getElementById('stats-container').style.display = 'none';
  document.getElementById('chooseTheme').innerHTML = '';
  themeText.forEach(({name}) => {
    document.getElementById('chooseTheme').innerHTML += `<button class="choose-btn" id="${name}">${name}</button>`;
  });
  themeText.forEach(({name}, index) => {
    document.getElementById(name).addEventListener('click', () => {
      console.log('index choosed: ', index);
      document.getElementById('showTheme').innerHTML = `
      <h1>${themeText[index].name}</h1>
      <p>${themeText[index].data}</p>
      `;
    })
  });
  document.getElementById('showTheme').innerHTML = `
  <h1>${themeText[0].name}</h1>
  <p>${themeText[0].data}</p>
  `;
}

const createTasks = () => {
  const myDocument = document;
  document.getElementById('chooseTheme').innerHTML = '';
  tasksText.forEach(({title}) => {
    document.getElementById('chooseTheme').innerHTML += `<button class="choose-btn" id="${title}">${title}</button>`;
  });
  tasksText.forEach(({title}, index) => {
    document.getElementById(title).addEventListener('click', () => {
    taskIndex = index;
    console.log('taskIndex: ', taskIndex);
    console.log('users[userIndex].tasks[taskIndex]: ', users[userIndex].tasks[taskIndex]);
      if (users[userIndex].tasks[taskIndex].attempts === 0){
        document.getElementById('showTheme').innerHTML = '<h1>У вас закончились попытки.</h1>';
        showStats();
      } else {
      document.getElementById('showTheme').innerHTML = `
      <h1>${tasksText[index].title}</h1>
      <p>${tasksText[index].task}</p>
      <div id="taskbtn${index}div" class="btn__container"><button class="task__btn" id="taskbtn${index}">Начать решать</button></div>
      <div style="display: none" id="taskBody${index}"></div>
      <div style="display: none" class="btn__container" id="checkbtn${index}div"><button class="task__btn" id="checkbtn${index}">Проверить решение</button></div>
      `
      myDocument.getElementById(`taskbtn${index}`).addEventListener('click', startTask);
      showStats();
      }
    })
  });
  console.log('users: ', users);
  console.log('users[userIndex]: ', users[userIndex]);
  console.log('users[userIndex].tasks: ', users[userIndex].tasks);
  if (users[userIndex].tasks[0].attempts === 0){
    document.getElementById('showTheme').innerHTML = '<h1>У вас закончились попытки.</h1>';
    showStats();
  } else {
  document.getElementById('showTheme').innerHTML = `
  <h1>${tasksText[0].title}</h1>
  <p>${tasksText[0].task}</p>
  <div id="taskbtn${0}div" class="btn__container"><button class="task__btn" id="taskbtn${0}">Начать решать</button></div>
  <div style="display: none" id="taskBody${0}"></div>
  <div style="display: none" class="btn__container" id="checkbtn${0}div"><button class="task__btn" id="checkbtn${0}">Проверить решение</button></div>
  `
  taskIndex = 0;
  myDocument.getElementById(`taskbtn${0}`).addEventListener('click', startTask);
  showStats();
  }
}

document.getElementById('theory-btn').addEventListener('click', createThemes);
document.getElementById('task-btn').addEventListener('click', createTasks);

ipcRenderer.on('successful login', (e, userNumber) => {
  users = JSON.parse(fs.readFileSync(filePathUsers, { encoding: 'utf-8' }));
  
  userIndex = userNumber;
  console.log('index: ', userIndex);
  createThemes();
});
