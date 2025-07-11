import RevenueStatisticalView from 'src/sections/statistical/views/revenue-view';

export default {
  title: 'Page/Revenue',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export const Revenue = (args) => <RevenueStatisticalView />;
