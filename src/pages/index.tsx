import { GetStaticProps } from 'next';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <img src="/images/logo.png" className={styles.logo} />

      <ul>
        <li className={styles.post}>
          <Link href="/" passHref>
            <a>
              <h2>Título do post</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

              <div className={styles.postInfo}>
                <span>
                  <FiCalendar /> 19 Abr 2021
                </span>
                <span>
                  <FiUser /> John Doe
                </span>
              </div>
            </a>
          </Link>
        </li>

        <li className={styles.post}>
          <Link href="/" passHref>
            <a>
              <h2>Título do post</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

              <div className={styles.postInfo}>
                <span>
                  <FiCalendar /> 19 Abr 2021
                </span>
                <span>
                  <FiUser /> John Doe
                </span>
              </div>
            </a>
          </Link>
        </li>

        <li className={styles.post}>
          <Link href="/" passHref>
            <a>
              <h2>Título do post</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

              <div className={styles.postInfo}>
                <span>
                  <FiCalendar /> 19 Abr 2021
                </span>
                <span>
                  <FiUser /> John Doe
                </span>
              </div>
            </a>
          </Link>
        </li>
      </ul>

      <button className={styles.button}>Carregar mais posts</button>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
