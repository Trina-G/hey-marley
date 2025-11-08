# Problem First AI Capstone

## Project Overview
An AI-powered adaptive learning system that provides personalized English reading and writing instruction for students aged 13-16.

## Documentation Guidelines

**Language Requirements:** All documentation, user-facing content, and learning materials must use simple, concise language that is easy to understand for ages 13-16. Avoid jargon, complex terminology, and lengthy explanations. Write in short sentences with clear, everyday words.

## Problem Statement
**What real-world problem does your AI system aim to solve?**

Students often receive generic study plans that fail to adjust to their pace or strengths. An AI system could analyze performance, attention span, and engagement data to create individualized learning paths, adapting recommendations as the learner progresses.

**Target User Segment:** Children age 13 to 16
**MVP Subject:** English reading skills
**Product Type:** B2C
**Out of Scope:** Parental features/login

## Why This Problem Matters

With teacher shortages and growing class sizes, personalized attention is increasingly scarce. Students have diverse learning styles, paces, and strengths that one-size-fits-all curricula can't address. This widens achievement gaps, especially for students from lower-income families who can't afford tutors. Additionally, subjects like AI/tech evolve rapidly, requiring adaptive learning systems that can keep pace. Students aged 13-16 are at a critical developmental stage where personalized learning can significantly impact their academic trajectory and confidence.

## Why Generative AI?

GenAI enables dynamic, conversational tutoring that adapts in real-time, unlike static LMS platforms. It can:

1. Generate personalized content matching each student's interests and level
2. Scaffold learning by adjusting difficulty based on comprehension
3. Provide contextual explanations in multiple formats
4. Continuously assess learning patterns and adjust strategies
5. Scale personalized tutoring to thousands of students simultaneously at a fraction of traditional tutoring costs

## Model Selection

**Primary Model:** GPT-4.5 for core reasoning tasks (onboarding diagnostics, curriculum planning, parent reports) where high-quality reasoning justifies higher latency.

**Secondary Model:** Consider a lighter model (GPT-4o-mini or Claude Sonnet) for real-time interactions during lessons where speed matters more.

**Reference:** [Arena Leaderboard](https://arelmna.ai/)

**Note:** Model selection is fixed at the beginning for the capstone scope. No revisiting with every iteration to maintain design focus.

## Architecture Approach

**Starting Point:** Workflow Agents only

**Progression Path:**
- Start: Workflow Agents only
- Add: Workflow Agents + RAG
- Consider later: Agents (Level 2) → Multi-Agents

**Important:** Never start with agents as your first prototype. They can make the system very unpredictable.

**Fine-tuning:** Out of scope for this capstone (requires extensive benchmarking and data).

## Business Constraints

- **Cost:** Budget-conscious implementation
- **Compute:** Computational resource limitations
- **Privacy:** PI/data privacy compliance
- **Safety:** Restricted AI requirements for age group (13-16)

## Iterative Solution Design

### Iteration 1: Diagnostic & Personalized Plan
Diagnostic writing assessment → personalised 2-week writing plan with targeted exercises using workflow agent (validates writing level & generates relevant prompts)

### Iteration 2: Enhanced RAG + Memory
Add writing curriculum RAG (grammar, essay structure, styles) + memory of recurring mistakes/strengths for adaptive feedback & exercise generation

### Iteration 3: Multi-Agent System
Multi-agent system (writing coach, grammar checker, progress tracker, idea generator agents) with tools (summarisation, style analysis) & culturally-relevant writing prompts

## Implementation Approach

### Core Principle: Lean Iteration

Build the simplest version that solves the core problem first. Test with real users. Learn. Iterate. Never build features before validating the foundation works.

**Each iteration must:**
1. Add ONE new capability
2. Be fully functional and testable
3. Validate assumptions before moving forward
4. Ship to users (or test group) for feedback

### Technical Framework

**Primary Tool:** LangFlow for building and orchestrating AI workflows

**Why LangFlow:**
- Visual workflow builder for rapid prototyping
- Built-in support for LLM chains and agents
- Easy testing and debugging of individual components
- Supports RAG and memory integration
- Can deploy workflows as APIs
- Lower code maintenance than custom implementations

**Documentation Requirement:** Always check the LangFlow documentation (https://docs.langflow.org/) before making any architectural decisions to ensure recommendations align with current capabilities and best practices.

## Project Timeline

- **Step 1:** Problem Definition - 10-15 minutes
- **Step 2:** Iterative Solution Design - 10-15 minutes per iteration
- **Step 3:** Implementation - Lean, incremental builds per phase

---

*Last Updated: 2025-11-04*
