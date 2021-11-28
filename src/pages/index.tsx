import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

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

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={commonStyles.container}>
      <img src="/images/logo.png" className={styles.logo} />

      <ul>
        {postsPagination.results.map(post => (
          <li className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`} passHref>
              <a>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfo}>
                  <span>
                    <FiCalendar /> {post.first_publication_date}
                  </span>
                  <span>
                    <FiUser /> {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      {postsPagination.next_page && (
        <button className={styles.button}>Carregar mais posts</button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    { pageSize: 5 }
  );

  const posts: Post[] = postsResponse.results.map(post => ({
    uid: post.uid,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
    first_publication_date: new Date(post.first_publication_date)
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/de|\./g, ' '),
  }));

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
