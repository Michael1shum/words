import React from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./TestPage.module.scss";

export const TestsPage = () => {
  const { tests } = useOutletContext<{ tests: any[] }>();

  return (
    <div className={styles.container}>
      <h1>Tests Page</h1>
      <div className={styles.tests}>
        {tests?.length > 0
          ? tests.map((test, index) => <div key={index}>{test.name}</div>)
          : "No tests found"}
      </div>
    </div>
  );
};
