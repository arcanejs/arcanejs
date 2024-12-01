'use client';
import styles from './page.module.css';
import {
  ToolkitDisplay,
  ToolkitSimulatorProvider,
} from './components/simulator';
import { CORE_FRONTEND_COMPONENT_RENDERER } from '@arcanejs/toolkit-frontend';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ToolkitSimulatorProvider
          renderers={[CORE_FRONTEND_COMPONENT_RENDERER]}
        >
          <h2>Toolkit A</h2>
          <ToolkitDisplay />
          <h2>Toolkit B</h2>
          <ToolkitDisplay />
        </ToolkitSimulatorProvider>
      </main>
    </div>
  );
}
