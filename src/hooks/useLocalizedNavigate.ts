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

    if (typeof to !== 'string') {
      if (!to.pathname) {
        navigate(to, options);
        return;
      }
      navigate(
        {
          ...to,
          pathname: to.pathname.startsWith(`/${language}`)
            ? to.pathname
            : `/${language}${to.pathname.startsWith('/') ? to.pathname : `/${to.pathname}`}`,
        },
        options
      );
      return;
    }

    if (to.startsWith('?') || to.startsWith('#')) {
      navigate(to, options);
      return;
    }
    if (/^https?:\/\//.test(to)) {
      window.location.href = to;
      return;
    }

    navigate(
      to.startsWith(`/${language}`)
        ? to
        : `/${language}${to.startsWith('/') ? to : `/${to}`}`,
      options
    );
  };
}
