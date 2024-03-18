import FadeLoader from 'react-spinners/FadeLoader';
const Loader = () => {
  return (
    <div>
      <FadeLoader width={2} color='rgb(37 99 235)' aria-label='Loading' />
    </div>
  );
};

export default Loader;
