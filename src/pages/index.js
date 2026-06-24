// The marketplace home is out of scope for this prototype — send visitors
// straight to the "Matcha mäklare" directory root (Sverige overview).
export async function getServerSideProps() {
  return {
    redirect: { destination: '/maklare', permanent: false },
  };
}

export default function Home() {
  return null;
}
