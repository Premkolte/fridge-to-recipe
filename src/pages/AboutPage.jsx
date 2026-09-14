/**
 * TECH_STACK — displayed in the about page.
 */
const TECH_STACK = [
  { name: 'React',        desc: 'UI components and state',   emoji: '⚛️'  },
  { name: 'Vite',         desc: 'Build tool and dev server', emoji: '⚡'  },
  { name: 'Tailwind CSS', desc: 'Utility-first styling',     emoji: '🎨'  },
  { name: 'Groq + LLaMA', desc: 'AI recipe generation',      emoji: '🤖'  },
  { name: 'Vercel',       desc: 'Deployment and serverless', emoji: '▲'   },
  { name: 'Zod',          desc: 'Runtime schema validation', emoji: '🛡️'  },
];

/**
 * TEAM_VALUES — mission points.
 */
const TEAM_VALUES = [
  {
    emoji: '♻️',
    title: 'Reduce food waste',
    description:
      'The average household throws away 30% of the food it buys. ' +
      'FridgeChef helps you use what you already have.',
  },
  {
    emoji: '⚡',
    title: 'Cook without decision fatigue',
    description:
      'Staring at the fridge wondering what to make? ' +
      'We turn a list of ingredients into a concrete plan in seconds.',
  },
  {
    emoji: '🧠',
    title: 'AI that actually helps',
    description:
      'We use LLaMA 3.1 70B via Groq to generate recipes that ' +
      'make sense for your specific ingredients — not generic results.',
  },
];

/**
 * AboutPage — brand story, mission, and technical transparency.
 */
function AboutPage() {
  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16
        flex flex-col gap-20"
      >

        {/* Hero */}
        <div className="flex flex-col gap-6 animate-fade-in">
          <span className="text-xs font-semibold text-primary
            uppercase tracking-widest"
          >
            About FridgeChef
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold
            text-white leading-tight"
          >
            We turn your fridge into
            <span className="text-primary"> a restaurant</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            FridgeChef is an AI-powered recipe generator built to
            solve a simple problem — you have ingredients, but no
            idea what to cook. We fix that in under 10 seconds.
          </p>
        </div>

        {/* Mission */}
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white">
            Why we built this
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEAM_VALUES.map(({ emoji, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-6 bg-card
                  border border-border rounded-2xl"
              >
                <span className="text-3xl">{emoji}</span>
                <h3 className="text-base font-bold text-white">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How the AI works */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">
            How the AI works
          </h2>
          <div className="p-6 bg-card border border-border
            rounded-2xl flex flex-col gap-4"
          >
            <p className="text-sm text-muted leading-relaxed">
              When you select ingredients and hit Find Recipes,
              FridgeChef sends your list to a serverless function
              running on Vercel. That function builds a structured
              prompt and calls the LLaMA 3.1 70B model via Groq&apos;s
              inference API.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              The model returns a JSON response with 3 dish
              suggestions. We validate the shape of that JSON
              before showing it to you — if the AI returns
              something unexpected, we catch it and show a
              clean error instead of crashing.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              When you pick a dish, a second AI call generates a
              detailed 10-step recipe with ingredient amounts,
              timing, and chef tips. Your API key never touches
              the browser.
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">
            Built with
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TECH_STACK.map(({ name, desc, emoji }) => (
              <div
                key={name}
                className="flex items-center gap-3 p-4 bg-card
                  border border-border rounded-xl"
              >
                <span className="text-2xl shrink-0">{emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white
                    truncate"
                  >
                    {name}
                  </span>
                  <span className="text-xs text-muted truncate">
                    {desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
