const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const filePathTheme = path.join(process.cwd(), 'JSON', 'Info.json');
const themeText = JSON.parse(fs.readFileSync(filePathTheme, { encoding: 'utf-8' }));
let index = '';

ipcRenderer.on('successful login', (e, index) => {
  index = index;
  console.log('index: ', index);
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
