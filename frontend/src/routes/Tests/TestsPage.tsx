import React from "react";
import { Link } from "react-router-dom";  // Импортируем Link для создания ссылок
import { useOutletContext } from "react-router-dom";
import styles from "./TestPage.module.scss";

export const TestsPage = () => {
  const { tests } = useOutletContext<{ tests: any[] }>(); // Получаем список тестов
  console.log("tests", tests);

  return (
    <div className={styles.container}>
      <h1>Tests Page</h1>
      <div className={styles.tests}>
        {tests?.length > 0
          ? tests.map((test, index) => (
            <div key={index}>
              {/* Создаем ссылку на страницу с подробностями теста */}
              <Link to={`/test/${test._id}`}>{test.name}</Link>
            </div>
          ))
          : "No tests found"}
      </div>

      {/* Добавляем кнопку для перехода на страницу добавления теста */}
      <div className={styles.addTestButton}>
        <Link to="/add-test">
          <button>Add New Test</button>
        </Link>
      </div>
    </div>
  );
};
