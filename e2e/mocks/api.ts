import type { Page } from '@playwright/test';

type MockResponse<T> = T | ((url: URL) => T);

const getApiUrl = () => {
  const apiUrl = process.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined');
  }

  return apiUrl.replace(/\/$/, '');
};

export async function mockApi(page: Page) {
  await page.route(`${getApiUrl()}/**`, async (route) => {
    throw new Error(
      `Unmocked API request: ${route.request().method()} ${route.request().url()}`
    );
  });
}

export async function mockGet<T>(
  page: Page,
  path: string,
  response: MockResponse<T>,
  status = 200
) {
  const apiUrl = getApiUrl();

  await page.route(`${apiUrl}${path}**`, async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname !== path) {
      return route.fallback();
    }

    const body =
      typeof response === 'function'
        ? (response as (url: URL) => T)(url)
        : response;

    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function mockPost<T>(
  page: Page,
  path: string,
  response: T,
  status = 200
) {
  await page.route(`${getApiUrl()}${path}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

export async function mockPatch<T>(
  page: Page,
  path: string,
  response: T,
  status = 200
) {
  await page.route(`${getApiUrl()}${path}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}
