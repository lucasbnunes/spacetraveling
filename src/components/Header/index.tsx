import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <Link href="/" passHref>
      <a>
        <header className={styles.header}>
          <img src="/images/logo.png" alt="logo" />
        </header>
      </a>
    </Link>
  );
}
