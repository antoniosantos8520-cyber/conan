/**
 * Conan NPC Sheet v2
 * A modern NPC character sheet for the Conan 2d20 system
 *
 * TODO: Implement full NPC sheet functionality
 * - Combat stats and abilities
 * - Conditions system (matching character2)
 * - Quick actions for GM
 * - Token management
 */

export default class ConanNPCSheet2 extends ActorSheet {

  // ========== SHEET CONFIG ==========
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["conan", "sheet", "actor", "npc2"],
      template: "systems/conan/templates/npc-sheet2.html",
      width: 600,
      height: 700,
      resizable: true,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  // ========== DATA PREPARATION ==========
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Conditions (same structure as character2 for compatibility)
    context.conditions = this.actor.system.conditions || {};

    return context;
  }

  // ========== LISTENERS ==========
  activateListeners(html) {
    super.activateListeners(html);

    // TODO: Add event listeners for NPC sheet interactions
  }

  // ========== CONDITION MANAGEMENT ==========
  /**
   * Toggle a condition on this NPC
   * @param {string} conditionKey - The condition to toggle
   * @returns {Promise<boolean>} - Whether the condition is now active
   */
  async toggleCondition(conditionKey) {
    const currentState = this.actor.system.conditions?.[conditionKey] || false;
    await this.actor.update({ [`system.conditions.${conditionKey}`]: !currentState });
    return !currentState;
  }

  /**
   * Get the current state of a condition
   * @param {string} conditionKey - The condition to check
   * @returns {boolean} - Whether the condition is active
   */
  hasCondition(conditionKey) {
    return this.actor.system.conditions?.[conditionKey] || false;
  }
}
