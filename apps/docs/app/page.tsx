import styles from './page.module.css';
import {
  ToolkitDisplay,
  ToolkitSimulatorProvider,
} from './components/simulator';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ToolkitSimulatorProvider>
          <h2>Toolkit A</h2>
          <ToolkitDisplay />
          <h2>Toolkit B</h2>
          <ToolkitDisplay />
        </ToolkitSimulatorProvider>
      </main>
    </div>
  );
}
