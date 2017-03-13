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
      const increment = 20;
      const animateScroll = (elapsedTime) => {
        elapsedTime += increment;
        const position = _easeInOut(elapsedTime, element.scrollTop, to - element.scrollTop, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
          setTimeout(() => {
            animateScroll(elapsedTime);
          }, increment);
        }
      };
      animateScroll(0);
    };

    const positionY = Math.round(targetElement.getBoundingClientRect().top + window.pageYOffset);
    duration = Math.round(duration);
    if (duration < 0) {
      return Promise.reject("bad duration");
    }
    if (duration === 0) {
      element.scrollTop = target;
      return Promise.resolve();
    }
    _scrollAnimation(document.documentElement||document.body, positionY, Math.round(duration));
  }
}
