/**
 *  @module Task - компонент задача
*/
import React from "react";
import clsx from 'clsx';
import dayjs from 'dayjs';
import './Task.css';

function Task({task, getDoneTodo, deleteTodo}) {

    /** 
     * Определяем переменные - свойства объекта, к которым будем обращаться
    */
    const { title, deadline, file, link, done } = task.item;

    /** 
     * Получаем текущую дату
    */
    const currentDate = dayjs(new Date().toISOString().split('T')[0]);

    /** 
     * Функция, которая проверяет просрочено выполнение задачи или нет
    * @returns {boolean}
    */
    function getExpired() {
        const taskDeadline = dayjs(deadline);
        return taskDeadline.diff(currentDate, 'day') < 0 ? true : false;
    };

    return (
        <li className='task'>
       
        <div className={clsx('task__wrap', done && 'task_type_done', getExpired() && 'task_type_done')}>      
          <h2 className="task__title">{title}</h2>
          <p className="task__caption">
            Срок: {dayjs(deadline).format('DD.MM.YYYY')} г.
          </p>
          {file && (
            <>
              <p className="task__attachement">Прикрепленный файл: </p>
              <a className="task__attachement" href={link}>{file}</a>
            </>
          )}
        </div>

        {getExpired() && <p className="task_type_expired">Просрочено</p>}
        {done && <p className="task_type_done">Сделано</p>}

        <div className="task__wrap">
        { getExpired() ? 
          <button 
            className="task__done-btn_disabled" 
            type="disabled">Ой</button> 
          :
          <button 
            type='button' 
            className='task__done-btn'  
            onClick={() => getDoneTodo(task)}
          >Сделано</button>    
        }          
          <button
            className="task__delete-btn"
            onClick={() => deleteTodo(task)}
          >Удалить</button>
        </div>
      </li>
    )
}

export default Task;