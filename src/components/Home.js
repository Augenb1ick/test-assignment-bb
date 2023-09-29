const Home = ({ handleClick, isStartAnimation, isReverseAnimationStart }) => (
  <div>
    <h1
      onClick={handleClick}
      className={`text ${isStartAnimation && 'text_forward_animated'} ${
        isReverseAnimationStart && 'text_reverse_animated'
      }`}
    >
      Bit Busters
    </h1>
  </div>
);

export default Home;
