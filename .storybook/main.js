/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['..\\public'],
  webpackFinal: async (config) => {
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.REACT_APP_WS_HOST': JSON.stringify(process.env.REACT_APP_WS_HOST),
        'process.env.REACT_APP_HOST_API': JSON.stringify(process.env.REACT_APP_HOST_API),
        'process.env.REACT_APP_CLIENT_ID': JSON.stringify(process.env.REACT_APP_CLIENT_ID),
        'process.env.REACT_APP_VERCEL_DOMAIN': JSON.stringify(process.env.REACT_APP_VERCEL_DOMAIN),
        'process.env.STORYBOOK': JSON.stringify(true),
      })
    );

    return config;
  },
};
export default config;
