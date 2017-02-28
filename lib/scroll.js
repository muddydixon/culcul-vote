export default class Scroll{
  static scroll(targetElement){
    const positionX = window.pageXOffset;
    const positionY = targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo( positionX, positionY);
  }
  static scrollAnimation(targetElement, duration){
    const _easeInOut = (currentTime, start, change, duration) => {
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    };
    const _scrollAnimation = (element, to, duration) => {
      const start = element.scrollTop;
      const change = to - start;
      const increment = 20;
      const animateScroll = (elapsedTime) => {
        elapsedTime += increment;
        const position = _easeInOut(elapsedTime, start, change, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
          setTimeout(() => {
            animateScroll(elapsedTime);
          }, increment);
        }
      };
      animateScroll(0);
    };

    const positionY = targetElement.getBoundingClientRect().top + window.pageYOffset;
    _scrollAnimation(document.body, positionY, duration);
  }
}
