const About = ({ isStartAnimation, handleClick, isReverseAnimationStart }) => (
  <div>
    <h1
      onClick={handleClick}
      className={`text ${isReverseAnimationStart && 'text_reverse_animated'} ${
        isStartAnimation && 'text_forward_animated'
      }`}
    >
      New
      <br />
      technologies
    </h1>
  </div>
);

export default About;
