/** Mirrors the receiver app's "How to Improve Rank" tips (backend RANK_TIPS). */
export const RANK_TIPS = [
  {
    id: 'online',
    title: 'Stay Online More Often',
    description: 'Being online increases visibility and call opportunities.',
  },
  {
    id: 'answer',
    title: 'Answer Incoming Calls Quickly',
    description: 'Higher answer rates improve ranking.',
  },
  {
    id: 'missed',
    title: 'Avoid Missing Calls',
    description: 'Frequent missed calls lower your performance score.',
  },
  {
    id: 'peak',
    title: 'Stay Online During Peak Hours',
    description: 'Be available when caller demand is highest.',
  },
  {
    id: 'complete',
    title: 'Complete More Calls',
    description: 'Higher completed call count improves rank.',
  },
  {
    id: 'talktime',
    title: 'Increase Total Talk Time',
    description: 'Longer quality conversations contribute positively.',
  },
] as const;
