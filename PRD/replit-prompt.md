# Replit Prompt: Build an Actually Good Onboarding (That Teens Won't Immediately Hate)

## Project Overview

Alright, here's the deal: We're building an onboarding for a writing tutor app for 13-16 year olds. And before you go all "let's add rainbow Comic Sans and some cringy emojis!" - **NO**. We're making something teens will actually tolerate using.

You know what teens hate? Being talked down to. You know what else they hate? Adults who try too hard to be "cool" and "relatable." So we're going to build something clean, straightforward, and not embarrassing.

**Context Documents** (if you want the boring adult version):
- Full PRD: `PRD/onboarding-prd.md`
- Writing exercises: `docs/writing-communication-playbook.md`
- Project overview: `CLAUDE.md`

---

## What We're Actually Building

**8 screens.** Not 47. Not a million forms. Just 8 screens that get the job done without making students want to throw their phone out the window.

**🆕 NEW: Screen 4 is now scenario selection!** Students pick from 3 engaging scenarios instead of being assigned one. Simple choice, more engagement.

1. **Screen 1:** "Hi, this won't suck, we promise" (Phase 1)
2. **Screen 2:** "What do you actually like?" (Phase 2)
3. **Screen 3:** "Real talk about writing" (Phase 3)
4. **Screen 4:** "Pick your scenario" (Phase 3.5 - NEW!)
5. **Screen 5:** Exercise 1 with chosen scenario (Phase 4)
6. **Screen 6:** Exercise 2 with chosen scenario (Phase 4)
7. **Screen 7:** Exercise 3 with chosen scenario (Phase 4)
8. **Screen 8:** "Here's your actual personalized plan (not generic BS)" (Phase 5)

**The Scenarios:** Students choose from 3 engaging scenarios (big game, boss fight victory, kitchen disaster). Why? Because letting them pick what interests them means they'll actually care about the writing. Way better than "Write about your summer vacation."

---

## Tech Stack (Keep It Simple, People)

### What to Use
- **Frontend:** HTML, CSS, JavaScript (vanilla is fine, React if you want to feel fancy)
- **Styling:** Make it look good. Not "educational software from 2005" good. Actually good.
- **Backend:** None. We're not trying to win architecture awards here. localStorage is your friend.
- **AI:** Mock it. We'll add the real AI later when we have budget and time.

### Design Rules (aka How Not to Make It Look Like Your School's Website)

- **Font size:** 16px minimum. Because squinting is not cool.
- **Target audience:** Ages 13-16. They can handle real design. Don't infantilize them.
- **Mobile-first:** They're on their phones. Obviously.
- **Colors:** Pick a palette that doesn't scream "LEARNING IS FUN!!!1!"
- **Progress bar:** Yes. Because people like knowing when suffering will end.

---

## The Screens (Detailed Because Adults Need Hand-Holding)

### Screen 1: The "Don't Worry, This Won't Suck" Welcome

**Purpose:** Don't scare them away in the first 5 seconds

**The Copy (aka what actual teens might tolerate reading):**
```
Welcome!

Let's get you better at writing.

I'll ask a few questions about what you're into and how you feel about writing.
Takes about 10 minutes.

No wrong answers. Just helping you get better.

[Button: Let's Go]
```

**Translation for developers:** Make a welcome screen that doesn't immediately trigger "oh great, another boring educational thing" vibes.

**UI Specs:**
- Clean header. Not cutesy.
- Bullets for easy scanning (teens scroll fast)
- Big button (easy to tap with thumbs)
- Progress bar: "Step 1 of 7"
- NO CLIPART. I repeat: NO CLIPART.

**Data to store:**
```javascript
{
  "onboarding_start_time": "timestamp",
  "user_didnt_immediately_close_tab": true
}
```

---

### Screen 2: The "What Do You Actually Like?" Question

**Purpose:** Find out what they care about (so we can stop boring them with generic examples)

**The Copy:**
```
[Progress: 2 of 7]

What do you like to do when you're not in school?

Hobbies, interests, whatever you're into.

[Text area - decent size, not those tiny boxes that fit 3 words]

[Button: Continue]
```

**For developers:**
- Progress bar at top
- Text area that actually fits multiple sentences (revolutionary concept, I know)
- Button stays disabled until they type at least 10 characters
- Why? Because "idk" is not helpful data

**The Interest Detection Logic (Simple but Effective):**

Create a basic keyword matcher that isn't completely stupid:

```javascript
const interestKeywords = {
  sports: ["soccer", "basketball", "football", "hockey", "sports", "team", "game"],
  gaming: ["game", "video game", "gaming", "xbox", "playstation", "minecraft", "fortnite"],
  music: ["music", "sing", "guitar", "piano", "band", "concert", "spotify"],
  books: ["read", "book", "novel", "story", "harry potter", "manga"],
  art: ["draw", "paint", "art", "sketch", "design", "digital art"],
  social: ["friends", "hang out", "hangout", "social", "people"],
  // Add more as needed
};

// If nothing matches, default to sports for the prototype
// (Because statistically someone in their life plays some sport)
```

**Data to capture:**
```javascript
{
  "lifestyle_interests": "I love soccer and hanging with friends and gaming",
  "detected_interests": ["sports", "gaming", "social"],
  "timestamp": "when they answered"
}
```

---

### Screen 3: The "Let's Be Real About Writing" Question

**Purpose:** Get their actual feelings (not the "correct" answer they think we want)

**The Copy:**
```
[Progress: 3 of 7]

How do you feel about writing?

Be honest. Most people have mixed feelings about it.

[Text area - also decent size]

[Skip this question]  [Button: Continue]
```

**Developer notes:**
- Give them a skip option (some people are private, and that's fine)
- If they skip, capture that they skipped
- Keep tone like a supportive buddy, not a teacher or AI assistant

**Simple Sentiment Analysis** (aka trying to figure out if they hate writing or just find it meh):

```javascript
function analyzeSentiment(text) {
  const positive = ["love", "like", "enjoy", "fun", "good", "great", "awesome"];
  const negative = ["hate", "hard", "difficult", "struggle", "bad", "sucks", "worst"];

  const lowerText = text.toLowerCase();
  const hasPositive = positive.some(word => lowerText.includes(word));
  const hasNegative = negative.some(word => lowerText.includes(word));

  if (hasPositive && !hasNegative) return "positive";
  if (hasNegative && !hasPositive) return "negative";
  if (hasPositive && hasNegative) return "mixed"; // Most honest answer
  return "neutral";
}
```

**Data to store:**
```javascript
{
  "writing_feelings": "it's ok i guess but essays are hard",
  "sentiment": "neutral",
  "skipped": false
}
```

---

### Screen 4: Pick Your Scenario (NEW!)

**Purpose:** Let students choose a scenario that actually interests them (increases engagement and buy-in)

**The Copy:**
```
[Progress: 4 of 8]

What do you want to write about?

[3 big scenario cards - tappable]

⚽ The Big Game
Your team made it to the championship. It's tomorrow and you can't sleep.

🎮 Boss Fight Victory
You finally beat that level everyone said was impossible.

🍕 Kitchen Disaster
You tried to cook something fancy. Things got... creative.

[After selection: Button: Start Writing]
```

**Developer Notes:**
- Make these BIG, tappable cards (not a boring list)
- Use emoji for each (just one, keep it clean)
- Highlight/animate on hover/tap
- Save selected scenario before moving to exercises
- 3 scenarios = simpler choice, faster decision
- Optional: Based on interests from Screen 2, show a subtle "Recommended" badge on one

**Why this works:**
- Gives students agency (they choose, not assigned)
- Short descriptions trigger curiosity
- 3 options = quick decision, not overwhelming
- Everyone can relate to at least one
- Makes the assessment feel less like a test, more like creative writing

**UI Design:**
```css
.scenario-card {
  background: white;
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.scenario-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
  transform: translateY(-2px);
}

.scenario-card.selected {
  border-color: var(--primary);
  background: rgba(74, 144, 226, 0.05);
}

.scenario-emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.scenario-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.scenario-description {
  font-size: 14px;
  color: var(--text-secondary);
}
```

**Data to store:**
```javascript
{
  "selected_scenario": "big_game",
  "scenario_title": "The Big Game",
  "scenario_emoji": "⚽",
  "timestamp": "when they selected"
}
```

**Scenario Templates for Exercises:**

Each scenario needs 3 exercise prompts. Here's how they adapt:

**⚽ The Big Game:**
- Ex1: Show nervousness/excitement before the game
- Ex2: Why this game matters to you
- Ex3: Opening for newspaper article about the game

**🎮 Boss Fight Victory:**
- Ex1: Show the moment of victory
- Ex2: Why beating this level matters
- Ex3: Opening for a gaming story or guide

**🍕 Kitchen Disaster:**
- Ex1: Show the chaos in the kitchen
- Ex2: Why you decided to cook this dish
- Ex3: Opening for a story about cooking gone wrong

---

### Screen 5: Exercise 1 (Previously Screen 4)

**Purpose:** See how they write (without making it feel like a test)

**The Copy:**
```
[Progress: 5 of 8]

Time to write! (Not a test, just practice.)

[SELECTED_SCENARIO_EMOJI] Your Scenario

[DYNAMIC: Show the scenario they chose with appropriate context]

Example for Championship Game:
You're a soccer player. Your team made it to the championship game this weekend.
You're excited and nervous.

---

Exercise 1: Show How You Feel

[DYNAMIC: Adjust based on scenario]

Instead of "I feel [emotion]," SHOW what it feels like.

Write 2-3 sentences:
• What your body feels like
• What you're doing
• What's going through your head

Example for The Big Game:
"My hands won't stop shaking as I tie my cleats. I keep checking
the clock, wishing the game would start already."

Example for Boss Fight Victory:
"My hands are sweating on the controller. I lean forward, barely breathing,
as the final boss's health bar drops to zero."

Example for Kitchen Disaster:
"Smoke fills the kitchen and the timer won't stop beeping. I stare at
what was supposed to be lasagna and wonder if takeout counts as cooking."

[Big text area - like, actually big enough to write in]

[Button: Next Exercise]
```

**For the devs:**
- Use an emoji for the scenario (⚽ or 📝) but JUST ONE. Don't go emoji-crazy.
- Example in a different style (italics or subtle background)
- Large text area (not a cruel joke of a box)
- Button enables after 20 characters minimum
- Show a word counter (people like metrics)

**Track this stuff:**
```javascript
{
  "scenario": "soccer_championship",
  "exercise_1": {
    "response": "their writing here",
    "word_count": 28,
    "character_count": 145,
    "time_spent_seconds": 95,
    "timestamp": "when they submitted"
  }
}
```

---

### Screen 6: Exercise 2 - The Paragraph (Previously Screen 5)

**Purpose:** See if they can organize their thoughts (spoiler: most can't yet, that's why they're here)

**The Copy:**
```
[Progress: 6 of 8]

[SELECTED_SCENARIO_EMOJI] [Scenario name]

---

Exercise 2: Build a Paragraph

[DYNAMIC: Adjust question based on scenario]

Write ONE paragraph about why [this scenario] matters to you.

Structure:
1. Topic sentence (your main point)
2. 2-3 supporting details
3. Concluding sentence

Example for The Big Game:
"This championship game means everything to me. [REASON 1].
[REASON 2]. [WRAP IT UP]."

Example for Boss Fight Victory:
"Beating this level matters more than I want to admit. [REASON 1].
[REASON 2]. [WRAP IT UP]."

Example for Kitchen Disaster:
"I decided to cook this dish for a reason. [REASON 1].
[REASON 2]. [WRAP IT UP]."

[Another properly-sized text area]

[Button: Next Exercise]
```

**Dev notes:**
- Show the scenario reminder but make it smaller (they remember)
- Structure guide should be visible while they write
- Optional but cool: Show a simple visual guide (like 3 boxes for topic/details/conclusion)
- Auto-count sentences and show it

**Simple analysis to show in UI:**
```javascript
// Count sentences (roughly)
const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

// Show feedback
if (sentenceCount < 3) {
  // Maybe show a subtle hint: "Try adding more detail"
} else if (sentenceCount > 7) {
  // Show: "That's a lot! Maybe break into multiple paragraphs?"
}
```

**Store this:**
```javascript
{
  "exercise_2": {
    "response": "the paragraph they wrote",
    "word_count": 65,
    "sentence_count": 5,
    "time_spent_seconds": 120,
    "timestamp": "when done"
  }
}
```

---

### Screen 7: Exercise 3 - The Hook (Previously Screen 6)

**Purpose:** See if they can grab attention (most important skill for social media generation)

**The Copy:**
```
[Progress: 7 of 8]

Last one!

[SELECTED_SCENARIO_EMOJI] [Scenario name]

---

Exercise 3: Hook Your Reader

[DYNAMIC: Adjust based on scenario]

You're writing about [scenario] for your school newspaper.
Write an opening that grabs attention.

Tips:
• Start with action or dialogue
• Get specific
• Make people curious

Example for The Big Game:
"The whistle blew, and everything I'd practiced for came down to this moment."

Example for Boss Fight Victory:
"The screen flashed 'Victory' and I dropped the controller in disbelief."

Example for Kitchen Disaster:
"The smoke alarm went off, and I knew my cooking experiment had officially failed."

Write your opening + 2-3 more sentences:

[Final text area of appropriate size]

[Button: See My Results]
```

**Dev notes:**
- Keep it consistent with previous exercises
- Button text changes to "See My Results" (builds anticipation)
- Add a small encouraging message like "Almost done!"
- This is their last chance to write, make the text area nice

**Final exercise data:**
```javascript
{
  "exercise_3": {
    "response": "their opening",
    "word_count": 42,
    "time_spent_seconds": 85,
    "timestamp": "when submitted"
  }
}
```

---

### Screen 8: The "Here's Your Actual Results" Page (Previously Screen 7)

**Purpose:** Give them useful feedback and a plan (not generic garbage)

**The Copy:**
```
[Progress: Complete! 🎉]

Nice work!

---

What You're Good At ✓

• You included specific details
• Your ideas were clear
• Your writing has personality

---

What We'll Work On →

• Organizing paragraphs
• Varying sentence length
• Using transition words

---

Your 2-Week Plan

Week 1: Better Paragraphs
• Day 1: Paragraph structure (10 min)
• Day 2: Topic sentences (10 min)
• Day 3: Adding details (10 min)
• Day 4: Practice (15 min)
• Day 5: Check-in

Week 2: Better Flow
• Day 1: Transition words (10 min)
• Day 2: Sentence variety (10 min)
• Day 3: Revision (15 min)
• Day 4: Show don't tell (10 min)
• Day 5: Progress check

[Button: Start Day 1]
```

**For developers (aka how to fake AI feedback):**

Create some mock classification logic that isn't completely random:

```javascript
function mockClassifySkill(responses) {
  // Calculate based on response lengths (simple but works for prototype)
  const ex1Words = responses.exercise_1.word_count;
  const ex2Words = responses.exercise_2.word_count;
  const ex3Words = responses.exercise_3.word_count;

  const totalWords = ex1Words + ex2Words + ex3Words;
  const avgWords = totalWords / 3;

  // Simple classification
  let level = 'intermediate'; // Most people land here
  let orgScore = 3.0;
  let langScore = 3.0;

  if (avgWords < 20) {
    // Short responses = beginner
    level = 'beginner';
    orgScore = 2.0;
    langScore = 2.5;
  } else if (avgWords > 50) {
    // Long responses = probably advanced
    level = 'advanced';
    orgScore = 4.0;
    langScore = 4.0;
  }

  // Generate strengths (pick 3 that sound specific)
  const possibleStrengths = [
    "You included specific details in your descriptions",
    "Your ideas were clear and easy to follow",
    "Your writing has personality and sounds like you",
    "You used vivid imagery that creates mental pictures",
    "Your examples were relevant and helped explain your point"
  ];

  // Pick 3 randomly (or first 3 for simplicity)
  const strengths = possibleStrengths.slice(0, 3);

  // Areas to improve (everyone gets organization because it's universally useful)
  const improvements = [
    "Organizing paragraphs with clear structure",
    "Varying your sentence length and style",
    "Using transition words to connect ideas smoothly"
  ];

  return {
    level: level,
    scores: {
      content: 3.5,
      organization: orgScore,
      language: langScore,
      mechanics: 3.0
    },
    strengths: strengths,
    improvements: improvements
  };
}
```

**UI for results:**
- Celebration at top (🎉 or subtle confetti animation)
- Use ✓ for strengths (green-ish)
- Use → for improvements (blue, NOT red - red = bad, we're going for neutral)
- Make the plan scannable (not a wall of text)
- Big CTA button to start

**Final data structure:**
```javascript
{
  "session_id": "some-uuid",
  "started_at": "timestamp",
  "completed_at": "timestamp",
  "total_time_minutes": 10,
  "phase_2": { /* lifestyle data */ },
  "phase_3": { /* mindset data */ },
  "phase_4": { /* all 3 exercises */ },
  "classification": {
    "level": "intermediate",
    "scores": {
      "content": 3.5,
      "organization": 3.0,
      "language": 3.0,
      "mechanics": 3.0
    },
    "strengths": ["array of good things"],
    "improvements": ["array of focus areas"]
  },
  "learning_plan": {
    "week_1_focus": "paragraph_structure",
    "week_2_focus": "flow_and_style"
  }
}
```

---

## Design Specs (Because "Make It Look Good" Is Too Vague)

### Typography (aka Fonts That Don't Suck)

```css
/* Import a clean font if you want, or use system fonts */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #212529;
}

h1, h2 {
  font-weight: 600;
  margin-bottom: 1rem;
}

.helper-text {
  font-size: 14px;
  color: #666;
  font-style: italic;
}
```

### Colors (Not a Rainbow, Please)

Pick a palette that looks like it was designed this decade:

```css
:root {
  --primary: #4A90E2;        /* Blue, calm, professional */
  --primary-hover: #357ABD;  /* Darker blue for hover */
  --success: #4CAF50;        /* Green for positive things */
  --text: #212529;           /* Almost black but not quite */
  --text-secondary: #666;    /* Gray for less important text */
  --background: #F8F9FA;     /* Light background */
  --white: #FFFFFF;          /* For cards */
  --border: #DEE2E6;         /* Subtle borders */
}

/* DO NOT use: */
/* - Comic Sans (obviously) */
/* - Rainbow gradients */
/* - Bright pink, yellow, or lime green */
/* - Anything that reminds you of Microsoft Office clipart */
```

### Spacing (So Things Don't Look Cramped)

```css
/* Use consistent spacing */
.container {
  max-width: 700px;           /* Don't make text lines too long */
  margin: 0 auto;
  padding: 24px;              /* Breathing room */
}

.screen {
  background: white;
  border-radius: 12px;        /* Rounded corners, subtle */
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* Subtle shadow */
}

/* For mobile */
@media (max-width: 640px) {
  .container {
    padding: 16px;
  }
  .screen {
    padding: 24px;
  }
}
```

### Buttons (Actually Tappable)

```css
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;           /* Easy to tap on mobile */
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  background: #CCC;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  /* Same sizing as primary */
}
```

### Text Areas (Not Tiny Torture Boxes)

```css
textarea {
  width: 100%;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-family: inherit;       /* Don't make it monospace or weird */
  resize: vertical;
  min-height: 120px;          /* Enough space to actually write */
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* Word counter below textarea */
.word-count {
  text-align: right;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}
```

### Progress Bar (So People Know When Freedom Arrives)

```css
.progress-container {
  margin-bottom: 24px;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}
```

---

## File Structure (Keep It Simple)

### Option 1: Vanilla JS (No Framework Drama)

```
onboarding-prototype/
├── index.html              # All the HTML
├── styles.css              # All the styles
├── script.js               # All the logic
└── README.md               # Instructions for future you
```

### Option 2: React (If You Must)

```
onboarding-prototype/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main component
│   ├── App.css             # Styles
│   ├── components/
│   │   ├── Welcome.js
│   │   ├── LifestyleQ.js
│   │   ├── MindsetQ.js
│   │   ├── Exercise1.js
│   │   ├── Exercise2.js
│   │   ├── Exercise3.js
│   │   └── Results.js
│   └── utils/
│       └── storage.js      # localStorage helpers
└── package.json
```

Pick whichever you're more comfortable with. This isn't a framework beauty contest.

---

## Implementation Checklist

### Phase 1: Basic Setup
- [ ] Create project structure
- [ ] Set up basic HTML/CSS
- [ ] Get navigation working between screens
- [ ] Set up localStorage (don't lose data on refresh)

### Phase 2: First 4 Screens
- [ ] Build Welcome screen
- [ ] Build Lifestyle question screen
- [ ] Build Mindset question screen
- [ ] Build Scenario selection screen (the fun one!)
- [ ] Test flow through these 4

### Phase 3: Writing Assessment
- [ ] Build Exercise 1 screen (dynamic based on scenario)
- [ ] Build Exercise 2 screen (dynamic based on scenario)
- [ ] Build Exercise 3 screen (dynamic based on scenario)
- [ ] Add word counters
- [ ] Add timing tracking
- [ ] Test all 3 scenarios work correctly

### Phase 4: Results
- [ ] Build Results screen
- [ ] Implement mock classification
- [ ] Display personalized feedback
- [ ] Test complete flow

### Phase 5: Polish
- [ ] Add progress indicators throughout
- [ ] Add input validation
- [ ] Test on actual phone
- [ ] Fix any weird UI issues
- [ ] Remove any accidental clipart you may have added

---

## Testing (aka Make Sure It Actually Works)

Test these things before calling it done:

- [ ] Can complete all 8 screens without rage-quitting
- [ ] Scenario selection is fun and easy to use
- [ ] Takes 8-12 minutes (not 45)
- [ ] Looks good on phone (test on real device, not just resize browser)
- [ ] Looks good on tablet
- [ ] Looks good on desktop
- [ ] Data saves to localStorage correctly
- [ ] Refresh doesn't delete everything
- [ ] Buttons work
- [ ] Text areas are actually usable
- [ ] No console errors
- [ ] Doesn't look like educational software from 2005
- [ ] Doesn't have clipart
- [ ] Doesn't have Comic Sans
- [ ] Adults would find it "too casual" (that's how you know it's right)

---

## What NOT to Do (Seriously)

### ❌ DON'T:
- Use bright, "fun" colors that hurt your eyes
- Add unnecessary animations (we're not a startup trying to seem innovative)
- Use clipart or stock photos of "diverse teens smiling at computers"
- Add sound effects
- Use words like "super cool" or "awesome sauce"
- Make it look like a quiz on BuzzFeed
- Add gamification elements (no points, no badges, no "streaks")
- Use emojis in every sentence
- Talk down to users
- Use educational jargon ("pedagogical," "scaffolding," etc.)

### ✅ DO:
- Keep it clean and simple
- Use consistent spacing
- Make buttons easy to tap
- Write like a normal human
- Test on mobile
- Save user data so they don't lose progress
- Show progress so they know when it's over
- Be straightforward

---

## Success Criteria (How to Know You're Done)

The prototype is successful if:

1. ✅ A 14-year-old could use it without help
2. ✅ It doesn't look like it was made in 2005
3. ✅ Takes about 10 minutes to complete
4. ✅ Actually works on mobile
5. ✅ Data persists correctly
6. ✅ No console errors
7. ✅ You'd show it to people without embarrassment
8. ✅ Adults think it's "a bit too casual" (perfect)

---

## Getting Started

1. **Create a new Repl** with HTML/CSS/JS or React
2. **Read this prompt** (you're doing that now, good job)
3. **Start with Screens 1-3** (Welcome, Lifestyle, Mindset)
4. **Build Screen 4** (Scenario selection - 3 simple choices)
5. **Build exercises 1-3** with dynamic content based on chosen scenario
6. **Build results screen**
7. **Test as you go** (don't wait until the end)
8. **Keep it simple** (you can always add fancy stuff later)

---

## Final Notes

Remember: Teens are not idiots. They can handle straightforward, clean design. They don't need everything to be "gamified" or "fun" or covered in emojis.

What they DO need:
- Something that works
- Something that doesn't waste their time
- Something that respects their intelligence
- Something that doesn't look like it was designed by someone's well-meaning but out-of-touch parent

Build for that, and you're golden.

**Now go build something that doesn't suck! 🚀**

(See? ONE emoji. That's the rule. One. Not seventeen.)
