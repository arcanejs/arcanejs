import Image from "next/image";
import styles from "./page.module.css";
import { diffJson } from "@arcanejs/diff";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        Hello World
        {JSON.stringify(diffJson({ a: "456" }, { a: "654" }))}
      </main>
    </div>
  );
}
