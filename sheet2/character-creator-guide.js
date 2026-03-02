/**
 * Character Creator Guide - A companion window for creating Conan characters
 * Opens as a separate Application window from the actor sheet
 */
export default class CharacterCreatorGuide extends Application {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "conan-character-creator-guide",
      classes: ["conan", "conan-guide-window"],
      template: "systems/conan/sheet2/character-creator-guide.hbs",
      width: 500,
      height: 600,
      minimizable: true,
      resizable: true,
      title: "Character Creator Guide"
    });
  }

  /** Track active step internally */
  _activeStep = 1;

  /** Total number of steps */
  _totalSteps = 9;

  /** Reference to the associated actor (optional) */
  _actor = null;

  /** Track expanded origin card */
  _expandedOrigin = null;

  /** Track if origins list is expanded (default closed) */
  _originsExpanded = false;

  /** Random background image for this instance */
  _backgroundImage = null;

  /**
   * Create a new Character Creator Guide
   * @param {Actor} actor - Optional actor reference for context
   * @param {Object} options - Application options
   */
  constructor(actor = null, options = {}) {
    super(options);
    this._actor = actor;

    // Randomly select background image
    const backgrounds = [
      'systems/conan/images/guide/guide_background1.jpg',
      'systems/conan/images/guide/guide_background2.jpg'
    ];
    this._backgroundImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

  /** @override */
  getData() {
    const context = super.getData();

    context.activeStep = this._activeStep;
    context.totalSteps = this._totalSteps;
    context.isFirstStep = this._activeStep === 1;
    context.isLastStep = this._activeStep === this._totalSteps;
    context.expandedOrigin = this._expandedOrigin;
    context.originsExpanded = this._originsExpanded;

    // Origin data for step 2
    context.origins = this._getOriginsData();

    // Stats data for step 3
    context.stats = this._getStatsData();

    return context;
  }

  /**
   * Get origins data for display
   * @returns {Array} Array of origin objects
   */
  _getOriginsData() {
    return [
      {
        id: "from-the-hills",
        name: "From the Hills",
        baseLP: 30,
        sorcery: "None",
        bonuses: ["Choose Might, Edge, or Grit each Tale: +1 to all related Checks and Attacks"],
        startingSkills: "None",
        description: "You grew up beyond the frontiers of civilization. The hills breed hardy people, and you're the hardiest of them."
      },
      {
        id: "from-the-streets",
        name: "From the Streets",
        baseLP: 22,
        sorcery: "None",
        bonuses: ["+1 to all Edge Checks and Attacks"],
        startingSkills: "Fleet Footed OR Of the Shadows",
        description: "Born in the hidden underside of civilization. Heir only to muck and larceny."
      },
      {
        id: "from-the-steppes",
        name: "From the Steppes",
        baseLP: 26,
        sorcery: "None",
        bonuses: ["+1 to all Ranged Damage"],
        startingSkills: "Born in the Saddle",
        description: "The steppes stretch on endlessly beneath the sky. Here, the rider rules."
      },
      {
        id: "from-the-north",
        name: "From the North",
        baseLP: 32,
        sorcery: "None",
        bonuses: ["+1 to all Melee Damage"],
        startingSkills: "Iron Hide OR Charge",
        description: "Where the ice crystals form in your beard in seconds. Your people are ship builders, sailors, reavers."
      },
      {
        id: "from-the-wilds",
        name: "From the Wilds",
        baseLP: 30,
        sorcery: "None",
        bonuses: ["+1 to all Grit Checks", "Spend 1 SP to regain 2 LP"],
        startingSkills: "None",
        description: "You know only the hardness of earth beneath your feet. The wild made you."
      },
      {
        id: "from-a-civilized-land",
        name: "From a Civilized Land",
        baseLP: 22,
        sorcery: "Alchemy",
        bonuses: ["+2 to all Wits Checks"],
        startingSkills: "Uncanny Warding",
        description: "The cities of Aquilonia, Nemedia, Corinthia, and Stygia are many things. Decadent, perhaps. But not safe."
      },
      {
        id: "from-parts-unknown",
        name: "From Parts Unknown",
        baseLP: 26,
        sorcery: "Any Two Disciplines",
        bonuses: ["+1 to all Contest Checks", "Spend 1 SP for +2 Sorcery Defense (combat)"],
        startingSkills: "None",
        description: "Your homeland isn't on any maps. You keep your past to yourself."
      },
      {
        id: "from-the-blood-of-jhebbal-sag",
        name: "Blood of Jhebbal Sag",
        baseLP: 28,
        sorcery: "Alchemy, White Magic",
        bonuses: ["+2 LP whenever regaining LP"],
        startingSkills: "Healing (spell)",
        description: "The old, wild blood of Jhebbal Sag runs in your veins."
      },
      {
        id: "from-the-blood-of-acheron",
        name: "Blood of Acheron",
        baseLP: 20,
        sorcery: "All Disciplines",
        bonuses: ["+1 to all Wits Checks", "Spend 1 SP to halve spell LP cost"],
        startingSkills: "None",
        description: "The blood of ancient sorcerers awakens in you. Three thousand years since Acheron fell."
      },
      {
        id: "from-the-blood-of-a-demon",
        name: "Blood of a Demon",
        baseLP: 26,
        sorcery: "Black Magic, Demonic Magic",
        bonuses: ["+1 to all Sorcery Attacks", "+2 to all Sorcery Damage"],
        startingSkills: "None",
        description: "At least one of your parents was a demon. You are balanced between the human and the inhuman."
      }
    ];
  }

  /**
   * Get stats data for display
   * @returns {Array} Array of stat objects
   */
  _getStatsData() {
    return [
      {
        name: "Might",
        description: "Physical strength. Used for melee attacks, melee/thrown damage, climbing, swimming, lifting."
      },
      {
        name: "Edge",
        description: "Deftness and alertness. Used for ranged/thrown attacks, initiative, Physical Defense base, stealth."
      },
      {
        name: "Grit",
        description: "Pain tolerance and constitution. Used for Life Points, Stamina, death checks, resisting poison/fear."
      },
      {
        name: "Wits",
        description: "Eloquence and knowledge. Used for sorcery attacks, Sorcery Defense base, persuasion, deception."
      }
    ];
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Apply random background image
    this.element.find('.window-content').css('background-image', `url('${this._backgroundImage}')`);

    // Tab navigation
    html.find('.guide-tabBtn').click(this._onTabClick.bind(this));

    // Prev/Next buttons
    html.find('.guide-navBtn.prev').click(this._onPrevClick.bind(this));
    html.find('.guide-navBtn.next').click(this._onNextClick.bind(this));

    // Origins list toggle (collapsible)
    html.find('.guide-originToggle').click(this._onOriginsToggle.bind(this));

    // Origin card expansion
    html.find('.guide-originCard').click(this._onOriginCardClick.bind(this));

    // Restore active tab state
    this._restoreTabState(html);
  }

  /**
   * Handle tab button click
   * @param {Event} event - Click event
   */
  _onTabClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const step = parseInt(button.dataset.step);

    if (step === this._activeStep) return;

    this._activeStep = step;
    this.render(false);
  }

  /**
   * Handle previous button click
   * @param {Event} event - Click event
   */
  _onPrevClick(event) {
    event.preventDefault();
    if (this._activeStep > 1) {
      this._activeStep--;
      this.render(false);
    }
  }

  /**
   * Handle next button click
   * @param {Event} event - Click event
   */
  _onNextClick(event) {
    event.preventDefault();
    if (this._activeStep < this._totalSteps) {
      this._activeStep++;
      this.render(false);
    }
  }

  /**
   * Handle origins list toggle (expand/collapse)
   * @param {Event} event - Click event
   */
  _onOriginsToggle(event) {
    event.preventDefault();
    this._originsExpanded = !this._originsExpanded;
    this.render(false);
  }

  /**
   * Handle origin card click for expansion
   * @param {Event} event - Click event
   */
  _onOriginCardClick(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent triggering parent toggle
    const card = event.currentTarget;
    const originId = card.dataset.origin;

    if (this._expandedOrigin === originId) {
      this._expandedOrigin = null;
    } else {
      this._expandedOrigin = originId;
    }

    this.render(false);
  }

  /**
   * Restore tab state after render
   * @param {jQuery} html - The rendered HTML
   */
  _restoreTabState(html) {
    // Update tab buttons
    html.find('.guide-tabBtn').removeClass('active');
    html.find(`.guide-tabBtn[data-step="${this._activeStep}"]`).addClass('active');

    // Update panels
    html.find('.guide-panel').removeClass('active');
    html.find(`.guide-panel[data-step="${this._activeStep}"]`).addClass('active');
  }

  /**
   * Navigate to a specific step
   * @param {number} step - Step number to navigate to
   */
  goToStep(step) {
    if (step >= 1 && step <= this._totalSteps) {
      this._activeStep = step;
      this.render(false);
    }
  }
}
