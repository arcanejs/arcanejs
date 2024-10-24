"use client";
import styles from './page.module.css';
import { SimulatorExampleDynamic } from './components/simulator-example';


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SimulatorExampleDynamic />
      </main>
    </div>
  );
}
