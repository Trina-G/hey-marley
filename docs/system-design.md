# Architecture Iterations

## Overview

This document tracks the architecture evolution across three iterations using lean development principles.

### Core Use Case

**Problem:** Generic writing lessons fail to engage students because they ignore individual interests, skill levels, and learning patterns.

**Solution:** AI-powered learning app that personalizes exercises based on each student's context and abilities for higher engagement and faster learning.

### Business Constraints

- **Cost:** Budget-conscious implementation (~$1-3 per student per iteration)
- **Latency:** Real-time processing with minimal wait times for maximum engagement and learning efficiency
- **Privacy:** PI/data privacy compliance (GDPR, age-appropriate for 13-16 year olds)
- **Safety:** Age-appropriate content filtering, moderation of AI responses to prevent harmful outputs, educational guardrails to ensure constructive learning environment, protection against manipulation or inappropriate interactions
- **Regulatory:** HITL (Human-in-the-Loop) review mandatory for iteration validation

---

### Iteration 1: Onboarding Workflow
**Goal:** Assess student skill level and recommend three suitable focus areas
**Architecture:** 2 LangFlow flows + external orchestration (App)
**UI:** Form-based (Q&A + exercise submission)
**Key Components:** Fixed Q&A → Scenario generation → Writing assessment → Goal generation

### Iteration 2: Conversational Agent + RAG + Memory
**Goal:** Dynamic daily exercises with adaptive learning
**Architecture:** 2 additional LangFlow flows + RAG + learning history database
**UI:** Chat-based (conversational exercise sessions)

**User Flow:**
1. Student selects focus area → App retrieves curriculum (RAG) + learning history → Calls Flow 3
2. Student practices writing in chat loop with agent
3. Student ends session → Flow 4 generates feedback & updates learning history

**Key Components:** Curriculum RAG + Learning history → Conversational exercise agent → Session feedback & progress tracking

### Iteration 3: Multi-Agent Conversational System
**Goal:** Conversational tutor with specialized agents
**Architecture:** Multi-agent orchestration with chat interface
**UI:** Conversational (multi-turn chat with agents)

**User Flow:**
1. Student messages → Coordinator analyzes & routes to specialist (Writing Coach/Grammar Checker/Progress Tracker/Idea Generator)
2. Specialist responds using tools (summarization, style analysis) → Multi-turn conversation with agent handoffs
3. Session ends → Progress summary with agent-specific insights

**Key Components:** Coordinator agent routes to 4 specialists (Writing Coach, Grammar Checker, Progress Tracker, Idea Generator) with analysis tools

---

### UI Progression

| Iteration | Interface | Interaction Pattern | User Experience |
|-----------|-----------|---------------------|-----------------|
| 1 | Forms | Q&A → Submit exercises → View results | Quick, focused |
| 2 | Chat | Conversational exercise with single agent | Guided, interactive |
| 3 | Chat | Multi-turn conversation with agents | Engaging, guided |

### Key Metrics by Iteration

| Iter. | Cost/Latency Factors | Optimizations | Guardrails | Eval Metrics |
|-------|---------------------|---------------|------------|--------------|
| 1 | 2 LLM calls | Assessment prompts | Content filtering | Goal relevance, assessment accuracy |
| 2 | + Vector DB, 4-7 LLM calls | RAG + history context | Access control, moderation | RAG retrieval relevance, conversation coherence, mistake detection accuracy |
| 3 | + Multi-agent coordination | ReAct, routing, memory | Multi-layer filtering, HITL | Agent routing accuracy, tool use success rate, response consistency across agents, coordination efficiency |

**Metrics Details:**

**Iteration 1:**
- **Cost/Latency:** 2 sequential LLM calls (scenario generation + assessment)
- **Optimizations:** Refined prompts reduce tokens and improve response quality
- **Guardrails:** Content filtering blocks inappropriate or harmful outputs for ages 13-16
- **Eval Metrics:** Goal relevance (alignment with student interests), assessment accuracy (correct skill level detection)

**Iteration 2:**
- **Cost/Latency:** Adds vector DB queries + 3 additional LLM calls per chat session (retrieval, generation, feedback)
- **Optimizations:** RAG reduces hallucinations; learning history provides personalized context
- **Guardrails:** Context injection prevention (validates RAG inputs), content moderation (real-time filtering), rate limiting (prevents abuse), history sanitization (protects student privacy)
- **Eval Metrics:** RAG retrieval relevance (correct curriculum/history retrieved), conversation coherence (natural dialogue flow), mistake detection accuracy (identifies recurring errors)

**Iteration 3:**
- **Cost/Latency:** Multi-agent coordination overhead with routing decisions and multiple specialist LLM calls
- **Optimizations:** ReAct pattern (reasoning before acting), smart routing (right agent for task), shared memory (context across agents)
- **Guardrails:** Multi-layer filtering (each agent + coordinator), HITL (human review for validation)
- **Eval Metrics:** Agent routing accuracy (correct specialist selected), tool use success rate (effective use of analysis tools), response consistency (coherent answers across agents), coordination efficiency (minimal routing overhead)

---

## Iteration 1: Onboarding Workflow

### Flow Diagram

```
┌──────┐
│ User │ New student starts
└───┬──┘
    │
    ↓
┌─────────────────────────┐
│ Fixed Q&A (No LLM)      │
│ • Lifestyle questions   │
│ • Mindset questions     │
└──────────┬──────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ LLM Call 1: Scenario Generation      │ ← LangFlow Flow 1
│ IN:  lifestyle + mindset             │    GPT-4.5
│ OUT: Personalized scenario +         │    ~$0.04
│      3 exercise prompts              │
└──────────┬───────────────────────────┘
           │
           ↓
┌─────────────────────────┐
│ User Writes (5-10 min)  │
│ • Exercise 1, 2, 3      │
└──────────┬──────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ LLM Call 2: Assessment + Plan        │ ← LangFlow Flow 2
│ IN:  exercise responses +            │    GPT-4.5
│      student context                 │    ~$0.09
│ OUT: skill assessment +              │
│      3 learning focus areas -             │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────┐
│ Student Profile Created  │
│ + Learning focus area   │
└──────────────────────────┘
```

### LangFlow Components

**Flow 1 (Scenario Generation):**
- Input node
- Prompt template
- OpenAI Model (GPT-4.5)
- Output parser

**Flow 2 (Assessment + Plan):**
- Input node
- Prompt template
- OpenAI Model (GPT-4.5)
- Output parser

### Key Details

**LLM Calls:**
- **Flow 1 (Scenario Gen):** Creates engaging writing prompts based on student interests
- **Flow 2 (Assessment + Plan):** Evaluates writing, classifies skill level, generates personalized plan

**Why Combined former Flow 2 and 3?**
- No user interaction needed between assessment and plan
- 24% cost savings vs separate flows
- Lower latency

**State Management:**
- External database (not LangFlow memory)
- Session state persists across flow calls
- Survives page refreshes

---

## Iteration 2: RAG + Session Memory

### Flow Diagram

```
┌──────────────────────────────────────┐
│ ONBOARDING (Iteration 1 - unchanged) │
└────────────────┬─────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│ Student Profile + Focus Learning Topic (Goal)        │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ DAILY PRACTICE LOOP (New)                       │
│                                                  │
│  User logs in → Need exercise?                   │
│         ↓                                        │
│  ┌─────────────────────────────┐                │
│  │ 1. Load Learning History    │                │
│  │    • Last 5 exercises       │                │
│  │    • Recurring mistakes     │                │
│  │    • Progress trends        │                │
│  └──────────┬──────────────────┘                │
│             ↓                                    │
│  ┌─────────────────────────────┐                │
│  │ 2. RAG Curriculum Retrieval │                │
│  │    Query: skill level +     │                │
│  │           focus area +      │                │
│  │           interests         │                │
│  │    Retrieve: templates,     │                │
│  │             techniques,     │                │
│  │             rules           │                │
│  └──────────┬──────────────────┘                │
│             ↓                                    │
│  ┌─────────────────────────────────────┐        │
│  │ 3. LLM Call 3: Exercise Generator   │        │
│  │    IN:  profile + memory +          │ GPT-4.5│
│  │         curriculum (from RAG)       │ ~$0.05 │
│  │    OUT: Personalized exercise       │        │
│  └──────────┬──────────────────────────┘        │
│             ↓                                    │
│  ┌─────────────────────────┐                    │
│  │ 4. User Writes          │ (5-10 min)         │
│  └──────────┬──────────────┘                    │
│             ↓                                    │
│  ┌─────────────────────────────────────┐        │
│  │ 5. LLM Call 4: Quick Feedback       │        │
│  │    IN:  exercise + response         │ GPT-4o │
│  │    OUT: feedback + score +          │ mini   │
│  │         mistake analysis            │ ~$0.01 │
│  └──────────┬──────────────────────────┘        │
│             ↓                                    │
│  ┌─────────────────────────────┐                │
│  │ 6. Update Session Memory    │                │
│  │    • Add to history         │                │
│  │    • Track mistakes         │                │
│  │    • Update metrics         │                │
│  └─────────────────────────────┘                │
│             ↓                                    │
│      (Repeats next day)                          │
└─────────────────────────────────────────────────┘
```

### LangFlow Components

**Flow 3 (Exercise Generation):**
- Input node (profile + memory + curriculum)
- Prompt template
- OpenAI Model (GPT-4.5)
- Output parser

**Flow 4 (Quick Feedback):**
- Input node (exercise + response)
- Prompt template
- OpenAI Model (GPT-4o-mini)
- Output parser

### Key Details

**New Components:**
- **RAG System:** Vector database (Pinecone/Chroma) with curriculum content
- **Session Memory:** PostgreSQL tracking exercise history, mistakes, progress
- **Flow 3:** Exercise generator using RAG + memory context
- **Flow 4:** Fast feedback with lighter model (GPT-4o-mini)

**RAG Database Contains:**
- Exercise templates (by skill level + focus area)
- Grammar rules and explanations
- Writing techniques with examples

**Session Memory Tracks:**
- Completed exercises (last 14 days)
- Recurring mistakes (pattern detection)
- Progress metrics (scores, trends, streaks)
- Demonstrated strengths

**Why Separate Flow 3 & 4?**
- Flow 3: Daily, needs RAG context, heavier
- Flow 4: Must be fast (<5s), evaluation only, cheaper model
- Independent optimization

---

## Iteration 3: Multi-Agent Conversational System

### Flow Diagram

```
┌──────────────────────────────────────┐
│ ONBOARDING + INITIAL PROFILE         │
│ (Iteration 1 - unchanged)            │
└────────────────┬─────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ CONVERSATIONAL PRACTICE SESSION (New)           │
│                                                  │
│  Turn 1: Student logs in                         │
│         ↓                                        │
│  ┌─────────────────────────────────┐            │
│  │ Coordinator Agent               │            │
│  │ • Loads profile + memory        │            │
│  │ • Retrieves curriculum (RAG)    │            │
│  │ • Greets student                │            │
│  │ • Presents exercise             │            │
│  └──────────┬──────────────────────┘            │
│             ↓                                    │
│  Turn 2-8: Multi-turn conversation               │
│             ↓                                    │
│  Student: "What's a topic sentence?"             │
│             ↓                                    │
│  ┌─────────────────────────────────┐            │
│  │ Coordinator Routes Question     │            │
│  │ • Analyzes student need         │            │
│  │ • Selects appropriate agent     │            │
│  └──────────┬──────────────────────┘            │
│             │                                    │
│   ┌─────────┼─────────┬──────────┐              │
│   ↓         ↓         ↓          ↓              │
│  ┌────┐  ┌────┐  ┌────┐     ┌────┐             │
│  │ W  │  │ G  │  │ P  │     │ I  │             │
│  │ r  │  │ r  │  │ r  │     │ d  │             │
│  │ i  │  │ a  │  │ o  │     │ e  │             │
│  │ t  │  │ m  │  │ g  │     │ a  │             │
│  │ i  │  │ m  │  │ r  │     │    │             │
│  │ n  │  │ a  │  │ e  │     │ G  │             │
│  │ g  │  │ r  │  │ s  │     │ e  │             │
│  │    │  │    │  │ s  │     │ n  │             │
│  │ C  │  │ C  │  │    │     │    │             │
│  │ o  │  │ h  │  │ T  │     │    │             │
│  │ a  │  │ e  │  │ r  │     │    │             │
│  │ c  │  │ c  │  │ a  │     │    │             │
│  │ h  │  │ k  │  │ c  │     │    │             │
│  │    │  │ e  │  │ k  │     │    │             │
│  │    │  │ r  │  │ e  │     │    │             │
│  │    │  │    │  │ r  │     │    │             │
│  └──┬─┘  └──┬─┘  └──┬─┘     └──┬─┘             │
│     │       │       │          │                │
│  Agent provides specialized response             │
│     │       │       │          │                │
│     └───────┴───────┴──────────┘                │
│                 ↓                                │
│  ┌─────────────────────────────────┐            │
│  │ Coordinator Synthesizes Reply   │            │
│  │ • Formats agent response        │            │
│  │ • Guides next step              │            │
│  │ • Keeps conversation on-track   │            │
│  └──────────┬──────────────────────┘            │
│             ↓                                    │
│  Student: "Here's my draft..."                   │
│             ↓                                    │
│  ┌─────────────────────────────────┐            │
│  │ Coordinator Calls Multiple      │            │
│  │ Agents in Parallel:             │            │
│  │ • Writing Coach (feedback)      │            │
│  │ • Grammar Checker (errors)      │            │
│  │ • Progress Tracker (metrics)    │            │
│  └──────────┬──────────────────────┘            │
│             ↓                                    │
│  ┌─────────────────────────────────┐            │
│  │ Rich Combined Feedback          │            │
│  │ • Overall guidance (Coach)      │            │
│  │ • Grammar corrections (Grammar) │            │
│  │ • Progress insights (Tracker)   │            │
│  │ • Next steps suggestions        │            │
│  └──────────┬──────────────────────┘            │
│             ↓                                    │
│  ┌─────────────────────────────┐                │
│  │ Update Session Memory       │                │
│  │ • Save conversation         │                │
│  │ • Track patterns            │                │
│  │ • Update metrics            │                │
│  └─────────────────────────────┘                │
│             ↓                                    │
│      (Session ends or continues)                 │
└─────────────────────────────────────────────────┘
```

### LangFlow Components

**Coordinator Agent Flow:**
- Input node (message + session_id)
- Message History (LangFlow component)
- Agent node (with routing logic)
- OpenAI Model (GPT-4.5)
- Tool nodes (curriculum search, progress analytics)
- Output parser

**Specialist Agent Flows:**
- Writing Coach: Agent node + OpenAI Model
- Grammar Checker: Agent node + OpenAI Model + Grammar API tool
- Progress Tracker: Agent node + OpenAI Model + Analytics tool
- Idea Generator: Agent node + OpenAI Model + RAG tool

### Agent Roles

**Writing Coach Agent:**
- Overall writing guidance
- Motivational feedback
- Style and tone suggestions
- Connects feedback to learning goals

**Grammar Checker Agent:**
- Detailed grammar analysis
- Mechanics errors (punctuation, spelling)
- Explanation with examples
- Common mistake patterns

**Progress Tracker Agent:**
- Analyzes learning trends
- Identifies improvement areas
- Celebrates milestones
- Recommends focus shifts

**Idea Generator Agent:**
- Creative prompts for next exercises
- Culturally-relevant content
- Interest-based scenarios
- Alternative approaches

### Agent Tools

**Potential Tools:**
1. **Curriculum Search:** Query vector DB for specific concepts
2. **Progress Analytics:** Pattern detection in session history
3. **Grammar Checker API:** External validation (LanguageTool)
4. **Readability Analyzer:** Ensure age-appropriate complexity
5. **Diagram Generator:** Simple SVG visuals for concepts

**Not Recommended:**
- Video generation (too slow, too expensive)

### When to Use Agents vs Workflows

**Workflows (Iteration 1-2):**
- Predictable paths
- Known tool requirements upfront
- Cost-optimized

**Agents (Iteration 3):**
- Dynamic decision-making
- Uncertain which tools needed
- Student asks open-ended questions
- Multi-step reasoning required

### Key Details

**Conversational Architecture:**
- **LangFlow Message History:** Stores turn-by-turn conversation by session_id
- **External RAG:** Load curriculum once on Turn 1, reuse from message history
- **Multi-turn sessions:** 8-12 LLM calls per exercise session
- **Session management:** Handle timeouts, save/resume conversations

**Orchestration:**
- Coordinator agent routes to specialized agents
- Parallel execution for feedback (Coach + Grammar + Tracker together)
- Sequential for Q&A (one agent responds at a time)
- Agents have specialized prompts + tools
- ReAct pattern for tool use

**Why Conversational for Iteration 3:**
- Real-time scaffolding during writing
- Students can ask questions when confused
- More engaging than form submission
- Justifies 3.5x cost with richer experience
- Age group (13-16) comfortable with chat interfaces

---

## Cross-Iteration Summary

### Technical Stack

**LangFlow:**
- Visual workflow builder
- Flow orchestration
- Component library

**External Components:**
- **Database:** PostgreSQL (profiles, memory)
- **Vector DB:** Pinecone/Chroma (curriculum)
- **Embeddings:** OpenAI text-embedding-3-small
- **LLMs:** GPT-4.5 (reasoning), GPT-4o-mini (speed)

**Orchestration Layer:**
- Python (FastAPI) or Node.js
- Handles: state, timing, UX, business logic
- Calls LangFlow via REST API

### Key Design Principles

1. **Start Simple:** Workflow agents first, add complexity only when needed
2. **Cost Conscious:** Optimize at every step, use cheaper models where appropriate
3. **Lean Iteration:** Validate before adding features
4. **Form-to-Chat Progression:** Prove mechanics with forms before investing in conversational UX
5. **External Orchestration:** Keep control of state and UX outside LangFlow
6. **Privacy First:** Encrypted storage, age-appropriate safety

### Why Hybrid Approach?

**Iterations 1-2 (Form-Based):**
- ✅ Validate core learning mechanics quickly
- ✅ Keep costs low during validation phase
- ✅ Simpler to build and test
- ✅ Proven UX pattern (like homework submission)
- ✅ Budget-friendly at ~$1 per student

**Iteration 3 (Conversational):**
- ✅ Add conversational UX after validating that students return
- ✅ Justify 3.5x higher cost with richer, more engaging experience
- ✅ Real-time scaffolding when students know the value
- ✅ Multi-agent system shines in conversational context
- ✅ Can add selectively (e.g., only for engaged students)

---

*Last Updated: 2025-11-04*
