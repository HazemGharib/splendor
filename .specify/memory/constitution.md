<!--
Sync Impact Report:
- Version: 0.0.0 → 1.0.0
- Initial constitution creation
- Added 4 core principles: Code Quality, Testing Standards, Gaming UX Consistency, Performance Requirements
- Added 2 sections: Development Workflow, Quality Gates
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (constitution check section aligns)
  ✅ .specify/templates/spec-template.md (success criteria aligned with performance)
  ✅ .specify/templates/tasks-template.md (test-first approach aligned)
- Follow-up TODOs: None
-->

# Splendor Game Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

**Code MUST be:**
- Self-documenting through clear naming and structure
- Free of code duplication (DRY principle strictly enforced)
- Modular with single responsibility per function/class
- Type-safe with explicit types (no implicit any/dynamic types without justification)
- Linted and formatted according to project standards before commit

**Rationale**: Gaming projects accumulate technical debt rapidly due to iterative
design changes. Enforcing quality gates early prevents the "spaghetti code" that
makes feature iteration impossible and introduces hard-to-debug gameplay issues.

**Prohibited patterns**:
- Magic numbers or strings without named constants
- Functions exceeding 50 lines without documented justification
- Nested conditionals beyond 3 levels deep
- Global mutable state without explicit state management pattern

---

### II. Testing Standards (NON-NEGOTIABLE)

**Test-Driven Development (TDD) MUST be followed:**
1. Write acceptance tests first (Given-When-Then)
2. Verify tests FAIL (red phase)
3. Implement minimum code to pass (green phase)
4. Refactor while keeping tests green

**Test coverage requirements:**
- **Unit tests**: All business logic, game rules, and state mutations
- **Integration tests**: Component interactions, API contracts, save/load systems
- **Contract tests**: All public interfaces and data schemas
- **Gameplay tests**: Core game loops, player actions, win conditions

**Performance benchmarks**: All performance-critical paths MUST have automated
benchmark tests that fail if thresholds are exceeded.

**Rationale**: Games are complex state machines where a single bug can break
player progression or corrupt saved games. TDD catches regressions before they
reach players and serves as living documentation of game rules.

---

### III. Gaming UX Consistency

**User experience MUST maintain:**
- **Visual consistency**: UI elements follow established design system
- **Interaction patterns**: Similar actions use similar input mechanisms
- **Response times**: User actions acknowledge within 100ms (visual feedback)
- **State clarity**: Player always knows current game state and available actions
- **Accessibility**: Support for colorblind modes, adjustable text size, keyboard nav

**Feedback loops**:
- Every player action MUST provide immediate visual/audio feedback
- Long operations (>1s) MUST show progress indicators
- Error states MUST explain what happened and how to recover

**Design system enforcement**:
- All UI components sourced from centralized component library
- Color palette, typography, spacing defined in design tokens
- No ad-hoc styling without design system update and approval

**Rationale**: Gaming UX requires polish and consistency to maintain player
immersion. Inconsistent interactions create cognitive load and break flow state.
Design systems prevent UI fragmentation across features.

---

### IV. Performance Requirements

**Hard performance targets:**
- **Frame rate**: 60 FPS minimum for real-time gameplay, 30 FPS for UI/menus
- **Load times**: Initial load <3s, scene transitions <1s, asset loads <500ms
- **Memory**: Peak memory <200MB for mobile, <500MB for desktop
- **Network**: <100ms latency tolerance for multiplayer, graceful offline handling
- **Battery**: Mobile gameplay drains <20% battery per hour

**Performance monitoring**:
- Profile ALL new features for CPU/memory/GPU impact
- Automated performance tests in CI/CD pipeline
- Frame time budgets tracked per system (rendering, physics, AI, etc.)
- Memory allocation tracking for garbage collection spikes

**Optimization requirements**:
- Object pooling for frequently spawned entities
- Asset lazy loading and unloading strategies
- Level-of-detail (LOD) systems for complex scenes
- Texture compression and atlas packing

**Rationale**: Performance issues destroy gaming experiences and drive negative
reviews. Performance requirements must be treated as features, not afterthoughts.
Mobile and web platforms have strict resource constraints that cannot be violated.

---

## Development Workflow

### Branch Strategy

- **Feature branches**: `###-feature-name` format (number from spec system)
- **Branch from**: `main` (or `develop` for multi-stream projects)
- **Branch lifecycle**: Create → Implement → Test → Review → Merge → Delete

### Code Review Requirements

**Every PR MUST include:**
- Link to feature specification
- Demonstration of passing tests (screenshots/videos for gameplay changes)
- Performance impact analysis (frame time delta, memory delta)
- Constitution compliance checklist

**Reviews MUST verify:**
- All principles adhered to (or documented violations with justification)
- Tests written first and cover acceptance scenarios
- Code quality standards met (linting passes, no code smells)
- UX consistency maintained (design system usage, feedback patterns)
- Performance budgets respected (benchmarks pass)

### Commit Standards

- **Commit format**: `type(scope): description` (Conventional Commits)
- **Commit size**: Single logical change per commit
- **Commit frequency**: After each completed task or green test phase

---

## Quality Gates

### Pre-Implementation Gates

**MUST complete before coding:**
- [ ] Feature specification approved (user stories, acceptance criteria)
- [ ] Performance budgets allocated (frame time, memory, network)
- [ ] Design mockups approved (if UI changes)
- [ ] Test plan written (acceptance tests identified)
- [ ] Constitution check passed (complexity justified if needed)

### Pre-Merge Gates

**MUST pass before PR approval:**
- [ ] All tests passing (unit, integration, contract, gameplay)
- [ ] Performance benchmarks passing (no regressions)
- [ ] Code coverage thresholds met (80% minimum for new code)
- [ ] Linting and formatting checks passing
- [ ] Design review approved (if UI changes)
- [ ] Gameplay validation (manual playtest documented)

### Pre-Release Gates

**MUST pass before deployment:**
- [ ] Full regression test suite passing
- [ ] Performance profiling on target platforms
- [ ] Accessibility audit passed
- [ ] Localization verified (if multi-language)
- [ ] Save/load compatibility tested

---

## Governance

### Authority

This constitution supersedes all other coding practices, style guides, and
team conventions. When conflicts arise, constitution principles take precedence.

### Amendment Process

**Constitution changes require:**
1. Proposal with rationale and impact analysis
2. Team review and approval
3. Version bump according to semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible change
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic fixes
4. Migration plan for existing code violating new rules
5. Update to all dependent templates and documentation

### Complexity Justification

**When principles conflict with pragmatism:**
- Document violation in implementation plan complexity tracking table
- Explain why simpler alternatives are insufficient
- Define technical debt and timeline for resolution
- Obtain explicit approval before implementation

### Compliance Review

- **Continuous**: Automated linting, testing, and performance checks in CI/CD
- **Per-PR**: Code review checklist verification
- **Quarterly**: Architecture review for accumulated technical debt
- **Per-release**: Full constitution audit and remediation plan

### Living Document

This constitution evolves with the project. Treat it as the single source of
truth for development standards. When new patterns emerge or requirements change,
update this document first, then propagate to code and templates.

---

**Version**: 1.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
