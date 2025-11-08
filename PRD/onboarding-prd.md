# PRD: User Onboarding & Skill Classification

## Document Information
- **Version:** 1.0
- **Date:** 2025-11-03
- **Status:** Draft
- **Owner:** Capstone Team

---

## Executive Summary

The onboarding experience is the first interaction students have with our adaptive writing platform. Its purpose is to:
1. Understand the student's personal context (lifestyle and mindset)
2. Assess their current writing skill level
3. Create a personalized learning plan

This process should feel conversational, not like a test. Students should feel comfortable and excited, not stressed or judged.

---

## Goals

### User Goals
- Understand what the platform does
- Feel welcomed and comfortable
- Share information without feeling tested
- Get a personalized learning plan
- Start practicing right away

### System Goals
- Classify writing skill level (beginner, intermediate, advanced)
- Understand student's lifestyle and learning preferences
- Understand student's mindset about writing
- Generate personalized 2-week learning plan
- Set up student profile for adaptive learning

### Business Goals
- Complete onboarding in 10-15 minutes
- 80%+ completion rate
- Accurate skill classification (validated after first week)
- Positive first impression

---

## Target Users

**Primary Users:**
- Students aged 13-16
- English language learners (focus on reading/writing)
- Varying writing skill levels
- Different learning styles and paces

**User Characteristics:**
- May feel anxious about writing
- Prefer conversational interactions
- Want to understand "why" behind questions
- Value personalization
- Respond well to encouragement

---

## Onboarding Flow

### Phase 1: Welcome & Context Setting (2-3 minutes)
**Goal:** Make student feel comfortable and explain the process

**Elements:**
1. Warm welcome message
2. Explain what will happen ("We'll chat for 10 minutes to learn about you")
3. Set expectations ("No wrong answers, just getting to know you")
4. Privacy assurance ("Your answers are private")

### Phase 2: Personal Context - Lifestyle (3-4 minutes)
**Goal:** Understand how writing fits into student's daily life

**Topics to explore:**
- Daily routine and available time for practice
- Current writing activities (school, personal)
- Reading habits
- Hobbies and interests
- Preferred learning times
- Learning environment (quiet vs. busy)

### Phase 3: Personal Context - Mindset (3-4 minutes)
**Goal:** Understand student's beliefs and feelings about writing

**Topics to explore:**
- Feelings about writing (love it, fear it, neutral)
- Past writing experiences (positive/negative)
- Writing confidence level
- Growth mindset vs. fixed mindset indicators
- Motivation (intrinsic vs. extrinsic)
- Learning preferences (alone vs. with help)

### Phase 4: Writing Assessment (4-5 minutes)
**Goal:** Classify current writing skill level

**Assessment approach:**
- One short writing prompt (5 minutes)
- Analysis of: clarity, organization, details, mechanics
- AI evaluates multiple dimensions
- No grade shown to student (reduces anxiety)

### Phase 5: Results & Plan (2-3 minutes)
**Goal:** Present personalized plan and next steps

**Elements:**
1. Positive framing of results
2. Personalized 2-week learning plan
3. First exercise recommendation
4. Encouragement and call to action

---

## Detailed Requirements

### Phase 1: Welcome & Context Setting

**Welcome Message Template:**
```
Hi! I'm your writing coach. I'm here to help you become a better writer.

Before we start, I want to get to know you. We'll spend about 10 minutes
chatting about your life, your interests, and your writing.

There are no wrong answers here. I just want to understand:
- What your daily life is like
- How you feel about writing
- What kind of writing help would work best for you

Ready? Let's start with an easy question...
```

**Requirements:**
- Friendly, conversational tone
- Simple language (ages 13-16)
- Set clear time expectations
- Reduce test anxiety
- Emphasize personalization

---

### Phase 2: Personal Context - Lifestyle Questions

**Question Design Principles:**
- One question at a time
- Conversational flow (not a form)
- Open-ended then follow-ups
- Listen and adapt based on answers
- Connect questions to value ("This helps me understand...")

**Sample Question Flow:**

**Q1: Daily Routine**
- "Let's start with your typical day. What does a regular school day look like for you?"
- Follow-up: "When during the day do you usually feel most focused?"
- Follow-up: "When do you typically do homework?"

**Q2: Current Writing**
- "What kind of writing do you do now? For school? For yourself?"
- Follow-up: "What do you enjoy writing about?"
- Follow-up: "What do you find hardest about writing?"

**Q3: Reading Habits**
- "Do you read for fun? If yes, what do you like to read?"
- Follow-up: "How often do you read?"
- Follow-up: "What's the last thing you read that you really enjoyed?"

**Q4: Interests & Hobbies**
- "What do you like to do when you're not in school?"
- Follow-up: "What topics are you most interested in?"
- Purpose: To personalize writing prompts and examples

**Q5: Learning Environment**
- "Where do you usually do homework or study?"
- "Do you prefer quiet or some background noise?"
- Purpose: To recommend practice settings

**Q6: Available Time**
- "How much time could you spend practicing writing each day? Be realistic!"
- Options: 5-10 minutes, 10-15 minutes, 15-30 minutes, 30+ minutes
- Purpose: To set realistic practice goals

**Data Captured:**
```json
{
  "lifestyle": {
    "typical_day": "string",
    "best_focus_time": "morning|afternoon|evening",
    "homework_time": "string",
    "current_writing": ["school_essays", "personal_journal", "social_media", "creative_stories"],
    "reading_frequency": "daily|weekly|monthly|rarely",
    "reading_preferences": ["fiction", "non-fiction", "articles", "social_media"],
    "interests": ["sports", "music", "gaming", "art", "science", "etc"],
    "learning_environment": "quiet|moderate|noisy",
    "available_practice_time": "5-10|10-15|15-30|30+",
    "preferred_practice_time": "morning|afternoon|evening"
  }
}
```

---

### Phase 3: Personal Context - Mindset Questions

**Question Design Principles:**
- Normalize different feelings about writing
- Use "most students feel..." to reduce isolation
- Avoid judgment language
- Look for growth mindset indicators
- Understand motivation sources

**Sample Question Flow:**

**Q1: Current Feelings**
- "How do you feel about writing in general?"
- "Many students have mixed feelings - some parts they like, some they don't. What about you?"
- Follow-up: "What parts do you like?" / "What parts feel hard?"

**Q2: Past Experiences**
- "Think about a time when you felt good about your writing. What made it feel good?"
- "Think about a time when writing felt really hard. What made it difficult?"
- Purpose: Identify confidence sources and blockers

**Q3: Confidence Level**
- "If you had to rate your confidence in writing, where would you put yourself?"
- Scale: 1 (not confident) to 5 (very confident)
- Follow-up: "What would help you feel more confident?"

**Q4: Growth Mindset Check**
- "Some people think you're either a 'good writer' or 'not a good writer.' Others think anyone can improve with practice. What do you think?"
- Listen for: fixed mindset vs. growth mindset indicators

**Q5: Motivation**
- "Why do you want to improve your writing?"
- Listen for: grades, college, self-expression, creativity, communication
- Purpose: Tailor encouragement and goals

**Q6: Learning Preferences**
- "When you're learning something new, do you prefer:"
  - Working through it on your own first?
  - Getting help right away?
  - Trying, making mistakes, then getting help?
- Purpose: Set feedback frequency and support level

**Q7: Feedback Comfort**
- "How do you feel about getting feedback on your writing?"
- "What kind of feedback helps you most?"
- Purpose: Calibrate feedback tone and detail level

**Data Captured:**
```json
{
  "mindset": {
    "writing_feelings": "loves|likes|neutral|dislikes|fears",
    "likes_about_writing": ["creative", "expressing_ideas", "learning", "structure"],
    "challenges": ["starting", "organizing", "grammar", "word_choice", "finishing"],
    "positive_writing_memory": "string",
    "difficult_writing_memory": "string",
    "confidence_level": 1-5,
    "confidence_blockers": ["grammar_anxiety", "comparison_to_others", "past_criticism"],
    "growth_mindset": "strong|moderate|fixed",
    "motivation_sources": ["grades", "college", "self_expression", "career", "personal_growth"],
    "learning_preference": "independent|guided|trial_and_error",
    "feedback_preference": "direct|gentle|detailed|brief",
    "feedback_comfort": 1-5
  }
}
```

---

### Phase 4: Scenario-Based Writing Assessment

**Assessment Philosophy:**

Instead of a generic writing test, we create an engaging scenario based on the student's interests from Phases 2-3. The assessment feels like practice exercises, not a test. Students complete 3 short exercises (1-2 minutes each) within a single contextual scenario.

**Benefits:**
- More engaging (uses their interests)
- Less test anxiety (feels like practice)
- Better assessment (multiple data points vs. one essay)
- Natural conversation flow
- Assesses multiple skills efficiently

---

**Step 1: Scenario Selection**

**Selection Logic:**
Based on student's interests and context from Phase 2, select ONE scenario theme:

| Interest Area | Scenario Theme | Example Context |
|---------------|----------------|-----------------|
| Sports | A big game or competition | "You're preparing for the championship game" |
| Gaming | A favorite game or strategy | "You just discovered a new strategy in your game" |
| Music | A concert or favorite artist | "You're going to see your favorite artist live" |
| Art/Creative | A creative project | "You're creating something for an art show" |
| Books/Reading | A favorite book or character | "You just finished an amazing book" |
| Social/Friends | A friend situation | "You're planning something special with friends" |
| Animals/Pets | Pet care or animal interest | "You're teaching someone about caring for pets" |
| Science/Tech | A discovery or experiment | "You learned something fascinating in science" |
| Travel/Places | A place they love | "You're showing someone your favorite place" |
| Food/Cooking | A meal or recipe | "You're teaching someone to make your favorite food" |

**Personalization Example:**
- **Maya (from Phase 2/3):** Loves soccer, wants to write about sports
- **Selected Scenario:** "The Championship Game"
- **Context:** "You're a soccer player preparing for the biggest game of the season"

---

**Step 2: Scenario Introduction**

**Introduction Template:**

```
Great! Now let's do some writing practice together. This isn't a test -
it's just a chance for me to see how you write so I can help you improve.

Since you mentioned you love [INTEREST], let's write about that!

Here's the scenario:
[PERSONALIZED SCENARIO DESCRIPTION]

I'll ask you to do 3 short exercises - each will take 1-2 minutes.
Ready? Let's start!
```

**Example (Maya - Soccer Scenario):**

```
Great! Now let's do some writing practice together. This isn't a test -
it's just a chance for me to see how you write so I can help you improve.

Since you mentioned you love soccer, let's write about that!

Here's the scenario:
You're a soccer player, and your team just made it to the championship game.
It's this weekend, and you're both excited and nervous.

I'll ask you to do 3 short exercises about this scenario - each will take
1-2 minutes. We'll practice different writing skills together.

Ready? Let's start!
```

---

**Step 3: Three Mini-Exercises**

**Exercise Sequence:**
The 3 exercises are selected from the Writing-Communication Playbook to assess different dimensions:

1. **Exercise 1:** Assesses Language & Style + Content
2. **Exercise 2:** Assesses Organization + Mechanics
3. **Exercise 3:** Assesses Content & Ideas + Integration

---

**Exercise 1: Sentence Expansion (Show Don't Tell)**
*Based on Playbook: Exercise 1 (Sentence Expansion) + Exercise 3 (Show Don't Tell)*

**Skill Focus:** Language & Style, Descriptive Details

**Instructions:**
```
Exercise 1: Show How You Feel (1-2 minutes)

Instead of saying "I feel nervous about the game," SHOW me how nervousness feels.

Write 2-3 sentences that describe:
- What your body feels like
- What you're doing
- What you're thinking

Example: "My hands won't stop shaking as I tie my cleats. I keep checking
the clock, wishing the game would start already so I can stop thinking about it."

Your turn - show me the feeling:
```

**What This Assesses:**
- **Language & Style (Primary):** Descriptive language, word choice, showing vs. telling
- **Content:** Ability to add specific details
- **Mechanics (Secondary):** Basic grammar, spelling, punctuation

**Scoring Criteria:**

| Level | What We Look For |
|-------|------------------|
| **Beginner (1-2)** | - Generic descriptions ("I am nervous")<br>- Very basic vocabulary<br>- 1-2 simple sentences<br>- Tells rather than shows |
| **Intermediate (3-4)** | - Some specific details ("my heart beats fast")<br>- Attempts at showing<br>- 2-3 sentences with some variety<br>- Some descriptive words |
| **Advanced (4-5)** | - Vivid, specific details ("My stomach churns")<br>- Effective showing through action/sensory details<br>- Varied sentence structure<br>- Strong word choices |

---

**Exercise 2: Quick Paragraph Builder**
*Based on Playbook: Exercise 4 (Paragraph Builder)*

**Skill Focus:** Organization, Structure

**Instructions:**
```
Exercise 2: Build a Paragraph (2 minutes)

Write ONE paragraph about why this championship game is important to you.

Use this structure:
1. Start with a topic sentence (main idea)
2. Add 2-3 supporting details
3. End with a concluding sentence

Example structure:
"This championship game means everything to me. [DETAIL 1]. [DETAIL 2].
[DETAIL 3]. [CONCLUDING THOUGHT]."

Your turn:
```

**What This Assesses:**
- **Organization (Primary):** Paragraph structure, logical flow
- **Content:** Development of ideas with supporting details
- **Mechanics (Secondary):** Sentence construction, punctuation

**Scoring Criteria:**

| Level | What We Look For |
|-------|------------------|
| **Beginner (1-2)** | - No clear structure<br>- Missing topic sentence<br>- Few or no supporting details<br>- Ideas don't connect<br>- Frequent mechanical errors |
| **Intermediate (3-4)** | - Basic structure present<br>- Topic sentence exists<br>- 1-2 supporting details<br>- Some logical flow<br>- Some mechanical errors |
| **Advanced (4-5)** | - Clear structure followed<br>- Strong topic sentence<br>- 2-3 well-developed details<br>- Smooth flow and transitions<br>- Few mechanical errors |

---

**Exercise 3: Opening Line + Continuation**
*Based on Playbook: Exercise 2 (Five Opening Lines)*

**Skill Focus:** Content & Ideas, Engagement, Integration

**Instructions:**
```
Exercise 3: Hook Your Reader (2 minutes)

Imagine you're writing a story about the championship game for your school
newspaper. Write an opening sentence that grabs attention, then continue
for 2-3 more sentences.

Tips for great openings:
- Start with action or dialogue
- Use specific details
- Make readers curious

Example: "The whistle blew, and everything I'd practiced for the past three
months came down to this moment."

Your turn - write your opening and continue:
```

**What This Assesses:**
- **Content & Ideas (Primary):** Engagement, creativity, idea development
- **Language & Style:** Voice, tone, sentence variety
- **Integration:** Can they synthesize what they've practiced?

**Scoring Criteria:**

| Level | What We Look For |
|-------|------------------|
| **Beginner (1-2)** | - Generic opening ("I played in a game")<br>- Limited continuation<br>- Basic ideas only<br>- No clear voice |
| **Intermediate (3-4)** | - Somewhat engaging opening<br>- Continues for 2-3 sentences<br>- Some voice/personality<br>- Adequate detail |
| **Advanced (4-5)** | - Engaging, specific opening<br>- Strong continuation with detail<br>- Clear voice and style<br>- Makes reader want more |

---

**Step 4: Skill Classification System**

**Assessment Criteria:**

**Skill Level Dimensions:**

1. **Content & Ideas** (Weight: 30%)
   - Clear main ideas
   - Relevant details and examples
   - Development and depth of thoughts
   - *Assessed primarily in: Exercise 2, Exercise 3*

2. **Organization** (Weight: 25%)
   - Logical flow
   - Paragraph structure
   - Use of topic/concluding sentences
   - *Assessed primarily in: Exercise 2*

3. **Language & Style** (Weight: 25%)
   - Sentence variety
   - Word choice and vocabulary
   - Voice/tone
   - Show don't tell technique
   - *Assessed primarily in: Exercise 1, Exercise 3*

4. **Mechanics** (Weight: 20%)
   - Grammar accuracy
   - Spelling
   - Punctuation
   - Sentence construction
   - *Assessed across all exercises*

**Overall Classification Rubric:**

| Level | Description | Characteristics |
|-------|-------------|-----------------|
| **Beginner (1.0-2.4)** | Developing foundational skills | - Mostly simple sentences<br>- Limited vocabulary<br>- Basic ideas with little detail<br>- Frequent grammar/spelling errors<br>- Minimal organization<br>- Tells rather than shows |
| **Intermediate (2.5-3.9)** | Building competency | - Some sentence variety<br>- Adequate vocabulary<br>- Main ideas with some details<br>- Some grammar/spelling errors<br>- Basic organization present<br>- Attempts at showing |
| **Advanced (4.0-5.0)** | Demonstrating proficiency | - Good sentence variety<br>- Strong vocabulary<br>- Clear ideas with rich details<br>- Few grammar/spelling errors<br>- Clear organization<br>- Effective showing vs. telling |

---

**Step 5: AI Evaluation Process**

```python
# Pseudo-code for scenario-based skill classification

def classify_writing_skill_scenario(exercise_responses, student_context):
    """
    Analyzes student responses across 3 mini-exercises and classifies skill level

    Args:
        exercise_responses: Dict containing responses to 3 exercises
        student_context: Personal context from phases 2-3

    Returns:
        skill_level: "beginner" | "intermediate" | "advanced"
        dimension_scores: Dict of scores per dimension
        strengths: List of specific strengths
        areas_to_improve: List of specific areas
        exercise_scores: Individual scores per exercise
    """

    # 1. Score each exercise
    ex1_scores = score_exercise_1(
        exercise_responses['exercise_1'],
        focus=['language', 'content', 'mechanics']
    )

    ex2_scores = score_exercise_2(
        exercise_responses['exercise_2'],
        focus=['organization', 'content', 'mechanics']
    )

    ex3_scores = score_exercise_3(
        exercise_responses['exercise_3'],
        focus=['content', 'language']
    )

    # 2. Calculate dimension scores (weighted average across exercises)
    content_score = weighted_avg([
        (ex2_scores['content'], 0.5),   # Exercise 2 is primary
        (ex3_scores['content'], 0.3),   # Exercise 3 is secondary
        (ex1_scores['content'], 0.2)    # Exercise 1 is tertiary
    ])

    organization_score = ex2_scores['organization']  # Primarily from Ex 2

    language_score = weighted_avg([
        (ex1_scores['language'], 0.5),  # Exercise 1 is primary
        (ex3_scores['language'], 0.5)   # Exercise 3 is secondary
    ])

    mechanics_score = weighted_avg([
        ex1_scores['mechanics'],
        ex2_scores['mechanics'],
        ex3_scores['mechanics']
    ])

    # 3. Calculate weighted overall score
    overall_score = (
        content_score * 0.30 +
        organization_score * 0.25 +
        language_score * 0.25 +
        mechanics_score * 0.20
    )

    # 4. Classify into level
    if overall_score < 2.5:
        skill_level = "beginner"
    elif overall_score < 4.0:
        skill_level = "intermediate"
    else:
        skill_level = "advanced"

    # 5. Identify specific strengths and areas to improve
    dimension_scores = {
        "content": content_score,
        "organization": organization_score,
        "language": language_score,
        "mechanics": mechanics_score
    }

    strengths = identify_strengths(dimension_scores, exercise_responses)
    areas_to_improve = identify_areas_to_improve(dimension_scores, exercise_responses)

    return {
        "skill_level": skill_level,
        "overall_score": overall_score,
        "dimension_scores": dimension_scores,
        "exercise_scores": {
            "exercise_1": ex1_scores,
            "exercise_2": ex2_scores,
            "exercise_3": ex3_scores
        },
        "strengths": strengths,
        "areas_to_improve": areas_to_improve,
        "scenario_theme": student_context['interests'][0]
    }
```

---

**Step 6: Complete Example - Maya's Assessment**

**Maya's Context:**
- Interest: Soccer
- Motivation: Better grades, possibly write about sports
- Confidence: 3/5
- Challenge: Getting started and organizing thoughts

**Scenario:** Championship Soccer Game

---

**Exercise 1 - Show Don't Tell**

**Maya's Response:**
```
My legs feel like jelly when I think about the game. I keep tying and
retying my shoelaces even though they're already tight. Every time I
close my eyes, I see the other team's star player zooming past me.
```

**AI Analysis:**
- **Language & Style: 4.0** - Good showing ("legs feel like jelly"), action details (tying shoelaces), visual imagery
- **Content: 3.5** - Specific sensory details, personal actions
- **Mechanics: 4.0** - Clean grammar, proper punctuation, varied sentences

---

**Exercise 2 - Paragraph Builder**

**Maya's Response:**
```
This championship game is the most important thing happening to me right
now. Our team has worked so hard all season practicing drills and building
teamwork. If we win it will prove that all the early morning practices
were worth it. Plus my parents are coming to watch and I want to make them
proud. This game could be the highlight of my whole year.
```

**AI Analysis:**
- **Organization: 2.5** - Has topic sentence and supporting ideas, but lacks clear structure; run-on at the end; missing transitions
- **Content: 3.5** - Multiple supporting details (practices, parents, importance)
- **Mechanics: 3.0** - Missing comma in "If we win, it will"; run-on sentence structure

---

**Exercise 3 - Opening Line + Continuation**

**Maya's Response:**
```
The championship game is tomorrow and I can barely sleep. I've been
playing soccer since I was six years old and this feels like what all
that practice was building toward. My team is counting on me to play
defense against their best striker.
```

**AI Analysis:**
- **Content & Ideas: 3.5** - Engaging scenario, personal context, stakes established
- **Language & Style: 3.0** - Clear voice, but somewhat straightforward; could be more vivid
- **Overall Engagement: 3.5** - Draws reader in with personal stakes

---

**Maya's Final Classification:**

```json
{
  "skill_level": "intermediate",
  "overall_score": 3.3,
  "dimension_scores": {
    "content": 3.5,
    "organization": 2.5,
    "language": 3.3,
    "mechanics": 3.3
  },
  "exercise_scores": {
    "exercise_1": {
      "language": 4.0,
      "content": 3.5,
      "mechanics": 4.0
    },
    "exercise_2": {
      "organization": 2.5,
      "content": 3.5,
      "mechanics": 3.0
    },
    "exercise_3": {
      "content": 3.5,
      "language": 3.0
    }
  },
  "strengths": [
    "Uses descriptive details effectively (showed nervousness through body language)",
    "Includes specific examples and personal context",
    "Clear voice and personality in writing",
    "Good grasp of basic mechanics"
  ],
  "areas_to_improve": [
    "Paragraph organization and structure (primary focus)",
    "Use of transitions to connect ideas",
    "Sentence variety and complexity",
    "Punctuation in complex sentences"
  ],
  "scenario_theme": "soccer"
}
```

**Result:** Maya is classified as **Intermediate** with a primary focus area of **Organization**.

---

**Step 7: Scenario Templates by Interest**

**Template Structure for Each Scenario:**

1. Scenario introduction (personalized to their interest)
2. Exercise 1: Show Don't Tell within scenario
3. Exercise 2: Paragraph Builder within scenario
4. Exercise 3: Opening Line within scenario

**Example Templates:**

**Gaming Scenario:**
```
Scenario: "You just discovered an amazing strategy in your favorite game."

Exercise 1: Show how excited you feel about this discovery (body language, actions)
Exercise 2: Write a paragraph explaining why this strategy is so good
Exercise 3: Write an opening for a guide teaching others this strategy
```

**Music Scenario:**
```
Scenario: "You're going to see your favorite artist in concert next week."

Exercise 1: Show your excitement about the upcoming concert
Exercise 2: Write a paragraph about why this artist means so much to you
Exercise 3: Write an opening describing the moment the concert starts
```

**Books Scenario:**
```
Scenario: "You just finished reading an amazing book."

Exercise 1: Show how the book made you feel
Exercise 2: Write a paragraph about what made the book so good
Exercise 3: Write an opening for a book review
```

**All scenarios follow the same assessment structure** while feeling personalized and engaging.

---

**Validation & Adjustment:**

- **Week 1 Performance Check:** Compare classification accuracy with actual performance
- **Adjustment Triggers:**
  - Student finds all exercises too easy → Re-classify up one level
  - Student struggles significantly → Re-classify down one level
  - Specific dimension is off → Adjust focus areas
- **Target Accuracy:** 85%+ accurate classification by end of Week 1
- **Feedback Loop:** System learns from adjustments to improve future classifications

---

### Phase 5: Results & Personalized Plan

**Result Presentation Principles:**
- Always start with positives
- Frame level as "starting point" not "judgment"
- Emphasize growth potential
- Connect to student's goals
- Provide clear next steps

**Results Message Template:**

```
Great work! I learned a lot from reading your writing.

Here's what I noticed:

[STRENGTHS - always list 2-3 specific things]
✓ Your main idea was clear
✓ You included specific details
✓ Your writing had personality

[GROWTH AREAS - frame as opportunities]
→ We'll work on organizing paragraphs
→ We'll practice varying sentence length
→ We'll build your vocabulary

Based on what I learned about you, I created a 2-week learning plan just for you.

Your plan focuses on:
1. [Skill area 1 - connected to their interests]
2. [Skill area 2]
3. [Skill area 3]

Ready to start? Your first exercise will take about 10 minutes.
```

**Personalized Learning Plan Components:**

**Week 1 Focus:**
- Primary skill to develop (based on weakest area)
- 2-3 exercises from playbook (matched to skill level)
- Practice frequency (based on available time)
- Progress check on Day 3

**Week 2 Focus:**
- Secondary skill to develop
- 2-3 new exercises
- One revision exercise (improve Week 1 writing)
- End-of-week reflection

**Personalization Factors:**

```python
def generate_learning_plan(student_profile):
    """
    Creates personalized 2-week learning plan

    Inputs:
        - Skill level classification
        - Lifestyle context
        - Mindset data
        - Writing assessment results

    Outputs:
        - Week-by-week plan
        - Exercise recommendations
        - Practice schedule
        - Motivational framing
    """

    # Determine primary focus area
    primary_focus = student_profile.areas_to_improve[0]

    # Select exercises matched to skill level
    if student_profile.skill_level == "beginner":
        exercises = get_foundational_exercises(primary_focus)
    elif student_profile.skill_level == "intermediate":
        exercises = get_intermediate_exercises(primary_focus)
    else:
        exercises = get_advanced_exercises(primary_focus)

    # Adapt to available time
    if student_profile.available_time == "5-10":
        exercises = filter_by_duration(exercises, max_duration=10)

    # Personalize prompts to interests
    exercises = personalize_prompts(
        exercises,
        student_profile.interests
    )

    # Set practice schedule
    schedule = create_schedule(
        student_profile.preferred_practice_time,
        student_profile.available_time
    )

    # Frame with appropriate motivation
    motivation = get_motivational_message(
        student_profile.motivation_sources
    )

    return LearningPlan(
        primary_focus=primary_focus,
        exercises=exercises,
        schedule=schedule,
        motivation=motivation
    )
```

**Example Personalized Plans:**

**Profile A: Beginner, Loves Gaming, 10min/day, Growth Mindset**
```
Your 2-Week Writing Plan

Week 1: Building Strong Sentences
- Day 1: Sentence Expansion (using gaming examples)
- Day 2: Show Don't Tell (describe a game scene)
- Day 3: Practice + Reflection
- Day 4: Sentence Expansion 2
- Day 5: Weekly Check-in

Week 2: Adding Details
- Day 1: Descriptive Details (your favorite game)
- Day 2: Paragraph Builder (why you like gaming)
- Day 3: Practice + Reflection
- Day 4: Revision Challenge (improve Day 2 writing)
- Day 5: Celebrate Progress!

Daily Practice: 10 minutes each evening
Your strength: You have great ideas! Let's work on expressing them clearly.
```

**Profile B: Intermediate, Anxious, 15min/day, Wants Better Grades**
```
Your 2-Week Writing Plan

Week 1: Organizing Your Ideas
- Day 1: Paragraph Structure (clear formula to follow)
- Day 2: Transition Words (connect your ideas)
- Day 3: Practice + Reflection
- Day 4: Paragraph Builder
- Day 5: Weekly Check-in + Feedback

Week 2: Polishing Your Writing
- Day 1: Revision Checklist (step-by-step process)
- Day 2: Grammar Quick Wins (fix common errors)
- Day 3: Practice + Reflection
- Day 4: Revise Week 1 writing (see your progress!)
- Day 5: Celebrate + Plan Next Week

Daily Practice: 15 minutes after school
Your strength: You already write well! Let's make it even better with structure.
```

**Data Saved to Profile:**
```json
{
  "student_id": "uuid",
  "onboarding_date": "2025-11-03",
  "skill_classification": {
    "level": "intermediate",
    "dimension_scores": {
      "content": 3.5,
      "organization": 2.8,
      "language": 3.2,
      "mechanics": 3.0
    },
    "strengths": ["clear ideas", "good details", "engaging voice"],
    "areas_to_improve": ["paragraph organization", "transitions", "sentence variety"]
  },
  "lifestyle": { ... },
  "mindset": { ... },
  "learning_plan": {
    "week_1_focus": "organization",
    "week_2_focus": "revision",
    "exercises": [...],
    "schedule": { ... }
  },
  "first_writing_sample": "string",
  "onboarding_completed": true
}
```

---

## User Experience Requirements

### Conversational Design

**Tone & Voice:**
- Friendly but professional
- Encouraging without being condescending
- Age-appropriate (13-16 year olds)
- Avoids educational jargon
- Uses "we" language (we're in this together)

**Example Good vs. Bad:**

❌ **Bad:** "Your writing demonstrates insufficient mastery of syntactic complexity."

✅ **Good:** "Let's work on mixing up your sentence lengths - it'll make your writing more interesting to read!"

**Response Handling:**
- Acknowledge every response positively
- Ask follow-up questions naturally
- Connect answers to value ("This helps me...")
- Allow students to skip uncomfortable questions
- Validate feelings and experiences

**Progress Indicators:**
- Show progress bar (e.g., "Step 2 of 5")
- Indicate time remaining ("About 5 more minutes")
- Celebrate milestones ("Halfway there!")

### Accessibility Requirements

**Technical:**
- Mobile-responsive design
- Works on tablets and phones
- Supports keyboard navigation
- Screen reader compatible
- Minimum font size: 16px

**Language:**
- Simple sentence structure
- 8th grade reading level maximum
- Define any complex terms
- Use examples and analogies
- Visual aids where helpful

**Timing:**
- Auto-save all responses
- Allow pause and resume
- No strict time limits (guidance only)
- Option to extend writing time

---

## Technical Requirements

### Model Usage

**Primary Model:** GPT-4.5
- **Use cases:**
  - Analyzing writing samples
  - Classifying skill level
  - Generating personalized plans
  - Creating adaptive follow-up questions

**Rationale:** High-quality reasoning needed for accurate assessment and plan generation. Latency acceptable during onboarding (one-time process).

### Data Storage

**Required Fields:**
```json
{
  "student_profile": {
    "id": "uuid",
    "created_at": "timestamp",
    "onboarding_completed": true,
    "lifestyle": { ... },
    "mindset": { ... },
    "skill_assessment": { ... },
    "learning_plan": { ... },
    "first_writing_sample": "string"
  }
}
```

**Storage Requirements:**
- Encrypted at rest
- Access controls (student only)
- Retention: Duration of course + 30 days
- Export functionality (GDPR compliance)

### Performance Requirements

**Latency:**
- Conversational responses: < 2 seconds
- Writing analysis: < 10 seconds
- Plan generation: < 5 seconds
- Total onboarding time: 10-15 minutes

**Availability:**
- 99% uptime during school hours
- Graceful degradation if AI unavailable
- Save progress for completion later

### Security & Privacy

**Data Protection:**
- No sharing with third parties
- No advertising use
- Compliant with COPPA (under 13) and student privacy laws
- Parent notification of data collection

**Age-Appropriate AI:**
- Content filtering
- Safe prompts only
- No personal information requests beyond necessary
- Monitored for inappropriate content

---

## Success Metrics

### Completion Metrics
- **Onboarding completion rate:** Target 80%+
- **Average completion time:** Target 10-15 minutes
- **Drop-off points:** Monitor where students leave

### Quality Metrics
- **Skill classification accuracy:** Validated after Week 1 (target 85%+ accuracy)
- **Plan completion rate:** % of students who complete Week 1 plan (target 70%+)
- **Re-engagement rate:** % returning after Day 1 (target 75%+)

### Satisfaction Metrics
- **Post-onboarding survey:** "How did that feel?" (target 4/5 stars)
- **Plan relevance:** "Does this plan fit you?" (target 4/5 stars)
- **Confidence shift:** "Do you feel more confident about improving?" (target 80% yes)

### Learning Metrics
- **Skill progression:** Improvement in target areas after 2 weeks
- **Exercise completion:** % of assigned exercises completed
- **Quality improvement:** Compare Week 1 vs Week 2 writing samples

---

## Edge Cases & Error Handling

### Student provides minimal answers
- **Scenario:** One-word responses, "I don't know"
- **Solution:** Provide multiple-choice options, give examples, reassure no wrong answers

### Student writes below expected level
- **Scenario:** Writing suggests much lower level than age
- **Solution:** Start with simplest exercises, provide extra support, consider flagging for teacher review

### Student writes far above expected level
- **Scenario:** Already very proficient writer
- **Solution:** Acknowledge strength, focus on refinement skills, offer advanced challenges

### Student expresses severe writing anxiety
- **Scenario:** "I hate writing," "I'm terrible at this," "I can't do this"
- **Solution:** Validate feelings, normalize struggle, emphasize growth, offer encouragement, start with very small wins

### Technical failures during assessment
- **Scenario:** Writing sample not saved, AI analysis fails
- **Solution:** Auto-save frequently, allow restart from last checkpoint, have backup classification method

### Student provides contradictory information
- **Scenario:** Says confident but writes at beginner level
- **Solution:** Trust the writing sample, frame positively ("You have potential!")

---

## Out of Scope

**V1 will NOT include:**
- Parent portal or login
- Comparison to other students
- Public sharing of writing
- Real-time collaboration
- Video or audio components
- Gamification/badges (future consideration)
- Multiple language support (English only)
- Teacher dashboard (future iteration)

---

## Future Enhancements

**V2 Considerations:**
- Adaptive difficulty during onboarding (adjust questions based on answers)
- Voice input option for responses
- Visual learning style assessment
- Peer connection suggestions
- Parental involvement options
- Progress sharing with teachers

**V3 Considerations:**
- Multi-modal assessment (voice, video)
- Community features
- Writing portfolio
- Achievement system

---

## Open Questions

1. **Should we allow students to skip the writing assessment?**
   - Pro: Reduces anxiety, faster onboarding
   - Con: Less accurate classification
   - **Decision needed:** Minimum requirement?

2. **How do we handle students who want to skip personal questions?**
   - **Proposal:** Make lifestyle/mindset questions optional but explain value
   - Default to neutral settings if skipped

3. **Should we show the skill level classification to students?**
   - Pro: Transparency
   - Con: May increase anxiety or comparison
   - **Proposal:** Show strengths/focus areas but not explicit "level" label

4. **What if a student wants to retake the assessment?**
   - **Proposal:** Allow retake once per week, explain that practice is better than retaking

5. **How do we validate classification accuracy?**
   - **Proposal:** Week 1 performance review, adjust if consistently too easy/hard

---

## Appendix

### Example Complete Onboarding Flow

**Student: Maya, 14 years old**

**Phase 1: Welcome (2 min)**
- System welcomes Maya
- Explains 10-minute process
- Sets expectations

**Phase 2: Lifestyle (4 min)**
- Q: "What's your typical day like?"
- A: "School until 3, soccer practice 3 days/week, homework at night"
- Q: "When do you feel most focused?"
- A: "Morning and right after school"
- Q: "What kind of writing do you do now?"
- A: "Mostly school essays, sometimes journal about soccer"
- Q: "Do you read for fun?"
- A: "Yeah, mostly sports biographies and manga"
- Q: "What do you like to do besides school?"
- A: "Soccer, hanging with friends, TikTok"
- Q: "How much time could you practice writing each day?"
- A: "Maybe 10-15 minutes"

**Phase 3: Mindset (3 min)**
- Q: "How do you feel about writing?"
- A: "It's okay. I like creative stuff but essays are hard"
- Q: "What makes essays hard?"
- A: "Getting started and organizing my thoughts"
- Q: "On a scale of 1-5, how confident are you in writing?"
- A: "Probably a 3"
- Q: "Do you think anyone can become a better writer with practice?"
- A: "Yeah, definitely. Just like soccer practice"
- Q: "Why do you want to improve?"
- A: "Better grades, and I might want to write about sports someday"

**Phase 4: Assessment (5 min)**
- Prompt: "Explain soccer to someone who's never played"
- Maya writes 200 words about soccer basics
- **AI Analysis:**
  - Content: 3.5 (clear ideas, good details)
  - Organization: 2.5 (needs structure)
  - Language: 3.0 (conversational, some variety)
  - Mechanics: 3.5 (few errors)
  - **Classification: Intermediate**

**Phase 5: Plan (2 min)**
- System shows strengths: "Your ideas are clear and you included great details about soccer!"
- Shows focus areas: "Let's work on organizing paragraphs and transitions"
- Presents 2-week plan:
  - Week 1: Paragraph structure (using sports examples)
  - Week 2: Transitions and flow
  - Schedule: 15 min right after school
- First exercise: Paragraph Builder (sports topic)

**Total time: 16 minutes**

---

## Testing Plan

### Alpha Testing (Week 1)
- **Users:** 10 students (ages 13-16, varied skill levels)
- **Focus:** Flow, timing, clarity
- **Metrics:** Completion rate, time, feedback

### Beta Testing (Week 2-3)
- **Users:** 50 students
- **Focus:** Classification accuracy, plan effectiveness
- **Metrics:** All success metrics, Week 1 validation

### Launch (Week 4)
- **Users:** Full rollout
- **Focus:** Monitor metrics, gather feedback
- **Iteration:** Weekly improvements based on data

---

*Last Updated: 2025-11-03*
*Status: Draft - Ready for Review*
*Aligned with: Problem First AI Capstone - English Writing Skills (Ages 13-16)*
