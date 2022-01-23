var findKey = require('lodash.findkey');

function getStateValue(values, name) {
  const key = findKey(values, name);
  const value = values[key][name];
  
  switch(value.type) {
    case 'plain_text_input': return value.value;
    case 'multi_users_select': return value.selected_users;
    case 'static_select': return value.selected_option;
    case 'checkboxes': return value.selected_options;
    default: return null;
  }
}

module.exports = {
  getStateValue,
};
