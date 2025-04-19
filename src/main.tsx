import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import log from 'loglevel';

const root_element: HTMLElement | null = document.body;

log.setLevel("trace")

/**
 * The main driver component of the application.
 * @returns
 */
function Main() {
  function handle_dark_mode(prefers_dark_mode: boolean) {
    root_element?.classList.add(prefers_dark_mode ? "dark" : "light");
    root_element?.classList.remove(prefers_dark_mode ? "light" : "dark");
  }

  //  Adds an event listener to add a corresponding theme to the root HTML element.
  useEffect(() => {
    handle_dark_mode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", event => handle_dark_mode(event.matches));

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", event => handle_dark_mode(event.matches));
    }
  }, []);

  return (
    <App/>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
