const fs = require('fs');

/**
 * 디렉토리 세팅 : 생성할 디렉토리 경로 (루트 기준)
 */
const arrDirectory = [
  'src/components/ui/Button',
  'src/components/Splash',
  'src/components/Header',
  'src/components/Footer',
  'src/pages/loginPage/Start',
  'src/pages/loginPage/Login',
  'src/pages/loginPage/Join',
  'src/pages/loginPage/Profile',
  'src/pages/mainPage/Home',
  'src/pages/mainPage/Search',
  'src/pages/mainPage/ChatList',
  'src/pages/mainPage/ChatRoom',
  'src/pages/mainPage/Post',
  'src/pages/mainPage/Posting',
  'src/pages/mainPage/ProfilePage/Profile',
  'src/pages/mainPage/ProfilePage/ProfileEdit',
  'src/pages/mainPage/ProfilePage/Followers',
  'src/pages/mainPage/ProfilePage/Following',
  'src/pages/NotFoundPage',
];

/**
 * 옵션
 * importCss : CSS import 여부
 */
const options = {
  importCss: 'styled-component', // css, styled-component, null
};

/**
 * 파스칼 케이스를 카멜 케이스로 변환
 * @param {string} str 파스칼 케이스 문자
 * @returns {string} 카멜 케이스 문자
 */
const pascalToCamel = str => {
  return str[0].toLowerCase() + str.slice(1);
};

/**
 * const 컴포넌트 템플릿
 * @param {string} title
 * @returns {string}
 */
const constComponent = title => `import React from 'react';
${importStyle(title)}

const ${title} = () => {
    return <p>${title}</p>;
};

export default ${title};
`;

/**
 * function 컴포넌트 템플릿
 * @param {string} title
 * @returns {string}
 */
const functionComponent = title => `import React from 'react';
${importStyle(title)}

export default function ${title}() {
    return (
        <div>
            ${title}
        </div>
    );
}
`;

/**
 * Styled-Components 템플릿
 * @param {string} title
 * @returns {string}
 */
const styledComponent = title => `import styled from 'styled-components';

export const ${title}Wrapper = styled.div\`\`;
`;

/**
 * CSS 템플릿
 * @param {string} title
 * @returns {string}
 */
const cssComponent = title => ``;

/**
 * import Style
 * @param {string} title
 * @returns
 */
const importStyle = title => {
  const pascalTitle = pascalToCamel(title);
  switch (options.importCss) {
    case 'css':
      return `import './${pascalTitle}.css'`;

    case 'styled-component':
      return `import {${title}Wrapper} from './styled.jsx'`;

    default:
      break;
  }
};

/**
 * 파일 생성
 * @param {string} dir 파일을 생성할 디렉토리
 * @param {string} file 구분 기호를 포함하는 파일 이름 확장명
 * @param {string} content 파일의 내용 (템플릿)
 */
const createFile = (dir, file, content) => {
  fs.writeFile(
    `${dir}/${file}`,
    content,
    {
      flag: 'ax',
    },
    err => {
      if (err === null) {
        console.log(`${file} file successfully saved`);
      } else if (err.code === 'EEXIST') {
        console.log('File already exists');
      }
    }
  );
};

/**
 * 디렉토리 생성 및 템플릿 파일 생성
 * @param {string} path 새로 생성할 디렉토리 경로
 */
const createDirectory = path => {
  path.split('/').reduce((directories, directory) => {
    const category = directories;
    const pascalTitle = pascalToCamel(directory);

    directories += `${directory}/`;

    if (!fs.existsSync(directories)) {
      fs.mkdirSync(directories);
    }

    // components 와 pages 하위 경로에 템플릿 생성
    if (category.includes('components') || category.includes('pages')) {
      createFile(directories, `styled.jsx`, styledComponent(directory));
      createFile(directories, `${directory}.jsx`, constComponent(directory));
    }

    return directories;
  }, '');
};

arrDirectory.forEach(item => createDirectory(item));
