import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useEffect, useState } from 'react';

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
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPageURL, setNextPageURL] = useState(postsPagination.next_page);

  function formatDate(date: string) {
    return format(new Date(date), 'dd LLL yyyy', {
      locale: ptBR,
    });
  }

  async function getNextPage() {
    const response = await fetch(nextPageURL);
    const newData = await response.json();

    const newPosts: Post[] = newData.results.map(post => ({
      uid: post.uid,
      data: post.data,
      first_publication_date: post.first_publication_date,
    }));

    setPosts([...posts, ...newPosts]);
    setNextPageURL(newData.next_page);
  }

  return (
    <div className={commonStyles.container}>
      <img src="/images/logo.png" className={styles.logo} />

      <ul>
        {posts.map(post => (
          <li className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`} passHref>
              <a>
                <h2>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfo}>
                  <span>
                    <FiCalendar /> {formatDate(post.first_publication_date)}
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

      {nextPageURL && (
        <button className={styles.button} onClick={getNextPage}>
          Carregar mais posts
        </button>
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
    first_publication_date: post.first_publication_date,
  }));

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
