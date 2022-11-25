/**
 *  @module App 
*/
import React from 'react';
import './App.css';
import Task from './component/Task';
import {db} from './utils/config';

import {
  doc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,  
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';


function App() {

/** 
 * Определяем стейт-переменные 
*/
const [task, setTask] = React.useState([]);
const [inputValue, setInputValue] = React.useState('');
const [file, setFile] = React.useState('');
const [deadline, setDeadline] =React.useState('');

/**
 * Получаем доступ к хранилищу файлов 
*/
const storage = getStorage();

/**
 * Получаем доступ к инпуту добавления файла 
*/
const downloadedFileRef = React.useRef('');

/**
 * Обновляем список задач 
*/
const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));
React.useEffect(() => { 
   onSnapshot(q, (snapshot) => {
    setTask(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        item: doc.data(),
      })),
    );
  });
}, [inputValue]);

/**
 * Функция - запрос на добавление новой задачи
 * @param {string} title - Описание задачи
 * @param {string} deadline - Срок исполнения
 * @param {string} file - Имя файла
 * @param {string} link - Ссылка на скачивание прикрепленного файла.
 * @param {boolean} isDone - статус выполнения задачи. По умолчанию выставлен false (== не выполнено).
*/
function getTodo(title, deadline, file = '', link = '', done = false) {
  addDoc(collection(db, 'todos'), {
    title,
    deadline,    
    file,
    link,
    done,
    timestamp: serverTimestamp(),
  });
}

/**
 * Функция добавления задачи 
*/
function addTodo(e) {
  e.preventDefault();
  if (file) {
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      function (snapshot) {},
      function (error) {
        console.error(error);
      },
      function () {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          getTodo(inputValue, deadline, file.name, downloadURL),
        );
      },
    );
  } else {
    getTodo(inputValue, deadline);
  }
  setInputValue('');
  setDeadline('');
  setFile('');
  downloadedFileRef.current.value = '';
}

/**Функция удаления задачи 
 * @param {object} task - задача
 * @property {string} id - идентификатор задачи
 * @property {object} item - объект задачи
*/
function deleteTodo(task) {
  deleteDoc(doc(db, 'todos', task.id));
  if (task.item.file) {
    const storageRef = ref(storage, `/files/${task.item.file}`);
    deleteObject(storageRef).catch((error) => {
      console.error(error);
    });
  }
}

/**
 * Функция смена статуса задачи (выполнена/не выполнена) 
 * @param {object} task - задача
 * @property {string} id - идентификатор задачи
 * @property {object} item - объект задачи
*/
function getDoneTodo(task) {
  const done = task.item.done;
  updateDoc(doc(db, 'todos', task.id), {
    done: done ? false : true,
  });
}

/**
 * Обработчики полей добавления задачи 
*/
function handleAddTask(e) {
  setInputValue(e.target.value);
}

function handleAddFile(e) {
  setFile(e.target.files[0])
}

function handleDate(e) {
  setDeadline(e.target.value);
}

  return (
    <div className="App">
      <div className='App-wrap'>
        <header className="App-header">
          <h1 className='header'>ToDo</h1>
        </header>
        <main className='main'>
          <form 
            className="form"
            onSubmit={addTodo}
            >            
                <input
                  className="form__input_type_task"
                  type="text"
                  placeholder="Напишите что-нибудь"
                  value={inputValue}
                  onChange={handleAddTask}
                />
              <div className='form__wrap'> 
                <label htmlFor='file' className="form__input_type_label">
                  Выберите файл
                  <input
                    name="file"
                    className="form__input_type_file"
                    type="file"
                    ref={downloadedFileRef}
                    onChange={handleAddFile}
                  />            
                </label>
                <label className="form__input_type_label">
                    Срок выполнения:
                    <input
                      className="form__input_type_deadline"
                      type="date"
                      value={deadline}
                      onChange={handleDate}
                      required
                    />
                  </label>
                </div>   
              <button className="form__button" type="submit">
                Запланировать
              </button>
          </form>
          <ul className="list">
           {task.map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        getDoneTodo={getDoneTodo}
                        deleteTodo={deleteTodo}
                    />
                )
            )}
        </ul>        
        </main>
      </div>
    </div>
  );
}

export default App;
