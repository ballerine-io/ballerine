import type { MarkdownHeading } from 'astro';
import { unescape } from 'html-escaper';
import { Component, createEffect, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

interface ItemOffsets {
  id: string;
  topOffset: number;
}

const TableOfContents: Component<{ headings: MarkdownHeading[] }> = ({ headings = [] }) => {
  // eslint-disable-next-line no-undef-init, prefer-const
  let toc: HTMLUListElement | undefined = undefined;
  const onThisPageID = `on-this-page-heading`;
  let _itemOffsets: ItemOffsets[] = [];
  const [currentID, setCurrentID] = createSignal(`overview`);
  createEffect(() => {
    const getItemOffsets = () => {
      const titles = document.querySelectorAll(`article :is(h1, h2, h3, h4)`);
      _itemOffsets = Array.from(titles).map(title => ({
        id: title.id,
        topOffset: title.getBoundingClientRect().top + window.scrollY,
      }));
    };

    getItemOffsets();
    window.addEventListener(`resize`, getItemOffsets);

    return () => {
      window.removeEventListener(`resize`, getItemOffsets);
    };
  }, []);

  createEffect(() => {
    if (!toc) return;

    const setCurrent: IntersectionObserverCallback = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { id } = entry.target;
          if (id === onThisPageID) continue;
          setCurrentID(entry.target.id);
          break;
        }
      }
    };

    const observerOptions: IntersectionObserverInit = {
      // Negative top margin accounts for `scroll-margin`.
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      rootMargin: `-100px 0% -66%`,
      threshold: 1,
    };

    const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

    // Observe all the headings in the main page content.
    document.querySelectorAll(`article :is(h1,h2,h3)`).forEach(h => headingsObserver.observe(h));

    // Stop observing when the component is unmounted.
    return () => headingsObserver.disconnect();
  });

  const onLinkClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = e => {
    const href = e.target.getAttribute(`href`);

    if (!href) return;

    setCurrentID(href.replace(`#`, ``));
  };

  return (
    <>
      <h2 id={onThisPageID} class="heading">
        On this page
      </h2>
      <ul ref={toc}>
        {headings
          .filter(({ depth }) => depth > 1 && depth < 4)
          .map(heading => (
            <li
              class={`header-link depth-${heading.depth} ${
                currentID() === heading.slug ? `current-header-link` : ``
              }`.trim()}
            >
              <a href={`#${heading.slug}`} onClick={onLinkClick}>
                {unescape(heading.text)}
              </a>
            </li>
          ))}
      </ul>
    </>
  );
};

export default TableOfContents;
