import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractQuestionDataFromPage } from '../quora-api.js';

export const getQuestionDetails = defineTool({
  name: 'get_question_details',
  displayName: 'Get Question Details',
  description: 'Get metadata for the current Quora question page — title, answer count, follower count, topics. Useful for understanding context before answering.',
  icon: 'info',
  group: 'Reading',
  input: z.object({}),
  output: z.object({
    found: z.boolean().describe('Whether a question was detected on the page'),
    title: z.string().optional().describe('The question title'),
    url: z.string().optional().describe('Question URL'),
    answer_count: z.number().optional().describe('Number of answers'),
    follower_count: z.number().optional().describe('Number of followers'),
    topic: z.string().optional().describe('Primary topic if detectable'),
    page_title: z.string().describe('Browser page title'),
    current_url: z.string().describe('Current page URL'),
  }),
  async handle() {
    const question = extractQuestionDataFromPage();

    const pageTitle = document.title;
    const currentUrl = window.location.href;

    log.info('Question details', { found: !!question, url: currentUrl });

    return {
      found: !!question,
      title: question?.title,
      url: question?.url,
      answer_count: question?.answerCount,
      follower_count: question?.followerCount,
      topic: question?.topic,
      page_title: pageTitle,
      current_url: currentUrl,
    };
  },
});
