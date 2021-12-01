import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
  uid: string;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <Header />
        <span>Carregando...</span>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post);

  function calculateReadingTime(post: Post) {
    const totalWords = post.data.content.reduce((acc, curr) => {
      const wordsHeading = curr.heading.split(' ');
      const wordsBody = curr.body.reduce((acc, curr) => {
        const words = curr.text.split(' ');

        return acc + words.length;
      }, 0);

      return (acc += wordsHeading.length + wordsBody);
    }, 0);

    return Math.ceil(totalWords / 200);
  }

  return (
    <>
      <Header />

      <img src={post.data.banner.url} className={styles.banner} />

      <div className={`${commonStyles.container} ${styles.post}`}>
        <h1>{post.data.title}</h1>

        <div className={styles.postInfo}>
          <span>
            <FiCalendar />
            {format(new Date(post.first_publication_date), 'dd LLL yyyy', {
              locale: ptBR,
            })}
          </span>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <span>
            <FiClock />
            {readingTime} min
          </span>
        </div>

        {post.data.content.map(content => (
          <div
            key={content.heading.replace(/\s+/g, '')}
            className={styles.content}
          >
            <h2>{content.heading}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: String(RichText.asHtml(content.body)),
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: 'posts.uid',
      pageSize: 5,
    }
  );

  const paths = posts.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      author: response.data.author,
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
    uid: response.uid,
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
