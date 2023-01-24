import { getProviders } from 'next-auth/react';
import Head from 'next/head';
import Header from '../../components/Header';
import SignIn from '../../components/SignIn';

const SignInPage = ({ providers }) => {
  return (
    <>
      <Head>
        <title>Login - Instagram</title>
      </Head>
      <Header />
      <div className="grid place-items-center mt-36 text-center">
        <img
          src="/insta-logo-text.png"
          alt="instagram logo"
          className="w-60 sm:w-80"
        />
        <div className="mt-8">
          {Object.values(providers).map((provider) => (
            <SignIn key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

export default SignInPage;
