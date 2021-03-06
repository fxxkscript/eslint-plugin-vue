/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on the component do not have custom modifiers
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const VALID_MODIFIERS = new Set(['lazy', 'number', 'trim'])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow custom modifiers on v-model used on the component',
      categories: ['essential'],
      url: 'https://eslint.vuejs.org/rules/no-custom-modifiers-on-v-model.html'
    },
    fixable: null,
    schema: [],
    messages: {
      notSupportedModifier:
        "'v-model' directives don't support the modifier '{{name}}'."
    }
  },
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='model']"(node) {
        const element = node.parent.parent

        if (utils.isCustomComponent(element)) {
          for (const modifier of node.key.modifiers) {
            if (!VALID_MODIFIERS.has(modifier.name)) {
              context.report({
                node,
                loc: node.loc,
                messageId: 'notSupportedModifier',
                data: { name: modifier.name }
              })
            }
          }
        }
      }
    })
  }
}
