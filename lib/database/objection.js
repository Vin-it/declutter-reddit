const { Model } = require('objection');
/**
 * Objection Model does not require an instance to be created
 * Read more here -
 * https://vincit.github.io/objection.js/guide/models.html
 *
 * Takes instance of knex and initializes objection's Model
 * @param {Knex} knex
 */
function init(knex) {
  Model.knex(knex);
}

module.exports = {
  init,
};
