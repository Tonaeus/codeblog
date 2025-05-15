import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = (new JSDOM('')).window;
const purify = DOMPurify(window);

const sanitizeHtml = (inputHtml: string): string => {
  const sanitized = purify.sanitize(inputHtml);
  const template = window.document.createElement('template');
  template.innerHTML = sanitized;

  const firstElement = template.content.firstElementChild as HTMLElement | null;
  if (firstElement) {
    firstElement.style.marginTop = '0px';
  }

  const lastElement = template.content.lastElementChild as HTMLElement | null;
  if (lastElement) {
    lastElement.style.marginBottom = '0px';
  }

  return template.innerHTML.trim();
};

export default sanitizeHtml;
