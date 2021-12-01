const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const filePathTheme = path.join(process.cwd(), 'JSON', 'Info.json');
const themeText = JSON.parse(fs.readFileSync(filePathTheme, { encoding: 'utf-8' }));

const filePathTasks = path.join(process.cwd(), 'JSON', 'Tasks.json');
const tasksText = JSON.parse(fs.readFileSync(filePathTasks, { encoding: 'utf-8' }));

let userIndex = null;

const createThemes = () => {
  themeText.forEach(({name}, index) => {
    document.getElementById('chooseTheme').innerHTML += `<button class="btn" id="${name}">${name}</button>`;
  });
  themeText.forEach(({name}, index) => {
    document.getElementById(name).addEventListener('click', () => {
      console.log('index choosed: ', index);
      document.getElementById('showTheme').innerHTML = `
      <h1>${themeText[index].name}</h1>
      <p>${themeText[index].data}</p>
      `
    })
  });
  document.getElementById('showTheme').innerHTML = `
  <h1>${themeText[0].name}</h1>
  <p>${themeText[0].data}</p>
  `
}

ipcRenderer.on('successful login', (e, userNumber) => {
  userIndex = userNumber;
  console.log('index: ', userIndex);
  themeText.forEach(({name}, index) => {
    document.getElementById('chooseTheme').innerHTML += `<button class="btn" id="${name}">${name}</button>`;
  });
  themeText.forEach(({name}, index) => {
    document.getElementById(name).addEventListener('click', () => {
      console.log('index choosed: ', index);
      document.getElementById('showTheme').innerHTML = `
      <h1>${themeText[index].name}</h1>
      <p>${themeText[index].data}</p>
      `
    })
  });
  document.getElementById('showTheme').innerHTML = `
  <h1>${themeText[0].name}</h1>
  <p>${themeText[0].data}</p>
  `
});