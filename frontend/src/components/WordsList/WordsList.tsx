import { WordsFields } from 'App/types';
import styles from './WordsList.module.scss';
import React, { FC } from 'react';

interface WordListProps {
  data: WordsFields[];
}
export const WordList: FC<WordListProps> = ({ data }) => {
  const words = data.map((item) => item.word);
  const translations = data.map((item) => item.translation);

  return (
    <section className={styles.listWrapper}>
      <div className={styles.wordsWrapper}>
        {words.map((word) => (
          <div className={styles.entity} key={word}>
            {word}
          </div>
        ))}
      </div>

      <div className={styles.wordsWrapper}>
        {translations.map((translation) => (
          <div className={styles.entity} key={translation}>
            {translation}
          </div>
        ))}
      </div>
    </section>
  );
};
