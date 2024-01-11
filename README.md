# Elice Home Assignment Test
# Project name: Code Editor with Zip File Handling project


## Total effort time spent

| Feature  | Effort (man/day) |
| ------------- |:-------------:|
| Building UI and base structure | 1 day    |
| Coding logic of parsing zip and zip file | 4 days  |
| Coding monaco editor integration | 1 days  |
| Write test & documentation | 1 day  |

## Main features
1. User can upload a zip file then contents inside the zip file are unzipped and displayed as a tree on the left side.

2. User can see the content of the file after clicking on the file name. Supporting multiple tabs for displaying multiple files at the same time.

3. User can edit the content of the file if this file is editable. If the file is an image, user can see the image displayed directly on the screen. The current types of image supported: png | jpeg | jpg

4. User can download the file after editing as a zip file to the local machine.

5. Supported syntax highlighting for the following file extensions: html, css, javascript, typescript, json.

6. Covered basic Unit testing using Jest and E2E testing using Cypress. 

### [Watch the Video Demo](https://drive.google.com/file/d/1_95R2NbeQ6VXCEFAK-RdcjTGb5T4GmBl/view?usp=sharing)

## Techstack
1. Reactjs
2. Typescript
3. Styled comoponent (css)
4. Monaco editor
5. Jest (unit test)
6. Cypres (E2E test)


## Available Scripts

In the project directory, you can run:

1. ### `npm install` : Install all dependencies


2. ### `npm start`: Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



3. ### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## How to run unit test with JEST

In command, you can run test with:

### `npm test` or `yarn test`

- In command will show you result of test

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## How to run E2E test with Cypress

In command, you can run test with:

### `npx cypress open`, cypress will be automatically opened

- Step 1: At the pop-up window, select E2E testing

- Step 2: The config files appear, select Continue

- Step 3: Choose your preferred browser for E2E testing and click button "Start E2E"

- Step 4: Make sure your domain matches the one on the local server

- Step 5: If there are no test cases yet, click on "Create new empty spec"

- Step 6: Enter the name of the case you want to test and click "Create Spec"

- Step 7: Finally, choose "Okay, run the spec", file test will be run

- Step 8: You can write more test-cases in "cypress/e2e"

## Zip File Handling

All of files related to **Zip File Handling** are in [Zip](src/utility/zip) folder

### `constants.ts`

- **Description:** Defines constants used throughout the project related to ZIP file structure, signatures, compression methods, and more.

### `utils.ts`

- **Description:** Provides utility functions, including determining MIME types, concatenating Uint8Arrays, creating and downloading files, converting numbers to bytes, and retrieving timestamps.

### `types.ts`

- **Description:** Defines TypeScript interfaces used in the project, primarily focusing on the file tree structure and ZIP entry specifications.

### `zip-reader.ts` <i>Highlighted feature</i>

- **Description:** Implements the `ZipReader` class responsible for reading ZIP files. It utilizes the FileReader API and pako library for decompression.

### `zip-writer.ts` <i>Highlighted feature</i>

- **Description:** Implements the `ZipWriter` class for creating ZIP files. It includes methods for adding files, generating ZIP content, and writing the archive to a file.

### `index.ts`

- **Description:** Serves as the entry point for ZIP-related functionality, exporting the `ZipReader` and `ZipWriter` classes for external use.

## How to Use

```typescript
import { ZipReader } from '.utility/zip';
import { ZipWriter } from '.utility/zip';

const readZipFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const zipFile = event.target.files[0];
    const zipReader = new ZipReader();
    const fileTree = await zipReader.readZipFile(zipFile);
    // more
  }
};

const exportZipFile = () => {
  // interface IFileTree {
  //     [key: string]: IFileTree | {
  //         content: string | Uint8Array,
  //         blob?: string
  //     }
  // }
  const fileTree: IFileTree = {}; // TODO
  if (Object.keys(fileTree).length > 0) {
    const zipWriter = new ZipWriter('export.zip');
    zipWriter.generateFromFileTree(fileTree);
  } else {
    // more
  }
};
```

## Monaco Editor

The Monaco Editor is a powerful, web-based code editor that powers Visual Studio Code. It offers a rich-text editing experience embedded directly in web pages, providing features such as syntax highlighting, intelligent code completion, and advanced editing capabilities. This editor is designed for high performance and is highly customizable, making it suitable for a wide range of programming and scripting tasks. The Monaco Editor supports numerous programming languages and file formats, ensuring a versatile and developer-friendly environment.

### `monaco-editor`

Included in `package.json`, `monaco-editor` brings a sophisticated coding experience to our web application, offering features like syntax highlighting and advanced editing capabilities right in the browser.

### `craco`

Our project includes <b>craco</b> as a key dependency in <b>package.json</b>. It provides an efficient way to customize Create React App's configurations without ejecting. craco allows us to modify build configurations, add plugins, and tailor various settings, enhancing our development process and build workflow.

### `monaco-editor-webpack-plugin`

Also listed in our <b>package.json</b> is the <b>monaco-editor-webpack-plugin</b>. This plugin is integral for integrating the Monaco Editor with our Webpack setup. It manages the editor's inclusion in our Webpack bundle, ensuring optimal packaging and performance. The plugin streamlines the process of working with the Monaco Editor's assets and configurations, making it a vital part of our web application's development.

### `craco.config.js`

In <b>craco.config.js</b>, we use the <b>MonacoWebpackPlugin</b> from the <b>monaco-editor-webpack-plugin</b> package. This plugin is configured to include support for multiple programming languages such as JavaScript, TypeScript, CSS, HTML, and JSON. By specifying these languages, we ensure that the Monaco Editor is tailored to our application's specific needs, providing a rich coding experience with appropriate syntax highlighting and features for these languages.

### `src/compnents/MonacoEditr/index.tsx`

The <b>MonacoEditor</b> component integrates the <b>Monaco Editor</b> into our React application, providing a feature-rich coding environment. It accepts props for code content, programming language, editor theme, the selected tab, and a handler function for specific actions like content processing. This component uses React's useEffect and useRef hooks for efficient editor instance management and rendering within a designated DOM element. A notable feature is the download icon, enabling users to interact with the editor's content based on the current tab selection.


