import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    ...devices['Desktop Chrome'],
    launchOptions: {
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  webServer: [
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173/',
    },
    {
      command:
        'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort --base /site-minecraft/',
      url: 'http://127.0.0.1:4174/site-minecraft/',
    },
  ],
});
