import {
  useNavigate,
  useParams,
  type NavigateOptions,
  type To,
} from 'react-router-dom';

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams();

  return (to: To, options?: NavigateOptions) => {
    const language = lang ?? 'en';

    if (typeof to === 'string') {
      const localizedPath = to.startsWith(`/${language}`)
        ? to
        : `/${language}${to.startsWith('/') ? to : `/${to}`}`;

      navigate(localizedPath, options);
      return;
    }

    navigate(
      {
        ...to,
        pathname: to.pathname?.startsWith(`/${language}`)
          ? to.pathname
          : `/${language}${to.pathname?.startsWith('/') ? to.pathname : `/${to.pathname}`}`,
      },
      options
    );
  };
}
